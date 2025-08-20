/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DashboardMetrics {
  totalProducts: number;
  lowStockCount: number;
  totalRevenue: number;
  pendingOrders: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  type: string;
  message: string;
  details: string;
  timestamp: Date;
  icon: string;
  color: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: unknown, row: any) => React.ReactNode;
}

export interface TableAction {
  label: string;
  icon?: React.ComponentType<any>;
  onClick: (row: any) => void;
  variant?: "default" | "destructive" | "ghost";
}

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "number"
    | "select"
    | "textarea"
    | "date"
    | "checkbox";
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: (value: any) => string | undefined;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
}

export interface SalesChartData {
  daily: ChartDataPoint[];
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
}

export interface PDFOptions {
  filename: string;
  title: string;
  orientation?: "portrait" | "landscape";
  format?: "a4" | "letter";
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  customer: {
    name: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  paymentTerms?: string;
}

export interface OrderFormData {
  customerId: number;
  orderNumber: string;
  status: string;
  items: Array<{
    productId: number;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
  }>;
  totalAmount: string;
  notes?: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  sku: string;
  categoryId?: number;
  price: string;
  cost?: string;
  stockQuantity: number;
  minStockLevel?: number;
  isActive: boolean;
}

export interface CustomerFormData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isActive: boolean;
}

export interface ReturnFormData {
  customerId: number;
  orderId?: number;
  returnNumber: string;
  reason: string;
  refundAmount: string;
  refundMethod?: string;
  notes?: string;
  status: string;
}

export interface User {
  token: string;
  active: true;
  createdAt: string;
  email: string;
  id: string;
  name: string;
  orgId: string;
  phone: string;
  role: string;
  updatedAt: string;
}

export interface RegistrationState {
  org: {
    name: string;
    email: string;
    phone: string;
  };
  owner: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  location: {
    name: string;
    address: string;
  };
  payment: {
    email: string;
    name: string;
    amount: number;
    currency: string;
    paymentMethodId: string;
  };
}
export interface RequestTokenPayload {
  email?: string;
  phone?: string;
}
export interface ValidateTokenPayload {
  email?: string;
  phone?: string;
  token: string;
}
