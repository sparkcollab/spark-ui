import axiosClient from "@/api/axiosClient";
import { InviteStaffMember, StaffMember } from "@/types/Staff";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";

interface StaffState {
  staffList: StaffMember[];
  staffDetails: StaffMember | null;
  setStaffList: (staffList: StaffMember[]) => void;
  setStaffDetails: (staffDetails: StaffMember | null) => void;
  fetchStaffList: () => Promise<void>;
  fetchStaffDetails: (userId: string) => Promise<void>;
  inviteStaffMember: (staffData: InviteStaffMember) => Promise<void>;
  updateStaffMember: (userId: string, staffData: StaffMember) => Promise<void>;
  deleteStaffMember: (userId: string) => Promise<void>;
}

export const useStaffStore = create<StaffState>()(
  devtools((set) => ({
    staffList: [],
    staffDetails: null,
    setStaffList: (staffList) => set({ staffList }),
    setStaffDetails: (staffDetails) => set({ staffDetails }),
    fetchStaffList: async () => {
      try {
        console.log(useAuthStore.getState().userState);
        const { data } = await axiosClient.get(
          `org/${useAuthStore.getState().userState.orgId}/user`
        );
        set({ staffList: data.content });
      } catch (error) {
        console.error("Error fetching staff list:", error);
        throw new Error(error.response?.data || "Failed to fetch staff list");
      }
    },
    inviteStaffMember: async (staffData: InviteStaffMember) => {
      try {
        const { data } = await axiosClient.post(
          `org/${useAuthStore.getState().userState.orgId}/user/invite`,
          staffData
        );
        set((state) => ({
          staffList: [...state.staffList, data],
        }));
      } catch (error) {
        console.error("Error adding staff member:", error);
        throw new Error(error.response?.data || "Failed to add staff member");
      }
    },
    updateStaffMember: async (userId: string, staffData: StaffMember) => {
      try {
        const { data } = await axiosClient.put(
          `org/${useAuthStore.getState().userState.orgId}/user/${userId}`,
          staffData
        );
        set((state) => ({
          staffList: state.staffList.map((staff) =>
            staff.id === userId ? data : staff
          ),
        }));
      } catch (error) {
        console.error("Error updating staff member:", error);
        throw new Error(
          error.response?.data || "Failed to update staff member"
        );
      }
    },
    deleteStaffMember: async (userId: string) => {
      try {
        await axiosClient.delete(
          `org/${useAuthStore.getState().userState.orgId}/user/${userId}`
        );
        set((state) => ({
          staffList: state.staffList.filter((staff) => staff.id !== userId),
        }));
      } catch (error) {
        console.error("Error deleting staff member:", error);
        throw new Error(
          error.response?.data || "Failed to delete staff member"
        );
      }
    },
  }))
);
