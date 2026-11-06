import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailModal } from './product-detail-modal';
import { Product } from '../../../features/catalog/domain/product.model';
import { productsMock } from '../../../features/catalog/data/products.mock';

describe('ProductDetailModal', () => {
  let component: ProductDetailModal;
  let fixture: ComponentFixture<ProductDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('product detail presentation', () => {
    const product: Product = {
      id: 1000,
      name: 'Test album',
      category: { id: 1000, name: 'Music', slug: 'music', isActive: true },
      price: 88000,
      stock: 3,
      images: ['cover.jpg', 'vinyl.jpg'],
      description: 'Album description',
      details: { type: 'music', artist: 'Test artist', format: 'vinyl', genre: 'Metal' },
      isActive: true,
      isNew: false
    };
    let element: HTMLElement;

    beforeEach(() => {
      fixture.componentRef.setInput('product', product);
      fixture.componentRef.setInput('show', true);
      fixture.detectChanges();
      element = fixture.nativeElement;
    });

    it('selects images using thumbnails and wraps using the gallery controls', () => {
      const thumbnail = element.querySelector<HTMLButtonElement>('[aria-label="Ver imagen 2 de 2"]')!;
      thumbnail.click();
      fixture.detectChanges();

      expect(component.currentImage).toBe(1);
      expect(thumbnail.getAttribute('aria-pressed')).toBe('true');
      expect(element.querySelector('img')?.getAttribute('src')).toBe('vinyl.jpg');

      element.querySelector<HTMLButtonElement>('[aria-label="Imagen siguiente"]')!.click();
      fixture.detectChanges();
      expect(component.currentImage).toBe(0);

      element.querySelector<HTMLButtonElement>('[aria-label="Imagen anterior"]')!.click();
      fixture.detectChanges();
      expect(component.currentImage).toBe(1);
    });

    it('orders the artist before the album and keeps purchasing before the information tabs', () => {
      const layout = element.querySelector('.detail-layout')!;
      const information = layout.querySelector('.detail-information')!;
      const heading = information.querySelector('h2')!;
      const purchase = information.querySelector('.detail-purchase')!;
      const tabs = information.querySelector('.detail-tabs')!;

      expect(heading.previousElementSibling?.textContent?.trim()).toBe('Test artist');
      expect(layout.querySelector('.detail-gallery')?.nextElementSibling?.classList.contains('detail-summary')).toBeTrue();
      expect(purchase.nextElementSibling).toBe(tabs);
      expect(heading.style.fontFamily).toBe('Georgia, serif');
    });

    it('preserves closing and resets the gallery and tab', () => {
      spyOn(component.close, 'emit');
      component.currentImage = 1;
      component.activeProductTab = 'specifications';
      fixture.detectChanges();

      element.querySelector<HTMLButtonElement>('[aria-label="Cerrar detalle"]')!.click();

      expect(component.show).toBeFalse();
      expect(component.currentImage).toBe(0);
      expect(component.activeProductTab).toBe('specifications');
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('switches the underlined tab and its content', () => {
      const tabs = element.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      expect(tabs[0].textContent).toContain('Especificaciones');
      expect(tabs[0].getAttribute('aria-selected')).toBe('true');
      tabs[0].click();
      fixture.detectChanges();

      expect(tabs[0].getAttribute('aria-selected')).toBe('true');
      expect(tabs[0].classList.contains('border-black')).toBeTrue();
      expect(tabs[1].classList.contains('border-transparent')).toBeTrue();
      expect(element.querySelector('[role="tabpanel"]')?.textContent).toContain('Metal');

      tabs[1].click();
      fixture.detectChanges();
      expect(element.querySelector('[role="tabpanel"]')?.textContent).toContain(product.description);
    });

    it('allows scrolling only in the text panel and keeps purchase before the tabs', () => {
      const content = element.querySelector('[role="region"]')!;
      const scrollContent = element.querySelector('[role="tabpanel"]')!;
      const purchaseButton = element.querySelector<HTMLButtonElement>('button.bg-black')!;
      spyOn(component.addToCartEvent, 'emit');

      expect(element.querySelectorAll('.overflow-y-auto').length).toBe(1);
      expect(scrollContent.classList.contains('overflow-y-auto')).toBeTrue();
      expect(purchaseButton.parentElement?.classList.contains('detail-purchase')).toBeTrue();
      expect(purchaseButton.parentElement?.nextElementSibling?.classList.contains('detail-tabs')).toBeTrue();
      expect(purchaseButton.textContent).toContain(component.formatPrice(component.getProductPrice(product)));
      purchaseButton.click();
      expect(component.addToCartEvent.emit).toHaveBeenCalledWith(product);
    });

    it('hides thumbnails and gallery arrows for a single image', () => {
      fixture.componentRef.setInput('product', { ...product, images: ['cover.jpg'] });
      fixture.detectChanges();

      expect(element.querySelector('[aria-pressed]')).toBeNull();
      expect(element.querySelector('[aria-label="Imagen siguiente"]')).toBeNull();
      expect(element.querySelector('[aria-label="Imagen anterior"]')).toBeNull();
    });

    it('shows a single edition as text with its disc count instead of a swatch', () => {
      fixture.componentRef.setInput('product', {
        ...product,
        details: { ...product.details, vinylColor: { name: 'Azul', hex: '#2450dc' }, discCount: 2 }
      });
      fixture.detectChanges();

      expect(element.textContent?.replace(/\s+/g, ' ')).toContain('Versión: Azul · 2 discos');
      expect(element.querySelector('[role="img"]')).toBeNull();
      expect(element.querySelector('[aria-label="Versiones del vinilo"]')).toBeNull();
      expect(element.querySelector('[role="status"]')).toBeNull();
    });

    it('hides the edition line when color is missing or the format is CD', () => {
      expect(element.textContent).not.toContain('Versión:');

      fixture.componentRef.setInput('product', {
        ...product,
        details: { ...product.details, format: 'cd', vinylColor: { name: 'Negro', hex: '#111111' } }
      });
      fixture.detectChanges();

      expect(element.textContent).not.toContain('Versión:');
    });

    it('supports a single color in the versions array and singular disc wording', () => {
      fixture.componentRef.setInput('product', {
        ...product,
        details: {
          ...product.details,
          discCount: 1,
          vinylColors: [{ name: 'Blanco', hex: '#ffffff', imageIndex: 0 }]
        }
      });
      fixture.detectChanges();
      expect(element.textContent?.replace(/\s+/g, ' ')).toContain('Versión: Blanco · 1 disco');
      expect(element.querySelector('[aria-label="Versiones del vinilo"]')).toBeNull();
    });

    it('shows singular stock and hides the message when stock is zero', () => {
      fixture.componentRef.setInput('product', { ...product, stock: 1 });
      fixture.detectChanges();
      expect(element.querySelector('[role="status"]')?.textContent?.trim()).toBe('Queda 1 unidad');

      fixture.componentRef.setInput('product', { ...product, stock: 0 });
      fixture.detectChanges();
      expect(element.querySelector('[role="status"]')).toBeNull();
    });

    it('shows stock only at or below the configurable threshold', () => {
      expect(element.querySelector('[role="status"]')).toBeNull();

      fixture.componentRef.setInput('product', { ...product, stock: 2 });
      fixture.detectChanges();
      expect(element.querySelector('[role="status"]')?.textContent?.trim()).toBe('Quedan 2 unidades');

      fixture.componentRef.setInput('lowStockThreshold', 1);
      fixture.detectChanges();
      expect(element.querySelector('[role="status"]')).toBeNull();

      fixture.componentRef.setInput('lowStockThreshold', 3);
      fixture.componentRef.setInput('product', product);
      fixture.detectChanges();
      expect(element.querySelector('[role="status"]')?.textContent?.trim()).toBe('Quedan 3 unidades');
    });

    it('presents specification rows with the selected vinyl color', () => {
      const album = productsMock.find(product => product.name === 'The Way of All Flesh')!;
      fixture.componentRef.setInput('product', album);
      component.activeProductTab = 'specifications';
      fixture.detectChanges();

      const rows = element.querySelectorAll('dl > div');
      expect(Array.from(rows, row => row.querySelector('dt')?.textContent?.trim())).toEqual([
        'Género', 'Formato', 'Color del vinilo', 'Discos', 'Año de edición', 'Sello'
      ]);
      expect(Array.from(rows, row => row.querySelector('dd')?.textContent?.trim())).toEqual([
        'Progressive Metal', 'Vinilo 2LP', 'Azul', '2', '2018', 'Listenable Records'
      ]);

      fixture.componentRef.setInput('product', productsMock.find(product => product.details.artist === 'Carcass')!);
      fixture.detectChanges();
      component.currentImage = 2;
      fixture.detectChanges();
      expect(element.querySelectorAll('dl dd')[2].textContent?.trim()).toBe('Morado');
    });

    it('shows the specifications fade only while more rows remain below', () => {
      component.activeProductTab = 'specifications';
      fixture.detectChanges();
      const panel = element.querySelector<HTMLElement>('[role="tabpanel"]')!;
      Object.defineProperties(panel, {
        scrollHeight: { value: 240, configurable: true },
        clientHeight: { value: 144 },
        scrollTop: { value: 0, writable: true }
      });

      panel.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(panel.parentElement?.querySelector('.pointer-events-none')).not.toBeNull();

      panel.scrollTop = 96;
      panel.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(panel.parentElement?.querySelector('.pointer-events-none')).toBeNull();

      Object.defineProperty(panel, 'scrollHeight', { value: 144, configurable: true });
      panel.scrollTop = 0;
      panel.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
      expect(component.panelHasMore()).toBeFalse();
    });

    it('omits missing specifications and does not show a vinyl color for CDs', () => {
      fixture.componentRef.setInput('product', {
        ...product,
        details: { ...product.details, format: 'cd' }
      });
      component.activeProductTab = 'specifications';
      fixture.detectChanges();

      expect(Array.from(element.querySelectorAll('dl dt'), item => item.textContent?.trim())).toEqual([
        'Género', 'Formato'
      ]);
      expect(element.querySelectorAll('dl dd')[1].textContent?.trim()).toBe('CD');
    });

    it('links all four Carcass colors to their images and synchronizes gallery navigation', () => {
      const carcass = productsMock.find(product => product.details.artist === 'Carcass')!;
      fixture.componentRef.setInput('product', carcass);
      fixture.detectChanges();
      const versions = element.querySelectorAll<HTMLButtonElement>('[aria-label="Versiones del vinilo"] button');

      expect(versions.length).toBe(4);
      versions.forEach((button, index) => {
        button.click();
        fixture.detectChanges();
        expect(button.getAttribute('aria-pressed')).toBe('true');
        expect(element.querySelector('img')?.getAttribute('src')).toBe(carcass.images[index]);
        expect(component.currentVinylVersion?.name).toBe(carcass.details.vinylColors![index].name);
      });
      expect(element.querySelector('[aria-label="Versiones del vinilo"] button:last-child span')?.getAttribute('style')).toContain('repeating-conic-gradient');

      element.querySelector<HTMLButtonElement>('[aria-label="Imagen siguiente"]')!.click();
      fixture.detectChanges();
      expect(versions[0].getAttribute('aria-pressed')).toBe('true');
      expect(versions[3].getAttribute('aria-pressed')).toBe('false');
      expect(element.querySelector('[role="status"]')?.textContent).toContain('Quedan 2 unidades');
    });
  });
});
