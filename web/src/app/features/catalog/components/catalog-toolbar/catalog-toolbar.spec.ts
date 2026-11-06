import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogToolbar } from './catalog-toolbar';

describe('CatalogToolbar', () => {
  let fixture: ComponentFixture<CatalogToolbar>;
  let root: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CatalogToolbar] }).compileComponents();
    fixture = TestBed.createComponent(CatalogToolbar);
    fixture.componentRef.setInput('sortOptions', [{ label: 'Menor precio', value: 'price_asc' }]);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  it('rotates the sort SVG arrow when opening and closing the menu', () => {
    const toggle = root.querySelector<HTMLButtonElement>('#sort')!;
    const arrow = toggle.querySelector('svg')!;
    expect(arrow.classList.contains('rotate-180')).toBeFalse();
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(arrow.classList.contains('rotate-180')).toBeTrue();
    expect(root.querySelector('[role="listbox"]')).not.toBeNull();
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(arrow.classList.contains('rotate-180')).toBeFalse();
    expect(root.querySelector('[role="listbox"]')).toBeNull();
  });

  it('emits the selected sort and closes on selection or outside click', () => {
    spyOn(fixture.componentInstance.sortChange, 'emit');
    root.querySelector<HTMLButtonElement>('#sort')!.click();
    fixture.detectChanges();
    root.querySelector<HTMLButtonElement>('[role="option"]')!.click();
    expect(fixture.componentInstance.sortChange.emit).toHaveBeenCalledWith('price_asc');
    expect(fixture.componentInstance.sortMenuOpen).toBeFalse();
    root.querySelector<HTMLButtonElement>('#sort')!.click();
    document.dispatchEvent(new MouseEvent('click'));
    expect(fixture.componentInstance.sortMenuOpen).toBeFalse();
  });

  it('keeps the counter, chip group and clear control as direct siblings', () => {
    const filter = { kind: 'formats' as const, value: 'Vinilo', label: 'Vinilo' };
    fixture.componentRef.setInput('activeFilters', [filter]);
    spyOn(fixture.componentInstance.removeFilter, 'emit');
    spyOn(fixture.componentInstance.clearFilters, 'emit');
    fixture.detectChanges();
    const counter = root.querySelector('#catalog-results')!;
    const chips = root.querySelector('[aria-label="Filtros activos"]')!;
    const clear = chips.nextElementSibling as HTMLButtonElement;
    expect(counter.parentElement).toBe(chips.parentElement);
    expect(clear.parentElement).toBe(counter.parentElement);
    expect(counter.parentElement!.classList.contains('lg:flex-nowrap')).toBeTrue();
    expect(clear.textContent?.trim()).toBe('Limpiar todo');
    chips.querySelector<HTMLButtonElement>('button')!.click();
    clear.click();
    expect(fixture.componentInstance.removeFilter.emit).toHaveBeenCalledWith(filter);
    expect(fixture.componentInstance.clearFilters.emit).toHaveBeenCalled();
  });
});
