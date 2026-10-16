import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CatalogFilterService } from '../../../../core/services/catalog-filter/catalog-filter';

@Component({
  standalone: true,
  selector: 'app-admin-settings',
  imports: [CommonModule],
  template: `
    <section aria-labelledby="settings-title" class="space-y-6">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Administración</p>
        <h1 id="settings-title" class="mt-2 text-3xl font-semibold tracking-tight">Ajustes</h1>
      </div>

      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="mb-6">
          <h2 class="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">Configuración de filtros</h2>
          <div class="space-y-4">
            <label class="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <span class="text-sm text-gray-700">Bandas</span>
              <input type="checkbox" [checked]="filterState.bands.enabled" (change)="toggleFilter('bands', $event)" class="h-4 w-4 accent-black" />
            </label>

            <label class="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <span class="text-sm text-gray-700">Géneros</span>
              <input type="checkbox" [checked]="filterState.genres.enabled" (change)="toggleFilter('genres', $event)" class="h-4 w-4 accent-black" />
            </label>

            <div class="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
              Si desactiva este filtro, la sección de géneros desaparece de la home automáticamente.
            </div>

            <label class="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <span class="text-sm text-gray-700">Formato</span>
              <input type="checkbox" [checked]="filterState.formats.enabled" (change)="toggleFilter('formats', $event)" class="h-4 w-4 accent-black" />
            </label>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <span class="text-sm text-gray-700">Activar promociones automáticas</span>
            <span class="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">Activo</span>
          </div>
          <div class="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <span class="text-sm text-gray-700">Notificaciones por email</span>
            <span class="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">Configurado</span>
          </div>
          <div class="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <span class="text-sm text-gray-700">Modo mantenimiento</span>
            <span class="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">Desactivado</span>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AdminSettings {
  constructor(private filterService: CatalogFilterService) {}

  get filterState() {
    return this.filterService.getFilters();
  }

  toggleFilter(group: 'bands' | 'genres' | 'formats', event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.filterService.setFilterGroupState(group, checked);
  }
}
