import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampaignCarousel } from './campaign-carousel';
import { CampaignService } from '../../services/campaign.service';

describe('CampaignCarousel themes', () => {
  let fixture: ComponentFixture<CampaignCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CampaignCarousel] }).compileComponents();
    fixture = TestBed.createComponent(CampaignCarousel);
    fixture.componentRef.setInput('slides', TestBed.inject(CampaignService).getHomeCarouselSlides());
    fixture.detectChanges();
  });

  it('uses blue gradients for Gojira and restores the default theme on the first slide', () => {
    const root: HTMLElement = fixture.nativeElement;
    const banner = root.querySelector('section')!;
    const disc = banner.querySelector<HTMLElement>('[aria-hidden="true"]')!;
    expect(banner.classList.contains('blue')).toBeFalse();
    expect(banner.style.background).toBe('');

    root.querySelector<HTMLButtonElement>('[aria-label="Siguiente campaña"]')!.click();
    fixture.detectChanges();
    expect(banner.classList.contains('blue')).toBeTrue();
    expect(banner.style.background).toContain('linear-gradient(100deg');
    expect(banner.style.background).toContain('55%');
    expect(disc.style.background).toContain('radial-gradient');
    expect(disc.style.background).toContain('rgb(59, 130, 246)');

    root.querySelector<HTMLButtonElement>('[aria-label="Campaña anterior"]')!.click();
    fixture.detectChanges();
    expect(banner.classList.contains('blue')).toBeFalse();
    expect(banner.style.background).toBe('');
    expect(disc.style.background).toBe('');
  });

  it('renders lateral SVG chevrons only when there is more than one slide', () => {
    const root: HTMLElement = fixture.nativeElement;
    for (const label of ['Campaña anterior', 'Siguiente campaña']) {
      const button = root.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`)!;
      const icon = button.querySelector('svg')!;
      expect(icon.getAttribute('width')).toBe('18');
      expect(icon.getAttribute('height')).toBe('18');
      expect(icon.getAttribute('stroke-width')).toBe('2');
      expect(icon.getAttribute('stroke')).toBe('currentColor');
      expect(button.classList.contains('top-1/2')).toBeTrue();
    }
    fixture.componentRef.setInput('slides', [fixture.componentInstance.slides[0]]);
    fixture.detectChanges();
    expect(root.querySelector('[aria-label="Campaña anterior"]')).toBeNull();
    expect(root.querySelector('[aria-label="Siguiente campaña"]')).toBeNull();
  });
});
