import axiosClient from "@/api/axiosClient";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { Item } from "@/types/inventory";

export interface InventoryState {
  // Define your inventory state properties and actions here
  items: Item[];
  setItems: (items: Item[]) => void;
  postItem: (customerData: Item) => Promise<void>;
  fetchItems: () => Promise<void>;
  updateItem: (id: string, customerData: Item) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}
export const useInventory = create<InventoryState>()((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  postItem: async (itemData) => {
    try {
      const { data } = await axiosClient.post(
        `org/${useAuthStore.getState().userState.orgId}/location/${
          useAuthStore.getState().userState.locationId
        }/item`,
        itemData
      );
      set((state) => ({
        items: [...state.items, data],
      }));
    } catch (error) {
      throw new Error(error.response?.data || "Failed to add item");
    }
  },
  fetchItems: async () => {
    try {
      console.log(useAuthStore.getState().userState);
      const { data } = await axiosClient.get(
        `org/${useAuthStore.getState().userState.orgId}/location/${
          useAuthStore.getState().userState.locationId
        }/item`
      );
      set({ items: data.content });
    } catch (error) {
      throw new Error(error.response?.data || "Failed to fetch items");
    }
  },
  updateItem: async (id, itemData) => {
    try {
      const { data } = await axiosClient.put(
        `org/${useAuthStore.getState().userState.orgId}/item/${id}`,
        itemData
      );
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? data : item)),
      }));
    } catch (error) {
      throw new Error(error.response?.data || "Failed to update item");
    }
  },
  deleteItem: async (id) => {
    try {
      await axiosClient.delete(
        `org/${useAuthStore.getState().userState.orgId}/item/${id}`
      );
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
    } catch (error) {
      throw new Error(error.response?.data || "Failed to delete item");
    }
  },
}));
