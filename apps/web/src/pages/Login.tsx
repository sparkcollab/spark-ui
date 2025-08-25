import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ArrowLeft, Mail, Phone, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RequestTokenPayload } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";

const Login = () => {
  const navigate = useNavigate();
  const { requestToken, validateToken } = useAuthStore();
  const [step, setStep] = useState<"input" | "confirmation" | "otp">("input");
  const [contactMethod, setContactMethod] = useState<"email" | "phone">(
    "email"
  );
  const [contactValue, setContactValue] = useState("");
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({
    contactMethod: "",
    otp: "",
  });

  React.useEffect(() => {
    if (step === "confirmation" || step === "otp") {
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

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactValue.trim()) return;

    // Here you would call your API to send OTP
    console.log(`Sending OTP to ${contactMethod}: ${contactValue}`);
    try {
      await requestToken({
        [contactMethod]: contactValue,
      } as RequestTokenPayload);
      setErrors({ contactMethod: "" });
      setStep("confirmation");
      setTimeLeft(60);
      setCanResend(false);
    } catch (err) {
      setErrors({
        contactMethod: `${err.message}. Please try again.`,
      });
      console.error("Error sending OTP:", err);
      // Handle error, e.g., show error message
      return;
    }
  };

  const handleConfirmation = () => {
    setStep("otp");
  };

  const handleOtpComplete = async (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      // Here you would validate the OTP
      console.log(`Validating OTP: ${value}`);
      try {
        await validateToken({
          [contactMethod]: contactValue,
          token: value,
        });
        navigate("/");
        setStep("input");
        setErrors({ otp: "" });
        // After validation, you can redirect or show success message
      } catch (err) {
        setErrors({ otp: err.message || "Invalid OTP" });
        console.error("OTP validation failed:", err);
        // Handle error, e.g., show error message
        setOtp(""); // Clear OTP input
      }
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    console.log(`Resending OTP to ${contactMethod}: ${contactValue}`);
    setTimeLeft(60);
    setCanResend(false);
    setOtp("");
  };

  const handleBack = () => {
    if (step === "confirmation" || step === "otp") {
      setStep("input");
      setTimeLeft(60);
      setCanResend(false);
      setOtp("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {step === "input"
                ? "Secure Login"
                : step === "confirmation"
                ? "Code Sent"
                : "Enter Code"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {step === "input"
                ? "Enter your email or phone to continue"
                : step === "confirmation"
                ? "We've sent you a verification code"
                : "Enter the 6-digit code to complete login"}
            </p>
          </div>

          {/* Step 1: Contact Input */}
          {step === "input" && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-700">
                <button
                  type="button"
                  onClick={() => setContactMethod("email")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    contactMethod === "email"
                      ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod("phone")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    contactMethod === "phone"
                      ? "bg-white dark:bg-gray-800 text-blue-600 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </button>
              </div>

              <div>
                <Label htmlFor="contact">
                  {contactMethod === "email" ? "Email Address" : "Phone Number"}
                </Label>
                <Input
                  id="contact"
                  type={contactMethod === "email" ? "email" : "tel"}
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder={
                    contactMethod === "email"
                      ? "your@example.com"
                      : "+1 (555) 123-4567"
                  }
                  className="mt-1"
                  required
                />
                {errors.contactMethod && (
                  <p className="text-sm text-red-500 mt-1 whitespace-pre-line">
                    {errors.contactMethod}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg">
                Send Verification Code
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => navigate("/onboarding")}
              >
                Onboard Your Business
              </Button>
            </form>
          )}

          {/* Step 2: Confirmation */}
          {step === "confirmation" && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                {contactMethod === "email" ? (
                  <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                ) : (
                  <Phone className="w-8 h-8 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  We've sent a 6-digit verification code to:
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {contactValue}
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleConfirmation} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: OTP Input */}
          {step === "otp" && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  value={otp}
                  onChange={handleOtpComplete}
                  maxLength={6}
                >
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
                {errors.otp && (
                  <p className="text-sm text-red-500 mt-1 whitespace-pre-line">
                    {errors.otp}
                  </p>
                )}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Code sent via {contactMethod === "email" ? "email" : "SMS"} to{" "}
                  {contactValue}
                </p>

                {timeLeft > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend code in {timeLeft}s
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
