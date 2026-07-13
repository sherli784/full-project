export type Role = 'user' | 'admin' | 'pm';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
}

export type ProductSize = 'S' | 'M' | 'L' | 'XL';

export interface ProductRating {
  userId: string;
  rating: number;
  comment?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  sizes: Record<ProductSize, { price: number; stock: number }>;
  isNew: boolean;
  isTrending: boolean;
  availability: 'in-stock' | 'out-of-stock' | 'limited-stock';
  ratings?: ProductRating[];
  averageRating?: number;
  totalRatings?: number;
}

export interface CartItem {
  productId: string;
  size: ProductSize;
  quantity: number;
  product: Product; // Hydrated for easier access
}

export interface Order {
  id?: string;
  _id?: string;
  userId: string;
  items: {
    productId: string;
    productName: string;
    size: ProductSize;
    quantity: number;
    priceAtPurchase: number;
  }[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  paymentMethod: 'COD' | 'UPI';
  address: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountCode: string;
  discountPercent: number;
  image: string;
  validUntil?: string;
}
