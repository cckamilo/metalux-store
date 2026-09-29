import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MusicDetails, Product } from '../../domain/product.model';

export type ProductCardItem = Omit<Product, 'details'> & {
  details: MusicDetails;
};

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.html'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: ProductCardItem;
  @Input() currentImage = 0;
  @Input() selectedQuantity = 1;
  @Input() finalPrice = 0;
  @Input() hasDiscount = false;
  @Input() discountLabel: string | null = null;
  @Input() isProductNew = false;
  @Input() isActive = true;

  @Output() previousImage = new EventEmitter<void>();
  @Output() nextImage = new EventEmitter<void>();
  @Output() selectImage = new EventEmitter<number>();
  @Output() quantityChange = new EventEmitter<number>();
  @Output() addToCart = new EventEmitter<number>();
  @Output() openDetails = new EventEmitter<void>();

  onPreviousImage(): void {
    this.previousImage.emit();
  }

  onNextImage(): void {
    this.nextImage.emit();
  }

  onSelectImage(index: number): void {
    this.selectImage.emit(index);
  }

  onQuantityChange(quantity: number): void {
    this.quantityChange.emit(quantity);
  }

  onAddToCart(): void {
    this.addToCart.emit(this.selectedQuantity);
  }

  onOpenDetails(): void {
    this.openDetails.emit();
  }
}
