import { useTheme } from "@heroui/use-theme";
import { Sun, Moon } from "lucide-react";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-4 py-2 rounded-md 
                 bg-gray-800 text-white dark:bg-gray-200 dark:text-black 
                 transition"
    >
      {theme === "light" ? (
        <>
          <Moon className="w-3 h-5" />
         
        </>
      ) : (
        <>
          <Sun className="w-3 h-5" />
         
        </>
      )}
    </button>
  );
};
