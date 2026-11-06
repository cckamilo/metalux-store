import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogFilterState } from '../../../../core/services/catalog-filter/catalog-filter';
import { searchFilterOptions } from '../../queries/catalog.queries';

export type FilterGroup = 'bands' | 'genres' | 'formats';
/** Accion de un checkbox que el Home dirige al servicio compartido de filtros. */
export interface FilterSelection {
  group: FilterGroup;
  value: string;
  selected: boolean;
}

/**
 * Presenta los grupos de filtros con una plantilla compartida.
 * Conserva solo estado visual: panel movil, grupos abiertos, busquedas y listas expandidas.
 * Las selecciones y los conteos llegan del contenedor; las acciones salen mediante eventos.
 */
@Component({
  selector: 'app-catalog-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  host: { class: 'block min-w-0 lg:sticky lg:top-[130px] lg:self-start' },
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './catalog-filters.html'
})
export class CatalogFilters {
  /** Configuracion y selecciones compartidas; se leen sin modificarlas desde la vista. */
  @Input({ required: true }) filters!: CatalogFilterState;
  @Input() bands: readonly string[] = [];
  @Input() genres: readonly string[] = [];
  @Input() formats: readonly string[] = [];
  /** Discos con stock por banda; las claves se reciben en minusculas para su consulta. */
  @Input() bandCounts: ReadonlyMap<string, number> = new Map();
  /** Discos con stock por genero; no representan unidades ni resultados de la seleccion actual. */
  @Input() genreCounts: ReadonlyMap<string, number> = new Map();
  /** Numero de chips activos que acompana al boton de filtros movil. */
  @Input() activeCount = 0;
  /** Total filtrado que muestra el boton para cerrar el panel y ver los resultados. */
  @Input() resultCount = 0;
  /** Notifica un cambio de checkbox sin duplicar el estado del servicio compartido. */
  @Output() selectionChange = new EventEmitter<FilterSelection>();
  /** Solicita limpiar un solo grupo, sin cerrar el panel ni borrar las busquedas locales. */
  @Output() clearGroup = new EventEmitter<FilterGroup>();
  showMobileFilters = false;
  readonly initialLimit = 6;
  readonly groups = [
    { key: 'bands', id: 'band', title: 'BANDAS', search: 'Buscar banda', empty: 'No se encontraron bandas.' },
    { key: 'genres', id: 'genre', title: 'GÉNEROS', search: 'Buscar género', empty: 'No se encontraron géneros.' },
    { key: 'formats', id: 'format', title: 'FORMATO', search: '', empty: '' }
  ] as const;
  readonly expanded: Record<FilterGroup, boolean> = { bands: true, genres: true, formats: true };
  readonly showAll: Record<FilterGroup, boolean> = { bands: false, genres: false, formats: false };
  readonly searchTerms: Record<FilterGroup, string> = { bands: '', genres: '', formats: '' };

  /** Obtiene las opciones recibidas; el componente no consulta productos ni calcula conteos. */
  options(group: FilterGroup): readonly string[] {
    return group === 'bands' ? this.bands : group === 'genres' ? this.genres : this.formats;
  }

  /** Busca en toda la lista, reutilizando la normalizacion del catalogo. */
  filteredOptions(group: FilterGroup): string[] {
    return searchFilterOptions(this.options(group), this.searchTerms[group]);
  }

  /** Limita bandas y generos a seis filas salvo al buscar o expandir la lista. */
  visibleOptions(group: FilterGroup): readonly string[] {
    const options = this.filteredOptions(group);
    return group === 'formats' || this.showAll[group] || this.searchTerms[group].trim()
      ? options : options.slice(0, this.initialLimit);
  }

  /** Lee el conteo del catalogo fuente, independiente de los filtros seleccionados. */
  count(group: FilterGroup, value: string): number {
    return (group === 'bands' ? this.bandCounts : this.genreCounts).get(value.toLowerCase()) ?? 0;
  }

  /** Emite la seleccion sin modificar los datos recibidos del estado compartido. */
  select(group: FilterGroup, value: string, selected: boolean): void {
    this.selectionChange.emit({ group, value, selected });
  }

  /** Construye el texto del control de expansion sin alterar la seleccion. */
  expandLabel(group: FilterGroup): string {
    if (group === 'bands') return this.showAll[group] ? 'Ver menos bandas' : 'Ver más bandas';
    return this.showAll[group] ? 'Ver menos géneros' : 'Ver más géneros';
  }
}
