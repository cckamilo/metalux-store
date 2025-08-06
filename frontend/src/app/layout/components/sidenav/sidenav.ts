import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MenuFilter } from '../../../core/services/menu-filter';

declare var lucide: any;
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidenav.html'
})
export class Sidenav implements AfterViewInit {
  constructor(private filterService: MenuFilter) {

    this.selectedCategories = this.filterService.getFilters();
  }

  @Input() isOpen = false;
  @Output() categorySelected = new EventEmitter<string[]>();
  @Output() close = new EventEmitter<void>();
  selectedCategories: string[] = [];
  filtroList = [
    {
      title: 'Producto',
      options: ['Pines', 'Fundas', 'OFERTAS']
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
      ]
    },
    {
      title: 'Géneros',
      options: ['Rock', 'Black Metal', 'Death Metal', 'Heavy Metal', 'Thrash Metal']
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
