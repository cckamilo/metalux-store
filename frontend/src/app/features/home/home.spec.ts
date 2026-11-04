import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Home } from './home';
import { CatalogFilterService } from '../../core/services/catalog-filter/catalog-filter';
import { CatalogService } from '../catalog/services/catalog.service';
import { CatalogListingFacade } from '../catalog/services/catalog-listing.facade';
import { productsMock } from '../catalog/data/products.mock';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let listing: CatalogListingFacade;
  let catalog: jasmine.SpyObj<CatalogService>;

  beforeEach(async () => {
    catalog = jasmine.createSpyObj<CatalogService>('CatalogService', ['getProducts']);
    catalog.getProducts.and.returnValue(productsMock);
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [{ provide: CatalogService, useValue: catalog }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    listing = component.listing;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  for (const group of ['band', 'genre', 'format']) {
    it(`connects ${group} selection and clearing to the shared filters`, () => {
      fixture.detectChanges();
      const root: HTMLElement = fixture.nativeElement;
      root.querySelector<HTMLInputElement>(`#${group}-options-list input`)!.click();
      fixture.detectChanges();
      expect(listing.activeFilters.length).toBe(1);
      root.querySelector<HTMLButtonElement>(`#${group}-filter-options button`)!.click();
      fixture.detectChanges();
      expect(listing.activeFilters).toEqual([]);
      expect(listing.visibleProducts.length).toBe(9);
    });
  }

  it('scopes listing state to each page while sharing catalog filters', fakeAsync(() => {
    fixture.detectChanges();
    const other = TestBed.createComponent(Home);
    other.detectChanges();
    const otherListing = other.componentInstance.listing;
    expect(otherListing).not.toBe(listing);
    listing.selectSort('price_desc');
    listing.loadMoreProducts();
    tick(300);
    expect(listing.visibleProducts.length).toBe(18);
    expect(otherListing.visibleProducts.length).toBe(9);
    expect(otherListing.selectedSort).toBe('relevance');
    TestBed.inject(CatalogFilterService).setSearchQuery('Gojira');
    expect(listing.visibleProducts.length).toBe(2);
    expect(otherListing.visibleProducts.length).toBe(2);
    other.destroy();
  }));

  it('searches all real genres and filters products through the compact checkbox list', () => {
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const input = root.querySelector<HTMLInputElement>('[aria-label="Buscar género"]')!;
    expect(root.querySelectorAll('#genre-options-list label').length)
      .toBe(Math.min(6, listing.availableGenreOptions.length));
    input.value = ' PRÓGRESSIVE ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(root.querySelectorAll('#genre-options-list label').length).toBe(1);
    expect(root.querySelector('#genre-options-list')?.textContent).toContain('Progressive Metal');
    expect(listing.getGenreProductCount('Progressive Metal')).toBe(2);
    root.querySelector<HTMLInputElement>('#genre-options-list input')!.click();
    fixture.detectChanges();
    expect(listing.visibleProducts.length).toBe(2);
    expect(listing.selectedFilters.genres.values).toEqual(['Progressive Metal']);
    input.value = 'no-such-genre';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(root.textContent).toContain('No se encontraron géneros.');
  });

  it('expands and collapses genres while counting discs instead of stock units', () => {
    const product = productsMock[0];
    catalog.getProducts.and.returnValue(Array.from({ length: 9 }, (_, index) => ({
      ...product, id: 100 + index, stock: index === 8 ? 0 : 3,
      details: { ...product.details, genre: `Genre ${index}` }
    })));
    fixture.destroy();
    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    listing = component.listing;
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(listing.availableGenreOptions.length).toBe(8);
    expect(listing.getGenreProductCount('Genre 0')).toBe(1);
    expect(root.querySelectorAll('#genre-options-list label').length).toBe(6);
    const toggle = root.querySelector<HTMLButtonElement>('[aria-controls="genre-options-list"]')!;
    expect(toggle.textContent).toContain('Ver más géneros');
    toggle.click();
    fixture.detectChanges();
    expect(root.querySelectorAll('#genre-options-list label').length).toBe(8);
    toggle.click();
    fixture.detectChanges();
    expect(root.querySelectorAll('#genre-options-list label').length).toBe(6);
  });

  it('shows a permanent band search, six compact rows and a real expand/collapse total', () => {
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('input[aria-label="Buscar banda"]')).not.toBeNull();
    expect(root.querySelectorAll('#band-options-list label').length).toBe(6);
    const toggle = root.querySelector<HTMLButtonElement>('[aria-controls="band-options-list"]')!;
    expect(toggle.textContent).toContain('Ver más bandas');
    toggle.click();
    fixture.detectChanges();
    expect(root.querySelectorAll('#band-options-list label').length).toBe(listing.availableBandOptions.length);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    fixture.detectChanges();
    expect(root.querySelectorAll('#band-options-list label').length).toBe(6);
  });

  it('searches all bands with normalized text without changing the product filters', () => {
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const input = root.querySelector<HTMLInputElement>('[aria-label="Buscar banda"]')!;
    input.value = '  MÓRBID ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(root.querySelectorAll('#band-options-list label').length).toBe(1);
    expect(root.querySelector('#band-options-list')?.textContent).toContain('Morbid Angel');
    expect(listing.visibleProducts.length).toBe(9);
    const checkbox = root.querySelector<HTMLInputElement>('#band-options-list input')!;
    checkbox.click();
    fixture.detectChanges();
    expect(listing.selectedFilters.bands.values).toEqual(['Morbid Angel']);
    expect(listing.visibleProducts.every(product => product.details.artist === 'Morbid Angel')).toBeTrue();
    input.value = 'no-such-band';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(root.textContent).toContain('No se encontraron bandas.');
    expect(root.querySelectorAll('#band-options-list label').length).toBe(0);
  });

  it('keeps filter option counts independent of the selected filters', () => {
    fixture.detectChanges();
    expect(listing.getBandProductCount('Gojira')).toBe(2);
    TestBed.inject(CatalogFilterService).toggleBand('Carcass', true);
    expect(listing.getBandProductCount('Gojira')).toBe(2);
  });

  it('omits color and price filters while preserving product colors and price sorting', () => {
    fixture.detectChanges();
    const panel: HTMLElement = fixture.nativeElement.querySelector('#catalog-filters');
    expect(panel.textContent).not.toMatch(/Color del vinilo|Precio|Desde|Hasta/);
    expect(panel.querySelector('input[type="number"]')).toBeNull();
    expect(listing.products[0].details.vinylColor).toBeDefined();
    fixture.nativeElement.querySelector('#sort').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelectorAll('[role="option"]')[1].click();
    const prices = listing.visibleProducts.map(product => component.getProductPrice(product));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('exposes a mobile filter panel with expanded groups and retains selected filters when closed', () => {
    fixture.detectChanges();
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('[aria-controls="catalog-filters"]');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    for (const group of ['band', 'genre', 'format']) {
      expect(fixture.nativeElement.querySelector(`[aria-controls="${group}-filter-options"]`).getAttribute('aria-expanded')).toBe('true');
    }
    const lastBand: HTMLLabelElement = fixture.nativeElement.querySelector('#band-options-list label:last-child');
    const selectedBand = lastBand.querySelector('span')!.textContent!.trim();
    lastBand.querySelector('input')!.click();
    toggle.click();
    fixture.detectChanges();
    expect(listing.selectedFilters.bands.values).toEqual([selectedBand]);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders its initial page without changing bindings after view initialization', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(listing.visibleProducts.length).toBe(listing.itemsPerPage);
    expect(fixture.nativeElement.querySelectorAll('app-product-card').length).toBe(listing.itemsPerPage);
  });

  it('searches artist and album together regardless of case, accents or extra spaces', () => {
    fixture.detectChanges();
    TestBed.inject(CatalogFilterService).setSearchQuery('  GÓJIRA   sírius ');
    fixture.detectChanges();
    expect(listing.visibleProducts.map(product => product.name)).toEqual(['From Mars To Sirius']);
    expect(fixture.nativeElement.querySelector('#catalog-results').textContent.replace(/\s+/g, ' ').trim())
      .toBe('Mostrando 1 de 1 producto');
    expect(fixture.nativeElement.querySelector('[aria-label="Filtros activos"]').textContent).toContain('Búsqueda: GÓJIRA   sírius');
  });

  it('combines the query with existing filters and shows an empty state outside filter panels', () => {
    fixture.detectChanges();
    const filters = TestBed.inject(CatalogFilterService);
    filters.toggleBand('Carcass', true);
    filters.setSearchQuery('Gojira');
    fixture.detectChanges();
    expect(listing.visibleProducts).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('No encontramos productos');
    filters.clearBands();
    fixture.detectChanges();
    expect(listing.visibleProducts.length).toBe(2);
    expect(fixture.nativeElement.textContent).not.toContain('No encontramos productos');
  });

  it('applies new-release and offer navigation using actual product flags and pricing', () => {
    fixture.detectChanges();
    const filters = TestBed.inject(CatalogFilterService);
    filters.setFilters(['NOVEDADES']);
    expect(listing.filteredProducts).toEqual(listing.products.filter(product => product.stock > 0 && product.isNew));
    filters.setFilters(['OFERTAS']);
    expect(listing.filteredProducts).toEqual(listing.products.filter(product => product.stock > 0 && component.hasDiscount(product)));
    expect(listing.filteredProducts.length).toBeGreaterThan(0);
  });

  it('resets pending pagination when search changes to an empty result', fakeAsync(() => {
    fixture.detectChanges();
    listing.loadMoreProducts();
    TestBed.inject(CatalogFilterService).setSearchQuery('no-such-album');
    tick(300);
    expect(listing.visibleProducts).toEqual([]);
    expect(listing.isLoadingMore).toBeFalse();
  }));

  it('loads only on request, disables repeated requests and stops after the final page', fakeAsync(() => {
    fixture.detectChanges();
    const button = () => fixture.nativeElement.querySelector('button[aria-controls="catalog-grid"]') as HTMLButtonElement | null;
    const summary = () => fixture.nativeElement.querySelector('#catalog-results').textContent.replace(/\s+/g, ' ').trim();
    expect(summary()).toBe('Mostrando 9 de 20 productos');
    const progress = () => fixture.nativeElement.querySelector('[role="progressbar"]') as HTMLElement;
    expect(progress().getAttribute('aria-valuenow')).toBe('9');
    expect(progress().getAttribute('aria-valuemax')).toBe('20');
    expect((progress().firstElementChild as HTMLElement).style.width).toBe('45%');
    expect(button()!.textContent).toContain('Ver más vinilos');
    window.dispatchEvent(new Event('scroll'));
    tick(300);
    expect(listing.visibleProducts.length).toBe(9);

    button()!.click();
    fixture.detectChanges();
    expect(button()!.disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('#catalog-grid').getAttribute('aria-busy')).toBe('true');
    listing.loadMoreProducts();
    tick(300);
    fixture.detectChanges();
    expect(summary()).toBe('Mostrando 18 de 20 productos');
    expect((progress().firstElementChild as HTMLElement).style.width).toBe('90%');
    expect(button()!.disabled).toBeFalse();
    button()!.click();
    tick(300);
    fixture.detectChanges();
    expect(summary()).toBe('Mostrando 20 de 20 productos');
    expect((progress().firstElementChild as HTMLElement).style.width).toBe('100%');
    expect(button()).toBeNull();
    expect(new Set(listing.visibleProducts.map(product => product.id)).size).toBe(20);
    listing.loadMoreProducts();
    expect(listing.isLoadingMore).toBeFalse();
  }));

  it('removes each chip independently while keeping other selections and sort order', () => {
    fixture.detectChanges();
    const filters = TestBed.inject(CatalogFilterService);
    filters.setFilters(['NOVEDADES', 'Gojira', 'Progressive Metal', 'Vinilo']);
    filters.setSearchQuery('flesh');
    listing.selectSort('price_desc');
    fixture.detectChanges();
    const chips = () => fixture.nativeElement.querySelectorAll('button[aria-label^="Quitar filtro:"]');
    expect(chips().length).toBe(5);
    for (const label of ['Búsqueda: flesh', 'Novedades', 'Gojira', 'Progressive Metal', 'Vinilo']) {
      const previousLength = chips().length;
      fixture.nativeElement.querySelector(`button[aria-label="Quitar filtro: ${label}"]`).click();
      fixture.detectChanges();
      expect(chips().length).toBe(previousLength - 1);
      expect(listing.selectedSort).toBe('price_desc');
    }
    expect(listing.visibleProducts.length).toBe(9);
    expect(filters.getFilters().searchQuery).toBe('');
    expect(filters.getFilters().collection).toBeUndefined();
  });

  it('clears all selections in one update without enabling disabled groups or losing sort order', fakeAsync(() => {
    fixture.detectChanges();
    const filters = TestBed.inject(CatalogFilterService);
    filters.setFilters(['OFERTAS', 'Gojira', 'Vinilo']);
    filters.setSearchQuery('flesh');
    filters.setFilterGroupState('genres', false);
    listing.selectSort('price_asc');
    fixture.detectChanges();
    const updates = jasmine.createSpy('updates');
    const subscription = filters.filters$.subscribe(updates);
    updates.calls.reset();
    const clearButton: HTMLButtonElement = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(button => button.textContent?.trim() === 'Limpiar todo')!;
    clearButton.click();
    tick(300);
    fixture.detectChanges();
    expect(updates).toHaveBeenCalledTimes(1);
    expect(listing.activeFilters).toEqual([]);
    expect(filters.getFilters().genres.enabled).toBeFalse();
    expect(listing.selectedSort).toBe('price_asc');
    expect(listing.visibleProducts.length).toBe(9);
    expect(fixture.nativeElement.querySelector('[aria-label="Filtros activos"]')).toBeNull();
    subscription.unsubscribe();
  }));

  it('hides pagination for empty results and does not show chips for disabled filter groups', () => {
    fixture.detectChanges();
    const filters = TestBed.inject(CatalogFilterService);
    filters.toggleBand('Gojira', true);
    filters.setFilterGroupState('bands', false);
    filters.setSearchQuery('no-such-album');
    fixture.detectChanges();
    expect(listing.activeFilters.map(filter => filter.kind)).toEqual(['search']);
    expect(fixture.nativeElement.querySelector('button[aria-controls="catalog-grid"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('#catalog-results').textContent.replace(/\s+/g, ' ').trim())
      .toBe('Mostrando 0 de 0 productos');
  });
});
