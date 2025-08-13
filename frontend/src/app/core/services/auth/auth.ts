import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
   // Simulación: en un proyecto real, esto vendría de una API
  private userRole = 'cliente'; // Cambia 'cliente' por 'admin' para probar

  getUserRole(): string {
    return this.userRole;
  }
}
