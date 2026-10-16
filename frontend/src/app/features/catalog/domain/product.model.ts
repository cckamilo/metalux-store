export type ProductType = 'music' | 'clothing' | 'accessory';
export type MusicFormat = 'vinyl' | 'cd';
export type ProductCondition = 'new' | 'used' | 'collector';

export interface VinylColor {
  name: string;
  // Representative swatch color for mixed finishes and picture discs.
  hex: string;
  secondaryHex?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface MusicDetails {
  type: 'music';
  artist: string;
  format: MusicFormat;
  genre: string;
  releaseYear?: number;
  releaseDate?: string;
  label?: string;
  discCount?: number;
  condition?: ProductCondition;
  edition?: string;
  vinylColor?: VinylColor;
  vinylColors?: (VinylColor & { imageIndex: number })[];
}

export interface ClothingDetails {
  type: 'clothing';
  brand?: string;
  sizes: string[];
  colors: string[];
  material?: string;
}

export interface AccessoryDetails {
  type: 'accessory';
  material?: string;
  color?: string;
}

export type ProductDetails = MusicDetails | ClothingDetails | AccessoryDetails;

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  stock: number;
  images: string[];
  description: string;
  details: ProductDetails;
  createdAt?: string;
  isActive: boolean;
  isNew: boolean;
}
