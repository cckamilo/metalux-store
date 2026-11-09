import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MusicProduct } from '../../domain/product.model';
import { catalogConfig } from '../../config/catalog.config';

export type ProductCardItem = MusicProduct;

@Component({
  standalone: true,
  selector: 'app-product-card',
  host: { class: 'block h-full min-w-0 w-full' },
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './product-card.html'
})
export class ProductCardComponent implements OnDestroy {
  @Input({ required: true }) product!: ProductCardItem;
  @Input() finalPrice = 0;
  @Input() hasDiscount = false;
  @Input() discountLabel: string | null = null;
  @Input() isProductNew = false;
  @Input() isActive = true;
  @Input() lowStockThreshold = catalogConfig.lowStockThreshold;
  @Input() primaryAction = true;
  isAdding = false;
  private addTimer?: ReturnType<typeof setTimeout>;

  formatPrice(price: number): string {
    return '$' + price.toLocaleString('es-CO');
  }

  @Output() addToCart = new EventEmitter<number>();
  @Output() openDetails = new EventEmitter<void>();

  onAddToCart(): void {
    if (this.product.stock <= 0 || this.isAdding) return;
    this.isAdding = true;
    this.addToCart.emit(1);
    this.addTimer = setTimeout(() => {
      this.isAdding = false;
      this.addTimer = undefined;
    }, 650);
  }

  ngOnDestroy(): void {
    if (this.addTimer) clearTimeout(this.addTimer);
  }

  onOpenDetails(): void {
    this.openDetails.emit();
  }
}
