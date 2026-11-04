import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MusicProduct } from '../../domain/product.model';
import { catalogConfig } from '../../config/catalog.config';

export type ProductCardItem = MusicProduct;

@Component({
  standalone: true,
  selector: 'app-product-card',
  host: { class: 'block h-full min-w-0 w-full' },
  imports: [CommonModule],
  templateUrl: './product-card.html'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductCardItem;
  @Input() finalPrice = 0;
  @Input() hasDiscount = false;
  @Input() discountLabel: string | null = null;
  @Input() isProductNew = false;
  @Input() isActive = true;
  @Input() lowStockThreshold = catalogConfig.lowStockThreshold;

  formatPrice(price: number): string {
    return '$' + price.toLocaleString('es-CO');
  }

  @Output() addToCart = new EventEmitter<number>();
  @Output() openDetails = new EventEmitter<void>();

  onAddToCart(): void {
    if (this.product.stock > 0) {
      this.addToCart.emit(1);
    }
  }

  onOpenDetails(): void {
    this.openDetails.emit();
  }
}
