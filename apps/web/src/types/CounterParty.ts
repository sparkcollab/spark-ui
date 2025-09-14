export interface CounterParty {
  name: string;
  email: string;
  phone: string;
  address: string;
  kind: "CUSTOMER" | "SUPPLIER";
  createdBy: string;
  updatedBy: string;
}

export interface CounterPartyResponse {
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
export interface CounterPartyListResponse {
  content: CounterPartyResponse[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}
