import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-admin-campaigns',
  imports: [CommonModule],
  template: `
    <section aria-labelledby="campaigns-title" class="space-y-6">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Administración</p>
        <h1 id="campaigns-title" class="mt-2 text-3xl font-semibold tracking-tight">Campañas</h1>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <article class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-gray-500">Campaña activa</p>
          <h2 class="mt-3 text-xl font-semibold">Weekend Metal Sale</h2>
          <p class="mt-2 text-sm text-gray-600">Descuentos del 15% en vinilos seleccionados.</p>
        </article>

        <article class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-gray-500">Próxima campaña</p>
          <h2 class="mt-3 text-xl font-semibold">New Releases</h2>
          <p class="mt-2 text-sm text-gray-600">Lanzamientos recientes con foco en black metal y death metal.</p>
        </article>
      </div>
    </section>
  `
})
export class AdminCampaigns {}
