import React, { useState } from "react";
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
import { Customer } from "@/types/Customer";
import { Textarea } from "../ui/textarea";
import { useAuthStore } from "@/store/useAuthStore";
import { add } from "date-fns";

interface AddCustomerProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerAdd: (customerData: Customer) => void;
}

const AddCustomer = ({ isOpen, onClose, onCustomerAdd }: AddCustomerProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
    kind: "CUSTOMER",
    createdBy: "",
    updatedBy: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const {
    userState: { id },
  } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would call your API to send the customer invite
      console.log("Sending customer invite:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Customer Added!",
        description: `Customer ${formData.name} has been added successfully.`,
      });

      // Add the new customer member to the list with pending status
      const newCustomerMember = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        kind: formData.kind,
        address: formData.address,
        createdBy: id, // Replace with actual current user ID
        updatedBy: id, // Replace with actual current user ID
      };

      onCustomerAdd(newCustomerMember);

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
        description: "Failed to add customer. Please try again.",
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
            <span>Add Customer</span>
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new customer to your account.
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
              <span>Email Address</span>
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
                <SelectItem value="CUSTOMER">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
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
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomer;
