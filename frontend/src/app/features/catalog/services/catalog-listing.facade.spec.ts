import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CatalogFilterService } from '../../../core/services/catalog-filter/catalog-filter';
import { productsMock } from '../data/products.mock';
import { CatalogListingFacade } from './catalog-listing.facade';
import { CatalogService } from './catalog.service';
import { PricingService } from './pricing.service';

describe('CatalogListingFacade', () => {
  let listing: CatalogListingFacade;
  let filters: CatalogFilterService;
  let catalog: jasmine.SpyObj<CatalogService>;

  beforeEach(() => {
    catalog = jasmine.createSpyObj<CatalogService>('CatalogService', ['getProducts']);
    catalog.getProducts.and.returnValue(productsMock);
    TestBed.configureTestingModule({
      providers: [CatalogListingFacade, { provide: CatalogService, useValue: catalog }]
    });
    filters = TestBed.inject(CatalogFilterService);
  });

  it('loads from the catalog service and reads the existing shared filter state', () => {
    filters.setSearchQuery('  GÓJIRA sírius ');
    listing = TestBed.inject(CatalogListingFacade);
    expect(catalog.getProducts).toHaveBeenCalledTimes(1);
    expect(listing.selectedFilters).toEqual(filters.getFilters());
    expect(listing.visibleProducts.map(product => product.name)).toEqual(['From Mars To Sirius']);
    expect(listing.activeFilters[0].kind).toBe('search');
    filters.setSearchQuery('');
    expect(listing.visibleProducts.length).toBe(9);
  });

  it('loads the next page and cancels pending pagination when filters change', fakeAsync(() => {
    listing = TestBed.inject(CatalogListingFacade);
    listing.loadMoreProducts();
    tick(300);
    expect(listing.visibleProducts.length).toBe(listing.itemsPerPage * 2);
    listing.loadMoreProducts();
    filters.toggleBand('Gojira', true);
    tick(300);
    expect(listing.visibleProducts.length).toBe(2);
    expect(listing.visibleProducts.every(product => product.details.artist === 'Gojira')).toBeTrue();
    expect(listing.isLoadingMore).toBeFalse();
  }));

  it('resets sorting without appending a pending page or clearing the catalog', fakeAsync(() => {
    listing = TestBed.inject(CatalogListingFacade);
    listing.loadMoreProducts();
    listing.selectSort('price_asc');
    tick(300);
    const pricing = TestBed.inject(PricingService);
    const prices = listing.visibleProducts.map(product => pricing.getFinalPrice(product));
    expect(listing.visibleProducts.length).toBe(listing.itemsPerPage);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(listing.isLoadingMore).toBeFalse();
    expect(listing.selectedSortLabel).toBe('Menor precio');
  }));

  it('derives counts from source products, not the filtered page or stock units', () => {
    const product = productsMock[0];
    catalog.getProducts.and.returnValue([
      { ...product, id: 101, stock: 3 },
      { ...product, id: 102, stock: 1 },
      { ...product, id: 103, stock: 0 }
    ]);
    listing = TestBed.inject(CatalogListingFacade);
    filters.setSearchQuery('no-such-album');
    expect(listing.visibleProducts).toEqual([]);
    expect(listing.availableBandOptions).toEqual(['Gojira']);
    expect(listing.getBandProductCount('Gojira')).toBe(2);
    expect(listing.getBandProductCount('GOJIRA')).toBe(2);
    expect(listing.getGenreProductCount(product.details.genre)).toBe(2);
  });

  it('handles empty catalog data without pending pagination', fakeAsync(() => {
    catalog.getProducts.and.returnValue([]);
    listing = TestBed.inject(CatalogListingFacade);
    listing.loadMoreProducts();
    tick(300);
    expect(listing.visibleProducts).toEqual([]);
    expect(listing.availableBandOptions).toEqual([]);
    expect(listing.availableGenreOptions).toEqual([]);
    expect(listing.isLoadingMore).toBeFalse();
  }));

  it('cancels timers and stops reacting to shared filters on destruction', fakeAsync(() => {
    listing = TestBed.inject(CatalogListingFacade);
    listing.loadMoreProducts();
    const page = listing.visibleProducts;
    TestBed.resetTestingModule();
    tick(300);
    filters.setSearchQuery('Gojira');
    expect(listing.visibleProducts).toBe(page);
    expect(listing.filteredProducts.length).toBe(20);
  }));
});
