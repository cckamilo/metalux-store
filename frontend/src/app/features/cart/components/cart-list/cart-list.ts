import { Component, inject, Input } from '@angular/core';
import { Cart, CartItem } from '../../services/cart';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cart-list',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './cart-list.html'
})
export class CartList {

  @Input() isOpen: boolean = false;
  @Input() close!: () => void;

  private cart = inject(Cart);
  cartItems = this.cart.getCartItems();

  increaseQuantity(item: CartItem) {
    this.cart.addItem(item);
  }

  decreaseQuantity(item: CartItem) {
    this.cart.removeItem(item.id);
  }

  formatearPrecio(precio: number): string {
    return '$' + precio.toLocaleString('es-CO');
  }

  getTotalPrice(): number {
    return this.cart.getCartItems()().reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
