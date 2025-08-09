import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail-modal.html'
})
export class ProductDetailModal {

   @Input() product: any;
  @Input() show: boolean = false;
  @Output() close = new EventEmitter<void>();
 @Output() addToCartEvent = new EventEmitter<any>();
  closeModal() {
    this.show = false;
    this.close.emit();
  }

  addToCart(product: any) {
    this.addToCartEvent.emit(product);
  }

  formatPrice(price: number): string {
    return '$' + price.toLocaleString('es-CO');
  }
}
