import { TestBed } from '@angular/core/testing';

import { CatalogFilterService } from './catalog-filter';

describe('CatalogFilterService', () => {
  let service: CatalogFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatalogFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('keeps the selected groups when searching and clears the query on home navigation', () => {
    service.toggleBand('Gojira', true);
    service.setSearchQuery('flesh');
    expect(service.getFilters().bands.values).toEqual(['Gojira']);
    expect(service.getFilters().searchQuery).toBe('flesh');
    service.clearFilters();
    expect(service.getFilters().searchQuery).toBe('');
    expect(service.getFilters().bands.values).toEqual([]);
  });

  it('recognizes new releases and offers and resets them on format navigation', () => {
    service.setFilters(['NOVEDADES']);
    expect(service.getFilters().collection).toBe('new');
    service.setFilters(['OFERTAS']);
    expect(service.getFilters().collection).toBe('offers');
    service.setFilters(['Vinilo']);
    expect(service.getFilters().collection).toBeUndefined();
    expect(service.getFilters().formats.values).toEqual(['Vinilo']);
  });

  it('preserves search and group configuration when other settings or quick filters change', () => {
    service.setSearchQuery('Gojira');
    service.setCatalogFilterConfiguration({ bands: { enabled: false, values: [] } });
    expect(service.getFilters().searchQuery).toBe('Gojira');
    service.setFilters(['CD']);
    expect(service.getFilters().bands.enabled).toBeFalse();
    expect(service.getFilters().searchQuery).toBe('');
  });

});