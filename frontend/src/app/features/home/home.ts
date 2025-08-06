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

  constructor(private cart: Cart,
    private cdr: ChangeDetectorRef,
    private filterService: MenuFilter) { }

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
        name: "Pines"
      },
      sizes: [],
      genres: {
        id: 1,
        name: "Black Metal"
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
    }

  ];

  selectedSort = 'relevance';
  isLoadingMore = false;
  visibleProducts: any[] = [];
  itemsPerPage = 9;
  currentPage = 1;
  selectedFilters: string[] = [];
  allProducts = this.products; // copia original
  filteredProducts: any[] = []; // productos ya filtrados

  ngAfterViewInit(): void {
    this.filteredProducts = [...this.products]; // Cargar todo al inicio
    this.loadMoreProducts();
    this.cdr.detectChanges();

    this.filterService.filters$.subscribe((filters: string[]) => {
      this.selectedFilters = filters;
      this.applyFilters();

      this.visibleProducts = [];
      this.currentPage = 1;
      this.loadMoreProducts();
    });

  }

  onScroll() {
    const el = this.scrollContainer.nativeElement;
    const limite = el.scrollHeight - el.clientHeight - 100;

    if (el.scrollTop >= limite) {
      this.loadMoreProducts();
    }
  }

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
    }, 500);
  }

  addToCart(product: any) {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    };
    this.cart.addItem(item);
  }

  formatPrice(price: number): string {
    return '$' + price.toLocaleString('es-CO');
  }

  nextImage(product: any): void {
    product.currentimage = (product.currentimage + 1) % product.images.length;
  }

  previousImage(product: any): void {
    product.currentimage =
      (product.currentimage - 1 + product.images.length) % product.images.length;
  }

  onSortChange() {
    this.applyLocalSort();
  }

  applyLocalSort() {
    switch (this.selectedSort) {
      case 'price_asc':
        this.visibleProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        this.visibleProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        this.visibleProducts.sort((a, b) =>
          new Date(b.fechaCreacion || '').getTime() - new Date(a.fechaCreacion || '').getTime()
        );
        break;
      default:
        this.visibleProducts.sort((a, b) => a.id - b.id);
        break;
    }
  }

  matchesFilter(product: any, filters: string[]): boolean {
    // Clasificamos filtros por tipo (basado en los posibles valores del menú)
   const { categorias, tallas, generos } = this.filterService.filtros;

    const filtrosCategoria = filters.filter(f => categorias.includes(f));
    const filtrosTalla = filters.filter(f => tallas.includes(f));
    const filtrosGenero = filters.filter(f => generos.includes(f));

    // Validar por categoría (solo si hay filtros de categoría)
    if (filtrosCategoria.length > 0 && !filtrosCategoria.includes(product.category?.name)) {
      return false;
    }

    // Validar por género (solo si hay filtros de género)
    if (filtrosGenero.length > 0 && !filtrosGenero.includes(product.genres?.name)) {
      return false;
    }

    // Validar por tallas (solo si hay filtros de talla)
    if (filtrosTalla.length > 0) {
      const tieneTalla = product.sizes?.some((size: string) => filtrosTalla.includes(size));
      if (!tieneTalla) {
        return false;
      }
    }

    // Si pasa todas las validaciones, se incluye el producto
    return true;
  }


  onFilterChange(selected: string[]) {
    this.selectedFilters = selected;
    this.applyFilters();

    // Reiniciar la paginación con los productos filtrados
    this.visibleProducts = [];
    this.currentPage = 1;
    this.loadMoreProducts();
  }
  applyFilters() {
    if (this.selectedFilters.length === 0) {
      this.filteredProducts = this.allProducts;
      return;
    }

    this.filteredProducts = this.allProducts.filter(product =>
      this.matchesFilter(product, this.selectedFilters)
    );
  }
}
