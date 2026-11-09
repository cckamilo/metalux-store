
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, signal, ChangeDetectionStrategy } from '@angular/core';
import { inject } from '@angular/core';
import { PricingService } from '../../../features/catalog/services/pricing.service';
import { MusicDetails } from '../../../features/catalog/domain/product.model';
import { catalogConfig } from '../../../features/catalog/config/catalog.config';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [],
  templateUrl: './product-detail-modal.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './product-detail-modal.css'
})
export class ProductDetailModal implements OnChanges, OnDestroy {

  private pricingService = inject(PricingService);
  activeProductTab: 'description' | 'specifications' = 'specifications';
  currentImage = 0;
  isAddingToCart = false;
  readonly panelHasMore = signal(false);
  private panelObserver?: ResizeObserver;
  private cartAddTimer?: ReturnType<typeof setTimeout>;

  get vinylVersions(): NonNullable<MusicDetails['vinylColors']> {
    return this.product?.details?.type === 'music' && this.product.details.format === 'vinyl'
      ? this.product.details.vinylColors ?? []
      : [];
  }

  get currentVinylVersion() {
    return this.vinylVersions.find(color => color.imageIndex === this.currentImage);
  }

  @ViewChild('scrollPanel')
  set scrollPanel(panel: ElementRef<HTMLElement> | undefined) {
    this.panelObserver?.disconnect();
    if (panel) {
      const element = panel.nativeElement;
      this.panelObserver = new ResizeObserver(() => this.updatePanelFade(element));
      this.panelObserver.observe(element);
      if (element.firstElementChild) {
        this.panelObserver.observe(element.firstElementChild);
      }
    }
  }

  updatePanelFade(element: HTMLElement): void {
    this.panelHasMore.set(element.scrollHeight - element.clientHeight - element.scrollTop > 1);
  }

  ngOnDestroy(): void {
    this.panelObserver?.disconnect();
    if (this.cartAddTimer) clearTimeout(this.cartAddTimer);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      this.currentImage = 0;
      this.activeProductTab = this.product?.details?.type === 'music' ? 'specifications' : 'description';
    }
  }

  nextImage(): void {
    const total = this.product?.images?.length ?? 0;
    if (total > 1) this.currentImage = (this.currentImage + 1) % total;
  }

  previousImage(): void {
    const total = this.product?.images?.length ?? 0;
    if (total > 1) this.currentImage = (this.currentImage - 1 + total) % total;
  }

  @Input() product: any;
  @Input() show: boolean = false;
  @Input() lowStockThreshold = catalogConfig.lowStockThreshold;
  @Output() close = new EventEmitter<void>();
 @Output() addToCartEvent = new EventEmitter<any>();
  closeModal() {
    this.show = false;
    this.activeProductTab = this.product?.details?.type === 'music' ? 'specifications' : 'description';
    this.currentImage = 0;
    this.close.emit();
  }

  addToCart(product: any) {
    if (this.isAddingToCart) return;
    this.isAddingToCart = true;
    this.addToCartEvent.emit(product);
    this.cartAddTimer = setTimeout(() => {
      this.isAddingToCart = false;
      this.cartAddTimer = undefined;
    }, 650);
  }

  formatPrice(price: number): string {
    return '$' + price.toLocaleString('es-CO');
  }

  getProductPrice(product: any): number {
    return this.pricingService.getFinalPrice(product);
  }

  hasDiscount(product: any): boolean {
    return this.pricingService.hasDiscount(product);
  }

  getDiscountLabel(product: any): string | null {
    return this.pricingService.getDiscountLabel(product);
  }
}
