import {
  MenuCategory,
  MenuItem,
  Reservation,
  Order,
  RestaurantTable,
  GalleryImage,
  Review,
  WebsiteSettings,
  DashboardAnalytics,
  AuthResponse
} from '../types';

const rawBase = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api';
const API_BASE = rawBase.replace(/\/+$/, '');

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('farzi_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

async function parseJsonResponse<T>(res: Response, defaultErrorMessage: string): Promise<T> {
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    throw new Error(res.statusText || defaultErrorMessage);
  }
  if (!res.ok) {
    throw new Error(json?.message || defaultErrorMessage);
  }
  return json?.data;
}

export const api = {
  // Public
  async getCategories(): Promise<MenuCategory[]> {
    const res = await fetch(`${API_BASE}/public/categories`);
    const data = await parseJsonResponse<MenuCategory[]>(res, 'Failed to load categories');
    return data || [];
  },

  async getMenu(params?: {
    categorySlug?: string;
    categoryId?: number;
    isVeg?: boolean;
    isChefSpecial?: boolean;
    isAvailable?: boolean;
    availableOnly?: boolean;
    search?: string;
  }): Promise<MenuItem[]> {
    const query = new URLSearchParams();
    if (params?.categorySlug) query.append('categorySlug', params.categorySlug);
    if (params?.categoryId) query.append('categoryId', String(params.categoryId));
    if (params?.isVeg !== undefined) query.append('isVeg', String(params.isVeg));
    if (params?.isChefSpecial !== undefined) query.append('isChefSpecial', String(params.isChefSpecial));
    if (params?.isAvailable !== undefined) query.append('isAvailable', String(params.isAvailable));
    if (params?.availableOnly !== undefined) query.append('availableOnly', String(params.availableOnly));
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/public/menu?${query.toString()}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to fetch menu items');
    return json.data || [];
  },

  async getDish(id: number): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/public/menu/${id}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to load dish details');
    return json.data;
  },

  async createReservation(data: {
    name: string;
    phone: string;
    email: string;
    reservationDate: string;
    reservationTime: string;
    guests: number;
    specialRequest?: string;
  }): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/public/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to submit reservation');
    return json.data;
  },

  async createOrder(data: {
    tableNumber: string;
    customerName?: string;
    customerPhone?: string;
    items: Array<{
      id?: number;
      menuItemId: number;
      name?: string;
      price?: number;
      quantity: number;
      specialInstructions?: string;
      isVeg?: boolean;
    }>;
    notes?: string;
    idempotencyKey?: string;
  }): Promise<Order> {
    const res = await fetch(`${API_BASE}/public/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(data.idempotencyKey ? { 'Idempotency-Key': data.idempotencyKey } : {})
      },
      body: JSON.stringify(data)
    });
    return parseJsonResponse<Order>(res, 'Failed to place order');
  },

  async getOrder(orderNumber: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/public/orders/${orderNumber}`);
    return parseJsonResponse<Order>(res, 'Order not found');
  },

  async getTables(): Promise<RestaurantTable[]> {
    const res = await fetch(`${API_BASE}/public/tables`);
    return parseJsonResponse<RestaurantTable[]>(res, 'Failed to load tables');
  },

  async logQRScan(table: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/public/qr/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table })
      });
    } catch {
      // Non-blocking telemetry
    }
  },

  async getGallery(): Promise<GalleryImage[]> {
    const res = await fetch(`${API_BASE}/public/gallery`);
    const json = await res.json();
    return json.data;
  },

  async getReviews(): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/public/reviews`);
    const json = await res.json();
    return json.data;
  },

  async submitReview(data: { customerName: string; rating: number; comment: string }): Promise<Review> {
    const res = await fetch(`${API_BASE}/public/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return parseJsonResponse<Review>(res, 'Failed to submit review');
  },

  async submitContactMessage(data: { name: string; email: string; phone?: string; subject?: string; message: string }): Promise<void> {
    const res = await fetch(`${API_BASE}/public/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    await parseJsonResponse<any>(res, 'Failed to submit contact inquiry');
  },

  async getSettings(): Promise<WebsiteSettings> {
    const res = await fetch(`${API_BASE}/public/settings`);
    return parseJsonResponse<WebsiteSettings>(res, 'Failed to load settings');
  },

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Authentication failed');
    return json.data;
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Session expired');
    const json = await res.json();
    return json.data;
  },

  // Admin
  async getAdminAnalytics(): Promise<DashboardAnalytics> {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized');
    const json = await res.json();
    return json.data;
  },

  async getAdminMenu(): Promise<MenuItem[]> {
    const res = await fetch(`${API_BASE}/admin/menu`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized or failed to load admin menu');
    const json = await res.json();
    return json.data || [];
  },

  async createMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/admin/menu`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create item');
    return json.data;
  },

  async updateMenuItem(id: number, item: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/admin/menu/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update item');
    return json.data;
  },

  async deleteMenuItem(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/menu/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete item');
  },

  async getAdminReservations(): Promise<Reservation[]> {
    const res = await fetch(`${API_BASE}/admin/reservations`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    return json.data;
  },

  async updateReservationStatus(id: number, status: string, tableNumber?: string, adminNote?: string): Promise<Reservation> {
    const res = await fetch(`${API_BASE}/admin/reservations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, tableNumber, adminNote })
    });
    const json = await res.json();
    return json.data;
  },

  async getAdminOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    return json.data;
  },

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    return json.data;
  },

  async getAdminTables(): Promise<RestaurantTable[]> {
    const res = await fetch(`${API_BASE}/admin/tables`, {
      headers: getAuthHeaders()
    });
    const json = await res.json();
    return json.data;
  },

  async updateTableStatus(id: number, status: string): Promise<RestaurantTable> {
    const res = await fetch(`${API_BASE}/admin/tables/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    return json.data;
  },

  async updateSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    const json = await res.json();
    return json.data;
  }
};
