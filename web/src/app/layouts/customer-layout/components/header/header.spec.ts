import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { Cart } from '../../../../features/cart/services/cart';
import { CatalogFilterService } from '../../../../core/services/catalog-filter/catalog-filter';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  const count = signal(0);

  beforeEach(async () => {
    count.set(0);
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([{ path: 'vinilos', redirectTo: '/' }]),
        { provide: Cart, useValue: { totalCount: count, total: signal(0), getCartItems: () => signal([]) } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows an always-present search field and removes the public administration link', () => {
    expect(fixture.nativeElement.querySelector('input[type="search"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="/admin"]')).toBeNull();
  });

  it('updates shared search state from the input and clears it in both directions', async () => {
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="search"]');
    input.value = 'Gojira';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(TestBed.inject(CatalogFilterService).getFilters().searchQuery).toBe('Gojira');
    fixture.nativeElement.querySelector('button[aria-label="Limpiar búsqueda"]').click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(input.value).toBe('');
    TestBed.inject(CatalogFilterService).setSearchQuery('Carcass');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(input.value).toBe('Carcass');
    component.goHome();
    expect(component.searchQuery).toBe('');
  });

  it('opens mobile navigation, closes on selection and supports Escape and outside clicks', () => {
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('[aria-controls="catalog-navigation"]');
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    component.selectQuickFilter('CD');
    fixture.detectChanges();
    expect(component.isMenuOpen).toBeFalse();
    expect(TestBed.inject(CatalogFilterService).getFilters().formats.values).toEqual(['CD']);
    toggle.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.isMenuOpen).toBeFalse();
    toggle.click();
    document.dispatchEvent(new MouseEvent('click'));
    expect(component.isMenuOpen).toBeFalse();
  });

  it('shows the actual cart count and preserves opening and closing the cart', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[aria-label="Abrir carrito"]');
    expect(button.querySelector('span')).toBeNull();
    count.set(3);
    fixture.detectChanges();
    expect(button.querySelector('span')?.textContent?.trim()).toBe('3');
    button.click();
    expect(component.isCartSidebarOpen).toBeTrue();
    component.closeCartSidebar();
    expect(component.isCartSidebarOpen).toBeFalse();
  });

  it('marks the active catalog navigation and leaves Inicio out of the menu', () => {
    const filters = TestBed.inject(CatalogFilterService);
    const activeItem = () => fixture.nativeElement.querySelector('#catalog-navigation [aria-current]');
    const navigationText = fixture.nativeElement.querySelector('#catalog-navigation').textContent;
    expect(navigationText).not.toContain('Inicio');
    expect(navigationText).not.toContain('Novedades');
    expect(activeItem()).toBeNull();
    expect(fixture.nativeElement.querySelector('header a[aria-label="Metaluxe, inicio"]').classList.contains('border-black')).toBeTrue();
    filters.setFilters(['NOVEDADES']);
    fixture.detectChanges();
    expect(activeItem().textContent.trim()).toBe('Vinilos');
    expect(activeItem().classList.contains('border-black')).toBeTrue();
    filters.setFilters(['OFERTAS']);
    fixture.detectChanges();
    expect(activeItem().textContent.trim()).toBe('Ofertas');
    expect(activeItem().classList.contains('border-black')).toBeTrue();
    filters.setFilters(['Vinilo']);
    fixture.detectChanges();
    expect(activeItem().textContent.trim()).toBe('Vinilos');
    filters.setFilters(['Vinilo', 'CD']);
    fixture.detectChanges();
    const activeItems = Array.from(fixture.nativeElement.querySelectorAll('#catalog-navigation [aria-current]') as NodeListOf<HTMLElement>);
    expect(activeItems.map(item => item.textContent?.trim())).toEqual(['Vinilos', 'CDs']);
    component.goHome();
    fixture.detectChanges();
    expect(activeItem()).toBeNull();
    expect(filters.getFilters().collection).toBeUndefined();
  });
});