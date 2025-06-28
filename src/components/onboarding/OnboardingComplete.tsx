
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { OnboardingData } from '@/pages/Onboarding';
import { useNavigate } from 'react-router-dom';

interface OnboardingCompleteProps {
  onboardingData: OnboardingData;
}

const OnboardingComplete = ({ onboardingData }: OnboardingCompleteProps) => {
  const navigate = useNavigate();

  const nextSteps = [
    { title: 'Add your first products', description: 'Start building your inventory catalog' },
    { title: 'Set up product lots', description: 'Track inventory by supplier and batch' },
    { title: 'Create your first invoice', description: 'Begin processing sales transactions' },
    { title: 'Add team members', description: 'Invite staff and assign roles' },
    { title: 'Configure settings', description: 'Customize your business preferences' },
  ];

  const handleGetStarted = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to ProfitPulse!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your account has been successfully created and activated.
            </p>
          </div>

          {/* Account Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-sm text-gray-500 dark:text-gray-400">Business</span>
                  <p className="font-semibold">{onboardingData.businessName}</p>
                </div>
                <div>
                  <span className="font-medium text-sm text-gray-500 dark:text-gray-400">Owner</span>
                  <p className="font-semibold">{onboardingData.ownerName}</p>
                </div>
                <div>
                  <span className="font-medium text-sm text-gray-500 dark:text-gray-400">Warehouse</span>
                  <p className="font-semibold">{onboardingData.warehouseName}</p>
                </div>
                <div>
                  <span className="font-medium text-sm text-gray-500 dark:text-gray-400">Plan</span>
                  <p className="font-semibold">Professional ($49.99/month)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Get Started Button */}
          <div className="text-center">
            <Button size="lg" onClick={handleGetStarted} className="px-8">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              You now have full access to Dashboard, Inventory, Sales, Customers, Staff, and Settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingComplete;