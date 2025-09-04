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
  type:
    | "received"
    | "dispatched"
    | "returned"
    | "donated"
    | "stolen"
    | "processed";
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
export interface Item {
  stock: ReactNode;
  unitOfMeasure: string;
  supplierName: string;
  lotCode: string;
  deliveryDate: string;
  expiryDate: string;
  quantityReceived: string;
  returnLotCode: string;
  returnQuantity: string;
  returnDate: string;
  returnReason: string;
  returnNotes: string;
  stockLotCode: string;
  adjustmentType: string;
  adjustmentQuantity: string;
  adjustmentReason: string;
  adjustmentNotes: string;
  id: string;
  category: string;
  subCategory: string;
  name: string;
  sku: string;
  description: string;
  costPrice: number;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}
