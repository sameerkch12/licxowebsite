import { useState } from "react";
import { Search, MapPin, TrendingUp, ChevronRight } from "lucide-react";
import UrgentBanner from "@/components/UrgentFindRoom";

// Helper function to navigate for search
const go = (v: string) => {
  // City value ko encode karke /search URL pe bhej dega
  window.location.href = `/search?q=${encodeURIComponent(v)}`;
};

export default function App() {
  const [q, setQ] = useState<string>("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      go(q.trim());
    }
  };

  const topDestinations = ["Near me", "Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad", "Mumbai", "Pune", "Kolkata", "Goa", "Jaipur"];

  return (
    // Set default and dark mode background
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* Header section is clean and minimal */}
      <header className="w-full">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          {/* Minimal header padding */}
        </div>
      </header>

      {/* Main content pushed up slightly (py-8) */}
      <main className="flex-grow w-full py-8 sm:py-10 lg:py-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="overflow-hidden"> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              
              {/* Search Form Section */}
              <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                
                {/* Heading placed above the search form */}
                <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-6 dark:text-indigo-400">
                    <span className="text-gray-900 dark:text-gray-50">Find Rooms</span> at Best Prices
                </h2>

                <form onSubmit={submit} className="w-full">
                  
                  {/* Destination Input */}
                  <label 
                    htmlFor="destination-search" 
                    className="text-sm font-medium text-gray-700 block mb-2 dark:text-gray-300"
                  >
                    Destination
                  </label>
                  
                  <div className="relative mb-6">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5 dark:text-indigo-400" />
                    <input
                      id="destination-search"
                      type="text"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="City, location or hotel name..."
                      // Dark mode input styling
                      className="w-full pl-12 pr-4 py-4 text-base border-0 border-b border-gray-300 focus:border-indigo-500 rounded-none focus:ring-0 focus:outline-none transition duration-300 placeholder:text-gray-400 dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700 dark:focus:border-indigo-400"
                      style={{ cursor: "text" }}
                      required
                    />
                  </div>
                  
                  {/* Search Button */}
                  <button 
                    type="submit" 
                    className="w-full bg-indigo-600 text-white text-lg font-bold py-4 rounded-xl 
                               hover:bg-indigo-700 transition duration-300 
                               flex items-center justify-center space-x-2 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                    disabled={!q.trim()}
                  >
                    <Search className="w-5 h-5"/>
                    <span>Search Hotels</span>
                  </button>
                </form>
                
                {/* Explore Destinations Section - SWIPEABLE */}
                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center justify-between dark:text-gray-50">
                    <span className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-indigo-500 mr-2 dark:text-indigo-400"/> Explore Top Destinations
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500"/>
                  </h3>
                  
                  {/* Scrollable Container */}
                  <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                    {topDestinations.map(city=>(
                      <button 
                        key={city} 
                        onClick={()=>go(city)} 
                        // Dark mode button styling
                        className="text-sm px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full 
                                   hover:bg-indigo-100 transition duration-200 font-medium flex-shrink-0 whitespace-nowrap 
                                   dark:bg-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-800"
                        title={city}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">← Scroll to see more destinations</p>
                </div>
              </div>

              {/* Decorative Image/Illustration Section */}
              <div className="hidden md:flex items-center justify-center bg-indigo-50 p-6 lg:p-12 dark:bg-indigo-900/50">
                <div className="w-full max-w-md text-center">
                  {/* Dark mode gradient adjustment */}
                  <div className="h-64 rounded-xl bg-gradient-to-br from-indigo-300 to-purple-400 flex items-center justify-center p-4 dark:from-indigo-600 dark:to-purple-700">
                    <span className="text-white text-lg font-semibold opacity-80 border-2 border-white/50 px-4 py-2 rounded-lg backdrop-blur-sm">Your Dream Stay Awaits</span>
                  </div>
                  <p className="text-sm text-indigo-700 font-medium mt-4 dark:text-indigo-300">
                    Discover handpicked rooms, instant bookings, and unbeatable deals for your perfect trip.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <UrgentBanner/>
      </main>

    </div>
  );
}