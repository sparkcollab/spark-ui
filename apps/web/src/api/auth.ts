import {
  RegistrationState,
  RequestTokenPayload,
  ValidateTokenPayload,
} from "@/types";
import axiosClient from "./axiosClient";

export const authApi = {
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
  validateToken: async (payload: ValidateTokenPayload, set) => {
    try {
      const { data } = await axiosClient.post("/auth/validate-token", payload);
      set({ userState: { ...data.orgUser, token: data.token } });
    } catch (error) {
      console.error("Error validating token:", error);
      throw new Error(error.response?.data || "Failed to request token");
    }
  },
  validateSession: async () => {
    try {
      const { data } = await axiosClient.get("/auth/session");
      return data;
    } catch (error) {
      console.error("Error requesting token:", error);
      throw new Error(error.response?.data || "Failed to request token");
    }
  },
};
