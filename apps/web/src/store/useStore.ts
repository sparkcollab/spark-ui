import {
  RegistrationState,
  RequestTokenPayload,
  User,
  ValidateTokenPayload,
} from "../types";
import { create } from "zustand";
import axios from "axios";
import axiosClient from "@/api/axiosClient";
import { devtools, persist } from "zustand/middleware";

interface AppState {
  // UI State
  sidebarOpen: boolean;
  loading: boolean;
  searchQuery: string;
  userState?: User;
  registrationState?: RegistrationState;
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setUserState: (userState: User | null, successAction?: () => void) => void;
  requestToken: (payload: RequestTokenPayload) => Promise<void>;
  registerUser: (userState: RegistrationState) => void;
  validateToken: (
    payload: ValidateTokenPayload,
    successAction?: () => void
  ) => Promise<void>;
  logout: () => void;
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        sidebarOpen: true,
        loading: false,
        searchQuery: "",
        userState: undefined,
        registrationState: undefined,

        // Actions
        setUserState: (userState, successAction) => {
          set({ userState });
          successAction?.();
        },
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setLoading: (loading) => set({ loading }),
        setSearchQuery: (query) => set({ searchQuery: query }),

        requestToken: async (payload: RequestTokenPayload) => {
          try {
            const { data } = await axiosClient.post(
              "/auth/request-token",
              payload
            );
            return data;
          } catch (error) {
            console.error("Error requesting token:", error);
            throw new Error(error.response?.data || "Failed to request token");
          }
        },
        registerUser: async (registrationState: RegistrationState) => {
          try {
            const { data } = await axiosClient.post(
              "/registration",
              registrationState
            );
          } catch (error) {
            console.error("Error posting new user:", error);
            throw new Error(error.response?.data || "Failed to register user");
          }
        },
        validateToken: async (payload: ValidateTokenPayload) => {
          try {
            const { data } = await axiosClient.post(
              "/auth/validate-token",
              payload
            );
            set({ userState: { ...data.orgUser, token: data.token } });
          } catch (error) {
            console.error("Error validating token:", error);
            throw new Error(error.response?.data || "Failed to request token");
          }
        },
        logout: () => {
          set({ userState: undefined });
          localStorage.removeItem("auth-storage");
          window.location.href = "/login"; // Redirect to login
        },
      }),
      {
        name: "auth-storage", // this key will be used in localStorage
      }
    )
  )
);
