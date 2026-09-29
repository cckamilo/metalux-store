import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-admin-users',
  imports: [CommonModule],
  template: `
    <section aria-labelledby="users-title" class="space-y-6">
      <div>
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Administración</p>
        <h1 id="users-title" class="mt-2 text-3xl font-semibold tracking-tight">Usuarios</h1>
      </div>

      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div class="grid grid-cols-4 gap-4 border-b border-gray-200 px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
          <span>Nombre</span>
          <span>Email</span>
          <span>Rol</span>
          <span>Estado</span>
        </div>

        <div class="grid grid-cols-4 gap-4 px-5 py-4 text-sm text-gray-700">
          <span>Ana Torres</span>
          <span>ana@metaluxe.com</span>
          <span>Admin</span>
          <span class="text-emerald-600">Activo</span>
        </div>
        <div class="grid grid-cols-4 gap-4 px-5 py-4 text-sm text-gray-700">
          <span>Mateo Ruiz</span>
          <span>mateo@metaluxe.com</span>
          <span>Cliente</span>
          <span class="text-emerald-600">Activo</span>
        </div>
      </div>
    </section>
  `
})
export class AdminUsers {}
