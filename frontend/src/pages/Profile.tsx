import  { useEffect, useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Card, CardBody, Avatar,  Divider } from "@heroui/react";
import { 
  ChevronRight, 
  Home, 
  MessageSquare, 
  PhoneCall, 
  Info, 
  Settings, 
  LogOut, 
  
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// 1. Define Token Interface based on your payload
interface DecodedToken {
  id: string;
  phoneNumber: string;
  iat: number;
  exp: number;
}

export default function ProfileMenu() {
  const navigate = useNavigate();
  const [user, setUser] = useState<DecodedToken | null>(null);

  // 2. Token Decode Logic
  useEffect(() => {
    try {
      // LocalStorage se token nikalein (key change karein agar aapne kuch aur rakha hai)
      const token = localStorage.getItem("authToken") || localStorage.getItem("token");
      
      if (token) {
        const decoded: DecodedToken = jwtDecode(token);
        setUser(decoded);
      }
    } catch (error) {
      console.error("Invalid Token", error);
    }
  }, []);

  // 3. Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login
  };

  // Menu Items with Icons
  const items = [
    { title: "My Room", icon: <Home size={20} />, link: "/my-room" },
    { title: "Feedback", icon: <MessageSquare size={20} />, link: "/feedback" },
    { title: "Contact Us", icon: <PhoneCall size={20} />, link: "/contact" },
    { title: "About App", icon: <Info size={20} />, link: "/about" },
    { title: "Settings", icon: <Settings size={20} />, link: "/settings" },
  ];

  return (
    <DefaultLayout>
      <div className="min-h-screen p-4 flex flex-col items-center gap-6">
        
        {/* === User Profile Card === */}
        <Card className="w-full max-w-md shadow-lg rounded-3xl border-none bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
          <CardBody className="flex flex-col items-center gap-3 py-8">
            <div className="relative">
              <Avatar
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png" // Default generic avatar
                className="w-24 h-24 text-large border-4 border-white dark:border-gray-700 shadow-xl"
                isBordered
                color="primary"
              />
              <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
            </div>
            
            <div className="text-center mt-2">
              {/* Fallback Name since token doesn't have name */}
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Hello, User!
              </h2>
              {/* Display Phone Number from Token */}
              <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center gap-1 mt-1">
                {user ? user.phoneNumber : "+91 XXXXX XXXXX"}
              </p>
              <div className="mt-2 inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs rounded-full font-semibold">
                Verified Member
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* === Menu Actions === */}
        <Card className="w-full max-w-md rounded-3xl shadow-md bg-white dark:bg-gray-900">
          <CardBody className="p-2">
            <div className="flex flex-col gap-1">
              {items.map((item, index) => (
                <div key={index}>
                  <a
                    href={item.link}
                    className="flex justify-between items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.98] transition-all rounded-2xl group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-300 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-base font-medium text-gray-700 dark:text-gray-200">
                        {item.title}
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </a>
                  {/* Add divider except for last item */}
                  {index < items.length - 1 && <Divider className="my-1 opacity-50" />}
                </div>
              ))}

              {/* === Logout Button === */}
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex justify-between items-center p-4 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-[0.98] transition-all rounded-2xl group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <LogOut size={20} />
                    </div>
                    <span className="text-base font-medium text-red-500">
                      Logout
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

        <p className="text-xs text-gray-400">App Version 1.0.0</p>
      </div>
    </DefaultLayout>
  );
}