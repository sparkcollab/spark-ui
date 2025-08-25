export interface InviteStaffMember {
  name: string;
  email: string;
  phone: string;
  role: string;
}
export type UpdateStaffMember = InviteStaffMember
export interface StaffMember {
  id: string;
  orgId: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  status?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
