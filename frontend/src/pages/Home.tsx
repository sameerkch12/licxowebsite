import { TrendingUp, ChevronRight } from "lucide-react";

import SearchPage from "./SearchPage";

// ===============================
// ✅ City-wise URL Mapping (LIVE DOMAIN)
// ===============================
const cityLinks: Record<string, string> = {
  Bhilai: "https://www.licxorental.in/results?lat=21.1938475&lng=81.3509416&place=Bhilai%2C%20Chhattisgarh%2C%20India",
  Durg: "https://www.licxorental.in/results?lat=21.190449&lng=81.283216&place=Durg%2C%20Chhattisgarh%2C%20India",
  Charoda: "https://www.licxorental.in/results?lat=21.166&lng=81.40&place=Charoda%2C%20Chhattisgarh%2C%20India",
  Raipur: "https://www.licxorental.in/results?lat=21.251384&lng=81.629641&place=Raipur%2C%20Chhattisgarh%2C%20India",
  Hyderabad: "https://www.licxorental.in/results?lat=17.385044&lng=78.486671&place=Hyderabad%2C%20India",
  Mumbai: "https://www.licxorental.in/results?lat=19.07609&lng=72.877426&place=Mumbai%2C%20Maharashtra%2C%20India",
  Pune: "https://www.licxorental.in/results?lat=18.52043&lng=73.856743&place=Pune%2C%20Maharashtra%2C%20India",
  Kolkata: "https://www.licxorental.in/results?lat=22.572645&lng=88.363892&place=Kolkata%2C%20West%20Bengal%2C%20India",
  Goa: "https://www.licxorental.in/results?lat=15.299326&lng=74.123993&place=Goa%2C%20India",
  Jaipur: "https://www.licxorental.in/results?lat=26.912434&lng=75.787271&place=Jaipur%2C%20Rajasthan%2C%20India",
};

// ===============================
// ✅ go() Function
// ===============================
const go = (city: string) => {
  if (cityLinks[city]) {
    window.location.href = cityLinks[city]; // Open LIVE URL
  } else {
    window.location.href = `/search?q=${encodeURIComponent(city)}`;
  }
};

export default function App() {
  const topDestinations = [
    "Bhilai", "Durg", "Charoda", "Raipur",
    "Hyderabad", "Mumbai", "Pune", "Kolkata",
    "Goa", "Jaipur"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <header className="w-full">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-2"></div>
      </header>

      <main className="flex-grow w-full py-8 sm:py-10 lg:py-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

              {/* Search Section */}
              <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                <h2 className="text-2xl md:text-2xl font-bold text-indigo-700 mb-1 dark:text-indigo-400">
                  <span className="text-gray-900 dark:text-gray-50">
                    Find Rooms and PG
                  </span> at Best Prices
                </h2>

                <form className="w-full">
                  <label
                    htmlFor="destination-search"
                    className="text-sm font-medium text-gray-700 block mb-2 dark:text-gray-300"
                  >
                    Destination
                  </label>

                  <div className="relative mb-6">
                    <SearchPage />
                  </div>
                </form>

                {/* Top Destinations */}
                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center justify-between dark:text-gray-50">
                    <span className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-indigo-500 mr-2 dark:text-indigo-400" />
                      Explore Top Destinations
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </h3>

                  <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                    {topDestinations.map((city) => (
                      <button
                        key={city}
                        onClick={() => go(city)}
                        className="text-sm px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full
                        hover:bg-indigo-100 transition duration-200 font-medium flex-shrink-0 whitespace-nowrap
                        dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
                      >
                        {city}
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
                    ← Scroll to see more destinations
                  </p>
                </div>
              </div>

              {/* Right Side Illustration */}
              <div className="hidden md:flex items-center justify-center bg-indigo-50 p-6 lg:p-12 dark:bg-indigo-900/50">
                <div className="w-full max-w-md text-center">
                  <div className="h-64 rounded-xl bg-gradient-to-br from-indigo-300 to-purple-400 flex items-center justify-center p-4 dark:from-indigo-600 dark:to-purple-700">
                    <span className="text-white text-lg font-semibold opacity-80 border-2 border-white/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                      Your Dream Stay Awaits
                    </span>
                  </div>
                  <p className="text-sm text-indigo-700 font-medium mt-4 dark:text-indigo-300">
                    Discover handpicked rooms, instant bookings, and unbeatable deals for your perfect trip.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}