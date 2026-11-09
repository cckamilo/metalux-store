import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, HostListener, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Cart } from '../../../../features/cart/services/cart';
import { CartList } from '../../../../features/cart/components/cart-list/cart-list';
import { CatalogFilterService } from '../../../../core/services/catalog-filter/catalog-filter';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideSearch, lucideShoppingCart, lucideUser, lucideX } from '@ng-icons/lucide';
import { filter } from 'rxjs';

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
  activeNavigation = new Set<string>(['Inicio']);
  isMenuOpen = false;
  isCartSidebarOpen = false;
  readonly quickNavigation = [
    { label: 'Vinilos', filter: 'Vinilo' },
    { label: 'CDs', filter: 'CD' },
    { label: 'Ofertas', filter: 'OFERTAS' }
  ];

  public cart = inject(Cart);
  private filterService = inject(CatalogFilterService);
  private readonly router = inject(Router);
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
      this.updateActiveNavigation();
    });
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => this.updateActiveNavigation());
  }

  search(query: string): void {
    this.filterService.setSearchQuery(query);
  }

  submitSearch(): void {
    this.navigateToCatalog();
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
    this.navigateToCatalog();
  }

  goHome(): void {
    this.filterService.clearFilters();
    this.closeMenu();
    this.document.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateActiveNavigation(): void {
    const filters = this.filterService.getFilters();
    const activeNavigation = new Set<string>();
    if (filters.collection === 'new') {
      activeNavigation.add('Vinilo');
    } else if (filters.collection === 'offers') {
      activeNavigation.add('OFERTAS');
    } else if (filters.formats.enabled) {
      filters.formats.values.forEach(format => activeNavigation.add(format));
    }
    if (activeNavigation.size === 0) {
      activeNavigation.add(this.router.url.startsWith('/vinilos') ? 'Vinilo' : 'Inicio');
    }
    this.activeNavigation = activeNavigation;
  }

  private navigateToCatalog(): void {
    this.closeMenu();
    this.router.navigateByUrl('/vinilos').then(() => {
      this.document.getElementById('catalogo-productos')?.scrollIntoView({ block: 'start' });
    });
  }
}