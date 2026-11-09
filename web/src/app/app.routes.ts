import { Routes } from '@angular/router';
import { MainLayout } from './layouts/customer-layout/components/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/home/home-landing').then(m => m.HomeLanding)
      },
      {
        path: 'vinilos',
        loadComponent: () =>
          import('./features/home/home').then(m => m.Home)
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/administration/pages/admin-home/admin-home').then(m => m.AdminHome)
      },
      {
        path: 'campaigns',
        loadComponent: () =>
          import('./features/administration/pages/admin-campaigns/admin-campaigns').then(m => m.AdminCampaigns)
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/administration/pages/admin-products/admin-products').then(m => m.AdminProducts)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/administration/pages/admin-users/admin-users').then(m => m.AdminUsers)
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/administration/pages/admin-reports/admin-reports').then(m => m.AdminReports)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/administration/pages/admin-settings/admin-settings').then(m => m.AdminSettings)
      }
    ]
  }
];
