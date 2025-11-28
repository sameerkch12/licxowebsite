// /mnt/data/OtpScreen.tsx
import React from "react";
import { Input, Button } from "@heroui/react";
import { Spinner } from "@heroui/react"; // Import Spinner for loading state

/**
 * Define the properties for the OtpScreen component.
 */
interface Props {
  phone: string;
  onVerified: (data: { userExists: boolean; token?: string }) => void;
  goBack?: () => void;
}

// Base API URL is loaded from environment variables
const API_BASE = import.meta.env.VITE_Server_API_URL;

/**
 * A responsive, full-width screen for users to enter the OTP verification code.
 * Supports light/dark mode.
 */
const OtpScreen: React.FC<Props> = ({ phone, onVerified, goBack }) => {
  const [codeArr, setCodeArr] = React.useState<string[]>(["", "", "", ""]);
  const [loading, setLoading] = React.useState(false);
  const onlyDigits = phone.replace(/\D/g, "");

  /**
   * Handles input change for each OTP box, focuses on the next box automatically.
   */
  const handleChange = (index: number, v: string) => {
    // Take only the last entered character
    const digit = v.slice(-1); 
    
    // Ensure the input is a digit or empty string for clearing
    if (digit && !/^\d$/.test(digit)) return;

    setCodeArr((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    // Auto-focus on the next input if a digit was entered and it's not the last box
    if (digit && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  /**
   * Handles form submission to verify the OTP.
   */
  const verify = async () => {
    const code = codeArr.join("");
    if (code.length !== 4) return alert("Enter 4-digit code");
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}api/v1/user/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phoneNumber: `+91${onlyDigits}`, 
          code 
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        return alert(data.message || "OTP verify failed");
      }
      
      // Notify parent component of verification status
      onVerified({ userExists: !!data.userExists, token: data.token });
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container: Full height, light/dark mode background, general text color, padding
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6">
      
      {/* Content wrapper: Centers content on larger screens (PC) for readability */}
      <div className="max-w-xl mx-auto"> 

        {/* Title */}
        <h2 className="text-2xl font-bold">
          Enter verification code
        </h2>

        {/* Subtitle/Info: Dark mode text color */}
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          A 4-digit code was sent to your mobile: 
          <strong className="text-gray-900 dark:text-white ml-1 block sm:inline mt-1 sm:mt-0">
            +91 {onlyDigits}
          </strong>
        </p>
        <p className=" text-red-500 font-semibold">
  Enter Default OTP: 0000
</p>

        {/* OTP Input Grid */}
        <div className="flex justify-between gap-3 sm:gap-4 max-w-sm">
          {codeArr.map((v, i) => (
            <Input
              key={i}
              id={`otp-input-${i}`}
              maxLength={1}
              // Large, centered input box with uniform size across platforms
              className="w-1/4 h-16 text-center text-xl font-mono" 
              value={v}
              onChange={(e) => handleChange(i, e.target.value)}
              type="tel"
              // Ensure bordered inputs look good in dark mode
              variant="bordered"
              inputMode="numeric" // Optimized for mobile numeric entry
            />
          ))}
        </div>

        {/* Verify Button: Full width, fixed color */}
        <Button
          className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center"
          onPress={verify}
          isDisabled={loading}
        >
          {loading ? (
            <Spinner
              classNames={{ label: "text-white ml-2" }}
              label="Verifying"
              variant="simple"
            />
          ) : (
            "Verify"
          )}
        </Button>

        {/* Back Button (Optional) */}
        {goBack && (
          <div className="flex justify-center mt-4">
            <button 
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition" 
              onClick={goBack as any}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpScreen;