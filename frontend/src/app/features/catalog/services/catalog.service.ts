import { Injectable } from '@angular/core';
import { productsMock } from '../data/products.mock';
import { MusicProduct } from '../domain/product.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  /** Entrega el catalogo local sin filtrar; centraliza el punto de sustitucion por una API. */
  getProducts(): readonly MusicProduct[] {
    return productsMock;
  }
}
