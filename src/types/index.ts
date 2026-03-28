// TypeScript types for the FFMerchant mobile app

// ===== Auth Types =====
export interface Merchant {
  id: string;
  _id?: string;
  shopName: string;
  email: string;
  phoneNumber: string;
  ownerName?: string;
  shopDescription?: string;
  category?: string;
  genderCategory?: string[];
  logo?: { public_id: string; url: string } | null;
  backgroundImage?: { public_id: string; url: string } | null;
  isActive?: boolean;
  isVerified?: boolean;
  [key: string]: any;
}

export interface LoginResponse {
  merchant: Merchant;
  token: string;
}

// ===== Product Types =====
export interface Size {
  _id?: string;
  size: string;
  stock: number;
}

export interface Variant {
  _id?: string;
  color: { name: string; hex: string };
  sizes: Size[];
  mrp: number;
  price: number;
  discount: number;
  images: ProductImage[];
}

export interface ProductImage {
  _id?: string;
  public_id?: string;
  url: string;
}

export interface Product {
  _id: string;
  name: string;
  brandId: string;
  categoryId: string;
  subCategoryId?: string;
  gender: string[];
  description: string;
  features: Record<string, string>;
  tags: string[];
  variants: Variant[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Category {
  _id: string;
  name: string;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  _id: string;
  name: string;
}

export interface Attribute {
  _id: string;
  name: string;
  values: string[];
}

// ===== Brand Types =====
export interface Brand {
  _id: string;
  name: string;
  description: string;
  logo: { public_id: string; url: string } | null;
  createdByType: 'Merchant' | 'Admin';
  createdById: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BrandPayload {
  name: string;
  description: string;
  logo?: any;
  createdByType: 'Merchant' | 'Admin';
  createdById: string;
}

// ===== Order Types =====
export interface OrderItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

export interface Order {
  _id: string;
  totalAmount: number;
  items: OrderItem[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

// ===== Analytics Types =====
export interface AnalyticsStats {
  totalRevenue: number;
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  returnedOrders: number;
  cancelledOrders: number;
  avgOrderValue: number;
  returnRate: number;
  deliveryRate: number;
  newCustomers?: number;
}

export interface DailyTrend {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  name: string;
  soldQuantity: number;
  revenue: number;
}

export interface AnalyticsResponse {
  success: boolean;
  stats: AnalyticsStats;
  dailyTrend: DailyTrend[];
  topProducts: TopProduct[];
  orderStatus?: { _id: string; count: number }[];
}

export interface WalletTransaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  description?: string;
  createdAt: string;
}

export interface WalletResponse {
  success: boolean;
  balance: number;
  transactions: WalletTransaction[];
}
