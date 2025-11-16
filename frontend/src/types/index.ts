export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  is_verified: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  base_price: number;
  category_id: string;
  attributes: Record<string, any>;
  stock_quantity: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
  category?: Category;
  images?: string[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  children?: Category[];
  href: string;
}

export interface Cart {
  id: string;
  user_id: string;
  is_active: boolean;
  items?: CartItem[];
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'cancelled' | 'delivered' | 'pending' | 'processing' | 'shipped';
  shipping_address: string;
  created_at?: Date;
  updated_at?: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'closed' | 'in_progress' | 'open';
  priority: 'high' | 'low' | 'medium';
  created_at?: Date;
  updated_at?: Date;
  user?: User;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_admin: boolean;
  created_at?: Date;
  user?: User;
}
