
import { Home, User, Bed } from "lucide-react"; // Removed Search and PlusCircle
import { useLocation } from "react-router-dom";
// Note: The Button component and useAuth hook were only used for the Add/Plus button,
// which is being removed, so they are kept for compilation safety but are no longer active.

// The useAuth hook is no longer functionally required but is kept if other parts rely on it.


export default function ButtonTabNavigation() {
  const { pathname } = useLocation();
  // const isAuthenticated = useAuth(); // Not used anymore
  
  // const [isLoading, setIsLoading] = useState(false); // Not used anymore
  
  // The handleAdd function is no longer needed as the button is removed.
  /*
  async function handleAdd() {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    try {
      setIsLoading(true);
      await new Promise((res) => setTimeout(res, 900));
      window.location.href = "/addroom";
    } finally {
      setIsLoading(false);
    }
  }
  */

  const item = (opts: { icon: React.ReactNode; label: string; href: string; rounded?: string }) => {
    // Determine active state based on current pathname
    const active = opts.href !== "#" && pathname === opts.href;
    
    // Set color class for active/inactive state
    const colorClass = active ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300";
    
    return (
      <button
        type="button"
        title={opts.label}
        // Use window.location.href for navigation
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
      {/* CHANGED: grid-cols-5 to grid-cols-3 
        The layout now accommodates only 3 items.
      */}
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto items-center">
        
        {/* 1. Home (Leftmost, rounded start) */}
        {item({ icon: <Home className="w-6 h-6" />, label: "Home", href: "/", rounded: "rounded-s-full" })}
        
        {/* 2. My Room (Center) */}
        {item({ icon: <Bed className="w-6 h-6" />, label: "My Room", href: "/myroom" })} 
        
        {/* 3. Profile (Rightmost, rounded end) */}
        {item({ icon: <User className="w-6 h-6" />, label: "Profile", href: "/profile", rounded: "rounded-e-full" })}
        
        {/* Removed: Search, Add Room (and its related Button/logic/imports) */}

      </div>
    </div>
  );
}