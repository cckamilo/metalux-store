import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Promotion } from '../models/promotion.model';
import { promotions } from '../data/promotions.mock';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private readonly promotions = promotions;

  getApplicablePromotion(product: Product): Promotion | null {
    const activePromotions = this.promotions.filter(promotion => this.isActive(promotion));

    const productPromotion = activePromotions.find(promotion =>
      promotion.scope === 'product' && promotion.targetIds?.includes(product.id)
    );
    if (productPromotion) {
      return productPromotion;
    }

    const categoryPromotion = activePromotions.find(promotion =>
      promotion.scope === 'category' && promotion.targetIds?.includes(product.category.id)
    );
    if (categoryPromotion) {
      return categoryPromotion;
    }

    return activePromotions.find(promotion => promotion.scope === 'store') ?? null;
  }

  getFinalPrice(product: Product): number {
    const promotion = this.getApplicablePromotion(product);
    if (!promotion) {
      return product.price;
    }

    if (promotion.discountType === 'percentage') {
      return Math.round(product.price * (1 - promotion.value / 100));
    }

    return Math.max(0, product.price - promotion.value);
  }

  hasDiscount(product: Product): boolean {
    return this.getFinalPrice(product) < product.price;
  }

  getDiscountLabel(product: Product): string | null {
    const promotion = this.getApplicablePromotion(product);
    if (!promotion || !this.hasDiscount(product)) {
      return null;
    }

    return promotion.discountType === 'percentage'
      ? `-${promotion.value}%`
      : `-${promotion.value.toLocaleString('es-CO')}`;
  }

  private isActive(promotion: Promotion): boolean {
    if (!promotion.isActive) {
      return false;
    }

    const now = Date.now();
    const startsAt = promotion.startsAt ? new Date(promotion.startsAt).getTime() : -Infinity;
    const endsAt = promotion.endsAt ? new Date(promotion.endsAt).getTime() : Infinity;

    return now >= startsAt && now <= endsAt;
  }
}
