export interface AdminNavigationItem {
  label: string;
  route?: string;
}

export const adminNavigationItems: AdminNavigationItem[] = [
  { label: 'Inicio', route: '/admin' },
  { label: 'Campañas', route: '/admin/campaigns' },
  { label: 'Productos', route: '/admin/products' },
  { label: 'Usuarios', route: '/admin/users' },
  { label: 'Reportes', route: '/admin/reports' },
  { label: 'Ajustes', route: '/admin/settings' }
];