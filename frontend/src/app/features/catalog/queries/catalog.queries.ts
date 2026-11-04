import { CatalogFilterState } from '../../../core/services/catalog-filter/catalog-filter';
import { MusicProduct } from '../domain/product.model';

/**
 * Consultas del catalogo independientes de componentes, almacenamiento e inyeccion de Angular.
 * Trabajan sobre los datos recibidos sin modificar los arreglos originales.
 * Las reglas de precios y descuentos se delegan mediante callbacks al servicio comercial.
 */

/** Elimina diacriticos y convierte a minusculas para comparar textos de busqueda. */
function normalizeSearch(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/**
 * Selecciona productos con stock que cumplen la busqueda, coleccion y grupos habilitados.
 * Todas las palabras buscadas deben aparecer entre el artista y el nombre del album,
 * ignorando mayusculas, acentos y espacios adicionales.
 * Combina grupos con AND y valores de un mismo grupo con OR; ignora grupos deshabilitados.
 * Bandas y generos se comparan sin distinguir mayusculas, pero conservando los acentos.
 *
 * @param products Catalogo fuente, antes de paginar.
 * @param filters Selecciones y configuracion de los grupos.
 * @param hasDiscount Determina si el producto pertenece a ofertas usando el precio vigente.
 * @returns Un nuevo arreglo de coincidencias, conservando su orden original.
 */
export function filterProducts(
  products: readonly MusicProduct[],
  filters: CatalogFilterState,
  hasDiscount: (product: MusicProduct) => boolean
): MusicProduct[] {
  const terms = normalizeSearch(filters.searchQuery ?? '').trim().split(/\s+/).filter(Boolean);
  return products.filter(product => {
    if (product.stock <= 0) return false;
    const searchableText = normalizeSearch(`${product.details.artist} ${product.name}`);
    if (!terms.every(term => searchableText.includes(term))) return false;
    if (filters.collection === 'new' && !product.isNew) return false;
    if (filters.collection === 'offers' && !hasDiscount(product)) return false;

    if (filters.bands.enabled && filters.bands.values.length > 0 &&
      !filters.bands.values.some(band => product.details.artist.toLowerCase() === band.toLowerCase())) {
      return false;
    }
    if (filters.genres.enabled && filters.genres.values.length > 0 &&
      !filters.genres.values.some(genre => product.details.genre.toLowerCase() === genre.toLowerCase())) {
      return false;
    }
    if (filters.formats.enabled && filters.formats.values.length > 0 &&
      !filters.formats.values.some(format => product.details.format === (format === 'Vinilo' ? 'vinyl' : 'cd'))) {
      return false;
    }
    return true;
  });
}

/**
 * Ordena una copia de los productos, sin mutar el catalogo ni aplicar filtros.
 * Los criterios de precio usan el precio final proporcionado por el llamador.
 * `newest` compara fechas de lanzamiento descendentes; no usa la fecha de creacion.
 * Fechas ausentes o invalidas no reciben un orden alternativo explicito.
 * Relevancia y criterios no reconocidos usan el ID ascendente.
 *
 * @param products Resultados que se desean ordenar.
 * @param sort Criterio: price_asc, price_desc, newest o relevance.
 * @param getPrice Obtiene el precio final, incluyendo promociones aplicables.
 * @returns Un nuevo arreglo ordenado con las mismas referencias de productos.
 */
export function sortProducts(
  products: readonly MusicProduct[],
  sort: string,
  getPrice: (product: MusicProduct) => number
): MusicProduct[] {
  const sorted = [...products];
  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => getPrice(a) - getPrice(b));
    case 'price_desc':
      return sorted.sort((a, b) => getPrice(b) - getPrice(a));
    case 'newest':
      return sorted.sort((a, b) =>
        new Date(b.details.releaseDate || '').getTime() - new Date(a.details.releaseDate || '').getTime());
    default:
      return sorted.sort((a, b) => a.id - b.id);
  }
}

/**
 * Busca una subcadena en toda la lista de bandas o generos, sin limitar las filas visibles.
 * Ignora acentos, mayusculas y espacios en los extremos del termino.
 * Un termino vacio devuelve todas las opciones en una nueva lista, manteniendo su orden.
 */
export function searchFilterOptions(options: readonly string[], term: string): string[] {
  const query = normalizeSearch(term.trim());
  return options.filter(option => normalizeSearch(option).includes(query));
}

/**
 * Cuenta registros con stock positivo para un artista o genero, no unidades ni versiones.
 * Compara el valor completo sin distinguir mayusculas y devuelve cero si no hay coincidencias.
 * La independencia respecto a filtros y paginacion requiere recibir el catalogo fuente.
 */
export function countAvailableProducts(
  products: readonly MusicProduct[],
  field: 'artist' | 'genre',
  value: string
): number {
  return products.filter(product => product.stock > 0 &&
    product.details[field].toLowerCase() === value.toLowerCase()).length;
}

/**
 * Conserva las bandas recibidas que tienen al menos un producto con stock.
 * Respeta el orden de la lista de bandas; no agrega nombres ni elimina duplicados.
 */
export function getAvailableBands(products: readonly MusicProduct[], bands: readonly string[]): string[] {
  return bands.filter(band => countAvailableProducts(products, 'artist', band) > 0);
}

/**
 * Extrae generos de productos con stock, descarta nombres vacios y los ordena con localeCompare.
 * Elimina duplicados exactos; no unifica nombres con diferencias de mayusculas o espacios.
 */
export function getAvailableGenres(products: readonly MusicProduct[]): string[] {
  return [...new Set(products.filter(product => product.stock > 0)
    .map(product => product.details.genre).filter(genre => genre.trim().length > 0))]
    .sort((a, b) => a.localeCompare(b));
}
