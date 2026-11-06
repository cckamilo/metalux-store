export type DiscountType = 'percentage' | 'fixed';
export type PromotionScope = 'store' | 'category' | 'product';

export interface PromotionDisplay {
  bannerEnabled: boolean;
  carouselEnabled: boolean;
  ctaEnabled: boolean;
  bannerTitle?: string;
  bannerDescription?: string;
  bannerImage?: string;
  ctaLabel?: string;
  ctaAction?: 'filter' | 'route' | 'url';
  ctaValue?: string;
}

export interface Promotion {
  id: number;
  name: string;
  description?: string;
  discountType: DiscountType;
  value: number;
  scope: PromotionScope;
  targetIds?: number[];
  isActive: boolean;
  startsAt?: string;
  endsAt?: string;
  canStack: boolean;
  display: PromotionDisplay;
}
