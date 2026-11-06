
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMenu, lucideX } from '@ng-icons/lucide';
import { adminNavigationItems } from '../../features/administration/config/admin-navigation';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  imports: [NgIcon, RouterLink, RouterLinkActive, RouterOutlet],
  providers: [provideIcons({ lucideMenu, lucideX })],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './admin-layout.html'
})
export class AdminLayout {
  readonly navigationItems = adminNavigationItems;
  readonly menuIcon = 'lucideMenu';
  readonly closeIcon = 'lucideX';
  isSidebarOpen = false;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}