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
import { CounterPartyResponse } from "@/types/CounterParty";

interface CounterPartyDeleteModalProps {
  counterPartyData: CounterPartyResponse;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSent: (id: string) => void;
  type: "Customer" | "Supplier";
}

const CounterPartyDeleteModal = ({
  counterPartyData,
  isOpen,
  onClose,
  onDeleteSent,
  type,
}: CounterPartyDeleteModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would call your API to delete the counterParty
      // Simulate API call
      await onDeleteSent(counterPartyData.id);

      toast({
        title: `${type} Delete!`,
        description: `${type} has been deleted`,
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
            <span>Delete {type}</span>
          </DialogTitle>
          <DialogDescription>
            Please confirm if you want to delete the {type}{" "}
            <strong>{counterPartyData?.name}</strong>. This action cannot be
            undone.
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

export default CounterPartyDeleteModal;
