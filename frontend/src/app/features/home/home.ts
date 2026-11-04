import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CatalogFilterService } from '../../core/services/catalog-filter/catalog-filter';
import { ProductDetailModal } from '../../shared/components/product-detail-modal/product-detail-modal';
import { Cart, CartItem } from '../cart/services/cart';
import { CatalogFilters, FilterGroup, FilterSelection } from '../catalog/components/catalog-filters/catalog-filters';
import { CatalogToolbar } from '../catalog/components/catalog-toolbar/catalog-toolbar';
import { ProductCardComponent, ProductCardItem } from '../catalog/components/product-card/product-card';
import { CatalogListingFacade } from '../catalog/services/catalog-listing.facade';
import { PricingService } from '../catalog/services/pricing.service';
import { CampaignCarousel } from '../marketing/components/campaign-carousel/campaign-carousel';
import { CampaignService } from '../marketing/services/campaign.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, ProductDetailModal, CampaignCarousel, ProductCardComponent,
    CatalogFilters, CatalogToolbar],
  providers: [CatalogListingFacade],
  templateUrl: './home.html'
})
export class Home {
  readonly listing = inject(CatalogListingFacade);
  private readonly cart = inject(Cart);
  private readonly filterService = inject(CatalogFilterService);
  private readonly pricingService = inject(PricingService);
  readonly campaignSlides = inject(CampaignService).getHomeCarouselSlides();
  showModal = false;
  selectedProduct: ProductCardItem | null = null;

  /** Envia la seleccion visual al servicio que comparte filtros con header y footer. */
  selectFilter({ group, value, selected }: FilterSelection): void {
    switch (group) {
      case 'bands': this.filterService.toggleBand(value, selected); break;
      case 'genres': this.filterService.toggleGenre(value, selected); break;
      case 'formats': this.filterService.toggleFormat(value, selected); break;
    }
  }

  /** Limpia un grupo sin modificar las demas selecciones ni su configuracion. */
  clearFilterGroup(group: FilterGroup): void {
    switch (group) {
      case 'bands': this.filterService.clearBands(); break;
      case 'genres': this.filterService.clearGenres(); break;
      case 'formats': this.filterService.clearFormats(); break;
    }
  }

  /** Conserva el comportamiento actual de compra de una unidad desde la tarjeta. */
  addToCart(product: ProductCardItem): void {
    const item: CartItem = {
      id: product.id, name: product.name, price: this.getProductPrice(product), originalPrice: product.price,
      image: product.images[0], quantity: 1
    };
    this.cart.addItem(item);
  }

  /** Delega el precio final al servicio comercial existente. */
  getProductPrice(product: ProductCardItem): number {
    return this.pricingService.getFinalPrice(product);
  }

  /** Consulta si el precio final representa un descuento vigente. */
  hasDiscount(product: ProductCardItem): boolean {
    return this.pricingService.hasDiscount(product);
  }

  /** Obtiene la etiqueta comercial del descuento para la tarjeta. */
  getDiscountLabel(product: ProductCardItem): string | null {
    return this.pricingService.getDiscountLabel(product);
  }

  /** Selecciona el producto que presenta el modal, sin modificar el listado. */
  openModal(product: ProductCardItem): void {
    this.selectedProduct = product;
    this.showModal = true;
  }

  /** Cierra el detalle y libera la seleccion local de la pagina. */
  closeModal(): void {
    this.showModal = false;
    this.selectedProduct = null;
  }
}
