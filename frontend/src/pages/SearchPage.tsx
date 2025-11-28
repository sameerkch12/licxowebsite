import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationSearch from "@/components/LocationSearch";

// Define the type for the payload object for better clarity
interface LocationPayload {
  description: string;
  lat?: number; // optional latitude
  lng?: number; // optional longitude
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  /**
   * Constructs the query string and navigates to the results page.
   * This function handles both manual search and "Near Me" results.
   */
  const navigateToResults = (payload: LocationPayload) => {
    // Clear any previous errors when a search is initiated
    setLocationError(null);
    
    // Construct the query string based on the presence of lat/lng
    const q = payload.lat !== undefined && payload.lng !== undefined
      ? `lat=${payload.lat}&lng=${payload.lng}&place=${encodeURIComponent(payload.description)}`
      : `place=${encodeURIComponent(payload.description)}`;

    // Navigate to the results page with the constructed query string
    navigate(`/results?${q}`);
  };

  /**
   * Handler for the LocationSearch component (manual input).
   */
  const onLocationSelect = (payload: LocationPayload) => {
    navigateToResults(payload);
  };

  /**
   * Handler for the "Search Near Me" button.
   */
  const searchNearMe = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        
        // Use coordinates to navigate, setting "Current Location" as the description
        navigateToResults({
          description: "Current Location",
          lat: latitude,
          lng: longitude,
        });
      },
      (error) => {
        setIsLocating(false);
        let errorMessage: string;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Please allow location access to search nearby.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "The request to get user location timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred while getting location.";
        }
        setLocationError(errorMessage);
        console.error("Geolocation Error:", error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Geolocation options
    );
  };

  return (
    <div >
      
      
      {/* Search Input */}
      <LocationSearch onSelect={onLocationSelect} />
      
      <div className="flex items-center justify-between my-4">
        {/* Separator */}
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Near Me Button */}
      <button
        onClick={searchNearMe}
        disabled={isLocating}
        className={`w-full p-3 rounded font-semibold transition duration-150 ${
          isLocating 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
        }`}
      >
        {isLocating ? "Locating..." : "📍 Search Near Me"}
      </button>

      {/* Error Message */}
      {locationError && (
        <p className="mt-3 text-sm text-red-600 p-2 bg-red-50 border border-red-200 rounded">
          {locationError}
        </p>
      )}
    </div>
  );
}