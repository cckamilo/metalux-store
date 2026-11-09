import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProductCardComponent } from './product-card';
import { productsMock } from '../../data/products.mock';
import { catalogConfig } from '../../config/catalog.config';

describe('ProductCardComponent', () => {
  let fixture: ComponentFixture<ProductCardComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProductCardComponent] }).compileComponents();
    fixture = TestBed.createComponent(ProductCardComponent);
    fixture.componentRef.setInput('product', productsMock[0]);
    fixture.componentRef.setInput('finalPrice', 84000);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('shows the artist, album, real color and Colombian price', () => {
    expect(element.querySelector('h3')?.textContent).toContain('Gojira');
    expect(element.querySelector('em')?.textContent).toContain('From Mars To Sirius');
    expect(element.textContent).toContain('Blanco crema');
    expect(element.textContent).toContain('$84.000');
  });

  it('shows the version count instead of a single color for multiple editions', () => {
    fixture.componentRef.setInput('product', productsMock.find(product => product.details.artist === 'Carcass'));
    fixture.detectChanges();
    expect(element.textContent).toContain('4 versiones');
    expect(element.textContent).not.toContain('Verde');
  });

  it('uses the shared stock threshold and allows overriding it', () => {
    expect(fixture.componentInstance.lowStockThreshold).toBe(catalogConfig.lowStockThreshold);
    expect(element.textContent).toContain('Queda 1 unidad');
    expect(element.querySelector('[role="status"]')?.classList.contains('text-black')).toBeTrue();
    fixture.componentRef.setInput('product', { ...productsMock[0], stock: 3 });
    fixture.detectChanges();
    expect(element.querySelector('[role="status"]')).toBeNull();
    fixture.componentRef.setInput('lowStockThreshold', 3);
    fixture.detectChanges();
    expect(element.textContent).toContain('Quedan 3 unidades');
    expect(element.querySelector('[role="status"]')?.classList.contains('text-black')).toBeTrue();
  });

  it('preserves detail and purchase events', () => {
    spyOn(fixture.componentInstance.openDetails, 'emit');
    spyOn(fixture.componentInstance.addToCart, 'emit');
    element.querySelector<HTMLButtonElement>('[aria-label]')!.click();
    element.querySelector<HTMLButtonElement>('button[aria-label^="Agregar al carrito:"]')!.click();
    expect(fixture.componentInstance.openDetails.emit).toHaveBeenCalled();
    expect(fixture.componentInstance.addToCart.emit).toHaveBeenCalledWith(1);
  });

  it('shows a loading spinner and prevents duplicate purchases briefly', fakeAsync(() => {
    const purchase = element.querySelector<HTMLButtonElement>('button[aria-label^="Agregar al carrito:"]')!;
    purchase.click();
    fixture.detectChanges();

    expect(purchase.disabled).toBeTrue();
    expect(purchase.getAttribute('aria-busy')).toBe('true');
    expect(purchase.textContent?.trim()).toBe('');
    expect(purchase.getAttribute('aria-label')).toContain('Agregar al carrito');
    expect(purchase.querySelector('.animate-spin')).not.toBeNull();

    tick(650);
    fixture.detectChanges();
    expect(purchase.disabled).toBeFalse();
    expect(purchase.getAttribute('aria-busy')).toBe('false');
    expect(purchase.textContent).toContain('Agregar al carrito');
  }));

  it('uses the same square cover inset for vinyl and CD images', () => {
    const image = element.querySelector('img')!;
    const frame = image.closest('div')!;
    expect(frame.classList.contains('bg-white')).toBeTrue();
    expect(frame.classList.contains('border-[#f0f0f0]')).toBeTrue();
    expect(image.classList.contains('drop-shadow-sm')).toBeFalse();
    expect(frame.classList.contains('aspect-square')).toBeTrue();
    expect(image.style.width).toBe('85%');
    expect(image.style.height).toBe('85%');
    fixture.componentRef.setInput('product', {
      ...productsMock[0], details: { ...productsMock[0].details, format: 'cd' }
    });
    fixture.detectChanges();
    expect(image.style.width).toBe('85%');
    expect(image.style.height).toBe('85%');
  });

  it('shows new and discount badges with the supplied discount label', () => {
    fixture.componentRef.setInput('isProductNew', true);
    fixture.componentRef.setInput('hasDiscount', true);
    fixture.componentRef.setInput('discountLabel', '-20%');
    fixture.detectChanges();
    expect(element.textContent).toContain('NUEVO');
    expect(element.textContent).toContain('-20%');
    const badges = element.querySelectorAll('span.pointer-events-none');
    expect(badges.length).toBe(2);
    for (const badge of Array.from(badges)) {
      expect(badge.classList.contains('bg-black')).toBeTrue();
      expect(badge.classList.contains('text-white')).toBeTrue();
    }
  });

  it('prioritizes the sold-out badge and prevents purchases without hiding details', () => {
    fixture.componentRef.setInput('product', { ...productsMock[0], stock: 0 });
    fixture.componentRef.setInput('isProductNew', true);
    fixture.detectChanges();
    spyOn(fixture.componentInstance.addToCart, 'emit');
    spyOn(fixture.componentInstance.openDetails, 'emit');
    expect(element.textContent).toContain('AGOTADO');
    expect(element.textContent).not.toContain('NUEVO');
    const purchase = element.querySelector<HTMLButtonElement>('button[aria-label^="Agregar al carrito:"]')!;
    expect(purchase.disabled).toBeTrue();
    purchase.click();
    fixture.componentInstance.onAddToCart();
    expect(fixture.componentInstance.addToCart.emit).not.toHaveBeenCalled();
    element.querySelector<HTMLButtonElement>('[aria-label]')!.click();
    expect(fixture.componentInstance.openDetails.emit).toHaveBeenCalled();
  });

  it('presents compact information and dims sold-out cards', () => {
    const title = element.querySelector('h3')!;
    expect(title.classList.contains('line-clamp-2')).toBeTrue();
    const colorDot = element.querySelector<HTMLElement>('[style*="background-color"]')!;
    expect(colorDot.classList.contains('h-[10px]')).toBeTrue();
    const purchase = element.querySelector<HTMLButtonElement>('button[aria-label^="Agregar al carrito:"]')!;
      expect(purchase.textContent?.trim()).toBe('Agregar al carrito');
    expect(purchase.classList.contains('bg-black')).toBeTrue();
    expect(purchase.classList.contains('text-white')).toBeTrue();
    fixture.componentRef.setInput('product', { ...productsMock[0], stock: 0 });
    fixture.detectChanges();
    expect(element.firstElementChild?.classList.contains('opacity-[0.55]')).toBeTrue();
    expect(purchase.disabled).toBeTrue();
  });
});
