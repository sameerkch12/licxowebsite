// /mnt/data/SignupScreen.tsx
import React from "react";
import { Input, Button } from "@heroui/react";
import { Spinner } from "@heroui/react";

/**
 * Define the properties for the SignupScreen component.
 */
interface Props {
  phone: string;
  onSignupComplete: (token?: string) => void;
  goBack?: () => void;
}

// Base API URL is loaded from environment variables
const API_BASE = import.meta.env.VITE_Server_API_URL;

/**
 * A full-width screen for users to complete their signup by providing name and email.
 * It is responsive and supports light/dark mode.
 */
const SignupScreen: React.FC<Props> = ({ phone, onSignupComplete, goBack }) => {
  // Extract only digits from the phone number
  const onlyDigits = phone.replace(/\D/g, "");
  
  // Component states
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  /**
   * Handles the form submission for user registration.
   */
  const submit = async () => {
    // Basic validation
    if (!name.trim() || !email.trim()) return alert("Name and email required");
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}api/v1/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Assumes Indian country code
          phoneNumber: `+91${onlyDigits}`, 
          name: name.trim(),
          email: email.trim(),
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Handle API errors
        return alert(data.message || "Register failed");
      }
      
      // On successful registration, call the completion handler
      onSignupComplete(data.token);
    } catch (err) {
      console.error(err);
      alert("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container now holds the background color and applies padding.
    // Use 'max-w-screen-md' and 'mx-auto' on PC for readable width, but keep it full-width on mobile.
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6">
      
      {/* Content wrapper: Centers content on larger screens (PC) for readability 
          while maintaining the requested 'no-box' full-width appearance */}
      <div className="max-w-xl mx-auto"> 
        
        {/* Title: Dark mode text color */}
        <h2 className="text-2xl font-bold">
          Tell us more about yourself
        </h2>

        {/* Subtitle/Info: Dark mode text color */}
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          You are signing up with: 
          <strong className="text-gray-900 dark:text-white ml-1">
            +91 {onlyDigits}
          </strong>
        </p>

        {/* Full Name Input */}
        <Input
          label="Full name"
          variant="bordered"
          className="mt-6"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        {/* Email Address Input */}
        <Input
          label="Email address"
          variant="bordered"
          className="mt-4"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Note about code */}
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          We need these details to create your full account profile.
        </p>

        {/* Submit Button: Full width, fixed color */}
        <Button
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center"
          onPress={submit}
          isDisabled={loading}
        >
          {loading ? (
            <Spinner
              classNames={{ label: "text-white ml-2" }}
              label="Loading"
              variant="simple"
            />
          ) : (
            "Create an account"
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

export default SignupScreen;