import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule, Menu, X } from 'lucide-angular';
import { adminNavigationItems } from '../../features/administration/config/admin-navigation';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  imports: [CommonModule, LucideAngularModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.html'
})
export class AdminLayout {
  readonly navigationItems = adminNavigationItems;
  readonly menuIcon = Menu;
  readonly closeIcon = X;
  isSidebarOpen = false;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}