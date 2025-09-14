import axiosClient from "@/api/axiosClient";
import {
  LocationState,
  RegistrationState,
  RequestTokenPayload,
  User,
  ValidateTokenPayload,
} from "@/types";
import { create } from "zustand";

export interface AuthState {
  isAuthenticated: boolean;
  userState: null | User;
  registrationState: null | RegistrationState;
  locationState: LocationState | null;
  setUserState: (userState: User | null, successAction?: () => void) => void;
  requestToken: (payload: RequestTokenPayload) => Promise<void>;
  registerUser: (userState: RegistrationState) => void;
  validateToken: (
    payload: ValidateTokenPayload,
    successAction?: () => void
  ) => Promise<void>;
  logout: () => void;
  validateSession: () => Promise<void>;
  getLocationId: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  userState: null,
  registrationState: null,
  locationState: null,
  setUserState: (userState, successAction) => {
    set({ userState });
    successAction?.();
  },
  requestToken: async (payload: RequestTokenPayload) => {
    try {
      const { data } = await axiosClient.post("/auth/request-token", payload);
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
      const { data } = await axiosClient.post("/auth/validate-token", payload);
      set({
        userState: { ...data.orgUser, token: data.token },
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Error validating token:", error);
      throw new Error(error.response?.data || "Failed to request token");
    }
  },
  logout: async () => {
    try {
      const { data } = await axiosClient.get("/auth/logout");
      set({ userState: undefined, isAuthenticated: false });
      window.location.href = "/login"; // Redirect to login
      return data;
    } catch (error) {
      console.error("Error logging out:", error);
      throw new Error(error.response?.data || "Failed to logout");
    }
  },
  validateSession: async () => {
    try {
      const { data } = await axiosClient.get("/auth/session");
      set({ userState: { ...data.orgUser, token: data.token } });
      return data;
    } catch (error) {
      console.error("Error requesting token:", error);
      throw new Error(error.response?.data || "Failed to request token");
    }
  },
  getLocationId: async () => {
    try {
      const { data } = await axiosClient.get(
        `org/${useAuthStore.getState().userState.orgId}/location`
      );
      set({
        userState: {
          ...useAuthStore.getState().userState,
          locationId: data.content?.[0].id,
        },
        locationState: data,
      });
      return data;
    } catch (error) {
      console.error("Error requesting token:", error);
      throw new Error(error.response?.data || "Failed to request token");
    }
  },
}));
