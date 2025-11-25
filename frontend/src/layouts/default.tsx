

import  Navbar  from "@/components/navbar";
import ButtonTabNavigation from "@/components/ButtonTabNavigation";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <div className="relative flex flex-col h-screen">
       <Navbar />
      <main >
      
        {children}
      </main>
         <ButtonTabNavigation />
      <footer className="w-full flex items-center justify-center py-3">
    
      </footer>
    </div>
  );
}
