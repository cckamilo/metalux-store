import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, effect, EventEmitter, inject, Output, signal } from '@angular/core';
import { Cart } from '../../../features/cart/services/cart';
import { CartList } from '../../../features/cart/components/cart-list/cart-list';


declare var lucide: any;

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [
    CommonModule,
    CartList
  ],
  templateUrl: './header.html'
})
export class Header implements AfterViewInit {

 @Output() menuClicked = new EventEmitter<void>();

  onToggleMenu() {
    this.menuClicked.emit();
  }

  showSearch = false;
  isCartSidebarOpen = false;

  public cart = inject(Cart);
  total = this.cart.total;

  totalItems = computed(() =>
    this.cart.getCartItems()().reduce((acc, item) => acc + item.quantity, 0)
  );


  ngAfterViewInit(): void {
    lucide.createIcons(); // Activar íconos luego de cargar el DOM
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    setTimeout(() => lucide.createIcons(), 0); // Re-render icons si cambian
  }

  toggleCartSidebar() {
    this.isCartSidebarOpen = !this.isCartSidebarOpen;
  }

  closeCartSidebar() {
    this.isCartSidebarOpen = false;
  }

}
