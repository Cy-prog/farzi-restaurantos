export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
  user: User;
}

export interface MenuCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  isVisible: boolean;
  itemCount?: number;
}

export type SpiceLevel = 'NONE' | 'MILD' | 'MEDIUM' | 'HOT' | 'EXTRA_HOT';

export interface MenuItem {
  id: number;
  categoryId: number;
  categoryName?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  ingredients?: string;
  allergens?: string;
  spiceLevel: SpiceLevel;
  isVeg: boolean;
  isAvailable: boolean;
  isChefSpecial: boolean;
  isRecommended: boolean;
  isPopular: boolean;
  displayOrder: number;
  calories?: number;
  preparationTimeMinutes?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'SEATED' | 'COMPLETED' | 'CANCELLED';

export interface Reservation {
  id: number;
  name: string;
  phone: string;
  email: string;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:mm
  guests: number;
  specialRequest?: string;
  eventType?: 'DINING' | 'SUFI_NIGHT' | 'MIXOLOGY_MASTERCLASS' | 'CHEFS_TABLE' | 'CELEBRATION' | 'CORPORATE_GALA';
  eventName?: string;
  seatingPreference?: string;
  status: ReservationStatus;
  tableNumber?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarziEvent {
  id: string;
  title: string;
  category: string;
  tag: string;
  dateText: string;
  time: string;
  description: string;
  inclusions: string[];
  priceText: string;
  image: string;
  badgeColor?: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_KITCHEN' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
  imageUrl?: string;
  isVeg?: boolean;
}

export interface Order {
  id: number;
  orderNumber: string;
  tableNumber: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantTable {
  id: number;
  tableNumber: string;
  capacity: number;
  section: string; // 'Main Dining' | 'Terrace' | 'Chef Table' | 'Lounge'
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
  qrCodeUrl: string;
  activeOrderId?: number;
}

export interface GalleryCategory {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface GalleryImage {
  id: number;
  categoryId?: number;
  categoryName?: string;
  title: string;
  description?: string;
  imageUrl: string;
  isVideo: boolean;
  displayOrder: number;
}

export interface Review {
  id: number;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  source: 'WEBSITE' | 'GOOGLE' | 'TRIPADVISOR' | 'ZOMATO';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isFeatured: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'NEW' | 'READ' | 'ARCHIVED';
  createdAt: string;
}

export interface WebsiteSettings {
  id: number;
  restaurantName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  accentColor: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  googleMapsEmbedUrl: string;
  workingHours: {
    days: string;
    lunch: string;
    dinner: string;
  }[];
  socialLinks: {
    instagram: string;
    facebook: string;
    tripadvisor: string;
  };
  currencySymbol: string;
  taxPercentage: number;
}

export interface DashboardAnalytics {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalReservations: number;
  upcomingReservations: number;
  totalMenuItems: number;
  availableMenuItems: number;
  recentOrders: Order[];
  recentReservations: Reservation[];
  salesByDay: { date: string; sales: number; orders: number }[];
  popularDishes: { name: string; category: string; orderCount: number; revenue: number }[];
  tableScanCounts: { table: string; scans: number }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}
