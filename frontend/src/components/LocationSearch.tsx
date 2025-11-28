import  { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

// 1. Define the Expected Global Google Types
// Extend the Window interface to inform TypeScript that 'google' is globally available 
// after useLoadScript finishes loading.
declare global {
  interface Window {
    google: typeof google;
  }
}

// 2. Define Interfaces for Inputs and State

/**
 * Interface for the payload returned when a location is selected.
 */
interface LocationPayload {
  description: string;
  lat?: number;
  lng?: number;
}

/**
 * Props for the LocationSearch component.
 */
type LocationSearchProps = {
  onSelect: (payload: LocationPayload) => void;
};

/**
 * Interface for a Google Maps Place Prediction object.
 * We only need 'description' and 'place_id' for this component's use case.
 */
type PlacePrediction = google.maps.places.AutocompletePrediction;


export default function LocationSearch({ onSelect }: LocationSearchProps) {
  // Use a proper type for the ref
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const [query, setQuery] = useState("");
  // Use the defined PlacePrediction type
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  
  const { isLoaded } = useLoadScript({
    // Use the non-null assertion operator (!) if you're certain it's defined
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY!, 
    libraries: ["places"],
  });

  // --- Autocomplete Prediction Debounce Effect ---
  useEffect(() => {
    // Only run if Google Maps API is loaded and there is a query
    if (!isLoaded || !query) {
      // Clear predictions immediately if not loaded or query is empty
      setPredictions([]);
      return;
    }

    const id = setTimeout(() => {
      // Check for global 'google' object availability before accessing services
      if (!window.google) return;
      
      const service = new window.google.maps.places.AutocompleteService();
      
      service.getPlacePredictions({ input: query, types: ["(cities)"] }, (preds: PlacePrediction[] | null) => {
        // The service returns null if no results found, so we handle that
        setPredictions(preds || []);
      });
    }, 250);

    // Cleanup function for the debounce timeout
    return () => clearTimeout(id);
  }, [query, isLoaded]);

  // --- Handler for Selecting a Prediction ---
  const handleSelect = async (desc: string, placeId?: string) => {
    setQuery(desc);
    setPredictions([]);

    // If placeId available, resolve lat/lng using Geocoder
    if (placeId && isLoaded && window.google) {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ placeId }, (results, status) => {
        if (status === "OK" && results?.[0]?.geometry?.location) {
          const loc = results[0].geometry.location;
          // Successfully got coordinates
          onSelect({ description: desc, lat: loc.lat(), lng: loc.lng() });
        } else {
          // Geocoding failed or returned no location, still pass description
          onSelect({ description: desc });
        }
      });
    } else {
      // No placeId or API not loaded, just pass the description
      onSelect({ description: desc });
    }
  };

  return (
    <div className="w-full max-w-xl">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search city, area or hotel"
        className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150"
        disabled={!isLoaded} // Disable if Google Maps API is not loaded
      />
      
      {/* Loading indicator when not loaded */}
      {!isLoaded && <p className="text-sm text-gray-500 mt-1">Loading map services...</p>}

      {predictions.length > 0 && (
        <div className="bg-white border border-t-0 shadow-lg rounded-b mt-0 max-h-60 overflow-auto z-10 relative">
          {predictions.map((p) => (
            <div
              key={p.place_id}
              className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
              // Pass required arguments to handleSelect
              onClick={() => handleSelect(p.description, p.place_id)}
            >
              **{p.structured_formatting.main_text}** <span className="text-gray-500 text-sm">, {p.structured_formatting.secondary_text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}