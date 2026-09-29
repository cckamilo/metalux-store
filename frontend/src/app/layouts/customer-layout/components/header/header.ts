import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Cart } from '../../../../features/cart/services/cart';
import { CartList } from '../../../../features/cart/components/cart-list/cart-list';
import { CatalogFilterService } from '../../../../core/services/catalog-filter/catalog-filter';
import { LucideAngularModule, Search, ShoppingCart, User } from 'lucide-angular';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, CartList, LucideAngularModule, RouterLink],
  templateUrl: './header.html'
})
export class Header {
  showSearch = false;
  isCartSidebarOpen = false;
  readonly quickNavigation = [
    { label: 'Novedades', filter: 'NOVEDADES' },
    { label: 'Vinilos', filter: 'Vinilo' },
    { label: 'CDs', filter: 'CD' },
    { label: 'Ofertas', filter: 'OFERTAS' }
  ];

  public cart = inject(Cart);
  private filterService = inject(CatalogFilterService);
  readonly searchIcon = Search;
  readonly cartIcon = ShoppingCart;
  readonly userIcon = User;
  total = this.cart.total;
  totalCount = this.cart.totalCount;

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }

  toggleCartSidebar(): void {
    this.isCartSidebarOpen = !this.isCartSidebarOpen;
  }

  closeCartSidebar(): void {
    this.isCartSidebarOpen = false;
  }

  selectQuickFilter(filter: string): void {
    this.filterService.setFilters([filter]);
  }

  goHome(): void {
    this.filterService.clearFilters();
  }
}