import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogFilterService {
  private filtersSubject = new BehaviorSubject<string[]>([]);
  filters$ = this.filtersSubject.asObservable();

  readonly genreOptions = [
    'Black Metal',
    'Death Metal',
    'Heavy Metal',
    'Progressive Metal',
    'War Metal',
    'Melodic Death Metal'
  ];

  setFilters(filters: string[]): void {
    this.filtersSubject.next(filters);
  }

  getFilters(): string[] {
    return this.filtersSubject.getValue();
  }

  clearFilters(): void {
    this.filtersSubject.next([]);
  }
}