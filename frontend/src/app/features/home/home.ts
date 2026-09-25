import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Cart, CartItem } from '../cart/services/cart';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuFilter } from '../../core/services/menufilter/menu-filter';
import { ProductDetailModal } from '../../shared/components/product-detail-modal/product-detail-modal';
import { Category, MusicDetails, Product } from '../catalog/models/product.model';
import { PricingService } from '../catalog/services/pricing.service';

type ProductCardItem = Omit<Product, 'details'> & {
  details: MusicDetails;
};

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
  imports: [CommonModule, FormsModule, ProductDetailModal],
  templateUrl: './home.html'
})
export class Home {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // Constructor con dependencias para carrito, detección de cambios y servicio de filtros
  constructor(
    private cart: Cart,
    private cdr: ChangeDetectorRef,
    private filterService: MenuFilter,
    private pricingService: PricingService
  ) { }

  selectedSort = 'relevance';
  // Propiedades para el modal
  showModal = false;
  selectedProduct: ProductCardItem | null = null;
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
  currentPage = 1;

  // Filtros seleccionados y productos filtrados
  selectedFilters: string[] = [];
  allProducts: ProductCardItem[] = this.products; // copia original sin filtrar
  filteredProducts: ProductCardItem[] = []; // productos luego de filtros

  // Hook del ciclo de vida: inicialización después del render
  ngAfterViewInit(): void {
    this.filteredProducts = [...this.products];
    this.loadMoreProducts();
    this.cdr.detectChanges();

    // Escucha cambios de filtros desde el servicio y recarga productos
    this.filterService.filters$.subscribe((filters: string[]) => {
      this.selectedFilters = filters;
      this.applyFilters();

      this.visibleProducts = [];
      this.currentPage = 1;
      this.loadMoreProducts();
    });
  }

  // Detecta scroll para carga infinita
  onScroll() {
    const el = this.scrollContainer.nativeElement;
    const limite = el.scrollHeight - el.clientHeight - 100;

    if (el.scrollTop >= limite) {
      this.loadMoreProducts();
    }
  }

  // Carga más productos en la vista visible
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

  // Agrega producto al carrito
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

  // Formatear precio en pesos colombianos
  formatPrice(price: number): string {
    return '$' + price.toLocaleString('es-CO');
  }

  getCardState(product: ProductCardItem): ProductCardState {
    let state = this.cardStates.get(product.id);

    if (!state) {
      state = { currentImage: 0, selectedQuantity: 1 };
      this.cardStates.set(product.id, state);
    }

    return state;
  }

  setQuantity(product: ProductCardItem, quantity: number): void {
    this.getCardState(product).selectedQuantity = Number(quantity);
  }

  selectImage(product: ProductCardItem, imageIndex: number): void {
    this.getCardState(product).currentImage = imageIndex;
  }

  // Cambia a la siguiente imagen del producto
  nextImage(product: ProductCardItem): void {
    const state = this.getCardState(product);
    state.currentImage = (state.currentImage + 1) % product.images.length;
  }

  // Cambia a la imagen anterior del producto
  previousImage(product: ProductCardItem): void {
    const state = this.getCardState(product);
    state.currentImage =
      (state.currentImage - 1 + product.images.length) % product.images.length;
  }

  // Cambia el orden seleccionado
  onSortChange() {
    this.applyLocalSort();
    this.visibleProducts = [];
    this.currentPage = 1;
    this.loadMoreProducts();
  }

  // Aplica lógica de ordenamiento local
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

  // Devuelve el precio correcto del producto (con descuento si aplica)
  getProductPrice(product: ProductCardItem): number {
    return this.pricingService.getFinalPrice(product);
  }

  hasDiscount(product: ProductCardItem): boolean {
    return this.pricingService.hasDiscount(product);
  }

  getDiscountLabel(product: ProductCardItem): string | null {
    return this.pricingService.getDiscountLabel(product);
  }

  /**
   * Valida si el producto cumple con los filtros seleccionados
   * @param product El producto a evaluar.
   * @param filters Los filtros seleccionados.
   */
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

    // Obtener la lista de filtros estructurada del servicio.
    const filtroList = this.filterService.filtroList;
    let allFiltersMatch = true;

    // Iterar sobre la lista de filtros para verificar cada grupo de opciones
    for (const filtro of filtroList) {
      if (!filtro.enabled) {
        continue; // Saltar filtros deshabilitados
      }

      let filtroOptions: string[] = [];
      if (filtro.options) {
        filtroOptions = filtro.options;
      } else if (filtro.subcategories) {
        filtroOptions = filtro.subcategories.flatMap(sub => sub.options);
      }
      
      // ✅ CORRECCIÓN: Los filtros de ofertas no están en `filtroList`, por lo que los ignoramos aquí.
      const filtrosActivosEnGrupo = filters.filter(f => filtroOptions.includes(f) && f !== 'OFERTAS');

      if (filtrosActivosEnGrupo.length > 0) {
        let coincideConGrupo = false;

        // Lógica de filtrado específica para cada título de filtro
        if (filtro.title === 'Géneros') {
          coincideConGrupo = filtrosActivosEnGrupo.some(f => product.details?.genre?.toLowerCase() === f.toLowerCase());
        } else if (filtro.title === 'Administración') {
          // Lógica de filtrado para administración, si aplica
          coincideConGrupo = false; // Asumimos que los productos no tienen un campo de "Administración"
        }

        if (!coincideConGrupo) {
          allFiltersMatch = false;
          break; // No hay necesidad de seguir evaluando si un grupo ya no coincide.
        }
      }
    }
    
    // Si no hay otros filtros seleccionados (además de ofertas), el resultado es verdadero.
    // Esto es para que al quitar el filtro de ofertas, se muestren todos los productos.
    if (allFiltersMatch && isOfferFilterActive) {
      return true;
    }

    return allFiltersMatch;
  }

  // Aplica filtros cuando cambian desde el componente
  onFilterChange(selected: string[]) {
    this.selectedFilters = selected;
    this.applyFilters();

    this.visibleProducts = [];
    this.currentPage = 1;
    this.loadMoreProducts();
  }

  // Aplica filtros y ordenamiento actuales
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

  // Nuevo método para verificar si un producto es nuevo (menos de 30 días)
  isProductNew(product: ProductCardItem): boolean {
    return product.isNew;
  }

  // Método para abrir el modal
  openModal(product: ProductCardItem) {
    this.selectedProduct = product;
    this.showModal = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
  }

}
