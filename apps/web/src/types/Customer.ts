export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  kind: "CUSTOMER" | "SUPPLIER";
  createdBy: string;
  updatedBy: string;
}

export interface CustomerResponse {
  id: string;
  orgId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  kind: "CUSTOMER" | "SUPPLIER";
  active: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}
export interface CustomerListResponse {
  content: CustomerResponse[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}
