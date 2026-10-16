import { productsMock } from './products.mock';

describe('productsMock vinyl colors', () => {
  it('assigns integer stock between one and three to every product', () => {
    for (const product of productsMock) {
      expect(Number.isInteger(product.stock)).withContext(product.name).toBeTrue();
      expect(product.stock).withContext(product.name).toBeGreaterThanOrEqual(1);
      expect(product.stock).withContext(product.name).toBeLessThanOrEqual(3);
    }
    expect(new Set(productsMock.map(product => product.stock))).toEqual(new Set([1, 2, 3]));
  });

  it('assigns a named color with a valid hexadecimal value to every vinyl', () => {
    const vinyls = productsMock.filter(product => product.details.format === 'vinyl');

    expect(vinyls.length).toBe(20);
    for (const product of vinyls) {
      const color = product.details.vinylColor;
      expect(color).withContext(product.name).toBeDefined();
      expect(color?.name.trim().length).withContext(product.name).toBeGreaterThan(0);
      expect(color?.hex).withContext(product.name).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('associates the blue edition with The Way of All Flesh', () => {
    const product = productsMock.find(product => product.name === 'The Way of All Flesh');

    expect(product?.details.vinylColor).toEqual({ name: 'Azul', hex: '#2450dc' });
  });

  it('preserves mixed finishes and picture disc labels', () => {
    const colorNames = productsMock.map(product => product.details.vinylColor?.name);

    expect(colorNames).toContain('Negro y amarillo splatter');
    expect(colorNames).toContain('Negro y rojo splatter');
    expect(colorNames).toContain('Azul marmoleado');
    expect(colorNames).toContain('Picture disc (ilustrado)');
  });

  it('links the three Left Hand Path colors to their gallery images', () => {
    const product = productsMock.find(product => product.name === 'Left Hand Path')!;

    expect(product.details.vinylColors).toEqual([
      { name: 'Negro', hex: '#111111', imageIndex: 0 },
      { name: 'Azul marmoleado', hex: '#537cc9', imageIndex: 1 },
      { name: 'Amarillo dorado', hex: '#b4a132', imageIndex: 2 }
    ]);
    for (const color of product.details.vinylColors!) {
      expect(product.images[color.imageIndex]).withContext(color.name).toBeDefined();
    }
  });
});
