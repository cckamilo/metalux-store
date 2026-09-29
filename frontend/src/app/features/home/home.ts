import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Cart, CartItem } from '../cart/services/cart';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogFilterService } from '../../core/services/catalog-filter/catalog-filter';
import { ProductDetailModal } from '../../shared/components/product-detail-modal/product-detail-modal';
import { CampaignCarousel } from '../marketing/components/campaign-carousel/campaign-carousel';
import { CampaignSlide } from '../marketing/domain/campaign.model';
import { CampaignService } from '../marketing/services/campaign.service';
import { ProductCardComponent, ProductCardItem } from '../catalog/components/product-card/product-card';
import { Category, Product } from '../catalog/domain/product.model';
import { PricingService } from '../catalog/services/pricing.service';

interface ProductCardState {
  currentImage: number;
  selectedQuantity: number;
}

const musicCategory: Category = {
  id: 1,
  name: 'Música',
  slug: 'musica',
  isActive: true
};

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule, ProductDetailModal, CampaignCarousel, ProductCardComponent],
  templateUrl: './home.html'
})
export class Home {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // Constructor con dependencias para carrito, detección de cambios y servicio de filtros
  constructor(
    private cart: Cart,
    private cdr: ChangeDetectorRef,
    private filterService: CatalogFilterService,
    private pricingService: PricingService,
    private campaignService: CampaignService
  ) {
    this.campaignSlides = this.campaignService.getHomeCarouselSlides();
    this.genreOptions = this.filterService.genreOptions;
  }

  selectedSort = 'relevance';
  showGenreFilter = false;
  readonly genreOptions: string[];
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

  products: ProductCardItem[] = [
    {
      id: 1,
      name: 'From Mars To Sirius',
      category: musicCategory,
      details: {
        type: 'music',
        artist: 'Gojira',
        format: 'vinyl',
        genre: 'Progressive Metal',
        releaseYear: 2005,
        releaseDate: '2005-09-27',
        label: 'Listenable Records',
        discCount: 2,
        condition: 'new'
      },
      price: 105000,
      description: 'Edición en vinilo del clásico álbum de Gojira, con sonido progresivo y atmósfera intensa.',
      stock: 0,
      images: [
        'https://f4.bcbits.com/img/0042534543_10.jpg',
        'https://f4.bcbits.com/img/0013928875_10.jpg'
      ],
      isActive: true,
      isNew: true
    },
    {
      id: 2,
      name: 'Slaughter of the Soul',
      category: musicCategory,
      details: {
        type: 'music',
        artist: 'At The Gates',
        format: 'vinyl',
        genre: 'Melodic Death Metal',
        releaseYear: 1995,
        releaseDate: '1995-11-14',
        label: 'Earache Records',
        discCount: 1,
        condition: 'new'
      },
      price: 95000,
      description: 'Obra esencial del death metal melódico sueco, disponible en una edición de vinilo para coleccionistas.',
      stock: 20,
      images: [
        'https://f4.bcbits.com/img/0037369395_10.jpg',
        'https://f4.bcbits.com/img/a2024836109_5.jpg',
        'https://f4.bcbits.com/img/0008114998_10.jpg',
      ],
      isActive: true,
      isNew: true
    },
    {
      id: 3,
      name: 'The Way of All Flesh',
      category: musicCategory,
      details: {
        type: 'music',
        artist: 'Gojira',
        format: 'vinyl',
        genre: 'Progressive Metal',
        releaseYear: 2008,
        releaseDate: '2008-10-13',
        label: 'Listenable Records',
        discCount: 2,
        condition: 'new'
      },
      price: 110000,
      description: 'Álbum de Gojira con una mezcla poderosa de metal progresivo, precisión rítmica y pasajes atmosféricos.',
      stock: 20,
      images: [
        'https://f4.bcbits.com/img/0040270533_10.jpg',
        'https://f4.bcbits.com/img/0013928710_10.jpg'
      ],
      isActive: true,
      isNew: true
    },
    {
      id: 4,
      name: 'Fallen Angel Of Doom',
      category: musicCategory,
      details: {
        type: 'music',
        artist: 'Blasphemy',
        format: 'vinyl',
        genre: 'War Metal',
        releaseYear: 1990,
        releaseDate: '1990-10-01',
        label: 'Wild Rags Records',
        discCount: 1,
        condition: 'new'
      },
      price: 90000,
      description: 'Pieza fundamental del war metal canadiense, presentada en formato vinilo para una colección extrema.',
      stock: 20,
      images: [
        'https://f4.bcbits.com/img/0047466366_10.jpg',
        'https://f4.bcbits.com/img/a0064561049_5.jpg'
      ],
      isActive: true,
      isNew: false
    },
    {
      id: 5,
      name: 'Pro Xristou',
      category: musicCategory,
      details: {
        type: 'music',
        artist: 'Rotting Christ',
        format: 'vinyl',
        genre: 'Black Metal',
        releaseYear: 2024,
        releaseDate: '2024-05-24',
        label: 'Season of Mist',
        discCount: 1,
        condition: 'new'
      },
      price: 115000,
      description: 'Lanzamiento reciente de Rotting Christ con una propuesta oscura, épica y profundamente melódica.',
      stock: 20,
      images: [
        'https://f4.bcbits.com/img/0035139854_10.jpg',
        'https://f4.bcbits.com/img/0035139793_10.jpg'
      ],
      isActive: true,
      isNew: false
    },
    {
      id: 6,
      name: 'Left Hand Path',
      category: musicCategory,
      details: {
        type: 'music',
        artist: 'Entombed',
        format: 'vinyl',
        genre: 'Death Metal',
        releaseYear: 1990,
        releaseDate: '1990-06-04',
        label: 'Earache Records',
        discCount: 1,
        condition: 'new'
      },
      price: 95000,
      description: 'Clásico del death metal sueco, reconocido por sus guitarras densas y su sonido crudo e influyente.',
      stock: 20,
      images: [
        'https://f4.bcbits.com/img/0031611650_10.jpg',
        'https://f4.bcbits.com/img/0042673750_10.jpg',
        'https://f4.bcbits.com/img/0027919700_10.jpg',
      ],
      isActive: true,
      isNew: false
    },
    {
      id: 7,
      name: 'Melissa',
      category: musicCategory,
      details: {
        type: 'music',
        artist: 'Mercyful Fate',
        format: 'vinyl',
        genre: 'Heavy Metal',
        releaseYear: 1983,
        releaseDate: '1983-10-30',
        label: 'Roadrunner Records',
        discCount: 1,
        condition: 'new'
      },
      price: 100000,
      description: 'Debut histórico de Mercyful Fate, una referencia del heavy metal oscuro y teatral de los años ochenta.',
      stock: 20,
      images: [
        'https://f4.bcbits.com/img/0041204342_10.jpg',
        'https://f4.bcbits.com/img/a1613378443_5.jpg'       
      ],
      isActive: true,
      isNew: false
    },
    {
      id: 8,
      name: 'Necroticism – Descanting the Insalubrious',
      category: musicCategory,
      details: {
        type: 'music',
        artist: 'Carcass',
        format: 'vinyl',
        genre: 'Death Metal',
        releaseYear: 1991,
        releaseDate: '1991-10-01',
        label: 'Earache Records',
        discCount: 1,
        condition: 'new'
      },
      price: 110000,
      description: 'Álbum esencial de Carcass, donde el death metal y el grindcore se encuentran con composiciones complejas.',
      stock: 20,
      images: [
        'https://f4.bcbits.com/img/0046581314_10.jpg',
        'https://f4.bcbits.com/img/0041935587_10.jpg',
        'https://f4.bcbits.com/img/0024791282_10.jpg',
        'https://f4.bcbits.com/img/0042673716_10.jpg'
      ],
      isActive: true,
      isNew: false
    },
    {
      id: 9,
      name: 'Don\'t Break the Oath',
      category: musicCategory,
      details: {
        type: 'music',
        artist: 'Mercyful Fate',
        format: 'vinyl',
        genre: 'Heavy Metal',
        releaseYear: 1984,
        releaseDate: '1984-09-07',
        label: 'Roadrunner Records',
        discCount: 1,
        condition: 'new'
      },
      price: 100000,
      description: 'Clásico de Mercyful Fate con una identidad oscura, riffs memorables y una interpretación vocal inconfundible.',
      stock: 20,
      images: [
        'https://f4.bcbits.com/img/0041204391_10.jpg',
        'https://f4.bcbits.com/img/a0621509914_5.jpg'
      ],
      isActive: true,
      isNew: false
    }

  ];

  // Control de scroll y paginación
  isLoadingMore = false;
  visibleProducts: ProductCardItem[] = [];
  itemsPerPage = 9;

  // Filtros seleccionados y productos filtrados
  selectedFilters: string[] = [];
  allProducts: ProductCardItem[] = this.products; // copia original sin filtrar
  filteredProducts: ProductCardItem[] = []; // productos luego de filtros

  // Hook de inicialización: prepara los productos visibles y subscribes los filtros del servicio global.
  ngAfterViewInit(): void {
    this.filteredProducts = [...this.products];
    this.loadMoreProducts();
    this.cdr.detectChanges();

    // Escucha cambios de filtros desde el servicio y recarga productos
    this.filterService.filters$.subscribe((filters: string[]) => {
      const scrollTop = this.scrollContainer.nativeElement.scrollTop;
      this.selectedFilters = filters;
      this.applyFilters();
      this.refreshVisibleProducts(scrollTop);
    });
  }

  // Detecta el fin del scroll para pedir más productos y mantener la paginación incremental.
  onScroll() {
    const el = this.scrollContainer.nativeElement;
    const limite = el.scrollHeight - el.clientHeight - 100;

    if (el.scrollTop >= limite) {
      this.loadMoreProducts();
    }
  }

  // Añade el siguiente lote de productos a la vista visible usando paginación incremental.
  loadMoreProducts() {
    if (this.isLoadingMore) return;
    if (this.visibleProducts.length >= this.filteredProducts.length) return;

    this.isLoadingMore = true;

    setTimeout(() => {
      const nextLote = this.filteredProducts.slice(
        this.visibleProducts.length,
        this.visibleProducts.length + this.itemsPerPage
      );
      this.visibleProducts = [...this.visibleProducts, ...nextLote];
      this.isLoadingMore = false;
    }, 300);
  }

  private refreshVisibleProducts(scrollTop: number): void {
    this.isLoadingMore = false;
    this.visibleProducts = this.filteredProducts.slice(0, this.itemsPerPage);

    requestAnimationFrame(() => {
      const el = this.scrollContainer.nativeElement;
      const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
      el.scrollTop = Math.min(scrollTop, maxScrollTop);
    });
  }

  // Convierte el producto visual en un item del carrito con la cantidad actual y el precio final.
  addToCart(product: ProductCardItem, quantity: number) {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: this.getProductPrice(product),
      image: product.images[0],
      quantity: Number(quantity),
    };
    this.cart.addItem(item);
  }

  // Devuelve el estado visual del producto para controlar imagen activa y cantidad seleccionada.
  getCardState(product: ProductCardItem): ProductCardState {
    let state = this.cardStates.get(product.id);

    if (!state) {
      state = { currentImage: 0, selectedQuantity: 1 };
      this.cardStates.set(product.id, state);
    }

    return state;
  }

  // Actualiza la cantidad elegida por el usuario para un producto concreto.
  setQuantity(product: ProductCardItem, quantity: number): void {
    this.getCardState(product).selectedQuantity = Number(quantity);
  }

  // Cambia la imagen activa seleccionada dentro del carrusel del producto.
  selectImage(product: ProductCardItem, imageIndex: number): void {
    this.getCardState(product).currentImage = imageIndex;
  }

  // Avanza a la siguiente imagen del producto en el mini carrusel.
  nextImage(product: ProductCardItem): void {
    const state = this.getCardState(product);
    state.currentImage = (state.currentImage + 1) % product.images.length;
  }

  // Retrocede a la imagen anterior del producto en el mini carrusel.
  previousImage(product: ProductCardItem): void {
    const state = this.getCardState(product);
    state.currentImage =
      (state.currentImage - 1 + product.images.length) % product.images.length;
  }

  // Aplica el orden seleccionado por el usuario y recarga el lote visible.
  onSortChange() {
    this.applyLocalSort();
    this.visibleProducts = [];
    this.loadMoreProducts();
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
  matchesFilter(product: ProductCardItem, filters: string[]): boolean {
    if (filters.length === 0) {
      return true;
    }

    // ✅ CORRECCIÓN: Si el filtro de ofertas está activo, el producto DEBE tener una oferta.
    const isOfferFilterActive = filters.includes('OFERTAS');
    if (isOfferFilterActive && !this.hasDiscount(product)) {
        return false;
    }

    const isNewFilterActive = filters.includes('NOVEDADES');
    if (isNewFilterActive && !product.isNew) {
      return false;
    }

    const genreFilters = filters.filter(filter => this.genreOptions.includes(filter));
    if (genreFilters.length > 0 && !genreFilters.some(genre =>
      product.details?.genre?.toLowerCase() === genre.toLowerCase()
    )) {
      return false;
    }

    // Si solo está activo el filtro de ofertas, no hay más lógica que aplicar.
    if ((isOfferFilterActive || isNewFilterActive) && filters.length === 1) {
        return true;
    }

    const formatFilters = filters.filter(filter => filter === 'Vinilo' || filter === 'CD');
    if (formatFilters.length > 0 && !formatFilters.some(filter =>
      product.details.format === (filter === 'Vinilo' ? 'vinyl' : 'cd')
    )) {
      return false;
    }

    return true;
  }

  // Devuelve si un género concreto está seleccionado en el filtro activo.
  isGenreSelected(genre: string): boolean {
    return this.selectedFilters.includes(genre);
  }

  // Calcula cuántos géneros activos hay en la selección actual.
  get selectedGenreCount(): number {
    return this.selectedFilters.filter(filter => this.genreOptions.includes(filter)).length;
  }

  // Indica si existe al menos un género en el filtro activo.
  get hasSelectedGenres(): boolean {
    return this.selectedGenreCount > 0;
  }

  // Agrega o quita un género del conjunto actual de filtros y notifica al servicio global.
  toggleGenreFilter(genre: string, selected: boolean): void {
    const filters = selected
      ? [...new Set([...this.selectedFilters, genre])]
      : this.selectedFilters.filter(filter => filter !== genre);

    this.filterService.setFilters(filters);
  }

  // Elimina todos los filtros de género manteniendo el resto de filtros del catálogo.
  clearGenreFilters(): void {
    this.filterService.setFilters(
      this.selectedFilters.filter(filter => !this.genreOptions.includes(filter))
    );
  }

  // Cierra el popover del filtro cuando el usuario hace clic fuera de él.
  closeGenreFilter(): void {
    this.showGenreFilter = false;
  }

  // Recalcula la coleccion filtrada y vuelve a aplicar el orden actual.
  applyFilters() {
    if (this.selectedFilters.length === 0) {
      this.filteredProducts = [...this.allProducts];
    } else {
      this.filteredProducts = this.allProducts.filter(product =>
        this.matchesFilter(product, this.selectedFilters)
      );
    }

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
