import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Warehouse } from "lucide-react";
import { OnboardingData } from "@/pages/Onboarding";
import { useStore } from "@/store/useStore";

interface WarehousePaymentStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  onComplete: () => void;
}

const WarehousePaymentStep = ({
  data,
  onUpdate,
  onBack,
  onComplete,
}: WarehousePaymentStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const { registerUser } = useStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.warehouseName.trim()) {
      newErrors.warehouseName = "Warehouse name is required";
    }

    if (!data.warehouseLocation.trim()) {
      newErrors.warehouseLocation = "Warehouse location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment processing
    try {
      await registerUser({
        org: {
          email: data.businessEmail,
          name: data.businessName,
          phone: data.businessPhone,
        },
        owner: {
          email: data.ownerEmail,
          name: data.ownerName,
          phone: data.ownerPhone,
          role: "OWNER",
        },
        location: {
          name: data.warehouseName,
          address: data.warehouseLocation,
        },
        payment: {
          email: data.businessEmail,
          name: data.businessName,
          amount: 99.99, // Example amount
          currency: "USD",
          paymentMethodId: "pm_card_visa", // Example payment method ID
        },
      });
      setErrors({});
      onComplete();
    } catch (error) {
      setErrors({ general: error.message || "Failed to complete onboarding" });
      console.error("Error completing onboarding:", error);
      // Handle error, e.g., show error message
      return;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Warehouse Information */}
      <Card>
        <CardHeader>
          {errors.general && (
            <div className="bg-red-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-red-900 dark:text-blue-200 mb-2">
                Account Setup
              </h3>
              <p className="text-sm text-red-700 dark:text-blue-300">
                {errors.general}
              </p>
            </div>
          )}
          <CardTitle className="flex items-center space-x-2">
            <Warehouse className="w-5 h-5" />
            <span>First Warehouse</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="warehouseName">Warehouse Name *</Label>
            <Input
              id="warehouseName"
              value={data.warehouseName}
              onChange={(e) => onUpdate({ warehouseName: e.target.value })}
              placeholder="Main Warehouse"
              className={errors.warehouseName ? "border-red-500" : ""}
            />
            {errors.warehouseName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.warehouseName}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="warehouseLocation">Location *</Label>
            <Input
              id="warehouseLocation"
              value={data.warehouseLocation}
              onChange={(e) => onUpdate({ warehouseLocation: e.target.value })}
              placeholder="123 Main St, City, State, ZIP"
              className={errors.warehouseLocation ? "border-red-500" : ""}
            />
            {errors.warehouseLocation && (
              <p className="text-sm text-red-500 mt-1">
                {errors.warehouseLocation}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Registration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Business:</span>
              <p className="text-gray-600 dark:text-gray-300">
                {data.businessName}
              </p>
            </div>
            <div>
              <span className="font-medium">Business Email:</span>
              <p className="text-gray-600 dark:text-gray-300">
                {data.businessEmail}
              </p>
            </div>
            <div>
              <span className="font-medium">Owner:</span>
              <p className="text-gray-600 dark:text-gray-300">
                {data.ownerName}
              </p>
            </div>
            <div>
              <span className="font-medium">Owner Email:</span>
              <p className="text-gray-600 dark:text-gray-300">
                {data.ownerEmail}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="font-medium">Monthly Plan</span>
            <span className="text-lg font-bold">$49.99/month</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Secure payment processing with Stripe
            </p>
            <p className="text-sm text-gray-500">
              Your payment information is encrypted and secure. You can cancel
              anytime.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={isProcessing}
          className="min-w-32"
        >
          {isProcessing ? "Processing..." : "Complete Setup & Pay"}
        </Button>
      </div>
    </form>
  );
};

export default WarehousePaymentStep;
