export type Category =
  | 'Buzos y Camperas'
  | 'Remeras y Camisas'
  | 'Pantalones'
  | 'Bermudas'
  | 'Jeans'
  | 'Gorras';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}