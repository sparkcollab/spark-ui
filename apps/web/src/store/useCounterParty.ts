import axiosClient from "@/api/axiosClient";
import { useAuthStore } from "./useAuthStore";
import { create } from "zustand";
import { CounterParty, CounterPartyResponse } from "@/types/CounterParty";

interface CounterPartyState {
  counterParties: CounterPartyResponse[];
  setCounterParties: (counterParties: CounterPartyResponse[]) => void;
  postCounterParty: (counterPartyData: CounterParty) => Promise<void>;
  fetchCounterParties: () => Promise<void>;
  updateCounterParty: (
    id: string,
    counterPartyData: CounterParty
  ) => Promise<void>;
  deleteCounterParty: (id: string) => Promise<void>;
}

export const useCounterPartyStore = create<CounterPartyState>()((set) => ({
  counterParties: [],
  setCounterParties: (counterParties) => set({ counterParties }),
  postCounterParty: async (counterPartyData) => {
    try {
      const { data } = await axiosClient.post(
        `org/${useAuthStore.getState().userState.orgId}/counterparty`,
        counterPartyData
      );
      set((state) => ({
        counterParties: [...state.counterParties, data],
      }));
    } catch (error) {
      throw new Error(error.response?.data || "Failed to add counterParty");
    }
  },
  fetchCounterParties: async () => {
    try {
      console.log(useAuthStore.getState().userState);
      const { data } = await axiosClient.get(
        `org/${useAuthStore.getState().userState.orgId}/counterparty`
      );
      set({ counterParties: data.content });
    } catch (error) {
      throw new Error(error.response?.data || "Failed to fetch counterParties");
    }
  },
  updateCounterParty: async (id, counterPartyData) => {
    try {
      const { data } = await axiosClient.put(
        `org/${useAuthStore.getState().userState.orgId}/counterparty/${id}`,
        counterPartyData
      );
      set((state) => ({
        counterParties: state.counterParties.map((counterParty) =>
          counterParty.id === id ? data : counterParty
        ),
      }));
    } catch (error) {
      throw new Error(error.response?.data || "Failed to update counterParty");
    }
  },
  deleteCounterParty: async (id) => {
    try {
      await axiosClient.delete(
        `org/${useAuthStore.getState().userState.orgId}/counterparty/${id}`
      );
      set((state) => ({
        counterParties: state.counterParties.filter(
          (counterParty) => counterParty.id !== id
        ),
      }));
    } catch (error) {
      throw new Error(error.response?.data || "Failed to delete counterParty");
    }
  },
}));
