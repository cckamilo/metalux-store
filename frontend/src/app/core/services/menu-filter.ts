import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuFilter {

  private filtersSubject = new BehaviorSubject<string[]>([]);
  filters$ = this.filtersSubject.asObservable();

   readonly filtros = {
    categorias: ['Pines', 'Fundas', 'OFERTAS'],
    tallas: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '26', '28', '30', '32', '34', '36', '38'],
    generos: ['Rock', 'Black Metal', 'Death Metal', 'Heavy Metal', 'Thrash Metal']
  };

  setFilters(filters: string[]) {
    this.filtersSubject.next(filters);
  }

  /** ✅ Esta es la clave para que los filtros persistan en el menú */
  getFilters(): string[] {
    return this.filtersSubject.getValue();
  }

  clearFilters() {
    this.filtersSubject.next([]);
  }
}
