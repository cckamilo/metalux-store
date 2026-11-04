import { CatalogFilterState } from '../../../core/services/catalog-filter/catalog-filter';
import { productsMock } from '../data/products.mock';
import { MusicProduct } from '../domain/product.model';
import { PricingService } from '../services/pricing.service';
import {
  countAvailableProducts, filterProducts, getAvailableBands, getAvailableGenres,
  searchFilterOptions, sortProducts
} from './catalog.queries';

describe('Catalog queries', () => {
  let filters: CatalogFilterState;
  const pricing = new PricingService();
  const hasDiscount = (product: MusicProduct) => pricing.hasDiscount(product);
  const getPrice = (product: MusicProduct) => pricing.getFinalPrice(product);

  beforeEach(() => {
    filters = {
      bands: { enabled: true, values: [] },
      genres: { enabled: true, values: [] },
      formats: { enabled: true, values: [] }
    };
  });

  it('excludes zero-stock products with and without active filters', () => {
    const product = productsMock[0];
    const products = [
      { ...product, id: 101, stock: 0 },
      { ...product, id: 102, stock: 1 },
      { ...product, id: 103, stock: 3 }
    ];
    expect(filterProducts(products, filters, hasDiscount).map(product => product.id)).toEqual([102, 103]);
    filters.bands.values = [product.details.artist];
    expect(filterProducts(products, filters, hasDiscount).map(product => product.id)).toEqual([102, 103]);
  });

  it('removes a product when its stock reaches zero and restores it when restocked', () => {
    const product = { ...productsMock[0], stock: 1 };
    expect(filterProducts([product], filters, hasDiscount)).toEqual([product]);
    product.stock = 0;
    expect(filterProducts([product], filters, hasDiscount)).toEqual([]);
    product.stock = 2;
    expect(filterProducts([product], filters, hasDiscount)).toEqual([product]);
  });

  it('searches artist and album together ignoring accents, case and extra spaces', () => {
    filters.searchQuery = '  GÓJIRA   sírius ';
    expect(filterProducts(productsMock, filters, hasDiscount).map(product => product.name))
      .toEqual(['From Mars To Sirius']);
    filters.searchQuery = 'no-such-album';
    expect(filterProducts(productsMock, filters, hasDiscount)).toEqual([]);
  });

  it('combines groups with AND and values within a group with OR, ignoring disabled groups', () => {
    filters.bands.values = ['gojira', 'CARCASS'];
    filters.genres.values = ['progressive metal'];
    filters.formats.values = ['Vinilo'];
    const result = filterProducts(productsMock, filters, hasDiscount);
    expect(result.length).toBe(2);
    expect(result.every(product => product.details.artist === 'Gojira')).toBeTrue();
    filters.searchQuery = 'necroticism';
    expect(filterProducts(productsMock, filters, hasDiscount)).toEqual([]);
    filters.genres.enabled = false;
    expect(filterProducts(productsMock, filters, hasDiscount).map(product => product.details.artist))
      .toEqual(['Carcass']);
  });

  it('distinguishes CD and vinyl formats', () => {
    const vinyl = productsMock[0];
    const cd: MusicProduct = { ...vinyl, id: 100, details: { ...vinyl.details, format: 'cd' } };
    filters.formats.values = ['CD'];
    expect(filterProducts([vinyl, cd], filters, hasDiscount)).toEqual([cd]);
    filters.formats.values = ['Vinilo', 'CD'];
    expect(filterProducts([vinyl, cd], filters, hasDiscount)).toEqual([vinyl, cd]);
  });

  it('uses actual new flags and delegates offer eligibility to pricing', () => {
    filters.collection = 'new';
    expect(filterProducts(productsMock, filters, hasDiscount))
      .toEqual(productsMock.filter(product => product.stock > 0 && product.isNew));
    filters.collection = 'offers';
    expect(filterProducts(productsMock, filters, hasDiscount))
      .toEqual(productsMock.filter(product => product.stock > 0 && hasDiscount(product)));
  });

  it('sorts by final price in both directions without changing the source array', () => {
    const products = [productsMock[0], productsMock[1], productsMock[2]];
    const original = [...products];
    const prices = products.map(getPrice);
    expect(sortProducts(products, 'price_asc', getPrice).map(getPrice))
      .toEqual([...prices].sort((a, b) => a - b));
    expect(sortProducts(products, 'price_desc', getPrice).map(getPrice))
      .toEqual([...prices].sort((a, b) => b - a));
    expect(products).toEqual(original);
    expect(sortProducts(products, 'price_asc', getPrice)).not.toBe(products);
  });

  it('sorts by release date and preserves ID-based relevance', () => {
    const older: MusicProduct = {
      ...productsMock[0], id: 2, details: { ...productsMock[0].details, releaseDate: '2000-01-01' }
    };
    const newer: MusicProduct = {
      ...productsMock[0], id: 1, details: { ...productsMock[0].details, releaseDate: '2020-01-01' }
    };
    expect(sortProducts([older, newer], 'newest', getPrice)).toEqual([newer, older]);
    expect(sortProducts([older, newer], 'relevance', getPrice)).toEqual([newer, older]);
    expect(sortProducts([older, newer], 'relevance', getPrice).map(product => product.id)).toEqual([1, 2]);
  });

  it('counts discs rather than stock units or vinyl editions and preserves band order', () => {
    const product = productsMock[0];
    const products = [
      { ...product, id: 101, stock: 3 },
      { ...product, id: 102, stock: 2 },
      { ...product, id: 103, stock: 0 },
      { ...productsMock[1], stock: 1 }
    ];
    expect(countAvailableProducts(products, 'artist', 'GOJIRA')).toBe(2);
    expect(countAvailableProducts(products, 'genre', product.details.genre)).toBe(2);
    expect(getAvailableBands(products, ['Missing', productsMock[1].details.artist, 'Gojira']))
      .toEqual([productsMock[1].details.artist, 'Gojira']);
    expect(countAvailableProducts(products, 'artist', 'Missing')).toBe(0);
  });

  it('derives unique sorted genres from in-stock products, excluding blank genres', () => {
    const products = ['Z Metal', 'A Metal', 'Z Metal', ' ', 'Unavailable'].map((genre, index) => ({
      ...productsMock[0], id: index, stock: index === 4 ? 0 : 1,
      details: { ...productsMock[0].details, genre }
    }));
    expect(getAvailableGenres(products)).toEqual(['A Metal', 'Z Metal']);
    expect(getAvailableGenres([])).toEqual([]);
  });

  it('shares normalized option searching across bands and genres without mutating options', () => {
    const options = ['Morbid Angel', 'Progressive Metal', 'Gojira'];
    expect(searchFilterOptions(options, '  MÓRBID ')).toEqual(['Morbid Angel']);
    expect(searchFilterOptions(options, 'prógressive')).toEqual(['Progressive Metal']);
    expect(searchFilterOptions(options, '')).toEqual(options);
    expect(searchFilterOptions(options, 'missing')).toEqual([]);
    expect(options.length).toBe(3);
  });
});
