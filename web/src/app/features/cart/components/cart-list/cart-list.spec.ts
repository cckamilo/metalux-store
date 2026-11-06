import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CheckoutFlow } from '../checkout-flow/checkout-flow';
import { CartList } from './cart-list';
import { Cart, CartItem } from '../../services/cart';
import { CheckoutStateService } from '../../services/checkout-state.service';

describe('CartList', () => {
  let component: CartList;
  let fixture: ComponentFixture<CartList>;
  let cart: Cart;
  const firstProduct: CartItem = {
    id: 1,
    name: 'The Way of All Flesh',
    price: 88000,
    image: '',
    quantity: 1
  };
  const secondProduct: CartItem = {
    id: 2,
    name: 'Fallen Angel Of Doom',
    price: 90000,
    image: '',
    quantity: 1
  };

  beforeEach(async () => {
    localStorage.removeItem('cart-items');
    await TestBed.configureTestingModule({
      imports: [CartList],
      providers: [provideRouter([])]
    })
    .compileComponents();

    cart = TestBed.inject(Cart);
    fixture = TestBed.createComponent(CartList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates the count, line subtotal, total, and shipping progress when quantity changes', () => {
    cart.addItem(firstProduct);
    cart.addItem(secondProduct);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cart-unit-count').textContent.trim()).toBe('2');
    expect(fixture.nativeElement.textContent).toContain('Te faltan $22.000 para envío gratis.');
    expect(fixture.nativeElement.querySelector('.line-subtotal').textContent.trim()).toBe('$88.000');
    expect(fixture.nativeElement.querySelector('.unit-price')).toBeNull();

    fixture.nativeElement.querySelector('[aria-label="Aumentar cantidad de The Way of All Flesh"]').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cart-unit-count').textContent.trim()).toBe('3');
    expect(fixture.nativeElement.querySelector('.line-subtotal').textContent.trim()).toBe('$176.000');
    expect(fixture.nativeElement.querySelector('.unit-price').textContent.trim()).toBe('$88.000 c/u');
    expect(fixture.nativeElement.textContent).toContain('$266.000');
    expect(fixture.nativeElement.textContent).toContain('Tienes envío gratis en esta compra.');
    expect(fixture.nativeElement.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')).toBe('100');
  });

  it('keeps quantity at one when decreased and removes the line only with Eliminar', () => {
    cart.addItem(firstProduct);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('[aria-label="Disminuir cantidad de The Way of All Flesh"]').click();
    fixture.detectChanges();
    expect(cart.getCartItems()()[0].quantity).toBe(1);

    fixture.nativeElement.querySelector('[aria-label="Eliminar The Way of All Flesh"]').click();
    fixture.detectChanges();
    expect(cart.getCartItems()()).toEqual([]);
    expect(fixture.nativeElement.querySelector('.cart-unit-count').textContent.trim()).toBe('0');
    expect(fixture.nativeElement.querySelector('button[disabled][role="tab"]')?.textContent).toContain('Pagar');
  });

  it('switches to checkout inside the same drawer and returns to the bag tab', () => {
    cart.addItem(firstProduct);
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    const bagWidth = dialog.getBoundingClientRect().width;

    fixture.nativeElement.querySelector('[role="tab"]:nth-child(2)').click();
    fixture.detectChanges();

    expect(component.activeView).toBe('pay');
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBe(dialog);
    expect(dialog.getBoundingClientRect().width).toBe(bagWidth);
    expect(fixture.nativeElement.querySelector('app-checkout-flow')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('button[aria-current="step"]')?.textContent).toContain('Pagar');
    expect(fixture.nativeElement.querySelector('[role="tab"]:nth-child(2)')?.textContent).not.toContain('$');

    fixture.nativeElement.querySelector('[role="tab"]').click();
    fixture.detectChanges();
    expect(component.activeView).toBe('bag');
    expect(fixture.nativeElement.querySelector('app-checkout-flow')).toBeNull();
  });

  it('traps keyboard focus, closes with Escape, and restores focus to the trigger', async () => {
    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
    await Promise.resolve();

    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();
    component.close.subscribe(() => fixture.componentRef.setInput('isOpen', false));
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
    await Promise.resolve();

    const dialog = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    const firstButton = dialog.querySelector('[role="tab"]') as HTMLButtonElement;
    const closeButton = dialog.querySelector('[aria-label="Cerrar carrito"]') as HTMLButtonElement;
    expect(document.activeElement).toBe(firstButton);

    firstButton.focus();
    const backwardTab = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
    document.dispatchEvent(backwardTab);
    expect(backwardTab.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(closeButton);

    closeButton.focus();
    const forwardTab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    document.dispatchEvent(forwardTab);
    expect(forwardTab.defaultPrevented).toBeTrue();
    expect(document.activeElement).toBe(firstButton);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    fixture.detectChanges();
    await Promise.resolve();
    expect(component.isOpen).toBeFalse();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('closes checkout directly and retains the draft in memory', () => {
    cart.addItem(firstProduct);
    fixture.detectChanges();
    component.showPayment();
    fixture.detectChanges();

    const flow = fixture.debugElement.query(node => node.componentInstance instanceof CheckoutFlow).componentInstance as CheckoutFlow;
    flow.checkoutForm.controls.fullName.setValue('Christian Castro');
    fixture.detectChanges();

    const closeSpy = jasmine.createSpy('close');
    component.close.subscribe(closeSpy);
    component.onClose();
    fixture.detectChanges();

    expect(component.isOpen).toBeTrue();
    expect(closeSpy).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).not.toContain('¿Quieres cerrar el checkout?');
    expect(TestBed.inject(CheckoutStateService).draft().fullName).toBe('Christian Castro');

    fixture.componentRef.setInput('isOpen', false);
    fixture.detectChanges();
    expect(component.activeView).toBe('bag');
    fixture.componentRef.setInput('isOpen', true);
    component.showPayment();
    fixture.detectChanges();
    const reopenedFlow = fixture.debugElement.query(node => node.componentInstance instanceof CheckoutFlow).componentInstance as CheckoutFlow;
    expect(reopenedFlow.checkoutForm.controls.fullName.value).toBe('Christian Castro');
  });
});
