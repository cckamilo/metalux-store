import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterOutlet } from '@angular/router';
import { Sidenav } from '../sidenav/sidenav';




@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [CommonModule, Header, Footer, RouterOutlet, Sidenav],
  templateUrl: './main-layout.html'
})
export class MainLayout {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  onCategorySelected(category: string[]) {
    console.log('Categoría seleccionada:', category);
  }

  onBackdropClick(event: MouseEvent) {
  const sidenav = document.querySelector('app-sidenav');

  // Solo cierra si el clic no fue dentro del componente
  if (sidenav && !sidenav.contains(event.target as Node)) {
    this.closeSidebar();
  }
}
}
