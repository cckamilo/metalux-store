import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Cart, CartItem } from '../cart/services/cart';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuFilter } from '../../core/services/menu-filter';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html'
})
export class Home {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // Constructor con dependencias para carrito, detección de cambios y servicio de filtros
  constructor(
    private cart: Cart,
    private cdr: ChangeDetectorRef,
    private filterService: MenuFilter
  ) { }

  selectedSort = 'relevance';
  
  sortOptions = [
    { label: 'Más relevantes', value: 'relevance' },
    { label: 'Menor precio', value: 'price_asc' },
    { label: 'Mayor precio', value: 'price_desc' },
    { label: 'Más recientes', value: 'newest' },
  ];

  products = [
    {
      id: 1,
      name: 'Pin Rock Al Parque',
      material: 'Metal',
      color: 'Amarillo-Negro',
      price: 9900,
      description: "",
      stock: 0,
      images: [
        'https://http2.mlstatic.com/D_NQ_NP_2X_849712-MCO49256793575_032022-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_867920-MCO49256892054_032022-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_984445-MLA87477124752_072025-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_700139-MLA87476949920_072025-F.webp'
      ],
      currentimage: 0,
      category: {
        id: 1,
        name: "Pines"
      },
      sizes: [],
      genres: {
        id: 1,
        name: "Black Metal"
      },
      offer: {
        title: '-20%',
        description: 'Solo esta semana',
        discountedPrice: 7900
      },
      publishDate: null
    },
    {
      id: 2,
      name: 'Pin Joy Division',
      material: 'Metal',
      color: 'Negro-Blanco',
      price: 9900,
      description: "",
      stock: 20,
      images: [
        'https://http2.mlstatic.com/D_NQ_NP_2X_705248-MLA87318121302_072025-F.webp'
      ],
      currentimage: 0,
      category: {
        id: 1,
        name: "Pines"
      },
      sizes: [],
      genres: {
        id: 1,
        name: "Death Metal"
      },
      offer: {
        title: '-20%',
        description: 'Solo esta semana',
        discountedPrice: 7900
      }, 
      publishDate: '2025-07-20'
    },
    {
      id: 3,
      name: 'Pin Jack',
      material: 'Metal',
      color: 'Black-White',
      price: 11000,
      description: "",
      stock: 20,
      images: [
        'https://http2.mlstatic.com/D_NQ_NP_2X_985184-MLA87652094141_072025-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_906741-MLA87652320287_072025-F.webp'
      ],
      currentimage: 0,
      category: {
        id: 1,
        name: 'Pines'
      },
      sizes: [],
      genres: {
        id: 1,
        name: "Death Metal"
      },
      offer: {
        title: '-20%',
        description: 'Solo esta semana',
        discountedPrice: 8800
      },
      publishDate: '2025-07-20'
    },
    {
      id: 4,
      name: 'Pin Muse',
      material: 'Metal',
      color: 'Black-White',
      price: 9900,
      description: "",
      stock: 20,
      images: [
        'https://http2.mlstatic.com/D_NQ_NP_2X_762659-MLA88123377247_072025-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_705880-MLA88123250371_072025-F.webp'
      ],
      currentimage: 0,
      category: {
        id: 1,
        name: 'Pines'
      },
      sizes: [],
      genres: {
        id: 1,
        name: "Death Metal"
      },
      offer: null,
      publishDate: null
    },
    {
      id: 5,
      name: 'Pin A Clockwork Orange',
      material: 'Metal',
      color: 'Black-Orange',
      price: 12000,
      description: "",
      stock: 20,
      images: [
        'https://http2.mlstatic.com/D_NQ_NP_2X_984445-MLA87477124752_072025-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_700139-MLA87476949920_072025-F.webp'
      ],
      currentimage: 0,
      category: {
        id: 1,
        name: 'Pines'
      },
      sizes: [],
      genres: {
        id: 1,
        name: "Death Metal"
      },
      offer: null,
      publishDate: null
    },
    {
      id: 6,
      name: 'Pin Rock Al Parque',
      material: 'Metal',
      color: 'Yellow-Black',
      price: 9900,
      description: "",
      stock: 20,
      images: [
        'https://http2.mlstatic.com/D_NQ_NP_2X_849712-MCO49256793575_032022-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_867920-MCO49256892054_032022-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_984445-MLA87477124752_072025-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_700139-MLA87476949920_072025-F.webp'
      ],
      currentimage: 0,
      category: {
        id: 1,
        name: 'Pines'
      },
      sizes: [],
      genres: {
        id: 1,
        name: "Death Metal"
      },
      offer: null,
      publishDate: null
    },
    {
      id: 7,
      name: 'Pin Rock Al Parque',
      material: 'Metal',
      color: 'Yellow-Black',
      price: 9900,
      description: "",
      stock: 20,
      images: [
        'https://http2.mlstatic.com/D_NQ_NP_2X_849712-MCO49256793575_032022-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_867920-MCO49256892054_032022-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_984445-MLA87477124752_072025-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_700139-MLA87476949920_072025-F.webp'
      ],
      currentimage: 0,
      category: {
        id: 1,
        name: 'Pines'
      },
      sizes: [],
      genres: {
        id: 1,
        name: "Death Metal"
      },
      offer: null,
      publishDate: null
    },
    {
      id: 8,
      name: 'Pin Rock Al Parque',
      material: 'Metal',
      color: 'Yellow-Black',
      price: 9900,
      description: "",
      stock: 20,
      images: [
        'https://http2.mlstatic.com/D_NQ_NP_2X_849712-MCO49256793575_032022-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_867920-MCO49256892054_032022-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_984445-MLA87477124752_072025-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_700139-MLA87476949920_072025-F.webp'
      ],
      currentimage: 0,
      category: {
        id: 2,
        name: 'Fundas'
      },
      sizes: [],
      genres: {
        id: 1,
        name: "Death Metal"
      },
      offer: null,
      publishDate: null
    },
    {
      id: 9,
      name: 'Pin Rock Al Parque',
      material: 'Metal',
      color: 'Yellow-Black',
      price: 9900,
      description: "",
      stock: 20,
      images: [
        'https://http2.mlstatic.com/D_NQ_NP_2X_849712-MCO49256793575_032022-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_867920-MCO49256892054_032022-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_984445-MLA87477124752_072025-F.webp',
        'https://http2.mlstatic.com/D_NQ_NP_2X_700139-MLA87476949920_072025-F.webp'
      ],
      currentimage: 0,
      category: {
        id: 2,
        name: 'Fundas'
      },
      sizes: [],
      genres: {
        id: 1,
        name: "Death Metal"
      },
      offer: null,
      publishDate: null
    }

  ];

  // Control de scroll y paginación
  isLoadingMore = false;
  visibleProducts: any[] = [];
  itemsPerPage = 9;
  currentPage = 1;

  // Filtros seleccionados y productos filtrados
  selectedFilters: string[] = [];
  allProducts = this.products; // copia original sin filtrar
  filteredProducts: any[] = []; // productos luego de filtros

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
  addToCart(product: any) {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    };
    this.cart.addItem(item);
  }

  // Formatear precio en pesos colombianos
  formatPrice(price: number): string {
    return '$' + price.toLocaleString('es-CO');
  }

  // Cambia a la siguiente imagen del producto
  nextImage(product: any): void {
    product.currentimage = (product.currentimage + 1) % product.images.length;
  }

  // Cambia a la imagen anterior del producto
  previousImage(product: any): void {
    product.currentimage =
      (product.currentimage - 1 + product.images.length) % product.images.length;
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
          new Date(b.fechaCreacion || '').getTime() - new Date(a.fechaCreacion || '').getTime()
        );
        break;
      default:
        this.filteredProducts.sort((a, b) => a.id - b.id);
        break;
    }
  }

  // Devuelve el precio correcto del producto (con descuento si aplica)
  getProductPrice(product: any): number {
    return product.offer?.discountedPrice ?? product.price;
  }

  // Valida si el producto cumple con los filtros seleccionados
  matchesFilter(product: any, filters: string[]): boolean {
    const { categorias, tallas, generos } = this.filterService.filtros;

    const filtrosCategoria = filters.filter(f => categorias.includes(f));
    const filtrosTalla = filters.filter(f => tallas.includes(f));
    const filtrosGenero = filters.filter(f => generos.includes(f));

    if (filtrosCategoria.length > 0 && !filtrosCategoria.includes(product.category?.name)) {
      return false;
    }

    if (filtrosGenero.length > 0 && !filtrosGenero.includes(product.genres?.name)) {
      return false;
    }

    if (filtrosTalla.length > 0) {
      const tieneTalla = product.sizes?.some((size: string) => filtrosTalla.includes(size));
      if (!tieneTalla) return false;
    }

    return true;
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
  isProductNew(product: any): boolean {
    if (!product.publishDate) {
      return false; // Si no hay fecha de publicación, no es nuevo.
    }

    const publishDate = new Date(product.publishDate);
    const today = new Date();
    const diffTime = today.getTime() - publishDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convierte milisegundos a días

    return diffDays <= 30; // Devuelve true si la diferencia es de 30 días o menos.
  }


}
