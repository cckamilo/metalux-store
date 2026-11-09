import { Component, signal, WritableSignal, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Header } from '../../layouts/customer-layout/components/header/header';
import { Footer } from '../../layouts/customer-layout/components/footer/footer';
import { Cart, CartItem } from '../cart/services/cart';
import { CatalogFilterService } from '../../core/services/catalog-filter/catalog-filter';
import { UserMessageService } from '../../core/services/user-message/user-message.service';
import { PricingService } from '../catalog/services/pricing.service';
import { Home } from './home';

@Component({
  standalone: true,
  imports: [Header, Home, Footer],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<app-header /><app-home /><app-footer />'
})
class StorefrontTestHost {}

describe('Storefront integration', () => {
  let fixture: ComponentFixture<StorefrontTestHost>;
  let root: HTMLElement;
  let home: Home;
  let cart: jasmine.SpyObj<Pick<Cart, 'addItem'>>;
  let cartItems: WritableSignal<CartItem[]>;
  let cartCount: ReturnType<typeof signal<number>>;
  let cartTotal: ReturnType<typeof signal<number>>;
  let messages: UserMessageService;

  beforeEach(async () => {
    cart = jasmine.createSpyObj('Cart', ['addItem']);
    cartItems = signal<CartItem[]>([]);
    cartCount = signal(0);
    cartTotal = signal(0);
    cart.addItem.and.callFake(item => {
      const currentItems = cartItems();
      const existing = currentItems.find(current => current.id === item.id);
      cartItems.set(existing
        ? currentItems.map(current => current.id === item.id
          ? { ...current, quantity: current.quantity + item.quantity }
          : current)
        : [...currentItems, { ...item }]);
      cartCount.set(cartItems().reduce((count, current) => count + current.quantity, 0));
      cartTotal.set(cartItems().reduce((total, current) => total + current.price * current.quantity, 0));
    });
    await TestBed.configureTestingModule({
      imports: [StorefrontTestHost],
      providers: [
        provideRouter([]),
        {
          provide: Cart,
          useValue: {
            ...cart, totalCount: cartCount, total: cartTotal,
            getCartItems: () => cartItems
          }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(StorefrontTestHost);
    fixture.detectChanges();
    root = fixture.nativeElement;
    home = fixture.debugElement.query(By.directive(Home)).componentInstance;
    messages = TestBed.inject(UserMessageService);
    messages.clear();
    spyOn(root.querySelector('#catalogo-productos')!, 'scrollIntoView');
  });

  function clickButton(selector: string, label: string): void {
    const button = Array.from(root.querySelectorAll<HTMLButtonElement>(selector))
      .find(element => element.textContent?.trim() === label);
    expect(button).withContext(`Missing button: ${label}`).toBeDefined();
    button!.click();
    fixture.detectChanges();
  }

  it('shows new arrivals on Inicio and connects catalog navigation to the real listing', () => {
    const pricing = TestBed.inject(PricingService);
    const heading = () => root.querySelector('#catalogo-productos h1')?.textContent?.trim();
    expect(heading()).toBe('Vinilos');
    TestBed.inject(CatalogFilterService).setFilters(['NOVEDADES']);
    fixture.detectChanges();
    expect(heading()).toBe('Novedades');
    expect(home.listing.filteredProducts).toEqual(home.listing.products
      .filter(product => product.stock > 0 && product.isNew));
    clickButton('header nav button', 'Ofertas');
    expect(heading()).toBe('Ofertas');
    expect(home.listing.filteredProducts).toEqual(home.listing.products
      .filter(product => product.stock > 0 && pricing.hasDiscount(product)));
    clickButton('header nav button', 'CDs');
    expect(heading()).toBe('CDs');
    expect(home.listing.filteredProducts).toEqual([]);
    expect(root.querySelector('app-home')?.textContent).toContain('No encontramos productos');
    clickButton('footer nav button', 'Vinilos');
    expect(heading()).toBe('Vinilos');
    expect(home.listing.filteredProducts.every(product => product.details.format === 'vinyl')).toBeTrue();
    clickButton('footer nav button', 'Novedades');
    expect(home.listing.selectedFilters.collection).toBe('new');
    clickButton('footer nav button', 'Ofertas');
    expect(home.listing.selectedFilters.collection).toBe('offers');
    clickButton('footer nav button', 'CDs');
    expect(home.listing.visibleProducts).toEqual([]);
    root.querySelector<HTMLAnchorElement>('footer a[aria-label="Metaluxe, inicio"]')!.click();
    fixture.detectChanges();
    expect(home.listing.activeFilters).toEqual([]);
    expect(root.querySelectorAll('app-product-card').length).toBe(9);
  });

  it('synchronizes header search, Home reset, sorting and pending pagination', fakeAsync(() => {
    tick();
    const search = root.querySelector<HTMLInputElement>('header input[type="search"]')!;
    root.querySelector<HTMLButtonElement>('[aria-controls="catalog-grid"]')!.click();
    search.value = 'Gojira';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
    expect(root.querySelectorAll('app-product-card').length).toBe(2);
    expect(home.listing.isLoadingMore).toBeFalse();
    root.querySelector<HTMLButtonElement>('[aria-label="Quitar filtro: Búsqueda: Gojira"]')!.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(search.value).toBe('');
    expect(root.querySelectorAll('app-product-card').length).toBe(9);
    root.querySelector<HTMLButtonElement>('#sort')!.click();
    fixture.detectChanges();
    clickButton('[role="option"]', 'Mayor precio');
    const prices = home.listing.visibleProducts.map(product => home.getProductPrice(product));
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
    expect(root.querySelector('[role="listbox"]')).toBeNull();
    root.querySelector<HTMLButtonElement>('[aria-controls="catalog-grid"]')!.click();
    tick(300);
    fixture.detectChanges();
    expect(root.querySelectorAll('app-product-card').length).toBe(18);
    root.querySelector<HTMLAnchorElement>('header a[aria-label="Metaluxe, inicio"]')!.click();
    tick();
    fixture.detectChanges();
    expect(home.listing.activeFilters).toEqual([]);
    expect(root.querySelector('#catalogo-productos h1')?.textContent?.trim()).toBe('Vinilos');
    expect(root.querySelectorAll('app-product-card').length).toBe(9);
  }));

  it('opens and closes the actual detail modal and preserves purchase from a card', () => {
    const product = home.listing.visibleProducts[0];
    root.querySelector<HTMLButtonElement>('app-product-card button[aria-label]')!.click();
    fixture.detectChanges();
    expect(root.querySelector('[aria-label="Detalle del producto"] h2')?.textContent).toContain(product.name);
    root.querySelector<HTMLButtonElement>('[aria-label="Cerrar detalle"]')!.click();
    fixture.detectChanges();
    expect(root.querySelector('[aria-label="Detalle del producto"]')).toBeNull();
    expect(home.selectedProduct).toBeNull();
    root.querySelector<HTMLButtonElement>('app-product-card button[aria-label^="Agregar al carrito:"]')!.click();
    fixture.detectChanges();
    expect(cart.addItem).toHaveBeenCalledWith({
      id: product.id, name: product.name, price: home.getProductPrice(product), originalPrice: product.price,
      image: product.images[0], quantity: 1
    });
    expect(root.querySelector('[aria-label="Abrir carrito"] span')?.textContent?.trim()).toBe('1');
    expect(root.querySelector('[role="dialog"]')).toBeNull();
    expect(messages.messages().at(-1)?.text).toBe('Agregado al carrito');
  });

  it('adds a product to the cart from the detail modal', () => {
    const product = home.listing.visibleProducts[0];
    root.querySelector<HTMLButtonElement>('app-product-card button[aria-label]')!.click();
    fixture.detectChanges();
    root.querySelector<HTMLButtonElement>('.detail-purchase button')!.click();
    fixture.detectChanges();

    expect(cart.addItem).toHaveBeenCalledWith({
      id: product.id, name: product.name, price: home.getProductPrice(product), originalPrice: product.price,
      image: product.images[0], quantity: 1
    });
    expect(root.querySelector('[aria-label="Abrir carrito"] span')?.textContent?.trim()).toBe('1');
    expect(root.querySelector('[role="dialog"]')).toBeNull();
    expect(messages.messages().at(-1)?.text).toBe('Agregado al carrito');
  });
});
