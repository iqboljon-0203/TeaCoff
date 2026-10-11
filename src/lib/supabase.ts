import { createClient } from '@supabase/supabase-js';
import { SEED_CATEGORIES, SEED_PRODUCTS } from './seed-data';
import {
  Category,
  Product,
  Order,
  RentalInquiry,
  ServiceTicket,
  Contract,
  ContractStatus,
  ContractReminderStatus,
} from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize client if credentials exist, otherwise null
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// In-memory runtime cache for orders, rentals, tickets, and contracts
let inMemoryProducts = [...SEED_PRODUCTS];

// 5 Sample Contracts covering all test cases (due today, follow-up, paused, terminated, etc.)
let inMemoryContracts: Contract[] = [
  {
    id: 'cnt-1258',
    contract_number: '1258',
    customer_name: 'Тимур Алиев',
    customer_phone: '+998 90 987 65 43',
    telegram_chat_id: 123456789,
    language: 'ru',
    machine_model: 'Nescafé Dolce Gusto Mini Me',
    machine_serial: 'NDG-MM-98214',
    contract_start_date: '2026-09-10',
    contract_end_date: '2027-09-10',
    status: 'active',
    min_capsule_boxes: 4,
    cycle_days: 30,
    last_purchase_date: '2026-09-10',
    next_purchase_date: '2026-10-10',
    reminder_status: 'idle',
    last_order_items: [
      {
        product_id: 'prod-carraro-crema',
        slug: 'capsules-carraro-crema',
        title: 'Капсулы Carraro Crema (16 шт)',
        price: 95000,
        quantity: 4,
        image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=900&auto=format&fit=crop',
      },
    ],
    notes: 'Договор аренды 0 сум с минимальной закупкой 4 коробки в месяц.',
    created_at: '2026-09-10T09:00:00Z',
    updated_at: '2026-09-10T09:00:00Z',
  },
  {
    id: 'cnt-1259',
    contract_number: '1259',
    customer_name: 'Азиз Каримов',
    customer_phone: '+998 90 123 45 67',
    telegram_chat_id: 987654321,
    language: 'ru',
    machine_model: 'Dolce Gusto Genio S',
    machine_serial: 'DG-GS-44120',
    contract_start_date: '2026-08-15',
    status: 'active',
    min_capsule_boxes: 4,
    cycle_days: 30,
    last_purchase_date: '2026-09-15',
    next_purchase_date: '2026-10-15',
    reminder_status: 'idle',
    last_order_items: [
      {
        product_id: 'prod-carraro-crema',
        slug: 'capsules-carraro-crema',
        title: 'Капсулы Carraro Crema (16 шт)',
        price: 95000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=900&auto=format&fit=crop',
      },
      {
        product_id: 'prod-carraro-puro-arabica',
        slug: 'capsules-carraro-puro-arabica',
        title: 'Капсулы Carraro Puro Arabica (16 шт)',
        price: 99000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=900&auto=format&fit=crop',
      },
    ],
    created_at: '2026-08-15T11:00:00Z',
    updated_at: '2026-09-15T14:30:00Z',
  },
  {
    id: 'cnt-1260',
    contract_number: '1260',
    customer_name: 'Сардор Мирзаев',
    customer_phone: '+998 93 456 78 90',
    telegram_chat_id: 554433221,
    language: 'uz',
    machine_model: 'Dolce Gusto Piccolo XS',
    machine_serial: 'DG-PX-11002',
    contract_start_date: '2026-09-01',
    status: 'active',
    min_capsule_boxes: 4,
    cycle_days: 30,
    last_purchase_date: '2026-09-01',
    next_purchase_date: '2026-10-01',
    reminder_status: 'reminded_primary',
    last_reminder_sent_at: '2026-10-06T10:00:00Z',
    last_order_items: [
      {
        product_id: 'prod-carraro-crema',
        slug: 'capsules-carraro-crema',
        title: 'Капсулы Carraro Crema (16 шт)',
        price: 95000,
        quantity: 4,
        image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=900&auto=format&fit=crop',
      },
    ],
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-10-06T10:00:00Z',
  },
  {
    id: 'cnt-1240',
    contract_number: '1240',
    customer_name: 'Дилшод Назиров',
    customer_phone: '+998 97 111 22 33',
    language: 'ru',
    machine_model: 'Nescafé Dolce Gusto Mini Me',
    contract_start_date: '2026-07-01',
    status: 'paused', // Reminder suppressed
    min_capsule_boxes: 4,
    cycle_days: 30,
    last_purchase_date: '2026-08-01',
    next_purchase_date: '2026-09-01',
    reminder_status: 'idle',
    last_order_items: [],
    notes: 'Клиент временно приостановил аренду (отпуск). Напоминания отключены.',
    created_at: '2026-07-01T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z',
  },
  {
    id: 'cnt-1222',
    contract_number: '1222',
    customer_name: 'Отабек Расулов',
    customer_phone: '+998 99 888 77 66',
    language: 'ru',
    machine_model: 'Dolce Gusto Genio S',
    contract_start_date: '2026-05-10',
    contract_end_date: '2026-09-10',
    status: 'terminated', // Reminder suppressed
    min_capsule_boxes: 4,
    cycle_days: 30,
    next_purchase_date: '2026-09-10',
    reminder_status: 'idle',
    last_order_items: [],
    notes: 'Договор расторгнут, кофемашина возвращена.',
    created_at: '2026-05-10T10:00:00Z',
    updated_at: '2026-09-10T10:00:00Z',
  },
];

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
    contract_id: 'cnt-1259',
    telegram_chat_id: 987654321,
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

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
  let targetOrder: Order | null = null;
  inMemoryOrders = inMemoryOrders.map((o) => {
    if (o.id === orderId || String(o.order_number) === orderId) {
      targetOrder = { ...o, status };
      return targetOrder;
    }
    return o;
  });

  if (supabase) {
    try {
      await supabase.from('orders').update({ status }).eq('id', orderId);
    } catch (e) {}
  }

  return targetOrder;
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

// -----------------------------------------------------------------------------
// CONTRACTS & BOT ENGINE DATA ACCESSORS
// -----------------------------------------------------------------------------

export async function getAllContracts(): Promise<Contract[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('contracts').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase contracts fetch fallback to memory:', e);
    }
  }
  return inMemoryContracts;
}

export async function getContractById(id: string): Promise<Contract | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('contracts').select('*').eq('id', id).single();
      if (!error && data) return data;
    } catch (e) {}
  }
  return inMemoryContracts.find((c) => c.id === id || c.contract_number === id) || null;
}

export async function getContractByChatId(chatId: number): Promise<Contract | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('contracts').select('*').eq('telegram_chat_id', chatId).single();
      if (!error && data) return data;
    } catch (e) {}
  }
  return inMemoryContracts.find((c) => c.telegram_chat_id === chatId) || null;
}

export async function getContractByPhone(phone: string): Promise<Contract | null> {
  const cleanDigits = phone.replace(/[^\d]/g, '');
  const last9 = cleanDigits.length >= 9 ? cleanDigits.slice(-9) : cleanDigits;
  if (supabase) {
    try {
      const { data, error } = await supabase.from('contracts').select('*');
      if (!error && data && data.length > 0) {
        const found = data.find((c: Contract) => c.customer_phone.replace(/[^\d]/g, '').endsWith(last9));
        if (found) return found;
      }
    } catch (e) {}
  }
  return inMemoryContracts.find((c) => c.customer_phone.replace(/[^\d]/g, '').endsWith(last9)) || null;
}

export async function createContract(
  contractData: Omit<Contract, 'id' | 'created_at' | 'updated_at'>
): Promise<Contract> {
  const now = new Date().toISOString();
  const newContract: Contract = {
    ...contractData,
    id: `cnt-${Date.now()}`,
    created_at: now,
    updated_at: now,
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('contracts').insert([newContract]).select().single();
      if (!error && data) return data;
    } catch (e) {}
  }

  inMemoryContracts.unshift(newContract);
  return newContract;
}

export async function updateContractStatus(id: string, status: ContractStatus): Promise<Contract | null> {
  let updated: Contract | null = null;
  inMemoryContracts = inMemoryContracts.map((c) => {
    if (c.id === id || c.contract_number === id) {
      updated = { ...c, status, updated_at: new Date().toISOString() };
      return updated;
    }
    return c;
  });

  if (supabase) {
    try {
      await supabase.from('contracts').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    } catch (e) {}
  }

  return updated;
}

export async function updateContractReminderStatus(
  id: string,
  reminder_status: ContractReminderStatus,
  last_reminder_sent_at?: string
): Promise<Contract | null> {
  let updated: Contract | null = null;
  inMemoryContracts = inMemoryContracts.map((c) => {
    if (c.id === id || c.contract_number === id) {
      updated = {
        ...c,
        reminder_status,
        last_reminder_sent_at: last_reminder_sent_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return updated;
    }
    return c;
  });

  if (supabase) {
    try {
      await supabase
        .from('contracts')
        .update({
          reminder_status,
          last_reminder_sent_at: last_reminder_sent_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    } catch (e) {}
  }

  return updated;
}

/**
 * ⭐ Smart replenishment forecast:
 * When an order is placed, dynamically adjust the next purchase date
 * based on actual order date + cycle days, and reset reminder status to idle.
 */
export async function updateContractCycleOnOrder(
  contractId: string,
  items: Contract['last_order_items'],
  actualDateStr?: string
): Promise<Contract | null> {
  const actualDate = actualDateStr ? new Date(actualDateStr) : new Date();
  const nextDate = new Date(actualDate);
  nextDate.setDate(nextDate.getDate() + 30); // 30-day smart cycle

  const nextPurchaseStr = nextDate.toISOString().split('T')[0];
  const lastPurchaseStr = actualDate.toISOString().split('T')[0];

  let updated: Contract | null = null;
  inMemoryContracts = inMemoryContracts.map((c) => {
    if (c.id === contractId || c.contract_number === contractId) {
      updated = {
        ...c,
        last_purchase_date: lastPurchaseStr,
        next_purchase_date: nextPurchaseStr,
        reminder_status: 'idle', // Reset reminder cycle!
        last_order_items: items.length > 0 ? items : c.last_order_items,
        updated_at: new Date().toISOString(),
      };
      return updated;
    }
    return c;
  });

  if (supabase) {
    try {
      await supabase
        .from('contracts')
        .update({
          last_purchase_date: lastPurchaseStr,
          next_purchase_date: nextPurchaseStr,
          reminder_status: 'idle',
          last_order_items: items,
          updated_at: new Date().toISOString(),
        })
        .eq('id', contractId);
    } catch (e) {}
  }

  return updated;
}

export async function linkContractTelegramChatId(contractId: string, chatId: number): Promise<boolean> {
  inMemoryContracts = inMemoryContracts.map((c) => {
    if (c.id === contractId || c.contract_number === contractId) {
      return { ...c, telegram_chat_id: chatId, updated_at: new Date().toISOString() };
    }
    return c;
  });

  if (supabase) {
    try {
      await supabase.from('contracts').update({ telegram_chat_id: chatId }).eq('id', contractId);
      return true;
    } catch (e) {}
  }
  return true;
}


