import { Product } from '../domain/product.model';

export interface ProductCardState {
  currentImageIndex: number;
}

export interface ProductCardViewModel {
  product: Product;
  state: ProductCardState;
  isNew: boolean;
  hasDiscount: boolean;
}
