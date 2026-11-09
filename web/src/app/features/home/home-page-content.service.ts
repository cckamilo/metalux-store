import { Injectable, inject } from '@angular/core';
import { CatalogService } from '../catalog/services/catalog.service';
import { MusicProduct } from '../catalog/domain/product.model';
import { PricingService } from '../catalog/services/pricing.service';

export type HomeCategoryFilter = 'Vinilo' | 'CD' | 'NOVEDADES' | 'OFERTAS' | 'BANDAS';

export interface HomeCategoryLink {
  label: string;
  filter: HomeCategoryFilter;
  count: number;
  description: string;
}

const HERO_PRODUCT_ID = 1;
const FEATURED_PRODUCT_IDS = [1, 2, 3, 4];

@Injectable({ providedIn: 'root' })
export class HomePageContentService {
  private readonly catalog = inject(CatalogService);
  private readonly pricing = inject(PricingService);
  private readonly products = this.catalog.getProducts().filter(product => product.isActive);

  readonly heroProduct = this.products.find(product => product.id === HERO_PRODUCT_ID);
  readonly heroEyebrow = 'DESTACADO DE LA SEMANA';
  readonly heroTitle = 'From Mars To Sirius';
  readonly heroDescription = 'From Mars To Sirius en vinilo blanco crema. Un clásico de Gojira para escuchar de principio a fin.';
  readonly heroActionLabel = 'Comprar el disco';

  readonly featuredProducts = FEATURED_PRODUCT_IDS
    .map(id => this.products.find(product => product.id === id))
    .filter((product): product is MusicProduct => product !== undefined && product.stock > 0);

  readonly newArrivals = this.products.filter(product => product.stock > 0 && product.isNew).slice(0, 4);

  readonly offerProducts = this.products.filter(product =>
    product.stock > 0 && this.pricing.hasDiscount(product)
  );

  readonly categories: HomeCategoryLink[] = [
    { label: 'Vinilos', filter: 'Vinilo', description: 'Ediciones de color', count: this.countProducts(product => product.details.format === 'vinyl') },
    { label: 'CDs', filter: 'CD', description: 'Ediciones especiales', count: this.countProducts(product => product.details.format === 'cd') },
    { label: 'Por banda', filter: 'BANDAS', description: 'Gojira, At The Gates...', count: new Set(this.products.filter(product => product.stock > 0).map(product => product.details.artist)).size },
    { label: 'Ofertas', filter: 'OFERTAS', description: 'Precios rebajados', count: this.offerProducts.length }
  ];

  private countProducts(matches: (product: MusicProduct) => boolean): number {
    return this.products.filter(product => product.stock > 0 && matches(product)).length;
  }
}
