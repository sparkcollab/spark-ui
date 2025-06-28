
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { UserPlus, Mail, Phone, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StaffInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSent: (staffData: any) => void;
}

const StaffInviteModal = ({ isOpen, onClose, onInviteSent }: StaffInviteModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staff'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Here you would call your API to send the staff invite
      console.log('Sending staff invite:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Invite Sent!",
        description: `Staff invitation has been sent to ${formData.email}`,
      });

      // Add the new staff member to the list with pending status
      const newStaffMember = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: 'Pending',
        inviteDate: new Date().toISOString().split('T')[0]
      };

      onInviteSent(newStaffMember);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Staff'
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invite. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span>Invite Staff Member</span>
          </DialogTitle>
          <DialogDescription>
            Send an invitation to join your team. They'll receive a secure link to complete registration.
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
              onChange={(e) => handleInputChange('name', e.target.value)}
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
              onChange={(e) => handleInputChange('email', e.target.value)}
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
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Owner">Owner</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>
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
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StaffInviteModal;