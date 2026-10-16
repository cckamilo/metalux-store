import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Representa el estado de un grupo de filtros.
// enabled indica si el grupo está disponible en la UI.
// values guarda los valores seleccionados por el usuario.
export interface FilterGroupState<T> {
  enabled: boolean;
  values: T[];
}

// Estado global del catálogo. Cada grupo de filtros funciona de forma independiente.
export interface CatalogFilterState {
  searchQuery?: string;
  collection?: 'new' | 'offers';
  bands: FilterGroupState<string>;
  genres: FilterGroupState<string>;
  formats: FilterGroupState<string>;
}

// Estado inicial del catálogo. Por defecto, los filtros están activos y sin valor seleccionado.
export const initialCatalogFilters: CatalogFilterState = {
  bands: { enabled: true, values: [] },
  genres: { enabled: true, values: [] },
  formats: { enabled: true, values: [] }
};

// Asegura que cualquier estado parcial del catálogo quede con la estructura completa.
// Esto evita errores cuando el formulario de admin o la UI entrega solo algunos valores.
function normalizeCatalogFilters(filters?: Partial<CatalogFilterState>): CatalogFilterState {
  const base = filters ?? {};

  return {
    searchQuery: base.searchQuery ?? '',
    collection: base.collection,
    bands: {
      enabled: base.bands?.enabled ?? true,
      values: base.bands?.values ?? []
    },
    genres: {
      enabled: base.genres?.enabled ?? true,
      values: base.genres?.values ?? []
    },
    formats: {
      enabled: base.formats?.enabled ?? true,
      values: base.formats?.values ?? []
    }
  };
}

@Injectable({
  providedIn: 'root'
})
export class CatalogFilterService {
  private filtersSubject = new BehaviorSubject<CatalogFilterState>(normalizeCatalogFilters(initialCatalogFilters));
  filters$ = this.filtersSubject.asObservable();

  // Umbral configurable para decidir si una lista grande de bandas debe mostrar un buscador interno.
  readonly bandSearchThreshold = 100;

  // Activa o desactiva un grupo de filtros a nivel de configuración.
  // La UI solo consume este estado; la administración decide si un filtro está disponible.
  setFilterGroupState(group: 'bands' | 'genres' | 'formats', enabled: boolean): void {
    const current = this.getFilters();
    const nextGroup = { ...current[group], enabled };
    this.filtersSubject.next({ ...current, [group]: nextGroup });
  }

  // Permite actualizar varios grupos de filtros con una sola configuración parcial.
  // Es útil para administración o carga inicial desde una fuente externa.
  setCatalogFilterConfiguration(config: Partial<CatalogFilterState>): void {
    const current = this.getFilters();
    this.filtersSubject.next(normalizeCatalogFilters({
      ...current,
      ...config,
      bands: { ...current.bands, ...config.bands },
      genres: { ...current.genres, ...config.genres },
      formats: { ...current.formats, ...config.formats }
    }));
  }

  // Restaura la configuración base del catálogo para volver a su estado inicial.
  resetCatalogFilterConfiguration(): void {
    this.filtersSubject.next(normalizeCatalogFilters(initialCatalogFilters));
  }

  // Lista de respaldo para bandas cuando no hay datos cargados desde los productos.
  private readonly defaultBandOptions = [
    'Gojira',
    'At The Gates',
    'Blasphemy',
    'Rotting Christ',
    'Entombed',
    'Mercyful Fate',
    'Carcass',
    'Bathory',
    'Mayhem',
    'Dark Tranquillity'
  ];

  // Opciones actuales para el filtro de bandas. Se alimentan desde productos para mantenerlas actualizadas.
  bandOptions: string[] = [...this.defaultBandOptions];

  // Genera la lista de bandas reales a partir de los artistas de los productos.
  // Elimina duplicados y usa una lista base solo como fallback.
  hydrateBandOptionsFromProducts(products: Array<{ details?: { artist?: string } }>): void {
    const artists = products
      .map(product => product.details?.artist)
      .filter((artist): artist is string => typeof artist === 'string' && artist.trim().length > 0);

    const uniqueArtists = [...new Set(artists)].sort((a, b) => a.localeCompare(b));
    this.bandOptions = uniqueArtists.length > 0 ? uniqueArtists : [...this.defaultBandOptions];
  }

  // Opciones actuales para géneros. Actualmente se mantienen como catálogo fijo, pero podrían derivarse desde productos.
  readonly genreOptions = [
    'Black Metal',
    'Death Metal',
    'Heavy Metal',
    'Progressive Metal',
    'War Metal',
    'Melodic Death Metal'
  ];

  // Opciones actuales para formatos de producto.
  readonly formatOptions = ['Vinilo', 'CD'];

  // Recibe un conjunto de filtros y reemplaza el estado actual por uno normalizado.
  setFilters(filters: string[]): void {
    const current = this.getFilters();
    const nextState: CatalogFilterState = {
      collection: filters.includes('NOVEDADES') ? 'new' : filters.includes('OFERTAS') ? 'offers' : undefined,
      bands: {
        enabled: current.bands.enabled,
        values: filters.filter(filter => this.bandOptions.includes(filter))
      },
      genres: {
        enabled: current.genres.enabled,
        values: filters.filter(filter => this.genreOptions.includes(filter))
      },
      formats: {
        enabled: current.formats.enabled,
        values: filters.filter(filter => filter === 'Vinilo' || filter === 'CD')
      }
    };

    this.filtersSubject.next(normalizeCatalogFilters(nextState));
  }

  setSearchQuery(searchQuery: string): void {
    this.filtersSubject.next({ ...this.getFilters(), searchQuery });
  }

  // Devuelve el estado actual del catálogo, siempre con la estructura completa.
  getFilters(): CatalogFilterState {
    return normalizeCatalogFilters(this.filtersSubject.getValue());
  }

  // Agrega o elimina una banda de la selección actual.
  toggleBand(band: string, selected: boolean): void {
    const current = this.getFilters();
    const nextBands = selected
      ? [...new Set([...current.bands.values, band])]
      : current.bands.values.filter(item => item !== band);

    this.filtersSubject.next({
      ...current,
      bands: { ...current.bands, values: nextBands }
    });
  }

  // Agrega o elimina un género de la selección actual.
  toggleGenre(genre: string, selected: boolean): void {
    const current = this.getFilters();
    const nextGenres = selected
      ? [...new Set([...current.genres.values, genre])]
      : current.genres.values.filter(item => item !== genre);

    this.filtersSubject.next({
      ...current,
      genres: { ...current.genres, values: nextGenres }
    });
  }

  // Agrega o elimina un formato de la selección actual.
  toggleFormat(format: string, selected: boolean): void {
    const current = this.getFilters();
    const nextFormats = selected
      ? [...new Set([...current.formats.values, format])]
      : current.formats.values.filter(item => item !== format);

    this.filtersSubject.next({
      ...current,
      formats: { ...current.formats, values: nextFormats }
    });
  }

  // Limpia la selección del grupo de bandas.
  clearBands(): void {
    this.filtersSubject.next({
      ...this.getFilters(),
      bands: { ...this.getFilters().bands, values: [] }
    });
  }

  // Limpia la selección del grupo de géneros.
  clearGenres(): void {
    this.filtersSubject.next({
      ...this.getFilters(),
      genres: { ...this.getFilters().genres, values: [] }
    });
  }

  // Limpia la selección del grupo de formatos.
  clearFormats(): void {
    this.filtersSubject.next({
      ...this.getFilters(),
      formats: { ...this.getFilters().formats, values: [] }
    });
  }

  // Elimina todas las selecciones y vuelve a la configuración inicial del catálogo.
  clearFilters(): void {
    this.filtersSubject.next(initialCatalogFilters);
  }
}