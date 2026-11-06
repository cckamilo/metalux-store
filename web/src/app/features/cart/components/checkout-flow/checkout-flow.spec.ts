import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../../services/cart';
import { CheckoutStateService } from '../../services/checkout-state.service';
import { CheckoutFlow } from './checkout-flow';

describe('CheckoutFlow', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<CheckoutFlow>>;
  let component: CheckoutFlow;
  let cart: Cart;
  let state: CheckoutStateService;
  let queryParamMap: BehaviorSubject<ReturnType<typeof convertToParamMap>>;

  const product: CartItem = {
    id: 1,
    name: 'Test album',
    price: 88000,
    originalPrice: 100000,
    image: '',
    quantity: 1
  };

  const validShippingDetails = {
    documentId: '80845435',
    fullName: 'Christian Castro',
    whatsapp: '302 373 5083',
    email: 'ccastro@example.com',
    city: 'Bogotá',
    address: 'Transversal 4 # 13-93, barrio Centro'
  };

  beforeEach(async () => {
    localStorage.removeItem('cart-items');
    queryParamMap = new BehaviorSubject(convertToParamMap({}));
    await TestBed.configureTestingModule({
      imports: [CheckoutFlow],
      providers: [{ provide: ActivatedRoute, useValue: { queryParamMap } }]
    }).compileComponents();

    cart = TestBed.inject(Cart);
    state = TestBed.inject(CheckoutStateService);
    fixture = TestBed.createComponent(CheckoutFlow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('blocks invalid shipping details and announces the cédula error', () => {
    component.continueFromShipping();
    fixture.detectChanges();

    expect(component.checkoutForm.invalid).toBeTrue();
    expect(component.state.activeStep()).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('La cédula debe tener entre 6 y 10 números');
    expect(fixture.nativeElement.querySelector('#checkout-document').getAttribute('aria-invalid')).toBe('true');
  });

  it('applies the Colombian field rules and trims values on blur', () => {
    const invalidFields: Array<[keyof typeof component.checkoutForm.controls, string, string]> = [
      ['documentId', '12A45', 'La cédula debe tener entre 6 y 10 números'],
      ['fullName', 'Christian', 'Escribe tu nombre y apellido'],
      ['whatsapp', '302 123 456', 'El WhatsApp debe tener 10 números y empezar por 3'],
      ['email', 'ana @example.com', 'Revisa el correo, por ejemplo nombre@dominio.com'],
      ['city', 'Manizales', 'Selecciona una ciudad de la lista'],
      ['address', 'Calle 10', 'Escribe la dirección completa con barrio o conjunto']
    ];

    for (const [field, value, message] of invalidFields) {
      const control = component.checkoutForm.controls[field];
      control.setValue(value as never);
      component.normalizeField(field as keyof typeof component.checkoutForm.controls);
      expect(control.invalid).withContext(field).toBeTrue();
      expect(component.fieldError(field as keyof typeof component.checkoutForm.controls)).toBe(message);
    }

    component.checkoutForm.controls.fullName.setValue('  María Fernanda López  ');
    component.normalizeField('fullName');
    expect(component.checkoutForm.controls.fullName.value).toBe('María Fernanda López');
    expect(component.checkoutForm.controls.fullName.valid).toBeTrue();
  });

  it('requires a full email domain and validates the trimmed text before blur', () => {
    const { email, address, documentId } = component.checkoutForm.controls;

    for (const value of ['a@b', 'a@b.', '@dominio.com', 'a@@b.com']) {
      email.setValue(value);
      expect(email.invalid).withContext(value).toBeTrue();
    }
    email.setValue(' nombre@dominio.com ');
    expect(email.valid).toBeTrue();

    address.setValue(' '.repeat(10));
    expect(address.invalid).toBeTrue();
    address.setValue('x'.repeat(151));
    expect(address.invalid).toBeTrue();
    address.setValue(' Calle 10 # 5-20 ');
    expect(address.valid).toBeTrue();

    documentId.setValue(' 80845435 ');
    expect(documentId.valid).toBeTrue();
  });

  it('shows valid field styling immediately without moving focus', () => {
    const nameInput = fixture.nativeElement.querySelector('#checkout-name') as HTMLInputElement;
    component.checkoutForm.controls.fullName.setValue('Christian Castro');
    fixture.detectChanges();
    nameInput.focus();

    expect(component.checkoutForm.controls.fullName.touched).toBeFalse();
    expect(nameInput.classList).toContain('border-gray-300');
    expect(nameInput.classList).not.toContain('border-green-500');
    expect(nameInput.parentElement?.querySelector('.field-valid-icon')).not.toBeNull();
    expect(document.activeElement).toBe(nameInput);
  });

  it('advances automatically after valid shipping and payment selection', () => {
    cart.addItem(product);
    component.checkoutForm.setValue(validShippingDetails);
    component.continueFromShipping();
    fixture.detectChanges();

    expect(state.activeStep()).toBe(2);
    expect(state.completedSteps()).toEqual([1]);
    expect(state.paymentMethod()).toBeNull();
    expect(component.availablePaymentMethods().some(method => method.id === 'cash-on-delivery')).toBeTrue();

    component.selectPaymentMethod('card');
    expect(state.activeStep()).toBe(3);
    expect(state.completedSteps()).toEqual([1, 2]);

    component.pay();
    fixture.detectChanges();

    expect(state.activeStep()).toBe(4);
    expect(state.completedSteps()).toEqual([1, 2, 3]);
    expect(fixture.nativeElement.textContent).toContain('Pulsa Pagar para confirmar el pedido.');
    expect(component.total()).toBe(100000);
    expect(component.discount()).toBe(12000);
    expect(component.shipping()).toBe(12000);
    expect(component.total()).toBe(100000);
  });

  it('lets completed shipping and payment steps be edited independently', () => {
    state.completedSteps.set([1, 2]);
    state.activeStep.set(3);

    component.editPayment();
    expect(state.activeStep()).toBe(2);
    expect(state.completedSteps()).toEqual([1]);

    state.completedSteps.set([1, 2]);
    state.activeStep.set(3);
    component.editShipping();
    expect(state.activeStep()).toBe(1);
    expect(state.completedSteps()).toEqual([]);
  });

  it('hides cash on delivery outside coverage and clears it when the city changes', () => {
    component.checkoutForm.setValue({ ...validShippingDetails, city: 'Sibaté' });
    component.continueFromShipping();
    fixture.detectChanges();

    expect(component.availablePaymentMethods().some(method => method.id === 'cash-on-delivery')).toBeFalse();
    component.selectPaymentMethod('cash-on-delivery');
    expect(state.paymentMethod()).toBeNull();

    component.checkoutForm.controls.city.setValue('Bogotá');
    component.selectPaymentMethod('cash-on-delivery');
    component.checkoutForm.controls.city.setValue('Sibaté');
    fixture.detectChanges();

    expect(state.paymentMethod()).toBeNull();
    expect(state.activeStep()).toBe(2);
    expect(state.completedSteps()).toEqual([1]);
  });

  it('uses the discounted subtotal to decide free shipping at the threshold', () => {
    cart.addItem({ ...product, price: 200000, originalPrice: 250000 });
    fixture.detectChanges();

    expect(component.hasFreeShipping()).toBeTrue();
    expect(component.shipping()).toBe(0);
    expect(component.discount()).toBe(50000);
  });

  it('shows a simulated success after processing and creates an order number', fakeAsync(() => {
    state.completedSteps.set([1, 2, 3]);
    state.activeStep.set(4);
    state.forcedPaymentResult.set('success');

    component.pay();
    expect(state.paymentState()).toBe('processing');
    tick(700);

    expect(state.paymentState()).toBe('success');
    expect(state.orderNumber()).toMatch(/^MLX-/);
    expect(state.completedSteps()).toEqual([1, 2, 3, 4]);
  }));

  it('can force an error from the URL and retry successfully', fakeAsync(() => {
    state.completedSteps.set([1, 2, 3]);
    state.activeStep.set(4);
    queryParamMap.next(convertToParamMap({ resultadoPago: 'error' }));
    fixture.detectChanges();

    component.pay();
    tick(700);
    expect(state.paymentState()).toBe('error');

    component.pay(true);
    tick(700);
    expect(state.paymentState()).toBe('success');
  }));

  it('accepts the accented success value in the URL', () => {
    queryParamMap.next(convertToParamMap({ resultadoPago: 'éxito' }));

    expect(state.forcedPaymentResult()).toBe('success');
  });

  it('shows the ready state from the URL and then completes the normal payment cycle', fakeAsync(() => {
    state.completedSteps.set([1, 2, 3]);
    state.activeStep.set(4);
    queryParamMap.next(convertToParamMap({ resultadoPago: 'listo' }));
    fixture.detectChanges();

    expect(state.forcedPaymentResult()).toBe('ready');
    component.pay();
    expect(state.paymentState()).toBe('processing');
    tick(700);
    expect(state.paymentState()).toBe('success');
  }));

  it('keeps form data in memory and shows a forced processing state', () => {
    component.checkoutForm.setValue(validShippingDetails);
    queryParamMap.next(convertToParamMap({ resultadoPago: 'procesando' }));
    fixture.detectChanges();

    expect(state.draft().documentId).toBe(validShippingDetails.documentId);
    expect(localStorage.getItem('checkout-form')).toBeNull();

    state.completedSteps.set([1, 2, 3]);
    state.activeStep.set(4);
    component.pay();

    expect(state.paymentState()).toBe('processing');
  });
});