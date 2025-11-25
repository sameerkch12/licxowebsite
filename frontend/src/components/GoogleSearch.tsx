import { useState, useCallback } from "react";
import { Card, Input, Avatar } from "@heroui/react";
import { useLoadScript } from "@react-google-maps/api";
import DefaultLayout from "@/layouts/default";

interface Prediction {
  description: string;
  place_id: string;
}

const popularCities = [
  { name: "Near me", img: "/near.png" },
  { name: "Bangalore", img: "/bangalore.png" },
  { name: "Chennai", img: "/chennai.png" },
  { name: "Delhi", img: "/delhi.png" },
  { name: "Gurgaon", img: "/gurgaon.png" },
  { name: "Hyderabad", img: "/hyd.png" },
];

const allCities = [
  "Bhilai", "Durg", "Bhilai 3", "Raipur", "Kumhari", "RISALI", "Ahiwara",
  "Balod", "Dongargarh", "Rajnandgaon", "Bemetara", "Tilda", "Arang",
  "Simga", "Khairagarh", "Kawardha", "Bilaspur", "Mungeli", "Korba",
  "Mahasamund", "Dhamtari", "Abhanpur", "Patan", "Gunderdehi", "Charoda",
  "Utai", "Janjgir", "Akaltara", "Seoni", "Gariaband", "Saraipali",
];

export default function OyoSearchPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Prediction[]>([]);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: ["places"],
  });

  // -------------------------
  // GET USER LOCATION (NEAR ME)
  // -------------------------
  const getCurrentCity = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported on this device");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Reverse Geocoding (lat → city)
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results?.length) {
            const cityComponent = results[0].address_components.find((c) =>
              c.types.includes("locality")
            );

            const cityName = cityComponent?.long_name || "Unknown Location";
            setQuery(cityName);
          } else {
            alert("Unable to detect city");
          }
        });
      },
      () => alert("Please allow location permission")
    );
  };

  // -------------------------
  // GOOGLE CITY AUTOCOMPLETE
  // -------------------------
  const fetchPredictions = useCallback(
    (input: string) => {
      if (!isLoaded || !input) return setSuggestions([]);

      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        { input, types: ["(cities)"] },
        (preds) => setSuggestions(preds || [])
      );
    },
    [isLoaded]
  );

  return (
    <DefaultLayout>
      <div className="fixed inset-0 bg-white dark:bg-black z-40">
        <div className="h-full w-full flex items-stretch justify-center">
          <Card
            className="
              h-full w-full max-w-md 
              rounded-none md:rounded-2xl 
              p-5 md:p-6 shadow-xl 
              bg-white dark:bg-neutral-900 
              border border-gray-200 dark:border-neutral-800
              overflow-hidden
            "
          >
            <div className="flex flex-col h-full">

              {/* Search Bar */}
              <Input
                size="lg"
                radius="full"
                placeholder="Search for city, location or hotel"
                value={query}
                classNames={{
                  inputWrapper: "bg-gray-100 dark:bg-neutral-800 shadow-sm",
                }}
                onChange={(e) => {
                  setQuery(e.target.value);
                  fetchPredictions(e.target.value);
                }}
              />

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto mt-4">

                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">
                  POPULAR CITIES
                </p>

                <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4">
                  {popularCities.map((city) => (
                    <div
                      key={city.name}
                      className="flex flex-col items-center cursor-pointer shrink-0"
                      onClick={() =>
                        city.name === "Near me"
                          ? getCurrentCity()
                          : setQuery(city.name)
                      }
                    >
                      <Avatar src={city.img} className="w-14 h-14 shadow-sm" />
                      <p className="text-xs mt-1 text-gray-700 dark:text-gray-300">
                        {city.name}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Google suggestions */}
                {suggestions.length > 0 && (
                  <>
                    <p className="mt-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      SUGGESTIONS
                    </p>
                    {suggestions.map((s) => (
                      <div
                        key={s.place_id}
                        className="p-3 border-b border-gray-200 dark:border-neutral-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800"
                        onClick={() => setQuery(s.description)}
                      >
                        {s.description}
                      </div>
                    ))}
                  </>
                )}

                <p className="mt-6 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  ALL CITIES
                </p>

                {allCities.map((city) => (
                  <div
                    key={city}
                    className="p-3 border-b border-gray-200 dark:border-neutral-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800"
                    onClick={() => setQuery(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
}
