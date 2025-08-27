import axiosClient from "@/api/axiosClient";
import { useAuthStore } from "./useAuthStore";
import { create } from "zustand";
import { Customer, CustomerResponse } from "@/types/Customer";

interface CustomerState {
  customers: CustomerResponse[];
  setCustomers: (customers: CustomerResponse[]) => void;
  postCustomer: (customerData: Customer) => Promise<void>;
  fetchCustomers: () => Promise<void>;
  updateCustomer: (id: string, customerData: Customer) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>()((set) => ({
  customers: [],
  setCustomers: (customers) => set({ customers }),
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
      throw new Error(error.response?.data || "Failed to fetch customers");
    }
  },
  updateCustomer: async (id, customerData) => {
    try {
      const { data } = await axiosClient.put(
        `org/${useAuthStore.getState().userState.orgId}/counterparty/${id}`,
        customerData
      );
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer.id === id ? data : customer
        ),
      }));
    } catch (error) {
      throw new Error(error.response?.data || "Failed to update customer");
    }
  },
  deleteCustomer: async (id) => {
    try {
      await axiosClient.delete(
        `org/${useAuthStore.getState().userState.orgId}/counterparty/${id}`
      );
      set((state) => ({
        customers: state.customers.filter((customer) => customer.id !== id),
      }));
    } catch (error) {
      throw new Error(error.response?.data || "Failed to delete customer");
    }
  },
}));
