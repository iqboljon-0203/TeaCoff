export type LocalizedString = {
  ru: string;
  uz: string;
  en: string;
};

export interface Category {
  id: string;
  slug: string;
  title: LocalizedString;
  description?: LocalizedString;
  image_url?: string;
  sort_order: number;
}

export interface Product {
  id: string;
  slug: string;
  category_id?: string;
  category_slug?: string;
  brand: string;
  title: LocalizedString;
  description: LocalizedString;
  taste_notes?: LocalizedString;
  price: number; // in UZS
  old_price?: number; // in UZS
  weight_volume?: string; // "16 шт", "1000 г", "250 г"
  in_stock: boolean;
  images: string[];
  is_rental_machine: boolean;
  min_capsule_boxes: number;
  specs: {
    system?: string;
    pressure?: string;
    water_tank?: string;
    power?: string;
    origin?: string;
    [key: string]: string | undefined;
  };
  badge?: LocalizedString;
  created_at?: string;
}

export interface OrderItem {
  product_id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  is_rental?: boolean;
}

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  district: string;
  delivery_address: string;
  total_amount: number;
  delivery_fee: number;
  status: 'new' | 'confirmed' | 'delivering' | 'completed' | 'cancelled';
  items: OrderItem[];
  payment_method: 'unified_qr' | 'cash_on_delivery' | 'card_on_delivery';
  payment_status?: 'pending' | 'paid';
  notes?: string;
  created_at: string;
}

export interface CapsuleSelection {
  capsule_id: string;
  name: string;
  boxes: number;
}

export interface RentalInquiry {
  id: string;
  customer_name: string;
  customer_phone: string;
  machine_model: string;
  selected_capsules: CapsuleSelection[];
  min_boxes_required: number;
  cups_per_day: number;
  district?: string;
  delivery_address?: string;
  status: 'new' | 'contacted' | 'approved' | 'installed' | 'rejected';
  created_at: string;
}

export interface ServiceTicket {
  id: string;
  ticket_number: number;
  customer_name: string;
  customer_phone: string;
  machine_model: string;
  issue_description: string;
  attachment_url?: string;
  status: 'new' | 'in_review' | 'repairing' | 'ready' | 'closed';
  created_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  is_active: boolean;
}
