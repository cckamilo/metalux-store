import { TestBed } from '@angular/core/testing';

import { Cart, CartItem } from './cart';

describe('Cart', () => {
  let service: Cart;
  const product: CartItem = {
    id: 1,
    name: 'Test album',
    price: 88000,
    image: '',
    quantity: 1
  };

  beforeEach(() => {
    localStorage.removeItem('cart-items');
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cart);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('does not decrease quantity below one', () => {
    service.addItem(product);

    service.removeItem(product.id);

    expect(service.getCartItems()()[0].quantity).toBe(1);
  });

  it('removes a whole product explicitly and recalculates totals', () => {
    service.addItem(product);
    service.addItem({ ...product, id: 2, quantity: 1 });

    service.removeProduct(product.id);

    expect(service.getCartItems()().map(item => item.id)).toEqual([2]);
    expect(service.totalCount()).toBe(1);
    expect(service.total()).toBe(88000);
  });
});
