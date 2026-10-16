import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CatalogFilterService } from '../../../../core/services/catalog-filter/catalog-filter';

@Component({
  standalone: true,
  selector: 'app-footer',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.html'
})
export class Footer {
  private readonly filterService = inject(CatalogFilterService);
  private readonly document = inject(DOCUMENT);
  readonly year = new Date().getFullYear();
  email = '';
  consent = false;
  subscriptionMessage = '';
  subscriptionError = '';
  readonly subscriptionKey = 'metaluxe-demo-subscription';
  readonly catalogLinks = [
    { label: 'Vinilos', filter: 'Vinilo' },
    { label: 'CDs', filter: 'CD' }
  ];
  readonly collectionLinks = [
    { label: 'Novedades', filter: 'NOVEDADES' },
    { label: 'Ofertas', filter: 'OFERTAS' }
  ];

  selectFilter(filter: string): void {
    this.filterService.setFilters([filter]);
    this.scrollToCatalog();
  }

  showCatalog(): void {
    this.filterService.clearFilters();
    this.scrollToCatalog();
  }

  subscribe(form: NgForm): void {
    this.subscriptionMessage = '';
    this.subscriptionError = '';
    if (form.invalid || !this.consent) {
      this.subscriptionError = 'Ingresa un correo válido y acepta el consentimiento de demostración.';
      return;
    }
    try {
      const storage = this.document.defaultView?.localStorage;
      if (!storage) throw new DOMException('Local storage unavailable', 'SecurityError');
      storage.setItem(this.subscriptionKey, JSON.stringify({
        email: this.email.trim(),
        consent: true,
        consentVersion: 'demo-v1',
        consentedAt: new Date().toISOString()
      }));
    } catch (error) {
      if (!(error instanceof DOMException)) throw error;
      this.subscriptionError = 'No se pudo guardar en este navegador. Revisa los permisos de almacenamiento e inténtalo de nuevo.';
      return;
    }
    this.subscriptionMessage = 'Registro de demostración guardado solo en este navegador. No recibirás correos.';
    form.resetForm({ email: '', consent: false });
  }

  removeSubscription(): void {
    this.subscriptionMessage = '';
    this.subscriptionError = '';
    try {
      const storage = this.document.defaultView?.localStorage;
      if (!storage) throw new DOMException('Local storage unavailable', 'SecurityError');
      storage.removeItem(this.subscriptionKey);
    } catch (error) {
      if (!(error instanceof DOMException)) throw error;
      this.subscriptionError = 'No se pudo eliminar el registro local. Revisa los permisos de almacenamiento.';
      return;
    }
    this.subscriptionMessage = 'Registro local eliminado. No queda una suscripción de demostración en este navegador.';
  }

  private scrollToCatalog(): void {
    this.document.getElementById('catalogo-productos')?.scrollIntoView({ block: 'start' });
  }
}