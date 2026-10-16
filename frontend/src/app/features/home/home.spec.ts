import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Home } from './home';
import { CatalogFilterService } from '../../core/services/catalog-filter/catalog-filter';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('rotates the sort SVG arrow when opening and closing the menu', () => {
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const toggle = root.querySelector<HTMLButtonElement>('#sort')!;
    const arrow = toggle.querySelector('svg')!;

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(arrow.classList.contains('rotate-180')).toBeFalse();
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(arrow.classList.contains('rotate-180')).toBeTrue();
    expect(root.querySelector('[role="listbox"]')).not.toBeNull();
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(arrow.classList.contains('rotate-180')).toBeFalse();
    expect(root.querySelector('[role="listbox"]')).toBeNull();
  });

  for (const panelId of ['band-filter-options', 'genre-filter-options', 'format-filter-options']) {
    it(`rotates the SVG arrow with the expanded state of ${panelId}`, () => {
      fixture.detectChanges();
      const root: HTMLElement = fixture.nativeElement;
      const toggle = root.querySelector<HTMLButtonElement>(`[aria-controls="${panelId}"]`)!;
      const arrow = toggle.querySelector('svg')!;

      expect(arrow.getAttribute('aria-hidden')).toBe('true');
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(arrow.classList.contains('rotate-180')).toBeTrue();
      expect(root.querySelector(`#${panelId}`)).not.toBeNull();

      toggle.click();
      fixture.detectChanges();
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(arrow.classList.contains('rotate-180')).toBeFalse();
      expect(root.querySelector(`#${panelId}`)).toBeNull();

      toggle.click();
      fixture.detectChanges();
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(arrow.classList.contains('rotate-180')).toBeTrue();
      expect(root.querySelector(`#${panelId}`)).not.toBeNull();
    });
  }

  it('searches all real genres and filters products through the compact checkbox list', () => {
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const input = root.querySelector<HTMLInputElement>('[aria-label="Buscar género"]')!;
    expect(root.querySelectorAll('#genre-options-list label').length)
      .toBe(Math.min(7, component.availableGenreOptions.length));
    input.value = ' PRÓGRESSIVE ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.visibleGenreOptions).toEqual(['Progressive Metal']);
    expect(component.getGenreProductCount('Progressive Metal')).toBe(2);
    root.querySelector<HTMLInputElement>('#genre-options-list input')!.click();
    fixture.detectChanges();
    expect(component.visibleProducts.length).toBe(2);
    expect(component.selectedFilters.genres.values).toEqual(['Progressive Metal']);
    input.value = 'no-such-genre';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(root.textContent).toContain('No se encontraron géneros.');
  });

  it('expands and collapses genres while counting discs instead of stock units', () => {
    const product = component.products[0];
    component.allProducts = Array.from({ length: 9 }, (_, index) => ({
      ...product, id: 100 + index, stock: index === 8 ? 0 : 3,
      details: { ...product.details, genre: `Genre ${index}` }
    }));
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(component.availableGenreOptions.length).toBe(8);
    expect(component.getGenreProductCount('Genre 0')).toBe(1);
    expect(root.querySelectorAll('#genre-options-list label').length).toBe(7);
    const toggle = root.querySelector<HTMLButtonElement>('[aria-controls="genre-options-list"]')!;
    expect(toggle.textContent).toContain('Ver los 8 géneros');
    toggle.click();
    fixture.detectChanges();
    expect(root.querySelectorAll('#genre-options-list label').length).toBe(8);
    toggle.click();
    fixture.detectChanges();
    expect(root.querySelectorAll('#genre-options-list label').length).toBe(7);
  });

  it('shows a permanent band search, seven compact rows and a real expand/collapse total', () => {
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('input[aria-label="Buscar banda"]')).not.toBeNull();
    expect(root.querySelectorAll('#band-options-list label').length).toBe(7);
    const toggle = root.querySelector<HTMLButtonElement>('[aria-controls="band-options-list"]')!;
    expect(toggle.textContent).toContain(`Ver las ${component.availableBandOptions.length} bandas`);
    toggle.click();
    fixture.detectChanges();
    expect(root.querySelectorAll('#band-options-list label').length).toBe(component.availableBandOptions.length);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    fixture.detectChanges();
    expect(root.querySelectorAll('#band-options-list label').length).toBe(7);
  });

  it('searches all bands with normalized text without changing the product filters', () => {
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const input = root.querySelector<HTMLInputElement>('[aria-label="Buscar banda"]')!;
    input.value = '  MÓRBID ';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.visibleBandOptions).toEqual(['Morbid Angel']);
    expect(component.visibleProducts.length).toBe(9);
    const checkbox = root.querySelector<HTMLInputElement>('#band-options-list input')!;
    checkbox.click();
    fixture.detectChanges();
    expect(component.selectedFilters.bands.values).toEqual(['Morbid Angel']);
    expect(component.visibleProducts.every(product => product.details.artist === 'Morbid Angel')).toBeTrue();
    input.value = 'no-such-band';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(root.textContent).toContain('No se encontraron bandas.');
    expect(root.querySelectorAll('#band-options-list label').length).toBe(0);
  });

  it('counts available discs rather than stock units or selected filters', () => {
    fixture.detectChanges();
    expect(component.getBandProductCount('Gojira')).toBe(2);
    TestBed.inject(CatalogFilterService).toggleBand('Carcass', true);
    expect(component.getBandProductCount('Gojira')).toBe(2);
    const product = component.products[0];
    component.allProducts = [
      { ...product, id: 101, stock: 3 },
      { ...product, id: 102, stock: 2 },
      { ...product, id: 103, stock: 0 }
    ];
    expect(component.getBandProductCount('Gojira')).toBe(2);
    expect(component.availableBandOptions).toEqual(['Gojira']);
  });

  it('omits color and price filters while preserving product colors and price sorting', () => {
    fixture.detectChanges();
    const panel: HTMLElement = fixture.nativeElement.querySelector('#catalog-filters');
    expect(panel.textContent).not.toMatch(/Color del vinilo|Precio|Desde|Hasta/);
    expect(panel.querySelector('input[type="number"]')).toBeNull();
    expect(component.products[0].details.vinylColor).toBeDefined();
    component.selectSort('price_asc');
    const prices = component.visibleProducts.map(product => component.getProductPrice(product));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('exposes a mobile filter panel with expanded groups and retains selected filters when closed', () => {
    fixture.detectChanges();
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('[aria-controls="catalog-filters"]');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(component.showBandFilter).toBeTrue();
    expect(component.showGenreFilter).toBeTrue();
    expect(component.showFormatFilter).toBeTrue();
    component.toggleBandFilter('Gojira', true);
    toggle.click();
    fixture.detectChanges();
    expect(component.selectedFilters.bands.values).toEqual(['Gojira']);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders its initial page without changing bindings after view initialization', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(component.visibleProducts.length).toBe(component.itemsPerPage);
    expect(fixture.nativeElement.querySelectorAll('app-product-card').length).toBe(component.itemsPerPage);
  });

  it('loads the next page and cancels pending pagination when filters change', fakeAsync(() => {
    fixture.detectChanges();
    component.loadMoreProducts();
    tick(300);
    expect(component.visibleProducts.length).toBe(component.itemsPerPage * 2);

    component.loadMoreProducts();
    TestBed.inject(CatalogFilterService).toggleBand('Gojira', true);
    tick(300);
    expect(component.visibleProducts.length).toBe(2);
    expect(component.visibleProducts.every(product => product.details.artist === 'Gojira')).toBeTrue();
    expect(component.isLoadingMore).toBeFalse();
  }));

  it('resets sorting without appending a pending page or clearing the catalog', fakeAsync(() => {
    fixture.detectChanges();
    component.loadMoreProducts();
    component.selectSort('price_asc');
    tick(300);

    expect(component.visibleProducts.length).toBe(component.itemsPerPage);
    const prices = component.visibleProducts.map(product => component.getProductPrice(product));
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(component.isLoadingMore).toBeFalse();
  }));

  it('excludes zero-stock products without active filters', () => {
    const product = component.products[0];
    component.allProducts = [
      { ...product, id: 101, stock: 0 },
      { ...product, id: 102, stock: 1 },
      { ...product, id: 103, stock: 3 }
    ];

    component.applyFilters();

    expect(component.filteredProducts.map(product => product.id)).toEqual([102, 103]);
  });

  it('searches artist and album together regardless of case, accents or extra spaces', () => {
    fixture.detectChanges();
    TestBed.inject(CatalogFilterService).setSearchQuery('  GÓJIRA   sírius ');
    fixture.detectChanges();
    expect(component.visibleProducts.map(product => product.name)).toEqual(['From Mars To Sirius']);
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
    expect(component.visibleProducts).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('No encontramos productos');
    filters.clearBands();
    fixture.detectChanges();
    expect(component.visibleProducts.length).toBe(2);
    expect(fixture.nativeElement.textContent).not.toContain('No encontramos productos');
  });

  it('applies new-release and offer navigation using actual product flags and pricing', () => {
    fixture.detectChanges();
    const filters = TestBed.inject(CatalogFilterService);
    filters.setFilters(['NOVEDADES']);
    expect(component.filteredProducts).toEqual(component.products.filter(product => product.stock > 0 && product.isNew));
    filters.setFilters(['OFERTAS']);
    expect(component.filteredProducts).toEqual(component.products.filter(product => product.stock > 0 && component.hasDiscount(product)));
    expect(component.filteredProducts.length).toBeGreaterThan(0);
  });

  it('resets pending pagination when the search changes and never returns zero-stock matches', fakeAsync(() => {
    fixture.detectChanges();
    const product = component.products[0];
    component.allProducts = [{ ...product, stock: 0 }];
    component.loadMoreProducts();
    TestBed.inject(CatalogFilterService).setSearchQuery(product.details.artist);
    tick(300);
    expect(component.visibleProducts).toEqual([]);
    expect(component.isLoadingMore).toBeFalse();
  }));

  it('excludes zero-stock products even when they match an active filter', () => {
    const product = component.products[0];
    component.allProducts = [
      { ...product, id: 101, stock: 0 },
      { ...product, id: 102, stock: 2 }
    ];
    component.selectedFilters.bands.values = [product.details.artist];

    component.applyFilters();

    expect(component.filteredProducts.map(product => product.id)).toEqual([102]);
  });

  it('removes a product when its stock reaches zero and restores it when restocked', () => {
    const product = { ...component.products[0], stock: 1 };
    component.allProducts = [product];
    component.applyFilters();
    expect(component.filteredProducts).toEqual([product]);

    product.stock = 0;
    component.applyFilters();
    expect(component.filteredProducts).toEqual([]);

    product.stock = 2;
    component.applyFilters();
    expect(component.filteredProducts).toEqual([product]);
  });

  it('loads only on request, disables repeated requests and stops after the final page', fakeAsync(() => {
    fixture.detectChanges();
    const button = () => fixture.nativeElement.querySelector('button[aria-controls="catalog-grid"]') as HTMLButtonElement | null;
    const summary = () => fixture.nativeElement.querySelector('#catalog-results').textContent.replace(/\s+/g, ' ').trim();
    expect(summary()).toBe('Mostrando 9 de 20 productos');
    window.dispatchEvent(new Event('scroll'));
    tick(300);
    expect(component.visibleProducts.length).toBe(9);

    button()!.click();
    fixture.detectChanges();
    expect(button()!.disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('#catalog-grid').getAttribute('aria-busy')).toBe('true');
    component.loadMoreProducts();
    tick(300);
    fixture.detectChanges();
    expect(summary()).toBe('Mostrando 18 de 20 productos');
    expect(button()!.disabled).toBeFalse();
    button()!.click();
    tick(300);
    fixture.detectChanges();
    expect(summary()).toBe('Mostrando 20 de 20 productos');
    expect(button()).toBeNull();
    expect(new Set(component.visibleProducts.map(product => product.id)).size).toBe(20);
    component.loadMoreProducts();
    expect(component.isLoadingMore).toBeFalse();
  }));

  it('removes each chip independently while keeping other selections and sort order', () => {
    fixture.detectChanges();
    const filters = TestBed.inject(CatalogFilterService);
    filters.setFilters(['NOVEDADES', 'Gojira', 'Progressive Metal', 'Vinilo']);
    filters.setSearchQuery('flesh');
    component.selectSort('price_desc');
    fixture.detectChanges();
    const chips = () => fixture.nativeElement.querySelectorAll('button[aria-label^="Quitar filtro:"]');
    expect(chips().length).toBe(5);
    for (const label of ['Búsqueda: flesh', 'Novedades', 'Gojira', 'Progressive Metal', 'Vinilo']) {
      const previousLength = chips().length;
      fixture.nativeElement.querySelector(`button[aria-label="Quitar filtro: ${label}"]`).click();
      fixture.detectChanges();
      expect(chips().length).toBe(previousLength - 1);
      expect(component.selectedSort).toBe('price_desc');
    }
    expect(component.visibleProducts.length).toBe(9);
    expect(filters.getFilters().searchQuery).toBe('');
    expect(filters.getFilters().collection).toBeUndefined();
  });

  it('clears all selections in one update without enabling disabled groups or losing sort order', fakeAsync(() => {
    fixture.detectChanges();
    const filters = TestBed.inject(CatalogFilterService);
    filters.setFilters(['OFERTAS', 'Gojira', 'Vinilo']);
    filters.setSearchQuery('flesh');
    filters.setFilterGroupState('genres', false);
    component.selectSort('price_asc');
    fixture.detectChanges();
    const updates = jasmine.createSpy('updates');
    const subscription = filters.filters$.subscribe(updates);
    updates.calls.reset();
    const clearButton: HTMLButtonElement = Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find(button => button.textContent?.trim() === 'Limpiar filtros')!;
    clearButton.click();
    tick(300);
    fixture.detectChanges();
    expect(updates).toHaveBeenCalledTimes(1);
    expect(component.activeFilters).toEqual([]);
    expect(filters.getFilters().genres.enabled).toBeFalse();
    expect(component.selectedSort).toBe('price_asc');
    expect(component.visibleProducts.length).toBe(9);
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
    expect(component.activeFilters.map(filter => filter.kind)).toEqual(['search']);
    expect(fixture.nativeElement.querySelector('button[aria-controls="catalog-grid"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('#catalog-results').textContent.replace(/\s+/g, ' ').trim())
      .toBe('Mostrando 0 de 0 productos');
  });
});
