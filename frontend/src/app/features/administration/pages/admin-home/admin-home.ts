import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DashboardMetric {
  label: string;
  value: string;
  description: string;
  route: string;
  tone: 'neutral' | 'success' | 'warning' | 'danger';
}

@Component({
  standalone: true,
  selector: 'app-admin-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-home.html'
})
export class AdminHome {
  readonly metrics: DashboardMetric[] = [
    {
      label: 'Ventas del mes',
      value: '$1.2M',
      description: '+18.4% respecto al mes anterior',
      route: '/admin/reports',
      tone: 'success'
    },
    {
      label: 'Productos activos',
      value: '148',
      description: '12 sin stock y 9 con stock bajo',
      route: '/admin/products',
      tone: 'neutral'
    },
    {
      label: 'Campañas vigentes',
      value: '4',
      description: '2 activas y 2 programadas',
      route: '/admin/campaigns',
      tone: 'warning'
    },
    {
      label: 'Usuarios nuevos',
      value: '76',
      description: '24 pedidos pendientes de revisión',
      route: '/admin/users',
      tone: 'danger'
    }
  ];

  readonly quickLinks = [
    { label: 'Campañas', route: '/admin/campaigns' },
    { label: 'Productos', route: '/admin/products' },
    { label: 'Usuarios', route: '/admin/users' },
    { label: 'Reportes', route: '/admin/reports' },
    { label: 'Ajustes', route: '/admin/settings' }
  ];
}