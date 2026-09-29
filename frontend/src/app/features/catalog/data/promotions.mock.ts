import { Promotion } from '../domain/promotion.model';

export const promotions: Promotion[] = [
  {
    id: 1,
    name: 'Descuento general de temporada',
    description: '10% de descuento en toda la tienda.',
    discountType: 'percentage',
    value: 10,
    scope: 'store',
    isActive: false,
    canStack: false,
    display: {
      bannerEnabled: true,
      carouselEnabled: true,
      ctaEnabled: false,
      bannerTitle: '10% de descuento en toda la tienda',
      bannerDescription: 'Aprovecha esta promocion por tiempo limitado.'
    }
  },
  {
    id: 2,
    name: 'Oferta especial Gojira',
    description: 'Descuento especial en ediciones seleccionadas.',
    discountType: 'percentage',
    value: 20,
    scope: 'product',
    targetIds: [1, 3],
    isActive: true,
    canStack: false,
    display: {
      bannerEnabled: true,
      carouselEnabled: true,
      ctaEnabled: true,
      bannerTitle: 'Ediciones de Gojira con 20% de descuento',
      ctaLabel: 'Ver oferta',
      ctaAction: 'filter',
      ctaValue: 'OFERTAS'
    }
  }
];
