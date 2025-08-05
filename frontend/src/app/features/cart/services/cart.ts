import { Injectable, signal, effect, computed } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const STORAGE_KEY = 'cart-items';

@Injectable({
  providedIn: 'root'
})
export class Cart {
  private cartItems = signal<CartItem[]>(this.getStoredCartItems());

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cartItems()));
    });
  }

  private getStoredCartItems(): CartItem[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    try {
      const parsed = JSON.parse(stored || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  getCartItems() {
    return this.cartItems.asReadonly();
  }

  addItem(item: CartItem) {
    const items = this.cartItems();
    const existing = items.find(p => p.id === item.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({ ...item, quantity: 1 });
    }

    this.cartItems.set([...items]);
    this.getStoredCartItems();
  }

  removeItem(productId: number) {
    const items = this.cartItems()
      .map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0);

    this.cartItems.set(items);
    this.getStoredCartItems();
  }

  clearCart() {
    this.cartItems.set([]);
  }

  getTotalCount(): number {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  }

  readonly total = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.price * item.quantity, 0)
  );


}
