import { TestBed } from '@angular/core/testing';

import { MenuFilter } from './menu-filter';

describe('MenuFilter', () => {
  let service: MenuFilter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuFilter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
