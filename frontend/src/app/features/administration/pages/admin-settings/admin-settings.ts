import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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
export class AdminSettings {}
