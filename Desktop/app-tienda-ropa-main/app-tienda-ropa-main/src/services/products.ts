import { Category, Product } from '../types';

const API = 'https://api.escuelajs.co/api/v1';
const PLACEHOLDER = 'https://picsum.photos/400/400';

export const CATEGORIES: Category[] = [
  'Buzos y Camperas',
  'Remeras y Camisas',
  'Pantalones',
  'Bermudas',
  'Jeans',
  'Gorras',
];

// Deduce la categoría a partir del nombre. Si no es ropa, devuelve null.
function detectCategory(title: string): Category | null {
  const t = title.toLowerCase();
  if (/\b(jeans?|denim)\b/.test(t)) return 'Jeans';
  if (/\b(shorts?|bermudas?)\b/.test(t)) return 'Bermudas';
  if (/\b(hoodie|hooded|sweatshirt|sweater|jacket|coat|pullover|cardigan|fleece|parka)\b/.test(t))
    return 'Buzos y Camperas';
  if (/\b(t-shirt|shirt|tee|polo|blouse|tank top)\b/.test(t)) return 'Remeras y Camisas';
  if (/\b(pants?|sweatpants|joggers?|trousers|leggings?|chinos?)\b/.test(t)) return 'Pantalones';
  if (/\b(caps?|hats?|beanie)\b/.test(t)) return 'Gorras';
  return null;
}

function cleanImage(url: string): string {
  return String(url).replace(/[\[\]"]/g, '').trim();
}

function mapProduct(item: any): Product | null {
  if (!item || typeof item.title !== 'string') return null;
  const category = detectCategory(item.title);
  if (!category) return null; // no es ropa

  const images: string[] = (Array.isArray(item.images) ? item.images : [])
    .map(cleanImage)
    .filter((u: string) => u.startsWith('http'));

  return {
    id: item.id,
    title: item.title,
    price: Math.max(Math.round(Number(item.price) || 15), 15) * 1000,
    description: item.description || 'Sin descripción disponible.',
    category,
    images: images.length > 0 ? images : [PLACEHOLDER],
    stock: 10,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API}/products?offset=0&limit=200`);
  if (!res.ok) throw new Error('Error al cargar productos');
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  const seen = new Set<number>();
  const result: Product[] = [];
  for (const item of data) {
    const p = mapProduct(item);
    if (p && !seen.has(p.id)) {
      seen.add(p.id);
      result.push(p);
    }
  }
  return result;
}

export async function fetchProductById(id: string | number): Promise<Product | null> {
  const res = await fetch(`${API}/products/${id}`);
  if (!res.ok) return null;
  return mapProduct(await res.json());
}