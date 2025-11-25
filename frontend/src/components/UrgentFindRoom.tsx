
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { Zap, CheckCircle2, Clock, ArrowRight, Flame } from "lucide-react";

interface UrgentBannerProps {
  price?: number;
  bookedCount?: number;
  onButtonClick?: () => void;
}

export default function UrgentBanner({ 
  price = 50, 
  bookedCount = 240,
  onButtonClick 
}: UrgentBannerProps): JSX.Element {
  return (
    // PC View: max-w-md center align. Mobile View: w-full
    <div className="relative group w-full lg:max-w-md mx-auto my-8 p-4 md:p-0">
      
      {/* Background Glow Effect - Adjusts for dark mode */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur 
        opacity-30 group-hover:opacity-60 
        dark:opacity-20 dark:group-hover:opacity-40 
        transition duration-1000 group-hover:duration-200" 
      />
      
      {/* Card Base - Responsive: bg-white in light mode, bg-gray-900 in dark mode */}
      <Card className="relative w-full rounded-3xl shadow-xl overflow-hidden 
        bg-white text-gray-900 border border-blue-100/50 
        dark:bg-gray-900 dark:text-white dark:border-gray-700/50">
        
        {/* Decorative Background shapes (Responsive) */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full blur-2xl pointer-events-none 
          bg-blue-50 opacity-50 dark:bg-blue-900 dark:opacity-30" 
        />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full blur-xl pointer-events-none 
          bg-blue-100 opacity-40 dark:bg-purple-900 dark:opacity-20" 
        />

        <CardBody className="p-6 space-y-5 relative z-10">
          
          {/* Header Section with Red High Demand Chip (Stays the same for visibility) */}
          <div className="space-y-2">
            <Chip 
              size="sm" 
              variant="solid"
              classNames={{
                // Red Chip is highly visible in both modes
                base: "bg-red-600 border border-red-500 mb-2", 
                content: "text-white font-bold tracking-wide text-[10px] uppercase pl-1" 
              }}
              startContent={<Flame size={12} className="fill-yellow-300 text-yellow-300 animate-pulse" />}
            >
              High Demand
            </Chip>
            {/* Title text color adjusts */}
            <h2 className="text-2xl font-black tracking-tight leading-tight text-blue-950 dark:text-white">
              Urgently Need <br/> a Room?
            </h2>
          </div>

          {/* Benefits List - Text colors adjust for readability */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
              Get verified room owners to contact you directly within minutes!
            </p>
            
            <ul className="space-y-2.5">
              {/* Icon color adjusted slightly for dark mode (blue-500 to blue-400) */}
              <li className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Clock size={18} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
                <span>Super fast response (&lt; 15 mins)</span>
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <CheckCircle2 size={18} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
                <span>100% verified room owners</span>
              </li>
              <li className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <Zap size={18} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
                <span>Guaranteed callback</span>
              </li>
            </ul>
          </div>

          {/* Action Button - Gradient Purple to Blue (Stays the same) */}
          <Button
            size="lg"
            radius="full"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-md shadow-[0_4px_15px_rgba(128,0,128,0.3)] hover:shadow-[0_6px_20px_rgba(128,0,128,0.4)] hover:scale-[1.02] transition-all active:scale-95 border-none"
            endContent={<ArrowRight size={20} className="text-white" />}
            onPress={onButtonClick || (() => console.log("Redirecting to payment..."))}
          >
            Get Room Now — ₹{price}
          </Button>
          
          <p className="text-[11px] text-center text-gray-400 dark:text-gray-500 font-medium">
            ⚡️ {bookedCount}+ people booked today
          </p>

        </CardBody>
      </Card>
    </div>
  );
}