// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class MenuFilter {

//   private filtersSubject = new BehaviorSubject<string[]>([]);
//   filters$ = this.filtersSubject.asObservable();

//    readonly filtros = {
//     categorias: ['Pines', 'Fundas', 'OFERTAS'],
//     tallas: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '26', '28', '30', '32', '34', '36', '38'],
//     generos: ['Rock', 'Black Metal', 'Death Metal', 'Heavy Metal', 'Thrash Metal']
//   };

//   setFilters(filters: string[]) {
//     this.filtersSubject.next(filters);
//   }

//   /** ✅ Esta es la clave para que los filtros persistan en el menú */
//   getFilters(): string[] {
//     return this.filtersSubject.getValue();
//   }

//   clearFilters() {
//     this.filtersSubject.next([]);
//   }
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Definición de las interfaces para la nueva estructura de filtros
export interface Subcategory {
  name: string;
  options: string[];
}

export interface FiltroList {
  title: string;
  options?: string[];
  subcategories?: Subcategory[];
  roles: string[];
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MenuFilter {

  private filtersSubject = new BehaviorSubject<string[]>([]);
  filters$ = this.filtersSubject.asObservable();

  // ✅ Aquí se ha agregado la estructura de filtros que proporcionaste
  filtroList: FiltroList[] = [
    {
      title: 'Géneros',
      options: ['Black Metal', 'Death Metal', 'Heavy Metal', 'Progressive Metal', 'War Metal', 'Melodic Death Metal'],
      roles: ['admin', 'cliente'],
      enabled: true,
    },
    {
      title: 'Administración',
      options: ['Usuarios', 'Reportes', 'Ajustes'],
      roles: ['admin'],
      enabled: true,
    },
  ];
  setFilters(filters: string[]) {
    this.filtersSubject.next(filters);
  }

  getFilters(): string[] {
    return this.filtersSubject.getValue();
  }

  
  clearFilters() {
    this.filtersSubject.next([]);
  }
}

