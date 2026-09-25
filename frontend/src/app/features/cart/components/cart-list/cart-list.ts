import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Cart, CartItem } from '../../services/cart';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Trash2 } from 'lucide-angular';


@Component({
  selector: 'app-cart-list',
  imports: [CommonModule, LucideAngularModule],
  standalone: true,
  templateUrl: './cart-list.html'
})
export class CartList {

  readonly trashIcon = Trash2;

  private _isOpen: boolean = false;

  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  @Output() close = new EventEmitter<void>();



  onClose() {
    this.close.emit();
  }

  private cart = inject(Cart);
  cartItems = this.cart.getCartItems();
    totalPrice = this.cart.total;

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

  onClearCart() {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cart.clearCart();
    }
  }

  removeProduct(id: number) {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.cart.removeProduct(id);
    }
  }
}