import { Component, computed, ElementRef, EventEmitter, HostListener, inject, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { Cart, CartItem } from '../../services/cart';
import { DOCUMENT } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { checkoutMock } from '../../data/checkout.mock';
import { CheckoutFlow } from '../checkout-flow/checkout-flow';

type CartPanelView = 'bag' | 'pay';


@Component({
  selector: 'app-cart-list',
  imports: [NgIcon, CheckoutFlow],
  providers: [provideIcons({ lucideX })],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './cart-list.html'
})
export class CartList {

  readonly closeIcon = 'lucideX';
  readonly freeShippingThreshold = checkoutMock.freeShippingThreshold;
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  activeView: CartPanelView = 'bag';

  private _isOpen: boolean = false;
  private previouslyFocusedElement: HTMLElement | null = null;

  @Input()
  set isOpen(value: boolean) {
    const wasOpen = this._isOpen;
    this._isOpen = value;

    if (!wasOpen && value) {
      this.previouslyFocusedElement = this.document.activeElement instanceof HTMLElement
        ? this.document.activeElement
        : null;
      queueMicrotask(() => {
        if (this._isOpen) this.focusFirstElement();
      });
    } else if (wasOpen && !value) {
      const elementToRestore = this.previouslyFocusedElement;
      this.previouslyFocusedElement = null;
      queueMicrotask(() => elementToRestore?.focus());
    }
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.onClose();
      return;
    }

    if (event.key !== 'Tab') return;

    const dialog = this.dialogElement();
    if (!dialog) return;

    const focusableElements = Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(element => element.getAttribute('aria-hidden') !== 'true');

    if (focusableElements.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = this.document.activeElement;

    if (event.shiftKey && (activeElement === firstElement || !dialog.contains(activeElement))) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && (activeElement === lastElement || !dialog.contains(activeElement))) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.activeView = 'bag';
    this.close.emit();
  }

  showBag(): void {
    this.activeView = 'bag';
  }

  showPayment(): void {
    if (this.totalCount() === 0) return;
    this.activeView = 'pay';
  }

  private cart = inject(Cart);
  cartItems = this.cart.getCartItems();
  totalPrice = this.cart.total;
  totalCount = this.cart.totalCount;
  paymentTotal = computed(() => this.totalCount() === 0
    ? 0
    : this.totalPrice() + (this.totalPrice() >= this.freeShippingThreshold ? 0 : checkoutMock.shippingFee)
  );
  remainingForFreeShipping = computed(() => Math.max(this.freeShippingThreshold - this.totalPrice(), 0));
  freeShippingProgress = computed(() => Math.min(this.totalPrice() / this.freeShippingThreshold * 100, 100));

  increaseQuantity(item: CartItem) {
    this.cart.addItem({ ...item, quantity: 1 });
  }

  decreaseQuantity(item: CartItem) {
    this.cart.removeItem(item.id);
  }

  formatearPrecio(precio: number): string {
    return '$' + precio.toLocaleString('es-CO');
  }

  removeProduct(id: number) {
    this.cart.removeProduct(id);
  }

  getLineSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  private focusFirstElement(): void {
    const dialog = this.dialogElement();
    const firstFocusable = dialog?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    (firstFocusable ?? dialog)?.focus();
  }

  private dialogElement(): HTMLElement | null {
    return (this.elementRef.nativeElement as HTMLElement).querySelector('[role="dialog"]');
  }
}