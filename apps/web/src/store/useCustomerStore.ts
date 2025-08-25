import axiosClient from "@/api/axiosClient";
import { useAuthStore } from "./useAuthStore";
import { create } from "zustand";

interface CustomerState {
  customers: Customer[];
  customerDetails: any | null;
  setCustomers: (customers: any[]) => void;
  setCustomerDetails: (customerDetails: any | null) => void;
  fetchCustomers: () => Promise<void>;
  fetchCustomerDetails: (customerId: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>()((set) => ({
  customers: [],
  customerDetails: null,
  setCustomers: (customers) => set({ customers }),
  setCustomerDetails: (customerDetails) => set({ customerDetails }),
  postCustomer: async (customerData) => {
    try {
      const { data } = await axiosClient.post(
        `org/${useAuthStore.getState().userState.orgId}/counterparty`,
        customerData
      );
      set((state) => ({
        customers: [...state.customers, data],
      }));
    } catch (error) {
      console.error("Error adding customer:", error);
      throw new Error(error.response?.data || "Failed to add customer");
    }
  },
  fetchCustomers: async () => {
    try {
      console.log(useAuthStore.getState().userState);
      const { data } = await axiosClient.get(
        `org/${useAuthStore.getState().userState.orgId}/counterparty`
      );
      set({ customers: data.content });
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw new Error(error.response?.data || "Failed to fetch customers");
    }
  },
  fetchCustomerDetails: async (customerId: string) => {
    try {
      const { data } = await axiosClient.get(
        `org/${useAuthStore.getState().userState.orgId}/counterparty/${customerId}`
      );
      set({ customerDetails: data });
    } catch (error) {
      console.error("Error fetching customer details:", error);
      throw new Error(
        error.response?.data || "Failed to fetch customer details"
      );
    }
  },
}));
