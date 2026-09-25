import { Injectable, signal, effect, computed } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

export type { CartItem } from '../models/cart-item.model';

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
    console.log('Se intenta agregar el siguiente item:', item);
    const items = this.cartItems();
    const existing = items.find(p => p.id === item.id);

    if (existing) {
      // Si el ítem existe, sumamos la nueva cantidad a la cantidad existente
      this.cartItems.update(currentItems =>
        currentItems.map(p =>
          p.id === item.id
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        )
      );
    } else {
      // Si el ítem es nuevo, lo agregamos con la cantidad seleccionada
      this.cartItems.set([...items, { ...item }]);
      console.log('Estado actual del carrito:', this.cartItems());
    }
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

// Nueva propiedad computada para el total de artículos
readonly totalCount = computed(() =>
  this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
);

  readonly total = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

   // Nuevo método para eliminar un producto por completo del carrito
  removeProduct(productId: number) {
    this.cartItems.update(items =>
      items.filter(item => item.id !== productId)
    );
  }


}
