import { createClient } from '@supabase/supabase-js';
import { SEED_CATEGORIES, SEED_PRODUCTS } from './seed-data';
import { Category, Product, Order, RentalInquiry, ServiceTicket } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize client if credentials exist, otherwise null
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// In-memory runtime cache for orders and inquiries (persists within node session when mock mode active)
let inMemoryProducts = [...SEED_PRODUCTS];
let inMemoryOrders: Order[] = [
  {
    id: 'ord-1001',
    order_number: 1042,
    customer_name: 'Азиз Каримов',
    customer_phone: '+998 90 123 45 67',
    district: 'Мирзо-Улугбекский район',
    delivery_address: 'ул. Мустакиллик, д. 45, кв. 12',
    total_amount: 749000,
    delivery_fee: 0,
    status: 'new',
    items: [
      {
        product_id: 'prod-genio-s',
        slug: 'dolce-gusto-genio-s',
        title: 'Dolce Gusto Genio S',
        price: 0,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?q=80&w=900&auto=format&fit=crop',
        is_rental: true,
      },
      {
        product_id: 'prod-carraro-crema',
        slug: 'capsules-carraro-crema',
        title: 'Капсулы Carraro Crema (16 шт)',
        price: 95000,
        quantity: 4,
        image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=900&auto=format&fit=crop',
      },
      {
        product_id: 'prod-lavazza-super-crema',
        slug: 'lavazza-super-crema-beans',
        title: 'Lavazza Super Crema (1000 г)',
        price: 369000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=900&auto=format&fit=crop',
      },
    ],
    payment_method: 'cash_on_delivery',
    notes: 'Позвонить за час до приезда.',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

let inMemoryRentals: RentalInquiry[] = [
  {
    id: 'rent-101',
    customer_name: 'Малика Умарова',
    customer_phone: '+998 97 765 43 21',
    machine_model: 'Dolce Gusto Mini Me - Krups',
    selected_capsules: [
      { capsule_id: 'c1', name: 'Carraro Crema (16 шт)', boxes: 2 },
      { capsule_id: 'c2', name: 'Carraro Puro Arabica (10 шт)', boxes: 2 },
    ],
    min_boxes_required: 4,
    cups_per_day: 4,
    district: 'Юнусабадский район',
    delivery_address: 'ул. Амира Темура, 108, офис 4',
    status: 'new',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

let inMemoryTickets: ServiceTicket[] = [
  {
    id: 'srv-89',
    ticket_number: 89,
    customer_name: 'Жасур Рахимов',
    customer_phone: '+998 93 555 12 34',
    machine_model: 'Dolce Gusto Piccolo XS',
    issue_description: 'Не подает воду, мигает желтый сервисный индикатор.',
    attachment_url: '',
    status: 'in_review',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

// Data accessor helpers
export async function getCategories(): Promise<Category[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase categories fetch failed, falling back to seed data:', e);
    }
  }
  return SEED_CATEGORIES;
}

export async function getProducts(options?: {
  categorySlug?: string;
  isRental?: boolean;
}): Promise<Product[]> {
  if (supabase) {
    try {
      let query = supabase.from('products').select('*');
      if (options?.categorySlug) {
        query = query.eq('category_slug', options.categorySlug);
      }
      if (options?.isRental !== undefined) {
        query = query.eq('is_rental_machine', options.isRental);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase products fetch failed, falling back to seed data:', e);
    }
  }

  let filtered = [...inMemoryProducts];
  if (options?.categorySlug) {
    filtered = filtered.filter((p) => p.category_slug === options.categorySlug);
  }
  if (options?.isRental !== undefined) {
    filtered = filtered.filter((p) => p.is_rental_machine === options.isRental);
  }
  return filtered;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase product single fetch failed, falling back to seed data:', e);
    }
  }
  return inMemoryProducts.find((p) => p.slug === slug) || null;
}

export async function createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    order_number: Math.floor(1000 + Math.random() * 9000),
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('orders').insert([newOrder]).select().single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase order insert failed, saving to runtime memory:', e);
    }
  }

  inMemoryOrders.unshift(newOrder);
  return newOrder;
}

export async function createRentalInquiry(inquiryData: Omit<RentalInquiry, 'id' | 'created_at'>): Promise<RentalInquiry> {
  const newInquiry: RentalInquiry = {
    ...inquiryData,
    id: `rent-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('rental_inquiries').insert([newInquiry]).select().single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase rental inquiry insert failed, saving to runtime memory:', e);
    }
  }

  inMemoryRentals.unshift(newInquiry);
  return newInquiry;
}

export async function createServiceTicket(ticketData: Omit<ServiceTicket, 'id' | 'ticket_number' | 'created_at'>): Promise<ServiceTicket> {
  const newTicket: ServiceTicket = {
    ...ticketData,
    id: `srv-${Date.now()}`,
    ticket_number: Math.floor(100 + Math.random() * 900),
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('service_tickets').insert([newTicket]).select().single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase ticket insert failed, saving to runtime memory:', e);
    }
  }

  inMemoryTickets.unshift(newTicket);
  return newTicket;
}

export async function getAllOrders(): Promise<Order[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {}
  }
  return inMemoryOrders;
}

export async function getAllRentalInquiries(): Promise<RentalInquiry[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('rental_inquiries').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {}
  }
  return inMemoryRentals;
}

export async function getAllServiceTickets(): Promise<ServiceTicket[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('service_tickets').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {}
  }
  return inMemoryTickets;
}

export function updateOrderStatus(orderId: string, status: Order['status']) {
  inMemoryOrders = inMemoryOrders.map((o) => (o.id === orderId ? { ...o, status } : o));
}

export function updateOrderPaymentStatus(orderId: string, payment_status: 'pending' | 'paid') {
  inMemoryOrders = inMemoryOrders.map((o) =>
    o.id === orderId || String(o.order_number) === orderId
      ? { ...o, payment_status, status: payment_status === 'paid' ? 'confirmed' : o.status }
      : o
  );
}

export function updateRentalStatus(rentalId: string, status: RentalInquiry['status']) {
  inMemoryRentals = inMemoryRentals.map((r) => (r.id === rentalId ? { ...r, status } : r));
}

export function updateServiceStatus(ticketId: string, status: ServiceTicket['status']) {
  inMemoryTickets = inMemoryTickets.map((t) => (t.id === ticketId ? { ...t, status } : t));
}

