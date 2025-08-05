import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidenav.html'
})
export class Sidenav {
  @Input() isOpen = false;
  @Input() filtroList: {
    titulo: string;
    opciones?: string[];
    subcategorias?: { nombre: string; opciones: string[] }[];
  }[] = [];


  @Output() close = new EventEmitter<void>();


  closeSidebar() {
    this.close.emit();
  }
}
