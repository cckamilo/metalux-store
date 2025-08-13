import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, HostListener, inject, Input, Output } from '@angular/core';
import { MenuFilter } from '../../../core/services/menufilter/menu-filter';
import { Auth } from '../../../core/services/auth/auth';

declare var lucide: any;
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidenav.html'
})
export class Sidenav implements AfterViewInit {


  // Inyectamos el servicio de autenticación
  private authService = inject(Auth);

  constructor(private filterService: MenuFilter) {

    this.selectedCategories = this.filterService.getFilters();

    // ⬇️ Lógica de filtrado en el constructor
    const currentUserRole = this.authService.getUserRole();

     // ⬇️ Lógica de filtrado actualizada:
    // Ahora se verifica tanto el rol como la propiedad 'enabled'
    this.filteredFiltroList = this.filtroList.filter(item =>
      (!item.roles || item.roles.includes(currentUserRole)) && (item.enabled !== false)
    );
  }


  @Input() isOpen = false;
  @Output() categorySelected = new EventEmitter<string[]>();
  @Output() close = new EventEmitter<void>();
  selectedCategories: string[] = [];
  // 2. Creamos una nueva propiedad para almacenar el menú filtrado
  filteredFiltroList: any[] = [];
  filtroList = [
    {
      title: 'Producto',
      options: ['Pines', 'Fundas', 'OFERTAS'],
      roles: ['admin', 'cliente'], // Visible para todos
      enabled: true // ✅ Habilitado por defecto
    },
    {
      title: 'Tallas',
      subcategories: [
        {
          name: 'Superior',
          options: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        },
        {
          name: 'Inferior',
          options: ['26', '28', '30', '32', '34', '36', '38']
        }
      ],
      roles: ['admin'], // Visible para todos
      enabled: false // ✅ Habilitado por defecto
    },
    {
      title: 'Géneros',
      options: ['Rock', 'Black Metal', 'Death Metal', 'Heavy Metal', 'Thrash Metal'],
      roles: ['admin', 'cliente'], // Visible para todos
      enabled: true // ✅ Habilitado por defecto
    },
    {
      title: 'Administración',
      options: ['Usuarios', 'Reportes', 'Ajustes'],
      roles: ['admin'], // ⚠️ Solo visible para el rol 'admin'
      enabled: true // ✅ Habilitado por defecto
    }
  ];
  ngAfterViewInit(): void {
    lucide.createIcons();
  }

  onCategoryClick(option: string) {
    const index = this.selectedCategories.indexOf(option);
    if (index === -1) {
      this.selectedCategories.push(option);
    } else {
      this.selectedCategories.splice(index, 1);
    }

    // 🔁 Envía los filtros actualizados al servicio global
    this.filterService.setFilters(this.selectedCategories);
  }

  onCloseClick() {
    this.close.emit();
  }
}
