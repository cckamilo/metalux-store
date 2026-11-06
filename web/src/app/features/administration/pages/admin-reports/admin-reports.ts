
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-admin-reports',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section aria-labelledby="reports-title" class="space-y-6">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Administración</p>
        <h1 id="reports-title" class="mt-2 text-3xl font-semibold tracking-tight">Reportes</h1>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-gray-500">Ventas</p>
          <p class="mt-3 text-3xl font-semibold">$1.2M</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-gray-500">Pedidos</p>
          <p class="mt-3 text-3xl font-semibold">3.480</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-gray-500">Conversión</p>
          <p class="mt-3 text-3xl font-semibold">4.8%</p>
        </div>
      </div>
    </section>
  `
})
export class AdminReports {}
