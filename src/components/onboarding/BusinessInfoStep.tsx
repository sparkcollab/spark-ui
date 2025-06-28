
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OnboardingData } from '@/pages/Onboarding';

interface BusinessInfoStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

const BusinessInfoStep = ({ data, onUpdate, onNext }: BusinessInfoStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!data.businessEmail.trim()) {
      newErrors.businessEmail = 'Business email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.businessEmail)) {
      newErrors.businessEmail = 'Please enter a valid email address';
    }

    if (!data.businessPhone.trim()) {
      newErrors.businessPhone = 'Business phone is required';
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            value={data.businessName}
            onChange={(e) => onUpdate({ businessName: e.target.value })}
            placeholder="Enter your business name"
            className={errors.businessName ? 'border-red-500' : ''}
          />
          {errors.businessName && (
            <p className="text-sm text-red-500 mt-1">{errors.businessName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="businessEmail">Business Email *</Label>
          <Input
            id="businessEmail"
            type="email"
            value={data.businessEmail}
            onChange={(e) => onUpdate({ businessEmail: e.target.value })}
            placeholder="business@example.com"
            className={errors.businessEmail ? 'border-red-500' : ''}
          />
          {errors.businessEmail && (
            <p className="text-sm text-red-500 mt-1">{errors.businessEmail}</p>
          )}
        </div>

        <div>
          <Label htmlFor="businessPhone">Business Phone *</Label>
          <Input
            id="businessPhone"
            type="tel"
            value={data.businessPhone}
            onChange={(e) => onUpdate({ businessPhone: e.target.value })}
            placeholder="(555) 123-4567"
            className={errors.businessPhone ? 'border-red-500' : ''}
          />
          {errors.businessPhone && (
            <p className="text-sm text-red-500 mt-1">{errors.businessPhone}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Continue to Your Information
        </Button>
      </div>
    </form>
  );
};

export default BusinessInfoStep;
