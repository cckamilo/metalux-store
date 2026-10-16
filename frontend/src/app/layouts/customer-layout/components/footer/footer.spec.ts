import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';
import { provideRouter } from '@angular/router';
import { CatalogFilterService } from '../../../../core/services/catalog-filter/catalog-filter';
import { By } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Footer], providers: [provideRouter([])] }).compileComponents();
    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the real logo, current year and clearly labelled fictional information', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('img')?.getAttribute('src')).toBe('assets/images/img-1.png');
    expect(element.textContent).toContain(String(new Date().getFullYear()));
    expect(element.querySelectorAll('nav').length).toBe(2);
    expect(element.querySelector('a[href="#"]')).toBeNull();
    expect(element.textContent).toContain('Datos ficticios');
    expect(element.textContent).toContain('Sin validez comercial');
    expect(element.querySelector('a[href="https://example.com/metaluxe-instagram"]')).not.toBeNull();
  });

  it('requires a valid email and explicit consent before saving locally', async () => {
    const save = spyOn(Storage.prototype, 'setItem');
    await fixture.whenStable();
    const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
    component.subscribe(form);
    expect(save).not.toHaveBeenCalled();
    expect(component.subscriptionError).toContain('correo válido');
    form.setValue({ email: 'invalid', consent: true });
    component.subscribe(form);
    expect(save).not.toHaveBeenCalled();
    form.setValue({ email: 'collector@example.com', consent: false });
    component.subscribe(form);
    expect(save).not.toHaveBeenCalled();
    form.setValue({ email: 'collector@example.com', consent: true });
    component.subscribe(form);
    expect(save).toHaveBeenCalledTimes(1);
    const [key, json] = save.calls.mostRecent().args;
    expect(key).toBe(component.subscriptionKey);
    const record = JSON.parse(json);
    expect(record.email).toBe('collector@example.com');
    expect(record.consent).toBeTrue();
    expect(record.consentVersion).toBe('demo-v1');
    expect(Number.isNaN(Date.parse(record.consentedAt))).toBeFalse();
    expect(component.subscriptionMessage).toContain('No recibirás correos');
    expect(component.email).toBe('');
    expect(component.consent).toBeFalse();
  });

  it('reports storage failures without pretending a successful subscription', async () => {
    spyOn(Storage.prototype, 'setItem').and.throwError(new DOMException('blocked', 'SecurityError'));
    await fixture.whenStable();
    const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
    form.setValue({ email: 'collector@example.com', consent: true });
    component.subscribe(form);
    expect(component.subscriptionError).toContain('No se pudo guardar');
    expect(component.subscriptionMessage).toBe('');
  });

  it('allows deleting the local record and reports deletion failures', () => {
    const remove = spyOn(Storage.prototype, 'removeItem');
    component.removeSubscription();
    expect(remove).toHaveBeenCalledWith(component.subscriptionKey);
    expect(component.subscriptionMessage).toContain('eliminado');
    remove.and.throwError(new DOMException('blocked', 'SecurityError'));
    component.removeSubscription();
    expect(component.subscriptionError).toContain('No se pudo eliminar');
    expect(component.subscriptionMessage).toBe('');
  });

  it('connects every navigation option to real catalog filters', () => {
    const filters = TestBed.inject(CatalogFilterService);
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    for (const format of ['Vinilos', 'CDs']) {
      buttons.find(button => button.textContent?.trim() === format)!.click();
      expect(filters.getFilters().formats.values).toEqual([format === 'Vinilos' ? 'Vinilo' : 'CD']);
    }
    buttons.find(button => button.textContent?.trim() === 'Novedades')!.click();
    expect(filters.getFilters().collection).toBe('new');
    buttons.find(button => button.textContent?.trim() === 'Ofertas')!.click();
    expect(filters.getFilters().collection).toBe('offers');
  });

  it('clears all selections and scrolls to the catalog when choosing Ver todo', () => {
    const filters = TestBed.inject(CatalogFilterService);
    filters.setSearchQuery('Gojira');
    filters.toggleBand('Gojira', true);
    filters.setFilters(['OFERTAS']);
    filters.setSearchQuery('Gojira');
    const catalog = document.createElement('section');
    catalog.id = 'catalogo-productos';
    const scroll = spyOn(catalog, 'scrollIntoView');
    document.body.appendChild(catalog);
    try {
      const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
      buttons.find(button => button.textContent?.trim() === 'Ver todo')!.click();
      expect(filters.getFilters().searchQuery).toBe('');
      expect(filters.getFilters().bands.values).toEqual([]);
      expect(filters.getFilters().collection).toBeUndefined();
      expect(scroll).toHaveBeenCalledWith({ block: 'start' });
    } finally {
      catalog.remove();
    }
  });
});