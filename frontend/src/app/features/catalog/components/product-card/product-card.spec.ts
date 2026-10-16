import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    fixture.componentRef.setInput('product', { ...productsMock[0], stock: 3 });
    fixture.detectChanges();
    expect(element.textContent).not.toContain('Quedan');
    fixture.componentRef.setInput('lowStockThreshold', 3);
    fixture.detectChanges();
    expect(element.textContent).toContain('Quedan 3 unidades');
  });

  it('preserves detail and purchase events', () => {
    spyOn(fixture.componentInstance.openDetails, 'emit');
    spyOn(fixture.componentInstance.addToCart, 'emit');
    element.querySelector<HTMLButtonElement>('[aria-label]')!.click();
    element.querySelector<HTMLButtonElement>('button:last-child:not([aria-label])')!.click();
    expect(fixture.componentInstance.openDetails.emit).toHaveBeenCalled();
    expect(fixture.componentInstance.addToCart.emit).toHaveBeenCalledWith(1);
  });
});
