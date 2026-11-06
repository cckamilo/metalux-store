
import { Component, EventEmitter, HostListener, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ActiveFilters } from '../active-filters/active-filters';
import { ActiveFilter } from '../../services/catalog-listing.facade';

/**
 * Presenta el resumen de resultados y el selector de orden.
 * Solo administra la apertura del menu; la fachada calcula resultados y aplica el orden.
 */
@Component({
  selector: 'app-catalog-toolbar',
  standalone: true,
  imports: [ActiveFilters],
  host: { class: 'relative z-40 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between' },
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './catalog-toolbar.html'
})
export class CatalogToolbar {
  /** Cantidad del bloque visible, que puede ser menor que el total por la paginacion. */
  @Input() visibleCount = 0;
  /** Total de coincidencias antes de limitar los productos visibles. */
  @Input() totalCount = 0;
  /** Selecciones que acompanan al contador; las acciones se delegan al contenedor. */
  @Input() activeFilters: readonly ActiveFilter[] = [];
  @Output() removeFilter = new EventEmitter<ActiveFilter>();
  @Output() clearFilters = new EventEmitter<void>();
  /** Criterio aplicado por el contenedor, utilizado para marcar la opcion seleccionada. */
  @Input() selectedSort = 'relevance';
  /** Texto del criterio actual calculado por la fachada. */
  @Input() selectedSortLabel = '';
  /** Criterios disponibles; sus valores se devuelven sin traducirlos a reglas de ordenamiento. */
  @Input() sortOptions: readonly { label: string; value: string }[] = [];
  /** Solicita al contenedor cambiar el orden; no modifica productos ni paginacion directamente. */
  @Output() sortChange = new EventEmitter<string>();
  sortMenuOpen = false;

  /** Cierra el menu al pulsar fuera, sin cancelar acciones nativas de otros controles. */
  @HostListener('document:click')
  closeSortMenu(): void {
    this.sortMenuOpen = false;
  }

  /** Emite el criterio al contenedor y cierra el desplegable local. */
  selectSort(value: string): void {
    this.sortChange.emit(value);
    this.closeSortMenu();
  }
}
