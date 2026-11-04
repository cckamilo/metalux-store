import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogFilters } from './catalog-filters';

describe('CatalogFilters', () => {
  let fixture: ComponentFixture<CatalogFilters>;
  let root: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CatalogFilters] }).compileComponents();
    fixture = TestBed.createComponent(CatalogFilters);
    fixture.componentRef.setInput('filters', {
      bands: { enabled: true, values: [] },
      genres: { enabled: true, values: [] },
      formats: { enabled: true, values: [] }
    });
    fixture.componentRef.setInput('bands', ['Gojira']);
    fixture.componentRef.setInput('formats', ['Vinilo', 'CD']);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  for (const panelId of ['band-filter-options', 'genre-filter-options', 'format-filter-options']) {
    it(`rotates the SVG arrow with the expanded state of ${panelId}`, () => {
      const toggle = root.querySelector<HTMLButtonElement>(`[aria-controls="${panelId}"]`)!;
      const arrow = toggle.querySelector('svg')!;
      expect(arrow.getAttribute('aria-hidden')).toBe('true');
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(arrow.classList.contains('rotate-180')).toBeTrue();
      toggle.click();
      fixture.detectChanges();
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(arrow.classList.contains('rotate-180')).toBeFalse();
      expect(root.querySelector(`#${panelId}`)).toBeNull();
      toggle.click();
      fixture.detectChanges();
      expect(arrow.classList.contains('rotate-180')).toBeTrue();
      expect(root.querySelector(`#${panelId}`)).not.toBeNull();
    });
  }

  it('emits selections without mutating its inputs', () => {
    spyOn(fixture.componentInstance.selectionChange, 'emit');
    root.querySelector<HTMLInputElement>('#band-options-list input')!.click();
    expect(fixture.componentInstance.selectionChange.emit)
      .toHaveBeenCalledWith({ group: 'bands', value: 'Gojira', selected: true });
    expect(fixture.componentInstance.filters.bands.values).toEqual([]);
  });

  it('closes the mobile panel and restores focus to its toggle', () => {
    const toggle = root.querySelector<HTMLButtonElement>('[aria-controls="catalog-filters"]')!;
    toggle.click();
    fixture.detectChanges();
    root.querySelector<HTMLButtonElement>('aside button.lg\\:hidden')!.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);
  });
});
