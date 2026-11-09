import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { CampaignCarousel } from './campaign-carousel';
import { CampaignService } from '../../services/campaign.service';
import { CatalogFilterService } from '../../../../core/services/catalog-filter/catalog-filter';

describe('CampaignCarousel', () => {
  let fixture: ComponentFixture<CampaignCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CampaignCarousel], providers: [provideRouter([])] }).compileComponents();
    fixture = TestBed.createComponent(CampaignCarousel);
    fixture.componentRef.setInput('slides', TestBed.inject(CampaignService).getHomeCarouselSlides());
    fixture.detectChanges();
  });

  it('shows actual campaign imagery and changes the title with the selected slide', () => {
    const root: HTMLElement = fixture.nativeElement;
    const banner = root.querySelector('section')!;
    expect(banner.classList.contains('campaign-hero')).toBeTrue();
    expect(root.querySelector('img')?.getAttribute('src')).toBe(fixture.componentInstance.slides[0].imageUrl);
    root.querySelector<HTMLButtonElement>('[aria-label="Siguiente campaña"]')!.click();
    fixture.detectChanges();
    expect(root.querySelector('h1')?.textContent).toContain('From Mars To Sirius');
    expect(root.querySelector('img')?.getAttribute('src')).toBe(fixture.componentInstance.slides[1].imageUrl);
    root.querySelector<HTMLButtonElement>('[aria-label="Campaña anterior"]')!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeIndex).toBe(0);
  });

  it('uses the active campaign call-to-action label', () => {
    const root: HTMLElement = fixture.nativeElement;
    const cta = root.querySelector<HTMLButtonElement>('button:not([aria-label])')!;
    expect(cta.textContent?.trim()).toBe('Ver novedades');

    root.querySelector<HTMLButtonElement>('[aria-label="Siguiente campaña"]')!.click();
    fixture.detectChanges();
    expect(cta.textContent?.trim()).toBe('Ver lanzamiento');
  });

  it('renders lower navigation controls only when there is more than one slide', () => {
    const root: HTMLElement = fixture.nativeElement;
    for (const label of ['Campaña anterior', 'Siguiente campaña']) {
      const button = root.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`)!;
      expect(button.querySelector('ng-icon')).not.toBeNull();
      expect(button.closest('.campaign-controls')).not.toBeNull();
    }
    fixture.componentRef.setInput('slides', [fixture.componentInstance.slides[0]]);
    fixture.detectChanges();
    expect(root.querySelector('[aria-label="Campaña anterior"]')).toBeNull();
    expect(root.querySelector('[aria-label="Siguiente campaña"]')).toBeNull();
  });

  it('pauses and resumes automatic rotation and stops changing slides during interaction', fakeAsync(() => {
    const component = fixture.componentInstance;
    component.togglePause();
    tick(6000);
    expect(component.activeIndex).toBe(0);
    component.togglePause();
    tick(6000);
    expect(component.activeIndex).toBe(1);
    component.setInteraction(true);
    tick(6000);
    expect(component.activeIndex).toBe(1);
    component.ngOnDestroy();
  }));

  it('applies the campaign filter and opens the catalog from the persistent banner', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    fixture.componentInstance.handleCta({ label: 'Ver ofertas', action: 'filter', value: 'OFERTAS' });

    expect(TestBed.inject(CatalogFilterService).getFilters().collection).toBe('offers');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/vinilos');
  });

  it('routes a new-arrivals campaign to the filtered catalog', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    fixture.componentInstance.handleCta({ label: 'Ver novedades', action: 'filter', value: 'NOVEDADES' });

    expect(TestBed.inject(CatalogFilterService).getFilters().collection).toBe('new');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/vinilos');
  });
});
