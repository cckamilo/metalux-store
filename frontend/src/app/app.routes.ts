import { Routes } from '@angular/router';
import { MainLayout } from './layout/components/main-layout/main-layout'

export const routes: Routes = [
    {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home').then(m => m.Home)
      },
    //   {
    //     path: 'productos',
    //     loadComponent: () =>
    //       import('./features/productos/productos.component').then(m => m.ProductosComponent)
    //   }
    ]
  }
];
