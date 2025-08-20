
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnboardingData } from '@/pages/Onboarding';

interface OwnerInfoStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const OwnerInfoStep = ({ data, onUpdate, onNext, onBack }: OwnerInfoStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (!data.ownerEmail.trim()) {
      newErrors.ownerEmail = 'Owner email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.ownerEmail)) {
      newErrors.ownerEmail = 'Please enter a valid email address';
    }

    if (!data.ownerPhone.trim()) {
      newErrors.ownerPhone = 'Owner phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Account Setup
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          You will be assigned the "Owner" role with full access to all features and settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="ownerName">Full Name *</Label>
          <Input
            id="ownerName"
            value={data.ownerName}
            onChange={(e) => onUpdate({ ownerName: e.target.value })}
            placeholder="Enter your full name"
            className={errors.ownerName ? 'border-red-500' : ''}
          />
          {errors.ownerName && (
            <p className="text-sm text-red-500 mt-1">{errors.ownerName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="ownerEmail">Email Address *</Label>
          <Input
            id="ownerEmail"
            type="email"
            value={data.ownerEmail}
            onChange={(e) => onUpdate({ ownerEmail: e.target.value })}
            placeholder="your@example.com"
            className={errors.ownerEmail ? 'border-red-500' : ''}
          />
          {errors.ownerEmail && (
            <p className="text-sm text-red-500 mt-1">{errors.ownerEmail}</p>
          )}
        </div>

        <div>
          <Label htmlFor="ownerPhone">Phone Number *</Label>
          <Input
            id="ownerPhone"
            type="tel"
            value={data.ownerPhone}
            onChange={(e) => onUpdate({ ownerPhone: e.target.value })}
            placeholder="(555) 123-4567"
            className={errors.ownerPhone ? 'border-red-500' : ''}
          />
          {errors.ownerPhone && (
            <p className="text-sm text-red-500 mt-1">{errors.ownerPhone}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" size="lg">
          Continue to Warehouse & Payment
        </Button>
      </div>
    </form>
  );
};

export default OwnerInfoStep;
