import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Cart } from '../../../features/cart/services/cart';
import { CartList } from '../../../features/cart/components/cart-list/cart-list';
import { MenuFilter } from '../../../core/services/menufilter/menu-filter';
import { LucideAngularModule, Menu, Search, ShoppingCart, User } from 'lucide-angular';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [
    CommonModule,
    CartList,
    LucideAngularModule,
    RouterLink
  ],
  templateUrl: './header.html'
})
export class Header {

  @Output() menuClicked = new EventEmitter<void>();

  onToggleMenu() {
    this.menuClicked.emit();
  }

  showSearch = false;
  isCartSidebarOpen = false;
  readonly quickNavigation = [
    { label: 'Novedades', filter: 'NOVEDADES' },
    { label: 'Vinilos', filter: 'Vinilo' },
    { label: 'CDs', filter: 'CD' },
    { label: 'Ofertas', filter: 'OFERTAS' }
  ];

  public cart = inject(Cart);
  private filterService = inject(MenuFilter);
  readonly menuIcon = Menu;
  readonly searchIcon = Search;
  readonly cartIcon = ShoppingCart;
  readonly userIcon = User;
  total = this.cart.total;

   // Exponemos la señal 'totalCount' del servicio para que el HTML la pueda usar
  totalCount = this.cart.totalCount;

  // totalItems = computed(() => this.cart.getTotalCount());


  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }

  toggleCartSidebar() {
    this.isCartSidebarOpen = !this.isCartSidebarOpen;
  }

  closeCartSidebar() {
    this.isCartSidebarOpen = false;
  }

  selectQuickFilter(filter: string): void {
    this.filterService.setFilters([filter]);
  }

  goHome(): void {
    this.filterService.clearFilters();
  }

}
