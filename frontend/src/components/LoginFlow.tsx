import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PhoneScreen from "./PhoneScreen";
import OtpScreen from "./OtpScreen";
import SignupScreen from "./SignupScreen";

import Navbar from "@/components/navbar";

const API_BASE = import.meta.env.VITE_Server_API_URL ?? "";

type Screen = "phone" | "otp" | "signup";

interface OtpVerifiedPayload {
  userExists: boolean;
  token?: string;
}

const LoginFlow: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("phone");
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  // verifiedToken state variable removed as its value was never read.

  // ---- Router hooks MUST be inside component body ----
  const navigate = useNavigate();
  const location = useLocation();
  // Determine where to redirect after successful login/signup
  const from =
    (location.state as { from?: string | Location })?.from || "/";

  // Step 1: Send OTP
  const handleContinue = async () => {
    const onlyDigits = phone.replace(/\D/g, "");
    if (onlyDigits.length !== 10) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}api/v1/user/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: `+91${onlyDigits}` }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Error" }));
        console.error("send-otp error:", err);
        return;
      }
      setScreen("otp");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Called when OTP verification returns: if user exists returns token else go to signup
  const handleOtpVerified = (payload: OtpVerifiedPayload) => {
    if (payload.userExists) {
      if (payload.token) {
        // Save token and redirect
        localStorage.setItem("token", payload.token);
      }
      navigate(from as string, { replace: true });
    } else {
      // User doesn't exist, proceed to signup
      setScreen("signup");
    }
  };

  // Called after signup completes
  const handleSignupComplete = (token?: string) => {
    if (token) {
      // Save token and redirect
      localStorage.setItem("token", token);
    }
    navigate(from as string, { replace: true });
  };

  return (
    <>
      <Navbar />
      <div>
        {screen === "phone" && (
          <PhoneScreen
            phone={phone}
            setPhone={setPhone}
            onContinue={handleContinue}
            loading={loading}
          />
        )}

        {screen === "otp" && (
          <OtpScreen
            phone={phone}
            onVerified={handleOtpVerified}
            goBack={() => setScreen("phone")}
          />
        )}

        {screen === "signup" && (
          <SignupScreen
            phone={phone}
            onSignupComplete={handleSignupComplete}
            goBack={() => setScreen("otp")}
          />
        )}
      </div>
    </>
  );
};

export default LoginFlow;