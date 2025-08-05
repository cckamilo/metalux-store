import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Cart, CartItem } from '../cart/services/cart';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html'
})
export class Home {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  constructor(private cart: Cart, private cdr: ChangeDetectorRef) { }

  productos = [
    {
      id: 1,
      imagenes: ['https://http2.mlstatic.com/D_NQ_NP_2X_849712-MCO49256793575_032022-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_867920-MCO49256892054_032022-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_984445-MLA87477124752_072025-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_700139-MLA87476949920_072025-F.webp'], // Varias imágenes
      imagenActual: 0, // Control interno para el carrusel,
      nombre: 'Pin Rock Al Parque',
      material: 'Metal',
      color: 'Amarillo-Negro',
      precio: 9900,

    },
    {
      id: 2,
      imagenes: ['https://http2.mlstatic.com/D_NQ_NP_2X_705248-MLA87318121302_072025-F.webp'], // Varias imágenes
      imagenActual: 0, // Control interno para el carrusel,
      nombre: 'Pin Joy Division',
      material: 'Metal',
      color: 'Negro-Blaco',
      precio: 10000,

    },
    {
      id: 3,
      imagenes: ['https://http2.mlstatic.com/D_NQ_NP_2X_985184-MLA87652094141_072025-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_906741-MLA87652320287_072025-F.webp'], // Varias imágenes
      imagenActual: 0, // Control interno para el carrusel,
      nombre: 'Pin Jack',
      material: 'Metal',
      color: 'Negro-Blanco',
      precio: 11000
    },
    {
      id: 4,
      imagenes: ['https://http2.mlstatic.com/D_NQ_NP_2X_762659-MLA88123377247_072025-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_705880-MLA88123250371_072025-F.webp'], // Varias imágenes
      imagenActual: 0, // Control interno para el carrusel,
      nombre: 'Pin Muse',
      material: 'Metal',
      color: 'Negro-Blanco',
      precio: 9900
    },
    {
      id: 5,
      imagenes: ['https://http2.mlstatic.com/D_NQ_NP_2X_984445-MLA87477124752_072025-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_700139-MLA87476949920_072025-F.webp'], // Varias imágenes
      imagenActual: 0, // Control interno para el carrusel,
      nombre: 'Pin Naranja Mecánica',
      material: 'Metal',
      color: 'Negro-Naranja',
      precio: 12000
    },
    {
      id: 6,
      imagenes: ['https://http2.mlstatic.com/D_NQ_NP_2X_849712-MCO49256793575_032022-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_867920-MCO49256892054_032022-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_984445-MLA87477124752_072025-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_700139-MLA87476949920_072025-F.webp'], // Varias imágenes
      imagenActual: 0, // Control interno para el carrusel,
      nombre: 'Pin Rock Al Parque',
      material: 'Metal',
      color: 'Amarillo-Negro',
      precio: 9900,

    },
    {
      id: 7,
      imagenes: ['https://http2.mlstatic.com/D_NQ_NP_2X_849712-MCO49256793575_032022-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_867920-MCO49256892054_032022-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_984445-MLA87477124752_072025-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_700139-MLA87476949920_072025-F.webp'], // Varias imágenes
      imagenActual: 0, // Control interno para el carrusel,
      nombre: 'Pin Rock Al Parque',
      material: 'Metal',
      color: 'Amarillo-Negro',
      precio: 9900,

    },
    {
      id: 8,
      imagenes: ['https://http2.mlstatic.com/D_NQ_NP_2X_849712-MCO49256793575_032022-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_867920-MCO49256892054_032022-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_984445-MLA87477124752_072025-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_700139-MLA87476949920_072025-F.webp'], // Varias imágenes
      imagenActual: 0, // Control interno para el carrusel,
      nombre: 'Pin Rock Al Parque',
      material: 'Metal',
      color: 'Amarillo-Negro',
      precio: 9900,

    },
    {
      id: 9,
      imagenes: ['https://http2.mlstatic.com/D_NQ_NP_2X_849712-MCO49256793575_032022-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_867920-MCO49256892054_032022-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_984445-MLA87477124752_072025-F.webp', 'https://http2.mlstatic.com/D_NQ_NP_2X_700139-MLA87476949920_072025-F.webp'], // Varias imágenes
      imagenActual: 0, // Control interno para el carrusel,
      nombre: 'Pin Rock Al Parque',
      material: 'Metal',
      color: 'Amarillo-Negro',
      precio: 9900,

    },
  ];

  isLoadingMore = false;
  productosVisibles: any[] = [];
  itemsPorPagina = 5;
  paginaActual = 1;


  ngAfterViewInit(): void {
    this.cargarMasProductos();
    this.cdr.detectChanges();
  }

  onScroll() {
    const el = this.scrollContainer.nativeElement;
    const limite = el.scrollHeight - el.clientHeight - 100;

    console.log('scrollTop:', el.scrollTop, 'limite:', limite); // 👈

    if (el.scrollTop >= limite) {
      this.cargarMasProductos();
    }
  }

  cargarMasProductos() {
    if (this.isLoadingMore) return; // Evita cargas dobles
    if (this.productosVisibles.length >= this.productos.length) return;
    this.isLoadingMore = true;

    setTimeout(() => {
      const siguienteLote = this.productos.slice(
        this.productosVisibles.length,
        this.productosVisibles.length + this.itemsPorPagina
      );
      this.productosVisibles = [...this.productosVisibles, ...siguienteLote];

      this.isLoadingMore = false;
    }, 500); // Simula demora
  }



  addToCart(producto: any) {
    const item: CartItem = {
      id: producto.id,
      name: producto.nombre,
      price: producto.precio,
      quantity: 1,
    };
    console.log(item);

    this.cart.addItem(item);
  }

  formatearPrecio(precio: number): string {
    return '$' + precio.toLocaleString('es-CO');
  }

  avanzarImagen(producto: any): void {
    producto.imagenActual = (producto.imagenActual + 1) % producto.imagenes.length;
  }

  retrocederImagen(producto: any): void {
    producto.imagenActual =
      (producto.imagenActual - 1 + producto.imagenes.length) % producto.imagenes.length;
  }

  sortOptions = [
    { label: 'Más relevantes', value: 'relevance' },
    { label: 'Menor precio', value: 'price_asc' },
    { label: 'Mayor precio', value: 'price_desc' },
    { label: 'Más recientes', value: 'newest' },
  ];

  selectedSort = 'relevance';

  onSortChange() {
    console.log('Orden actual:', this.selectedSort);

    // Para datos cargados en memoria (modo temporal):
    this.aplicarOrdenamientoLocal();

    // En versión final podrías llamar al backend así:
    // this.productService.getProducts(this.selectedSort, this.currentPage).subscribe(...)
  }
  aplicarOrdenamientoLocal() {
    switch (this.selectedSort) {
      case 'price_asc':
        this.productosVisibles.sort((a, b) => a.precio - b.precio);
        break;
      case 'price_desc':
        this.productosVisibles.sort((a, b) => b.precio - a.precio);
        break;
      case 'newest':
        this.productosVisibles.sort((a, b) =>
          new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        );
        break;
      default:
        // Si quieres definir "relevancia" como orden por id o algo similar:
        this.productosVisibles.sort((a, b) => a.id - b.id);
        break;
    }
  }
}
