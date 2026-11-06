import { TestBed } from '@angular/core/testing';
import { ActiveFilters } from './active-filters';

describe('ActiveFilters', () => {
  it('renders chips and emits removal and clearing without modifying inputs', async () => {
    await TestBed.configureTestingModule({ imports: [ActiveFilters] }).compileComponents();
    const fixture = TestBed.createComponent(ActiveFilters);
    const filter = { kind: 'search' as const, value: 'Gojira', label: 'Búsqueda: Gojira' };
    fixture.componentRef.setInput('filters', [filter]);
    spyOn(fixture.componentInstance.remove, 'emit');
    spyOn(fixture.componentInstance.clear, 'emit');
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    root.querySelector<HTMLButtonElement>('[aria-label="Quitar filtro: Búsqueda: Gojira"]')!.click();
    expect(fixture.componentInstance.remove.emit).toHaveBeenCalledWith(filter);
    const chips = root.querySelector('[aria-label="Filtros activos"]')!;
    const clear = chips.nextElementSibling as HTMLButtonElement;
    expect(clear.textContent?.trim()).toBe('Limpiar todo');
    expect(clear.parentElement).toBe(chips.parentElement);
    clear.click();
    expect(fixture.componentInstance.clear.emit).toHaveBeenCalled();
    expect(fixture.componentInstance.filters).toEqual([filter]);
    fixture.componentRef.setInput('filters', []);
    fixture.detectChanges();
    expect(root.querySelector('[aria-label="Filtros activos"]')).toBeNull();
  });
});
