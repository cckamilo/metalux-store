import { DOCUMENT } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CatalogFilterService } from '../../../../core/services/catalog-filter/catalog-filter';
import { UserMessageService } from '../../../../core/services/user-message/user-message.service';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './footer.html'
})
export class Footer {
  private readonly filterService = inject(CatalogFilterService);
  private readonly messages = inject(UserMessageService);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  readonly year = new Date().getFullYear();
  readonly storeLinks = [
    { label: 'Vinilos', filter: 'Vinilo' },
    { label: 'CDs', filter: 'CD' },
    { label: 'Novedades', filter: 'NOVEDADES' },
    { label: 'Ofertas', filter: 'OFERTAS' }
  ];
  readonly helpLinks = [
    {
      label: 'Envíos y pagos',
      message: 'Envío gratis desde $200.000. Esta tienda de demostración no procesa pagos ni entregas.'
    },
    {
      label: 'Cambios',
      message: 'La información de cambios está pendiente de definición para esta tienda de demostración.'
    },
    {
      label: 'Privacidad',
      message: 'Esta demostración guarda el carrito en tu navegador y no transmite esos datos a un servidor.'
    }
  ];

  selectFilter(filter: string): void {
    this.filterService.setFilters([filter]);
    this.navigateToCatalog('/vinilos');
  }

  showHome(): void {
    this.filterService.clearFilters();
    void this.router.navigateByUrl('/');
  }

  showHelp(title: string, message: string): void {
    this.messages.info(message, { title, duration: null });
  }

  private scrollToCatalog(): void {
    this.document.getElementById('catalogo-productos')?.scrollIntoView({ block: 'start' });
  }

  private navigateToCatalog(path: '/' | '/vinilos'): void {
    this.router.navigateByUrl(path).then(() => this.scrollToCatalog());
  }
}