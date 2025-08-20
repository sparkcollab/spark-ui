import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import BusinessInfoStep from "../components/onboarding/BusinessInfoStep";
import OwnerInfoStep from "../components/onboarding/OwnerInfoStep";
import WarehousePaymentStep from "../components/onboarding/WarehousePaymentStep";
import OnboardingComplete from "../components/onboarding/OnboardingComplete";

export interface OnboardingData {
  // Business Info
  businessName: string;
  businessEmail: string;
  businessPhone: string;

  // Owner Info
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;

  // Warehouse Info
  warehouseName: string;
  warehouseLocation: string;
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    warehouseName: "",
    warehouseLocation: "",
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    {
      number: 1,
      title: "Business Information",
      description: "Tell us about your business",
    },
    {
      number: 2,
      title: "Your Information",
      description: "Owner details and account setup",
    },
    {
      number: 3,
      title: "Warehouse & Payment",
      description: "Complete your setup",
    },
  ];

  const updateData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...stepData }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsComplete(true);
  };

  if (isComplete) {
    return <OnboardingComplete onboardingData={onboardingData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">PP</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                ProfitPulse
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Welcome! Let's set up your business account
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex items-center space-x-2 ${
                    step.number <= currentStep
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  {step.number < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                        step.number === currentStep
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {step.number}
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm text-gray-500">
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">
                Step {currentStep}: {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <BusinessInfoStep
                  data={onboardingData}
                  onUpdate={updateData}
                  onNext={handleNext}
                />
              )}
              {currentStep === 2 && (
                <OwnerInfoStep
                  data={onboardingData}
                  onUpdate={updateData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}
              {currentStep === 3 && (
                <WarehousePaymentStep
                  data={onboardingData}
                  onUpdate={updateData}
                  onBack={handleBack}
                  onComplete={handleComplete}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
