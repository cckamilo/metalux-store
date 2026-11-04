import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CatalogFilterService } from '../../../core/services/catalog-filter/catalog-filter';
import { MusicProduct } from '../domain/product.model';
import {
  countAvailableProducts, filterProducts, getAvailableBands, getAvailableGenres, sortProducts
} from '../queries/catalog.queries';
import { CatalogService } from './catalog.service';
import { PricingService } from './pricing.service';

export interface ActiveFilter {
  kind: 'bands' | 'genres' | 'formats' | 'search' | 'collection';
  value: string;
  label: string;
}

/** Coordina el listado por pagina sin duplicar el estado compartido de filtros. */
@Injectable()
export class CatalogListingFacade {
  private readonly filters = inject(CatalogFilterService);
  private readonly pricing = inject(PricingService);
  private readonly destroyRef = inject(DestroyRef);
  readonly products = inject(CatalogService).getProducts();
  readonly itemsPerPage = 9;
  readonly sortOptions = [
    { label: 'Más relevantes', value: 'relevance' },
    { label: 'Menor precio', value: 'price_asc' },
    { label: 'Mayor precio', value: 'price_desc' },
    { label: 'Más recientes', value: 'newest' }
  ];
  readonly formatOptions = this.filters.formatOptions;
  readonly availableBandOptions: string[];
  readonly availableGenreOptions = getAvailableGenres(this.products);
  private readonly mutableBandCounts = new Map<string, number>();
  private readonly mutableGenreCounts = new Map<string, number>();
  readonly bandCounts: ReadonlyMap<string, number> = this.mutableBandCounts;
  readonly genreCounts: ReadonlyMap<string, number> = this.mutableGenreCounts;
  private loadTimeout?: ReturnType<typeof setTimeout>;
  selectedSort = 'relevance';
  filteredProducts: MusicProduct[] = [];
  visibleProducts: MusicProduct[] = [];
  activeFilters: ActiveFilter[] = [];
  isLoadingMore = false;

  /**
   * Precalcula opciones y conteos del catalogo fuente y conecta los filtros al listado.
   * Cada cambio reinicia la paginacion; al destruir la pagina se liberan la
   * suscripcion y cualquier carga pendiente.
   */
  constructor() {
    this.filters.hydrateBandOptionsFromProducts([...this.products]);
    this.availableBandOptions = getAvailableBands(this.products, this.filters.bandOptions);
    for (const band of this.availableBandOptions) {
      this.mutableBandCounts.set(band.toLowerCase(), countAvailableProducts(this.products, 'artist', band));
    }
    for (const genre of this.availableGenreOptions) {
      this.mutableGenreCounts.set(genre.toLowerCase(), countAvailableProducts(this.products, 'genre', genre));
    }
    this.filters.filters$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(filters => {
      this.filteredProducts = sortProducts(
        filterProducts(this.products, filters, product => this.pricing.hasDiscount(product)),
        this.selectedSort, product => this.pricing.getFinalPrice(product));
      this.activeFilters = this.buildActiveFilters();
      this.resetPage();
    });
    this.destroyRef.onDestroy(() => clearTimeout(this.loadTimeout));
  }

  /** Consulta la seleccion actual en el servicio compartido, sin mantener una copia local. */
  get selectedFilters() {
    return this.filters.getFilters();
  }

  /** Obtiene la etiqueta del orden actual; usa relevancia si el valor no esta registrado. */
  get selectedSortLabel(): string {
    return this.sortOptions.find(option => option.value === this.selectedSort)?.label ?? 'Más relevantes';
  }

  /** Reordena los resultados por el criterio elegido y vuelve a la primera pagina. */
  selectSort(value: string): void {
    this.selectedSort = value;
    this.filteredProducts = sortProducts(this.filteredProducts, value, product => this.pricing.getFinalPrice(product));
    this.resetPage();
  }

  /**
   * Amplia el listado hasta el siguiente bloque tras una espera local de 300 ms.
   * No consulta una API y evita solicitudes simultaneas o posteriores al ultimo bloque.
   */
  loadMoreProducts(): void {
    if (this.isLoadingMore || this.visibleProducts.length >= this.filteredProducts.length) return;
    this.isLoadingMore = true;
    this.loadTimeout = setTimeout(() => {
      this.visibleProducts = this.filteredProducts.slice(0, this.visibleProducts.length + this.itemsPerPage);
      this.isLoadingMore = false;
      this.loadTimeout = undefined;
    }, 300);
  }

  /**
   * Devuelve discos con stock de la banda, no unidades ni versiones.
   * Ignora mayusculas y no depende de los filtros activos; una banda ausente devuelve cero.
   */
  getBandProductCount(band: string): number {
    return this.bandCounts.get(band.toLowerCase()) ?? 0;
  }

  /**
   * Devuelve discos con stock del genero, independientemente de filtros y paginacion.
   * Ignora mayusculas; un genero ausente devuelve cero.
   */
  getGenreProductCount(genre: string): number {
    return this.genreCounts.get(genre.toLowerCase()) ?? 0;
  }

  /** Quita solo la seleccion representada por el chip a traves del servicio compartido. */
  removeFilter(filter: ActiveFilter): void {
    switch (filter.kind) {
      case 'search': this.filters.setSearchQuery(''); break;
      case 'collection': this.filters.setCatalogFilterConfiguration({ collection: undefined }); break;
      case 'bands': this.filters.toggleBand(filter.value, false); break;
      case 'genres': this.filters.toggleGenre(filter.value, false); break;
      case 'formats': this.filters.toggleFormat(filter.value, false); break;
    }
  }

  /** Limpia las selecciones en una sola actualizacion, conservando grupos habilitados y orden. */
  clearActiveFilters(): void {
    const current = this.selectedFilters;
    this.filters.setCatalogFilterConfiguration({
      searchQuery: '', collection: undefined,
      bands: { ...current.bands, values: [] },
      genres: { ...current.genres, values: [] },
      formats: { ...current.formats, values: [] }
    });
  }

  /** Cancela cargas pendientes y reemplaza los productos visibles por el primer bloque. */
  private resetPage(): void {
    clearTimeout(this.loadTimeout);
    this.loadTimeout = undefined;
    this.isLoadingMore = false;
    this.visibleProducts = this.filteredProducts.slice(0, this.itemsPerPage);
  }

  /** Construye los chips de busqueda, coleccion y valores de los grupos habilitados. */
  private buildActiveFilters(): ActiveFilter[] {
    const current = this.selectedFilters;
    const filters: ActiveFilter[] = [];
    const query = current.searchQuery?.trim();
    if (query) filters.push({ kind: 'search', value: query, label: `Búsqueda: ${query}` });
    if (current.collection) {
      filters.push({
        kind: 'collection', value: current.collection,
        label: current.collection === 'new' ? 'Novedades' : 'Ofertas'
      });
    }
    for (const kind of ['bands', 'genres', 'formats'] as const) {
      if (current[kind].enabled) {
        filters.push(...current[kind].values.map(value => ({ kind, value, label: value })));
      }
    }
    return filters;
  }
}
