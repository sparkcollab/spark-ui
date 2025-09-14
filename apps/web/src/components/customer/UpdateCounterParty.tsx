import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserPlus, Mail, Phone, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CounterParty, CounterPartyResponse } from "@/types/CounterParty";
import { Textarea } from "../ui/textarea";
import { useAuthStore } from "@/store/useAuthStore";

interface UpdateCounterPartyProps {
  isOpen: boolean;
  onClose: () => void;
  onCounterPartyUpdate: (counterPartyData: CounterParty) => void;
  counterPartyData: CounterPartyResponse | null;
  type: "Customer" | "Supplier";
}

const UpdateCounterParty = ({
  isOpen,
  onClose,
  onCounterPartyUpdate,
  counterPartyData,
  type
}: UpdateCounterPartyProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<CounterParty>({
    name: "",
    email: "",
    phone: "",
    kind: type.toUpperCase() as "CUSTOMER" | "SUPPLIER",
    createdBy: "",
    updatedBy: "",
    address: "",
  });
  useEffect(() => {
    if (counterPartyData) {
      setFormData({
        name: counterPartyData.name,
        email: counterPartyData.email,
        phone: counterPartyData.phone || "",
        kind: counterPartyData.kind,
        createdBy: counterPartyData.createdBy,
        updatedBy: counterPartyData.updatedBy,
        address: counterPartyData.address || "",
      });
    }
  }, [counterPartyData]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    userState: { id },
  } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "CounterParty Updateed!",
        description: `CounterParty ${formData.name} has been updated successfully.`,
      });

      // Update the new counterParty member to the list with pending status
      const newCounterPartyMember = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        kind: formData.kind,
        address: formData.address,
        createdBy: id, // Replace with actual current user ID
        updatedBy: id, // Replace with actual current user ID
      };

      onCounterPartyUpdate(newCounterPartyMember);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        kind: "CUSTOMER",
        createdBy: "",
        updatedBy: "",
        address: "",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update counterParty. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span>Update CounterParty</span>
          </DialogTitle>
          <DialogDescription>
            Update counterParty details below and click "Update" to save
            changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Full Name</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter full name"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email Updateress</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="email@example.com"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Phone Number</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="kind">Kind</Label>
            <Select
              value={formData.kind}
              onValueChange={(value) => handleInputChange("kind", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPPLIER">Supplier</SelectItem>
                <SelectItem value="CUSTOMER">CounterParty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address">Updateress</Label>
            <Textarea
              id="address"
              value={formData.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter address"
              className="mt-1"
            />
          </div>

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
              {isLoading ? "Updateing..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCounterParty;
