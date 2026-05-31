/* eslint-disable @typescript-eslint/naming-convention */
import type { CreateProductDto } from './product';

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IListResponse<TItem> {
  items: TItem[];
  pagination: IPaginationMeta;
  totalCount: number;
}

export interface ApiSuccessResponse<T> {
  status: true;
  message?: string;
  data: T;
}

export interface ApiErrorResponse {
  status: false;
  message: string;
  error?: {
    code?: string;
  };
}

export type UserRole = 'admin' | 'customer' | 'super-admin';

export interface User {
  id: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUser extends User {
  role: 'admin' | 'super-admin';
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
  product?: CreateProductDto;
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
  product?: CreateProductDto;
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
