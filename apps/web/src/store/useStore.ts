import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AppState {
  // UI State
  sidebarOpen: boolean;
  loading: boolean;
  searchQuery: string;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<AppState>()(
  devtools((set) => ({
    // Initial state
    sidebarOpen: true,
    loading: false,
    searchQuery: "",

    // Actions

    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setLoading: (loading) => set({ loading }),
    setSearchQuery: (query) => set({ searchQuery: query }),
  }))
);
