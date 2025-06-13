
export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
}

export interface Lot {
  id: string;
  lotNumber: string;
  subCategoryId: string;
  quantity: number;
  receivedDate: string;
  expiryDate?: string;
  supplier: string;
  costPerUnit: number;
  movements: LotMovement[];
}

export interface LotMovement {
  id: string;
  lotId: string;
  type: 'received' | 'dispatched' | 'returned' | 'donated' | 'stolen' | 'processed';
  quantity: number;
  date: string;
  reference?: string;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  subCategoryId: string;
  unitPrice: number;
  lastUpdated: string;
}
