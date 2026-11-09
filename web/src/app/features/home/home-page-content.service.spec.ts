import { TestBed } from '@angular/core/testing';
import { CatalogService } from '../catalog/services/catalog.service';
import { PricingService } from '../catalog/services/pricing.service';
import { HomePageContentService } from './home-page-content.service';

describe('HomePageContentService', () => {
  let content: HomePageContentService;

  beforeEach(() => {
    content = TestBed.inject(HomePageContentService);
  });

  it('uses the existing hero product and curated featured products', () => {
    const products = TestBed.inject(CatalogService).getProducts();
    expect(content.heroProduct?.id).toBe(1);
    expect(content.featuredProducts.map(product => product.id)).toEqual([1, 2, 3, 4]);
    expect(content.featuredProducts.every(product => product.isActive && product.stock > 0)).toBeTrue();
    expect(content.featuredProducts.every(product => products.includes(product))).toBeTrue();
  });

  it('derives category counts and offers from active catalog data', () => {
    const products = TestBed.inject(CatalogService).getProducts().filter(product => product.isActive && product.stock > 0);
    const pricing = TestBed.inject(PricingService);
    const categoryCounts = content.categories.map(category => category.count);

    expect(content.categories.map(category => category.label)).toEqual(['Vinilos', 'CDs', 'Por banda', 'Ofertas']);
    expect(categoryCounts).toEqual([
      products.filter(product => product.details.format === 'vinyl').length,
      products.filter(product => product.details.format === 'cd').length,
      new Set(products.map(product => product.details.artist)).size,
      products.filter(product => pricing.hasDiscount(product)).length
    ]);
    expect(content.offerProducts.every(product => pricing.hasDiscount(product))).toBeTrue();
    expect(content.categories.find(category => category.filter === 'OFERTAS')?.count).toBe(content.offerProducts.length);
  });

  it('selects up to four available new arrivals from the catalog', () => {
    const products = TestBed.inject(CatalogService).getProducts();
    expect(content.newArrivals).toEqual(products.filter(product => product.isActive && product.stock > 0 && product.isNew).slice(0, 4));
    expect(content.newArrivals.length).toBe(4);
  });
});
