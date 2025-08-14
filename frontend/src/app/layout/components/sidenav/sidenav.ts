import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, HostListener, inject, Input, Output, OnInit } from '@angular/core';
import { MenuFilter, FiltroList } from '../../../core/services/menufilter/menu-filter';
import { Auth } from '../../../core/services/auth/auth';
import { FormsModule } from '@angular/forms';

declare var lucide: any;
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sidenav.html'
})
export class Sidenav implements OnInit, AfterViewInit {

  // Inyectamos el servicio de autenticación
  private authService = inject(Auth);
  
  constructor(private filterService: MenuFilter) {
  }

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() filterByOffer = new EventEmitter<void>();
  
  // Propiedad para almacenar la lista de filtros del servicio, ya filtrada
  filteredFiltroList: FiltroList[] = [];
  
  // Propiedad para los filtros seleccionados, obtenida del servicio
  selectedFilters: string[] = [];

  ngOnInit(): void {
    const currentUserRole = this.authService.getUserRole();

    // ⬇️ Lógica para filtrar los filtros basándose en el rol del usuario y si están habilitados
    // Esta lista se obtiene directamente del servicio, no de una copia en el componente.
    this.filteredFiltroList = this.filterService.filtroList.filter(item =>
      (item.roles.includes(currentUserRole)) && item.enabled
    );
    
    // Suscribimos para obtener los filtros seleccionados en tiempo real
    this.filterService.filters$.subscribe(filters => {
      this.selectedFilters = filters;
    });
  }

  ngAfterViewInit(): void {
    lucide.createIcons();
  }

  /**
   * Maneja el cambio de selección en los filtros y actualiza el servicio.
   * @param option La opción de filtro seleccionada/deseleccionada.
   */
  onFilterChange(option: string): void {
    const updatedFilters = this.selectedFilters.includes(option)
      ? this.selectedFilters.filter(f => f !== option)
      : [...this.selectedFilters, option];

    // ✅ Le decimos al servicio que los filtros han cambiado
    this.filterService.setFilters(updatedFilters);
  }

  /**
   * Verifica si una opción de filtro está seleccionada.
   * @param option La opción a verificar.
   */
  isFilterSelected(option: string): boolean {
    return this.selectedFilters.includes(option);
  }
  
  onCloseClick() {
    this.close.emit();
  }

  onOfferClick(): void {
    this.filterService.setFilters(['OFERTAS']); // Actualiza el servicio con el filtro de ofertas
    this.close.emit();
  }
}
