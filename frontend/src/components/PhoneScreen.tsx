import React from "react";
import { Input, Button } from "@heroui/react";

interface Props {
  phone: string;
  setPhone: (val: string) => void;
  onContinue: () => void;
  loading: boolean;
}

const PhoneScreen: React.FC<Props> = ({
  phone,
  setPhone,
  onContinue,
  loading,
}) => {
  return (
    // मेन कंटेनर पर टेक्स्ट के लिए डार्क/लाइट मोड क्लास लागू की गई है।
    // इससे हेडिंग और अन्य टेक्स्ट स्वतः ही रंग बदल लेंगे।
    <div className="w-full mt-5 p-5 md:p-8 text-gray-900 dark:text-white">
      
      <h2 className="text-2xl font-bold mb-6 text-start">
        Log in or create an account
      </h2>

      <Input
        label="Mobile Number"
        variant="bordered"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        size="lg"
        type="tel"
        placeholder="Enter your 10-digit number"
        
        // +91 के लिए fixed startContent और उसके बॉर्डर को responsive बनाया गया है।
        startContent={
          <div 
            // टेक्स्ट और बॉर्डर का रंग डार्क मोड में बदल जाएगा
            className="flex items-center text-gray-900 dark:text-white border-r border-gray-300 dark:border-gray-700 pr-2 mr-2"
          >
            <span className="font-semibold">+91</span>
          </div>
        }
      />

      <Button
        // बटन का रंग लाल (bg-red-500) और टेक्स्ट सफ़ेद (text-white) है, जो दोनों मोड में ठीक काम करेगा।
        className="w-full mt-6 bg-indigo-600 text-white"
        onPress={onContinue}
        isLoading={loading}
        isDisabled={loading || phone.length !== 10}
        size="lg"
      >
        Continue
      </Button>
    </div>
  );
};

export default PhoneScreen;