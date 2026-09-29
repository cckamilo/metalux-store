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
});