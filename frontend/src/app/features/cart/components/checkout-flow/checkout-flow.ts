import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, inject, OnDestroy, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Check, LucideAngularModule, Pencil } from 'lucide-angular';
import { checkoutMock, PaymentMethodId } from '../../data/checkout.mock';
import { Cart, CartItem } from '../../services/cart';
import { CheckoutDraft, CheckoutStateService, CheckoutStep, ForcedPaymentResult } from '../../services/checkout-state.service';

type ContactField = keyof CheckoutDraft;

const trimmed = (value: unknown): string => String(value ?? '').trim();

const documentIdValidator: ValidatorFn = control =>
  /^\d{6,10}$/.test(trimmed(control.value)) ? null : { documentId: true };

const cityValidator: ValidatorFn = control =>
  checkoutMock.cities.some(city => city.name === trimmed(control.value)) ? null : { city: true };

const fullNameValidator: ValidatorFn = control =>
  /^\p{L}+(?:\s+\p{L}+)+$/u.test(trimmed(control.value)) ? null : { fullName: true };

const whatsappValidator: ValidatorFn = control =>
  /^3\d{9}$/.test(trimmed(control.value).replace(/[\s-]/g, '')) ? null : { whatsapp: true };

// Exige un dominio con punto; Validators.email de Angular acepta "a@b".
const emailValidator: ValidatorFn = control =>
  /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(trimmed(control.value)) ? null : { email: true };

const addressValidator: ValidatorFn = control => {
  const length = trimmed(control.value).length;
  return length >= 10 && length <= 150 ? null : { address: true };
};

@Component({
  selector: 'app-checkout-flow',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './checkout-flow.html'
})
export class CheckoutFlow implements OnDestroy {
  readonly state = inject(CheckoutStateService);
  private readonly cart = inject(Cart);
  readonly cartItems = this.cart.getCartItems();
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly mock = checkoutMock;
  readonly editIcon = Pencil;
  readonly validIcon = Check;
  readonly paymentAttempted = signal(false);
  readonly submissionAttempted = signal(false);
  readonly detailsExpanded = signal(true);
  readonly subtotal = this.cart.total;
  readonly totalCount = this.cart.totalCount;
  readonly originalSubtotal = computed(() => this.cart.getCartItems()().reduce(
    (sum, item) => sum + (item.originalPrice ?? item.price) * item.quantity, 0
  ));
  readonly discount = computed(() => Math.max(this.originalSubtotal() - this.subtotal(), 0));
  readonly hasFreeShipping = computed(() => this.subtotal() >= checkoutMock.freeShippingThreshold);
  readonly shipping = computed(() => this.hasFreeShipping() ? 0 : checkoutMock.shippingFee);
  readonly total = computed(() => this.subtotal() + this.shipping());
  readonly selectedCity = computed(() => checkoutMock.cities.find(city => city.name === this.state.draft().city) ?? null);
  readonly availablePaymentMethods = computed(() => checkoutMock.paymentMethods.filter(method =>
    method.id !== 'cash-on-delivery' || this.selectedCity()?.cashOnDelivery === true
  ));

  readonly checkoutForm = this.formBuilder.nonNullable.group({
    documentId: ['', documentIdValidator],
    fullName: ['', fullNameValidator],
    whatsapp: ['', whatsappValidator],
    email: ['', emailValidator],
    city: ['', cityValidator],
    address: ['', addressValidator]
  });

  private paymentTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.checkoutForm.patchValue(this.state.draft(), { emitEvent: false });
    this.checkoutForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.state.updateDraft(this.checkoutForm.getRawValue());
      this.ensureSelectedPaymentIsAvailable();
      this.syncShippingStepWithValidity();
      this.tryAutoAdvanceFromShipping();
      this.tryAutoAdvanceFromPayment();
    });

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.state.forcedPaymentResult.set(this.parseForcedResult(params.get('resultadoPago')));
    });
  }

  ngOnDestroy(): void {
    if (this.paymentTimer) {
      clearTimeout(this.paymentTimer);
    }
  }

  formatPrice(price: number): string {
    return '$' + price.toLocaleString('es-CO');
  }

  lineSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  originalLineTotal(item: CartItem): number {
    return (item.originalPrice ?? item.price) * item.quantity;
  }

  selectedPaymentLabel(): string {
    return checkoutMock.paymentMethods.find(method => method.id === this.state.paymentMethod())?.label ?? 'Sin medio de pago';
  }

  onCityChanged(): void {
    this.normalizeField('city');
    this.ensureSelectedPaymentIsAvailable();
    this.tryAutoAdvanceFromShipping();
  }

  onShippingFieldBlur(field: ContactField): void {
    this.normalizeField(field);
    this.tryAutoAdvanceFromShipping();
  }

  showFieldError(field: ContactField): boolean {
    const control = this.checkoutForm.controls[field];
    return control.invalid && (control.touched || this.submissionAttempted());
  }

  fieldError(field: ContactField): string {
    const errors: ValidationErrors | null = this.checkoutForm.controls[field].errors;
    if (!errors) return '';
    const messages: Record<ContactField, string> = {
      documentId: 'La cédula debe tener entre 6 y 10 números',
      fullName: 'Escribe tu nombre y apellido',
      whatsapp: 'El WhatsApp debe tener 10 números y empezar por 3',
      email: 'Revisa el correo, por ejemplo nombre@dominio.com',
      city: 'Selecciona una ciudad de la lista',
      address: 'Escribe la dirección completa con barrio o conjunto'
    };
    return messages[field];
  }

  fieldClasses(field: ContactField): string {
    if (this.showFieldError(field)) return 'border-red-700 focus:border-red-700';
    return 'border-gray-300 focus:border-black';
  }

  isFieldValid(field: ContactField): boolean {
    const control = this.checkoutForm.controls[field];
    return control.valid && !!String(control.value).trim();
  }

  normalizeField(field: ContactField): void {
    const control = this.checkoutForm.controls[field];
    const value = control.value.trim();
    if (value !== control.value) control.setValue(value);
    control.markAsTouched();
  }

  continueFromShipping(): void {
    this.submissionAttempted.set(true);
    for (const field of Object.keys(this.checkoutForm.controls) as ContactField[]) {
      this.normalizeField(field);
    }
    if (this.checkoutForm.invalid) {
      this.focusFirstInvalidField();
      return;
    }
    this.completeShippingStep();
  }

  selectPaymentMethod(method: PaymentMethodId): void {
    if (method === 'cash-on-delivery' && !this.selectedCity()?.cashOnDelivery) return;
    this.state.paymentMethod.set(method);
    this.state.paymentState.set('ready');
    this.paymentAttempted.set(false);
    this.tryAutoAdvanceFromPayment();
  }

  editShipping(): void {
    this.state.editStep(1);
    this.submissionAttempted.set(false);
  }

  editPayment(): void {
    this.state.editStep(2);
    this.paymentAttempted.set(false);
  }

  isStepComplete(step: CheckoutStep): boolean {
    return this.state.completedSteps().includes(step);
  }

  isStepActive(step: CheckoutStep): boolean {
    return this.state.activeStep() === step;
  }

  isStepAvailable(step: CheckoutStep): boolean {
    if (step === 1) return true;
    return this.isStepComplete((step - 1) as CheckoutStep);
  }

  stepCircleClasses(step: CheckoutStep): string {
    if (this.isStepComplete(step)) return 'border-emerald-700 bg-emerald-700 text-white';
    if (this.isStepActive(step)) return 'border-gray-950 bg-gray-950 text-white';
    return 'border-gray-300 bg-white text-gray-500';
  }

  stepConnectorClasses(step: CheckoutStep): string {
    return this.isStepComplete(step) ? 'bg-emerald-700' : 'bg-gray-200';
  }

  pay(retry = false): void {
    if (this.state.paymentState() === 'processing' || this.state.paymentState() === 'success') return;

    if (this.isStepActive(3)) {
      this.state.completeStep(3);
    }

    if (!this.isStepActive(4)) return;

    if (this.paymentTimer) clearTimeout(this.paymentTimer);

    const forcedResult = retry || this.state.forcedPaymentResult() === 'ready'
      ? null
      : this.state.forcedPaymentResult();

    this.state.paymentState.set('processing');
    if (forcedResult === 'processing') return;

    this.paymentTimer = setTimeout(() => {
      if (forcedResult === 'error') {
        this.state.paymentState.set('error');
        return;
      }
      this.state.orderNumber.set(`MLX-${Date.now().toString(36).toUpperCase()}`);
      this.state.completeStep(4);
      this.state.paymentState.set('success');
    }, 650);
  }

  private ensureSelectedPaymentIsAvailable(): void {
    const method = this.state.paymentMethod();
    if (method === 'cash-on-delivery' && !this.selectedCity()?.cashOnDelivery) {
      this.state.paymentMethod.set(null);
      this.state.invalidateStepsFrom(2);
    }
  }

  private tryAutoAdvanceFromShipping(): void {
    if (!this.isStepActive(1) || this.checkoutForm.invalid) return;
    this.completeShippingStep();
  }

  private tryAutoAdvanceFromPayment(): void {
    if (!this.isStepActive(2) || !this.state.paymentMethod()) return;
    this.state.completeStep(2);
  }

  private syncShippingStepWithValidity(): void {
    if (!this.isStepComplete(1)) return;
    if (this.checkoutForm.valid) return;
    this.state.invalidateStepsFrom(1);
    this.paymentAttempted.set(false);
  }

  private completeShippingStep(): void {
    if (this.isStepComplete(1)) return;
    this.state.completeStep(1);
    this.paymentAttempted.set(false);
  }

  private focusFirstInvalidField(): void {
    const invalidField = this.elementRef.nativeElement.querySelector('[aria-invalid="true"]') as HTMLElement | null;
    invalidField?.focus();
  }

  private parseForcedResult(value: string | null): ForcedPaymentResult {
    const normalized = value?.toLocaleLowerCase();
    const results: Record<string, ForcedPaymentResult> = {
      listo: 'ready',
      ready: 'ready',
      procesando: 'processing',
      processing: 'processing',
      exito: 'success',
      'éxito': 'success',
      success: 'success',
      error: 'error'
    };
    return normalized ? results[normalized] ?? null : null;
  }
}