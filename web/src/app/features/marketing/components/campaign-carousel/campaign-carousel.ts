import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight, lucidePause, lucidePlay } from '@ng-icons/lucide';
import { CatalogFilterService } from '../../../../core/services/catalog-filter/catalog-filter';
import { CampaignCta, CampaignSlide } from '../../domain/campaign.model';

@Component({
  standalone: true,
  selector: 'app-campaign-carousel',
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ lucideArrowLeft, lucideArrowRight, lucidePause, lucidePlay })],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './campaign-carousel.html',
  styleUrl: './campaign-carousel.css'
})
export class CampaignCarousel implements OnChanges, OnDestroy {
  @Input() slides: CampaignSlide[] = [];
  activeIndex = 0;
  isPaused = false;
  isInteracting = false;
  private readonly intervalMs = 6000;
  private intervalId?: ReturnType<typeof setInterval>;

  constructor(
    private filterService: CatalogFilterService,
    private router: Router
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

  togglePause(): void {
    this.isPaused = !this.isPaused;
    this.stopAutoplay();
    if (!this.isPaused) this.startAutoplay();
  }

  setInteraction(interacting: boolean): void {
    this.isInteracting = interacting;
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
      void this.router.navigateByUrl('/vinilos');
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

    this.intervalId = setInterval(() => {
      if (!this.isPaused && !this.isInteracting && !globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) this.next();
    }, this.intervalMs);
  }

  private stopAutoplay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}