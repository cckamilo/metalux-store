import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, effect, inject, signal } from '@angular/core';
import { Cart, CartItem } from '../../../features/cart/services/cart';
import { CartList } from '../../../features/cart/components/cart-list/cart-list';
import { Sidenav } from '../../../layout/components/sidenav/sidenav';


declare var lucide: any;

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [
    CommonModule,
    CartList,
    Sidenav

  ],
  templateUrl: './header.html'
})
export class Header implements AfterViewInit {

  showSearch = false;
  isSidebarOpen = false;
  isCartSidebarOpen = false;

  public cart = inject(Cart);
  total = this.cart.total;

  totalItems = computed(() =>
    this.cart.getCartItems()().reduce((acc, item) => acc + item.quantity, 0)
  );

  filtroList = [
    {
      titulo: 'Producto',
      opciones: ['Pines', 'Fundas', 'SALE']
    },
    {
      titulo: 'Tallas',
      subcategorias: [
        {
          nombre: 'Superior',
          opciones: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        },
        {
          nombre: 'Inferior',
          opciones: ['26', '28', '30', '32', '34', '36', '38']
        }
      ]
    },
    {
      titulo: 'Géneros',
      opciones: ['Rock', 'Black Metal', 'Death Metal', 'Heavy Metal', 'Thrash Metal']
    }
  ];



  ngAfterViewInit(): void {
    lucide.createIcons(); // Activar íconos luego de cargar el DOM
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    setTimeout(() => lucide.createIcons(), 0); // Re-render icons si cambian
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  if (this.isSidebarOpen) {
    this.isCartSidebarOpen = false;
  }
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  toggleCartSidebar() {
    this.isCartSidebarOpen = !this.isCartSidebarOpen;
  if (this.isCartSidebarOpen) {
    this.isSidebarOpen = false;
  }
  }

  closeCartSidebar() {
    this.isCartSidebarOpen = false;
  }

}
