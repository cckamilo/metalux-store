import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, HostListener, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Cart } from '../../../../features/cart/services/cart';
import { CartList } from '../../../../features/cart/components/cart-list/cart-list';
import { CatalogFilterService } from '../../../../core/services/catalog-filter/catalog-filter';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideSearch, lucideShoppingCart, lucideUser, lucideX } from '@ng-icons/lucide';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, FormsModule, CartList, NgIcon, RouterLink],
  providers: [provideIcons({ lucideMenu, lucideSearch, lucideShoppingCart, lucideUser, lucideX })],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './header.html'
})
export class Header {
  searchQuery = '';
  activeNavigation = 'Inicio';
  isMenuOpen = false;
  isCartSidebarOpen = false;
  readonly quickNavigation = [
    { label: 'Novedades', filter: 'NOVEDADES' },
    { label: 'Vinilos', filter: 'Vinilo' },
    { label: 'CDs', filter: 'CD' },
    { label: 'Ofertas', filter: 'OFERTAS' }
  ];

  public cart = inject(Cart);
  private filterService = inject(CatalogFilterService);
  private readonly document = inject(DOCUMENT);
  readonly searchIcon = 'lucideSearch';
  readonly menuIcon = 'lucideMenu';
  readonly closeIcon = 'lucideX';
  readonly cartIcon = 'lucideShoppingCart';
  readonly userIcon = 'lucideUser';
  total = this.cart.total;
  totalCount = this.cart.totalCount;

  constructor() {
    this.filterService.filters$.pipe(takeUntilDestroyed()).subscribe(filters => {
      this.searchQuery = filters.searchQuery ?? '';
      this.activeNavigation = filters.collection === 'new' ? 'NOVEDADES'
        : filters.collection === 'offers' ? 'OFERTAS'
        : filters.formats.enabled && filters.formats.values.length === 1 ? filters.formats.values[0]
        : 'Inicio';
    });
  }

  search(query: string): void {
    this.filterService.setSearchQuery(query);
  }

  submitSearch(): void {
    this.closeMenu();
    this.document.getElementById('catalogo-productos')?.scrollIntoView({ block: 'start' });
  }

  @HostListener('document:keydown.escape')
  @HostListener('document:click')
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleCartSidebar(): void {
    this.closeMenu();
    this.isCartSidebarOpen = !this.isCartSidebarOpen;
  }

  closeCartSidebar(): void {
    this.isCartSidebarOpen = false;
  }

  selectQuickFilter(filter: string): void {
    this.filterService.setFilters([filter]);
    this.submitSearch();
  }

  goHome(): void {
    this.filterService.clearFilters();
    this.closeMenu();
  }
}