
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, Mail, Phone, Shield, CheckCircle, Users } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const StaffInviteRegistration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<'verify' | 'otp' | 'success'>('verify');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [contactValue, setContactValue] = useState('');
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // Mock invite data - in real app, this would come from the invite link
  const [inviteData] = useState({
    tenantName: 'Acme Corporation',
    role: 'Staff',
    prefilledEmail: searchParams.get('email') || '',
    prefilledPhone: searchParams.get('phone') || ''
  });

  useEffect(() => {
    // Pre-fill contact info from invite link
    if (inviteData.prefilledEmail) {
      setContactValue(inviteData.prefilledEmail);
      setContactMethod('email');
    } else if (inviteData.prefilledPhone) {
      setContactValue(inviteData.prefilledPhone);
      setContactMethod('phone');
    }
  }, [inviteData]);

  useEffect(() => {
    if (step === 'otp') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactValue.trim()) return;
    
    console.log(`Sending OTP to ${contactMethod}: ${contactValue}`);
    setStep('otp');
    setTimeLeft(60);
    setCanResend(false);
  };

  const handleOtpComplete = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      console.log(`Verifying OTP: ${value}`);
      // On success, show success screen
      setTimeout(() => {
        setStep('success');
      }, 1000);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    console.log(`Resending OTP to ${contactMethod}: ${contactValue}`);
    setTimeLeft(60);
    setCanResend(false);
    setOtp('');
  };

  const handleGetStarted = () => {
    navigate('/');
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('verify');
      setTimeLeft(60);
      setCanResend(false);
      setOtp('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              {step === 'success' ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : (
                <Users className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {step === 'verify' ? `Join ${inviteData.tenantName}` : 
               step === 'otp' ? 'Enter Code' : 'Welcome to the Team!'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {step === 'verify' ? `You've been invited to join as a ${inviteData.role}` :
               step === 'otp' ? 'Enter the 6-digit code to complete registration' :
               `You've successfully joined ${inviteData.tenantName} as a ${inviteData.role}`}
            </p>
          </div>

          {/* Step 1: Verify Contact */}
          {step === 'verify' && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-700">
                <button
                  type="button"
                  onClick={() => setContactMethod('email')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    contactMethod === 'email'
                      ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod('phone')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    contactMethod === 'phone'
                      ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </button>
              </div>

              <div>
                <Label htmlFor="contact">
                  {contactMethod === 'email' ? 'Email Address' : 'Phone Number'}
                </Label>
                <Input
                  id="contact"
                  type={contactMethod === 'email' ? 'email' : 'tel'}
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder={contactMethod === 'email' ? 'your@example.com' : '+1 (555) 123-4567'}
                  className="mt-1"
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Verify & Join Team
              </Button>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {step === 'otp' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <InputOTP value={otp} onChange={handleOtpComplete} maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Code sent via {contactMethod === 'email' ? 'email' : 'SMS'} to {contactValue}
                </p>
                
                {timeLeft > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend code in {timeLeft}s
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Registration Complete!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You now have access to {inviteData.tenantName} as a {inviteData.role}.
                </p>
              </div>

              <Button onClick={handleGetStarted} className="w-full" size="lg">
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffInviteRegistration;