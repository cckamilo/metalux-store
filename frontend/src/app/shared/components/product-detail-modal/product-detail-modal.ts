import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { inject } from '@angular/core';
import { PricingService } from '../../../features/catalog/services/pricing.service';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail-modal.html'
})
export class ProductDetailModal {

  private pricingService = inject(PricingService);

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

  getProductPrice(product: any): number {
    return this.pricingService.getFinalPrice(product);
  }

  hasDiscount(product: any): boolean {
    return this.pricingService.hasDiscount(product);
  }

  getDiscountLabel(product: any): string | null {
    return this.pricingService.getDiscountLabel(product);
  }
}
