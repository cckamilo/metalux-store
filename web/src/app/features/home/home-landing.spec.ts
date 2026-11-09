import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { CatalogFilterService } from '../../core/services/catalog-filter/catalog-filter';
import { HomeLanding } from './home-landing';

describe('HomeLanding', () => {
  let fixture: ComponentFixture<HomeLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeLanding],
      providers: [provideRouter([])]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeLanding);
    fixture.detectChanges();
  });

  it('keeps only the first new-arrival purchase button solid', () => {
    const root: HTMLElement = fixture.nativeElement;
    for (const section of ['featured-title']) {
      const buttons = root.querySelectorAll<HTMLButtonElement>(`section[aria-labelledby="${section}"] app-product-card button[aria-label^="Agregar al carrito:"]`);
      expect(buttons[0].classList.contains('bg-black')).toBeTrue();
      Array.from(buttons).slice(1).forEach(button => {
        expect(button.classList.contains('bg-white')).toBeTrue();
        expect(button.classList.contains('border-black')).toBeTrue();
      });
    }
  });

  it('uses the offer list for both the category count and rendered rows', () => {
    const root: HTMLElement = fixture.nativeElement;
    const content = fixture.componentInstance.content;
    const category = content.categories.find(category => category.filter === 'OFERTAS')!;
    const cards = root.querySelectorAll('section[aria-labelledby="home-offers-title"] .offer-row');
    const categoryButton = Array.from(root.querySelectorAll<HTMLButtonElement>('section[aria-labelledby="home-categories-title"] button'))
      .find(button => button.textContent?.includes('Ofertas'))!;

    expect(cards.length).toBe(category.count);
    expect(cards.length).toBe(content.offerProducts.length);
    expect(categoryButton.textContent).toContain(`${cards.length} discos`);
    content.offerProducts.forEach((product, index) => {
      expect(cards[index].textContent).toContain(product.name);
    });
  });

  it('differentiates offers with their actual savings instead of new-product labels', () => {
    const root: HTMLElement = fixture.nativeElement;
    const offers = root.querySelector('section[aria-labelledby="home-offers-title"]')!;
    const featured = root.querySelector('section[aria-labelledby="featured-title"]')!;
    const cards = offers.querySelectorAll('.offer-row');

    fixture.componentInstance.content.offerProducts.forEach((product, index) => {
      const savings = product.price - fixture.componentInstance.getProductPrice(product);
      expect(cards[index].textContent).toContain(`Ahorras ${fixture.componentInstance.formatPrice(savings)}`);
    });
    expect(offers.textContent).toContain('Ahorras $21.000');
    expect(offers.textContent).not.toContain('NUEVO');
    expect(offers.querySelector('app-product-card')).toBeNull();
    expect(featured.textContent).toContain('NUEVO');
    expect(featured.textContent).not.toContain('Ahorras');
  });

  it('marks empty categories as coming soon without offering navigation', () => {
    const root: HTMLElement = fixture.nativeElement;
    const categories = Array.from(root.querySelectorAll<HTMLButtonElement>('section[aria-labelledby="home-categories-title"] button'));
    const cds = categories.find(button => button.textContent?.includes('CDs'))!;
    const vinyls = categories.find(button => button.textContent?.includes('Vinilos'))!;

    expect(cds.textContent).toContain('Próximamente');
    expect(cds.textContent).not.toContain('0 discos');
    expect(cds.disabled).toBeTrue();
    expect(cds.querySelector('ng-icon')).toBeNull();
    expect(vinyls.disabled).toBeFalse();
    expect(vinyls.querySelector('ng-icon')).not.toBeNull();
  });

  it('shows the purchase steps before compact offers and opens offer details', () => {
    const root: HTMLElement = fixture.nativeElement;
    const exploration = root.querySelector('[aria-labelledby="home-categories-title"]')!;
    const steps = root.querySelector('[aria-labelledby="home-how-title"]')!;
    const offers = root.querySelector('[aria-labelledby="home-offers-title"]')!;
    expect(exploration.nextElementSibling).toBe(steps);
    expect(steps.nextElementSibling).toBe(offers);
    expect(steps.querySelectorAll('ol > li').length).toBe(3);
    expect(offers.parentElement).toBe(root);
    offers.querySelector<HTMLButtonElement>('.offer-row button')!.click();
    expect(fixture.componentInstance.selectedProduct).toBe(fixture.componentInstance.content.offerProducts[0]);
    expect(fixture.componentInstance.showProductModal).toBeTrue();
  });

  it('shows new arrivals at full width and links to the filtered catalog', () => {
    const root: HTMLElement = fixture.nativeElement;
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    const section = root.querySelector('section[aria-labelledby="featured-title"]')!;
    expect(section.parentElement).toBe(root);
    expect(section.textContent).toContain('Llegaron esta semana');
    expect(section.textContent).toContain('Los discos nuevos de la tienda, con precio y formato.');
    const cards = section.querySelectorAll('app-product-card');
    expect(cards.length).toBe(4);
    fixture.componentInstance.content.newArrivals.forEach((product, index) => {
      expect(cards[index].textContent).toContain(product.name);
    });
    const link = Array.from(section.querySelectorAll('button')).find(button => button.textContent?.trim() === 'Ver todas las novedades')!;
    link.click();
    expect(TestBed.inject(CatalogFilterService).getFilters().collection).toBe('new');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/vinilos');
  });

  it('shows full-width exploration below new arrivals and clears filters for browsing bands', () => {
    const root: HTMLElement = fixture.nativeElement;
    const filters = TestBed.inject(CatalogFilterService);
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    const arrivals = root.querySelector('section[aria-labelledby="featured-title"]')!;
    const exploration = root.querySelector('section[aria-labelledby="home-categories-title"]')!;
    expect(arrivals.nextElementSibling).toBe(exploration);
    expect(exploration.parentElement).toBe(root);
    expect(exploration.textContent).toContain('Ediciones de color');
    expect(exploration.textContent).toContain('Precios rebajados');
    filters.setFilters(['OFERTAS']);
    const bands = Array.from(exploration.querySelectorAll('button')).find(button => button.textContent?.includes('Por banda'))!;
    bands.click();
    expect(filters.getFilters().collection).toBeUndefined();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/vinilos');
  });

  it('shows the carousel before new arrivals, exploration and offers', () => {
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('[aria-label="Campañas destacadas"]')).not.toBeNull();
    expect(root.firstElementChild?.tagName).toBe('APP-CAMPAIGN-CAROUSEL');
    expect(root.querySelector('.campaign-media img')).not.toBeNull();
    expect(root.querySelectorAll('app-product-card').length).toBeGreaterThanOrEqual(4);
    expect(root.querySelectorAll('section[aria-labelledby="home-categories-title"] button').length).toBe(4);
    expect(root.textContent).toContain('Llegaron esta semana');
    expect(Array.from(root.querySelectorAll('button')).filter(button => button.textContent?.trim() === 'Ver todas las novedades').length).toBe(1);
    expect(root.textContent).toContain('Ofertas');
    expect(root.querySelector('a[href="/vinilos"]')).toBeNull();
  });
});
