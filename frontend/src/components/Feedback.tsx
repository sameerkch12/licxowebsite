import React, { useRef, useEffect } from "react";
import { motion, useAnimation, AnimationControls } from "framer-motion";

// FeedbackScroller.tsx
// Default export React component (Tailwind CSS + Framer Motion) in TypeScript

export type FeedbackItem = {
  id: string | number;
  name: string;
  role?: string;
  text: string;
  avatarUrl?: string;
};

type Props = {
  feedbacks?: FeedbackItem[];
  speed?: number; // seconds for a full loop
  pauseOnHover?: boolean;
};

const sampleData: FeedbackItem[] = [
  { id: 1, name: "Ravi Kumar", role: "Guest", text: "Room was neat, location perfect and owner very helpful! Highly recommend." },
  { id: 2, name: "Sneha", role: "Guest", text: "Easy booking, lovely room. Will book again next visit." },
  { id: 3, name: "Amit (Owner)", role: "Owner", text: "Happy to host — quick responses and clean rooms. Contact for long stays." },
  { id: 4, name: "Priya", role: "Guest", text: "Great value for money. Owner arranged early check-in for us." },
];

function FeedbackScroller({
  feedbacks,
  speed = 15, // <<-- गति 30 से घटाकर 15 सेकंड की गई
  pauseOnHover = true,
}: Props) {
  const controls: AnimationControls = useAnimation();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const items = feedbacks && feedbacks.length ? feedbacks : sampleData;
  const loopItems = [...items, ...items]; 

  // Function to start the continuous leftward animation
  const startAnimation = React.useCallback(() => {
    controls.start({
      x: ["0%", "-50%"],
      transition: { repeat: Infinity, ease: "linear", duration: speed },
    });
  }, [controls, speed]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const handleMouseEnter = () => {
    if (pauseOnHover) controls.stop();
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) startAnimation();
  };

  return (
    <section className="w-full bg-gray-50/70 dark:bg-gray-900/40 p-2 rounded-2xl shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">User Feedback</h3>
         
        </div>

        <div
          className="overflow-hidden relative rounded-xl bg-white dark:bg-gray-800 p-3 shadow-inner"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={wrapperRef}
        >
          {/* Framer Motion container */}
          <motion.div
            className="flex whitespace-nowrap gap-4"
            animate={controls}
            initial={{ x: "0%" }}
          >
            {/* Loop through duplicated items for seamless scrolling */}
            {loopItems.map((f, idx) => (
              <div
                // Key needs to be unique across the entire loopItems array
                key={`${f.id}-${idx}`} 
                className="inline-flex items-start gap-3 min-w-[320px] max-w-sm p-3 rounded-xl shadow-md transition duration-300 transform hover:scale-[1.01] bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800/90 border border-gray-100 dark:border-gray-700"
              >
                {/* Avatar / Initial */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 text-lg font-bold">
                  {f.avatarUrl ? (
                    // Use Next/Image if in Next.js, otherwise disable lint rule as you have
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.avatarUrl} alt={f.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{(f.name || "?").charAt(0)}</span>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{f.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">• {f.role}</div>
                  </div>
                  {/* Truncated feedback text */}
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 truncate">{f.text}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

     
      </div>
    </section>
  );
}

// Export with React.memo for performance optimization
export default React.memo(FeedbackScroller);