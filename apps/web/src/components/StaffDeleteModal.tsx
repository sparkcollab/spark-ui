import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StaffMember } from "@/types/Staff";

interface StaffDeleteModalProps {
  staffData: StaffMember;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSent: (id: string) => void;
}

const StaffDeleteModal = ({
  staffData,
  isOpen,
  onClose,
  onDeleteSent,
}: StaffDeleteModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would call your API to delete the staff
      // Simulate API call
      await onDeleteSent(staffData.id);

      toast({
        title: "Delete Request Sent!",
        description: `Staff has been deleted`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span>Delete Staff Member</span>
          </DialogTitle>
          <DialogDescription>
            Please confirm if you want to delete the staff member{" "}
            <strong>{staffData?.name}</strong>. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDeleteModal;
