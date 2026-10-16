import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Cart, CartItem } from '../cart/services/cart';
import { FormsModule } from '@angular/forms';
import { CatalogFilterService } from '../../core/services/catalog-filter/catalog-filter';
import { ProductDetailModal } from '../../shared/components/product-detail-modal/product-detail-modal';
import { CampaignCarousel } from '../marketing/components/campaign-carousel/campaign-carousel';
import { CampaignSlide } from '../marketing/domain/campaign.model';
import { CampaignService } from '../marketing/services/campaign.service';
import { ProductCardComponent, ProductCardItem } from '../catalog/components/product-card/product-card';
import { Product } from '../catalog/domain/product.model';
import { PricingService } from '../catalog/services/pricing.service';
import { CatalogFilterState } from '../../core/services/catalog-filter/catalog-filter';
import { productsMock } from '../catalog/data/products.mock';

interface ProductCardState {
  currentImage: number;
}

interface ActiveFilter {
  kind: 'bands' | 'genres' | 'formats' | 'search' | 'collection';
  value: string;
  label: string;
}

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule, ProductDetailModal, CampaignCarousel, ProductCardComponent],
  templateUrl: './home.html'
})
export class Home implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private loadTimeout?: ReturnType<typeof setTimeout>;

  // Constructor con dependencias para carrito y catálogo.
  constructor(
    private cart: Cart,
    private filterService: CatalogFilterService,
    private pricingService: PricingService,
    private campaignService: CampaignService
  ) {
    this.campaignSlides = this.campaignService.getHomeCarouselSlides();
    this.filterService.hydrateBandOptionsFromProducts(this.products);
    this.bandOptions = this.filterService.bandOptions;
    this.genreOptions = this.filterService.genreOptions;
    this.formatOptions = this.filterService.formatOptions;
    this.selectedFilters = this.filterService.getFilters();
  }

  // Estado actual del orden visual del catálogo.
  selectedSort = 'relevance';
  sortMenuOpen = false;
  // Controla la visibilidad de cada popover de filtro.
  showBandFilter = true;
  showGenreFilter = true;
  showFormatFilter = true;
  showMobileFilters = false;
  readonly initialBandLimit = 7;
  showAllBands = false;
  bandSearchTerm = '';
  readonly initialGenreLimit = 7;
  showAllGenres = false;
  genreSearchTerm = '';
  readonly bandOptions: string[];
  readonly genreOptions: string[];
  readonly formatOptions: string[];
  selectedFilters: CatalogFilterState = {
    bands: { enabled: true, values: [] },
    genres: { enabled: true, values: [] },
    formats: { enabled: true, values: [] }
  };
  // Propiedades para el modal
  showModal = false;
  selectedProduct: ProductCardItem | null = null;
  readonly campaignSlides: CampaignSlide[];
  private readonly cardStates = new Map<number, ProductCardState>();

  sortOptions = [
    { label: 'Más relevantes', value: 'relevance' },
    { label: 'Menor precio', value: 'price_asc' },
    { label: 'Mayor precio', value: 'price_desc' },
    { label: 'Más recientes', value: 'newest' },
  ];

  products: ProductCardItem[] = productsMock;

  // Paginación incremental bajo demanda.
  isLoadingMore = false;
  visibleProducts: ProductCardItem[] = [];
  itemsPerPage = 9;

  // Filtros seleccionados y productos filtrados
  allProducts: ProductCardItem[] = this.products; // copia original sin filtrar
  filteredProducts: ProductCardItem[] = []; // productos luego de filtros

  ngOnInit(): void {
    this.filterService.filters$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((filters: CatalogFilterState) => {
      this.selectedFilters = filters;
      this.applyFilters();
      this.refreshVisibleProducts();
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.loadTimeout);
  }

  get activeFilters(): ActiveFilter[] {
    const filters: ActiveFilter[] = [];
    const query = this.selectedFilters.searchQuery?.trim();
    if (query) {
      filters.push({ kind: 'search', value: query, label: `Búsqueda: ${query}` });
    }
    if (this.selectedFilters.collection) {
      filters.push({
        kind: 'collection',
        value: this.selectedFilters.collection,
        label: this.selectedFilters.collection === 'new' ? 'Novedades' : 'Ofertas'
      });
    }
    for (const kind of ['bands', 'genres', 'formats'] as const) {
      if (this.selectedFilters[kind].enabled) {
        filters.push(...this.selectedFilters[kind].values.map(value => ({ kind, value, label: value })));
      }
    }
    return filters;
  }

  removeFilter(filter: ActiveFilter): void {
    switch (filter.kind) {
      case 'search': this.filterService.setSearchQuery(''); break;
      case 'collection': this.filterService.setCatalogFilterConfiguration({ collection: undefined }); break;
      case 'bands': this.filterService.toggleBand(filter.value, false); break;
      case 'genres': this.filterService.toggleGenre(filter.value, false); break;
      case 'formats': this.filterService.toggleFormat(filter.value, false); break;
    }
  }

  trackFilter(_index: number, filter: ActiveFilter): string {
    return `${filter.kind}:${filter.value}`;
  }

  clearActiveFilters(): void {
    this.filterService.setCatalogFilterConfiguration({
      searchQuery: '',
      collection: undefined,
      bands: { ...this.selectedFilters.bands, values: [] },
      genres: { ...this.selectedFilters.genres, values: [] },
      formats: { ...this.selectedFilters.formats, values: [] }
    });
  }

  // Añade el siguiente bloque de productos visibles para mantener la paginación incremental.
  loadMoreProducts() {
    if (this.isLoadingMore) return;
    if (this.visibleProducts.length >= this.filteredProducts.length) return;

    this.isLoadingMore = true;

    this.loadTimeout = setTimeout(() => {
      const nextLote = this.filteredProducts.slice(
        this.visibleProducts.length,
        this.visibleProducts.length + this.itemsPerPage
      );
      this.visibleProducts = [...this.visibleProducts, ...nextLote];
      this.isLoadingMore = false;
      this.loadTimeout = undefined;
    }, 300);
  }

  // Reinicia el lote visible y cancela cargas pendientes al cambiar filtros u orden.
  private refreshVisibleProducts(): void {
    clearTimeout(this.loadTimeout);
    this.loadTimeout = undefined;
    this.isLoadingMore = false;
    this.visibleProducts = this.filteredProducts.slice(0, this.itemsPerPage);
  }

  // Convierte el producto visual en un item del carrito con una unidad y el precio final.
  addToCart(product: ProductCardItem, quantity: number) {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: this.getProductPrice(product),
      image: product.images[0],
      quantity: 1,
    };
    this.cart.addItem(item);
  }

  // Devuelve el estado visual del producto para controlar la imagen activa.
  getCardState(product: ProductCardItem): ProductCardState {
    let state = this.cardStates.get(product.id);

    if (!state) {
      state = { currentImage: 0 };
      this.cardStates.set(product.id, state);
    }

    return state;
  }

  // Aplica el orden seleccionado por el usuario y recarga el lote visible.
  onSortChange() {
    this.applyLocalSort();
    this.refreshVisibleProducts();
  }

  selectSort(value: string): void {
    this.selectedSort = value;
    this.sortMenuOpen = false;
    this.onSortChange();
  }

  closeSortMenu(): void {
    this.sortMenuOpen = false;
  }

  get selectedSortLabel(): string {
    return this.sortOptions.find(option => option.value === this.selectedSort)?.label ?? 'Más relevantes';
  }

  // Ordena el conjunto filtrado según la estrategia actual del selector.
  applyLocalSort() {
    switch (this.selectedSort) {
      case 'price_asc':
        this.filteredProducts.sort((a, b) => this.getProductPrice(a) - this.getProductPrice(b));
        break;
      case 'price_desc':
        this.filteredProducts.sort((a, b) => this.getProductPrice(b) - this.getProductPrice(a));
        break;
      case 'newest':
        this.filteredProducts.sort((a, b) =>
          new Date(b.details.releaseDate || '').getTime() - new Date(a.details.releaseDate || '').getTime()
        );
        break;
      default:
        this.filteredProducts.sort((a, b) => a.id - b.id);
        break;
    }
  }

  // Devuelve el precio final del producto, aplicando promociones si existen.
  getProductPrice(product: ProductCardItem): number {
    return this.pricingService.getFinalPrice(product);
  }

  // Indica si el producto tiene descuento vigente en la lógica de pricing.
  hasDiscount(product: ProductCardItem): boolean {
    return this.pricingService.hasDiscount(product);
  }

  // Retorna la etiqueta visual del descuento, por ejemplo '-20%'.
  getDiscountLabel(product: ProductCardItem): string | null {
    return this.pricingService.getDiscountLabel(product);
  }

  // Evalúa si un producto coincide con los filtros activos, incluyendo ofertas, novedades y géneros.
  matchesFilter(product: ProductCardItem, filters: CatalogFilterState): boolean {
    if (product.stock <= 0) {
      return false;
    }


    const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const terms = normalize(filters.searchQuery ?? '').trim().split(/\s+/).filter(Boolean);
    const searchableText = normalize(`${product.details.artist} ${product.name}`);
    if (!terms.every(term => searchableText.includes(term))) {
      return false;
    }

    if (filters.collection === 'new' && !this.isProductNew(product)) {
      return false;
    }
    if (filters.collection === 'offers' && !this.hasDiscount(product)) {
      return false;
    }

    const hasAnyFilter =
      (filters.bands.enabled && filters.bands.values.length > 0) ||
      (filters.genres.enabled && filters.genres.values.length > 0) ||
      (filters.formats.enabled && filters.formats.values.length > 0);

    if (!hasAnyFilter) {
      return true;
    }

    if (filters.bands.enabled && filters.bands.values.length > 0 && !filters.bands.values.some(band =>
      product.details?.artist?.toLowerCase() === band.toLowerCase()
    )) {
      return false;
    }

    if (filters.genres.enabled && filters.genres.values.length > 0 && !filters.genres.values.some(genre =>
      product.details?.genre?.toLowerCase() === genre.toLowerCase()
    )) {
      return false;
    }

    if (filters.formats.enabled && filters.formats.values.length > 0 && !filters.formats.values.some(filter =>
      product.details.format === (filter === 'Vinilo' ? 'vinyl' : 'cd')
    )) {
      return false;
    }

    return true;
  }

  // Verifica si una banda concreta ya está seleccionada.
  isBandSelected(band: string): boolean {
    return this.selectedFilters.bands.values.includes(band);
  }

  // Verifica si un género concreto ya está seleccionado.
  isGenreSelected(genre: string): boolean {
    return this.selectedFilters.genres.values.includes(genre);
  }

  // Verifica si un formato concreto ya está seleccionado.
  isFormatSelected(format: string): boolean {
    return this.selectedFilters.formats.values.includes(format);
  }

  // Devuelve la cantidad de bandas activas en el filtro actual.
  get selectedBandCount(): number {
    return this.selectedFilters.bands.values.length;
  }

  get availableBandOptions(): string[] {
    return this.bandOptions.filter(band => this.getBandProductCount(band) > 0);
  }

  get filteredBandOptions(): string[] {
    return this.searchOptions(this.availableBandOptions, this.bandSearchTerm);
  }

  get visibleBandOptions(): string[] {
    const bands = this.filteredBandOptions;
    return this.showAllBands || this.bandSearchTerm.trim() ? bands : bands.slice(0, this.initialBandLimit);
  }

  getBandProductCount(band: string): number {
    return this.allProducts.filter(product => product.stock > 0 &&
      product.details.artist.toLowerCase() === band.toLowerCase()).length;
  }

  private searchOptions(options: string[], term: string): string[] {
    const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const query = normalize(term.trim());
    return options.filter(option => normalize(option).includes(query));
  }

  get availableGenreOptions(): string[] {
    return [...new Set(this.allProducts.filter(product => product.stock > 0)
      .map(product => product.details.genre).filter(genre => genre.trim().length > 0))]
      .sort((a, b) => a.localeCompare(b));
  }

  get filteredGenreOptions(): string[] {
    return this.searchOptions(this.availableGenreOptions, this.genreSearchTerm);
  }

  get visibleGenreOptions(): string[] {
    const genres = this.filteredGenreOptions;
    return this.showAllGenres || this.genreSearchTerm.trim() ? genres : genres.slice(0, this.initialGenreLimit);
  }

  getGenreProductCount(genre: string): number {
    return this.allProducts.filter(product => product.stock > 0 &&
      product.details.genre.toLowerCase() === genre.toLowerCase()).length;
  }

  // Devuelve la cantidad de géneros activos en la selección actual.
  get selectedGenreCount(): number {
    return this.selectedFilters.genres.values.length;
  }

  // Devuelve la cantidad de formatos activos en la selección actual.
  get selectedFormatCount(): number {
    return this.selectedFilters.formats.values.length;
  }

  // Indica si hay bandas seleccionadas para permitir limpiar el filtro.
  get hasSelectedBands(): boolean {
    return this.selectedBandCount > 0;
  }

  // Indica si hay géneros seleccionados para permitir limpiar el filtro.
  get hasSelectedGenres(): boolean {
    return this.selectedGenreCount > 0;
  }

  // Indica si hay formatos seleccionados para permitir limpiar el filtro.
  get hasSelectedFormats(): boolean {
    return this.selectedFormatCount > 0;
  }

  // Persiste la selección de una banda en el servicio global de filtros.
  toggleBandFilter(band: string, selected: boolean): void {
    this.filterService.toggleBand(band, selected);
  }

  // Persiste la selección de un género en el servicio global de filtros.
  toggleGenreFilter(genre: string, selected: boolean): void {
    this.filterService.toggleGenre(genre, selected);
  }

  // Persiste la selección de un formato en el servicio global de filtros.
  toggleFormatFilter(format: string, selected: boolean): void {
    this.filterService.toggleFormat(format, selected);
  }

  // Limpia todas las bandas seleccionadas.
  clearBandFilters(): void {
    this.filterService.clearBands();
  }

  // Limpia todos los géneros seleccionados.
  clearGenreFilters(): void {
    this.filterService.clearGenres();
  }

  // Limpia todos los formatos seleccionados.
  clearFormatFilters(): void {
    this.filterService.clearFormats();
  }

  // Cierra los popovers de filtros cuando el usuario hace clic fuera de ellos.
  closeGenreFilter(): void {
    this.showBandFilter = false;
    this.showGenreFilter = false;
    this.showFormatFilter = false;
  }

  // Recalcula la coleccion filtrada y vuelve a aplicar el orden actual.
  applyFilters() {
    this.filteredProducts = this.allProducts.filter(product =>
      this.matchesFilter(product, this.selectedFilters)
    );

    this.applyLocalSort();
  }

  // Retorna si el producto debe mostrarse como novedad según su estado del dominio.
  isProductNew(product: ProductCardItem): boolean {
    return product.isNew;
  }

  // Abre el modal de detalle con el producto seleccionado.
  openModal(product: ProductCardItem) {
    this.selectedProduct = product;
    this.showModal = true;
  }

  // Cierra el modal y limpia el producto activo del detalle.
  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
  }

}
