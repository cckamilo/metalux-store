
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ActiveFilter } from '../../services/catalog-listing.facade';

/**
 * Presenta las selecciones activas como etiquetas removibles (chips).
 * No aplica filtros: emite acciones que la barra reenvia al Home.
 * Proyecta el contador junto a los chips; sin selecciones conserva solo el contador.
 */
@Component({
  selector: 'app-active-filters',
  standalone: true,
  imports: [],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './active-filters.html'
})
export class ActiveFilters {
  /** Selecciones calculadas por la fachada; este componente no modifica la lista. */
  @Input() filters: readonly ActiveFilter[] = [];
  /** Solicita quitar solo el chip pulsado, conservando las demas selecciones. */
  @Output() remove = new EventEmitter<ActiveFilter>();
  /** Solicita limpiar todas las selecciones; el contenedor conserva orden y configuracion. */
  @Output() clear = new EventEmitter<void>();

  /**
   * Identifica cada chip por grupo y valor para reutilizar su elemento al actualizar la lista.
   * Incluir el grupo evita confundir selecciones con el mismo texto en filtros distintos.
   */
  trackFilter(_index: number, filter: ActiveFilter): string {
    return `${filter.kind}:${filter.value}`;
  }
}
