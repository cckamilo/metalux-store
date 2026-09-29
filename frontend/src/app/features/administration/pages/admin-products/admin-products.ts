import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-admin-products',
  imports: [CommonModule],
  template: `
    <section aria-labelledby="products-title" class="space-y-6">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Administración</p>
        <h1 id="products-title" class="mt-2 text-3xl font-semibold tracking-tight">Productos</h1>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-gray-500">Productos activos</p>
          <p class="mt-3 text-3xl font-semibold">148</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-gray-500">Sin stock</p>
          <p class="mt-3 text-3xl font-semibold">12</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p class="text-sm text-gray-500">Ingresos del mes</p>
          <p class="mt-3 text-3xl font-semibold">$540k</p>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 class="text-lg font-semibold">Catálogo</h2>
          <button type="button" class="rounded-md bg-black px-3 py-2 text-xs font-medium text-white hover:bg-gray-800">Nuevo producto</button>
        </div>

        <div class="divide-y divide-gray-200">
          <div class="grid grid-cols-5 gap-4 px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
            <span>Producto</span>
            <span>Categoría</span>
            <span>Precio</span>
            <span>Stock</span>
            <span>Estado</span>
          </div>

          <div class="grid grid-cols-5 gap-4 px-5 py-4 text-sm text-gray-700">
            <span>From Mars To Sirius</span>
            <span>Vinilos</span>
            <span>$105.000</span>
            <span>20</span>
            <span class="text-emerald-600">Activo</span>
          </div>
          <div class="grid grid-cols-5 gap-4 px-5 py-4 text-sm text-gray-700">
            <span>Slaughter of the Soul</span>
            <span>Vinilos</span>
            <span>$95.000</span>
            <span>8</span>
            <span class="text-amber-600">Poco stock</span>
          </div>
          <div class="grid grid-cols-5 gap-4 px-5 py-4 text-sm text-gray-700">
            <span>Fallen Angel Of Doom</span>
            <span>Vinilos</span>
            <span>$90.000</span>
            <span>0</span>
            <span class="text-red-600">Sin stock</span>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AdminProducts {}
