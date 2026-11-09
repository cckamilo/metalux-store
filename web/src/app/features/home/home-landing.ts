import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { Cart, CartItem } from '../cart/services/cart';
import { CatalogFilterService } from '../../core/services/catalog-filter/catalog-filter';
import { UserMessageService } from '../../core/services/user-message/user-message.service';
import { ProductCardComponent, ProductCardItem } from '../catalog/components/product-card/product-card';
import { PricingService } from '../catalog/services/pricing.service';
import { ProductDetailModal } from '../../shared/components/product-detail-modal/product-detail-modal';
import { catalogConfig } from '../catalog/config/catalog.config';
import { checkoutMock } from '../cart/data/checkout.mock';
import { HomeCategoryFilter, HomePageContentService } from './home-page-content.service';
import { CampaignCarousel } from '../marketing/components/campaign-carousel/campaign-carousel';
import { CampaignService } from '../marketing/services/campaign.service';

@Component({
  standalone: true,
  selector: 'app-home-landing',
  imports: [CommonModule, NgIcon, ProductCardComponent, ProductDetailModal, CampaignCarousel],
  providers: [provideIcons({ lucideArrowRight })],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './home-landing.html',
  styleUrl: './home-landing.css'
})
export class HomeLanding {
  readonly campaignSlides = inject(CampaignService).getHomeCarouselSlides();
  readonly content = inject(HomePageContentService);
  private readonly filters = inject(CatalogFilterService);
  private readonly router = inject(Router);
  private readonly cart = inject(Cart);
  private readonly pricing = inject(PricingService);
  private readonly messages = inject(UserMessageService);
  readonly lowStockThreshold = catalogConfig.lowStockThreshold;
  readonly shippingThreshold = checkoutMock.freeShippingThreshold;
  showProductModal = false;
  selectedProduct: ProductCardItem | null = null;

  formatPrice(price: number): string {
    return '$' + price.toLocaleString('es-CO');
  }

  getProductPrice(product: ProductCardItem): number {
    return this.pricing.getFinalPrice(product);
  }

  hasDiscount(product: ProductCardItem): boolean {
    return this.pricing.hasDiscount(product);
  }

  getDiscountLabel(product: ProductCardItem): string | null {
    return this.pricing.getDiscountLabel(product);
  }

  selectCategory(filter: HomeCategoryFilter): void {
    if (filter === 'BANDAS') {
      this.filters.clearFilters();
    } else {
      this.filters.setFilters([filter]);
    }
    void this.router.navigateByUrl('/vinilos');
  }

  showAllVinyls(): void {
    this.selectCategory('Vinilo');
  }

  showAllNewArrivals(): void {
    this.selectCategory('NOVEDADES');
  }

  showAllOffers(): void {
    this.selectCategory('OFERTAS');
  }

  openHeroDetails(): void {
    if (!this.content.heroProduct) return;
    this.selectedProduct = this.content.heroProduct;
    this.showProductModal = true;
  }

  openModal(product: ProductCardItem): void {
    this.selectedProduct = product;
    this.showProductModal = true;
  }

  closeModal(): void {
    this.showProductModal = false;
    this.selectedProduct = null;
  }

  addToCart(product: ProductCardItem): void {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: this.getProductPrice(product),
      originalPrice: product.price,
      image: product.images[0],
      quantity: 1
    };
    this.cart.addItem(item);
    this.messages.success('Agregado al carrito', { title: 'Carrito', duration: 2500 });
  }
}
