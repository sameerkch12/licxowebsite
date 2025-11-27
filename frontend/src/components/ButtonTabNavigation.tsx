import React, { useState } from "react";
import { Home, Search, PlusCircle, User, Bed } from "lucide-react";
import { Button } from "@heroui/react";
import { useLocation } from "react-router-dom";

const useAuth = (): boolean => {
  return Boolean(typeof window !== "undefined" && localStorage.getItem("token"));
};

export default function ButtonTabNavigation() {
  const { pathname } = useLocation();
  const isAuthenticated = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  async function handleAdd() {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    try {
      setIsLoading(true);
      // Simulate work (replace with real async action if needed)
      await new Promise((res) => setTimeout(res, 900));
      window.location.href = "/addroom";
    } finally {
      setIsLoading(false);
    }
  }

  const item = (opts: { icon: React.ReactNode; label: string; href: string; rounded?: string }) => {
    const active = opts.href !== "#" && pathname === opts.href;
    const colorClass = active ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300";
    return (
      <button
        type="button"
        title={opts.label}
        onClick={() => (opts.href === "#" ? undefined : (window.location.href = opts.href))}
        className={`inline-flex flex-col items-center justify-center px-4 py-1 group ${opts.rounded ?? ""} hover:bg-neutral-100 dark:hover:bg-neutral-800`}
      >
        <div className={`${colorClass}`}>{opts.icon}</div>
        <span className={`text-xs mt-1 ${colorClass}`}>{opts.label}</span>
      </button>
    );
  };

  return (
    <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-full bottom-4 left-1/2 lg:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto items-center">
        {item({ icon: <Home className="w-6 h-6" />, label: "Home", href: "/", rounded: "rounded-s-full" })}
        {item({ icon: <Search className="w-6 h-6" />, label: "Search", href: "/search" })}

        <div className="flex items-center justify-center">
          <Button
            isLoading={isLoading}
            spinner={
              <svg
                className="animate-spin h-5 w-5 text-current"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2-647z"
                  fill="currentColor"
                />
              </svg>
            }
            onClick={handleAdd}
            className="bg-white dark:bg-neutral-900 rounded-full w-12 h-12 -mt-8 translate-y-1 border-4 border-white dark:border-neutral-900 shadow-md flex items-center justify-center"
          >
            {!isLoading && <PlusCircle className="w-6 h-6 text-red-600 dark:text-red-400" />}
            <span className="sr-only">Add Room</span>
          </Button>
        </div>

        {item({ icon: <Bed className="w-6 h-6" />, label: "My Room", href: "myroom" })}
        {item({ icon: <User className="w-6 h-6" />, label: "Profile", href: "/profile", rounded: "rounded-e-full" })}
      </div>
    </div>
  );
}
