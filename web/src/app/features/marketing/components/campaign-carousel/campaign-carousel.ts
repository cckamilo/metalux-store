import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CatalogFilterService } from '../../../../core/services/catalog-filter/catalog-filter';
import { CampaignCta, CampaignSlide } from '../../domain/campaign.model';

@Component({
  standalone: true,
  selector: 'app-campaign-carousel',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './campaign-carousel.html'
})
export class CampaignCarousel implements OnChanges, OnDestroy {
  @Input() slides: CampaignSlide[] = [];
  activeIndex = 0;
  private readonly intervalMs = 6000;
  private intervalId?: ReturnType<typeof setInterval>;

  constructor(
    private filterService: CatalogFilterService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['slides']) {
      this.activeIndex = 0;
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  next(): void {
    if (this.slides.length < 2) {
      return;
    }

    this.activeIndex = (this.activeIndex + 1) % this.slides.length;
  }

  previous(): void {
    if (this.slides.length < 2) {
      return;
    }

    this.activeIndex = (this.activeIndex - 1 + this.slides.length) % this.slides.length;
  }

  select(index: number): void {
    this.activeIndex = index;
  }

  getValidityLabel(slide: CampaignSlide): string | null {
    const startsAt = this.formatDate(slide.startsAt);
    const endsAt = this.formatDate(slide.endsAt);

    if (startsAt && endsAt) {
      return `Vigencia: ${startsAt} - ${endsAt}`;
    }

    if (endsAt) {
      return `Vigencia hasta: ${endsAt}`;
    }

    if (startsAt) {
      return `Vigencia desde: ${startsAt}`;
    }

    return null;
  }

  handleCta(cta: CampaignCta | undefined): void {
    if (cta?.action === 'filter') {
      this.filterService.setFilters([cta.value]);
    }
  }

  private formatDate(value: string | undefined): string | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? null
      : new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(date);
  }

  private startAutoplay(): void {
    if (this.slides.length < 2) {
      return;
    }

    this.intervalId = setInterval(() => this.next(), this.intervalMs);
  }

  private stopAutoplay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}