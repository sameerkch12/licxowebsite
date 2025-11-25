import DefaultLayout from "@/layouts/default";
import { Card, CardBody, Avatar } from "@heroui/react";
import { ChevronRight } from "lucide-react";

export default function ProfileMenu() {
  const items = [
    { title: "My Room", link: "#" },
    { title: "Feedback", link: "#" },
    { title: "Contact Us", link: "#" },
    { title: "About App", link: "#" },
    { title: "Settings", link: "#" },
  ];

  return (
    <DefaultLayout>
 <div className="min-h-screen  p-4 flex flex-col items-center">
         {/* User Header */}
      <Card className="w-full max-w-md shadow-md rounded-2xl">
        <CardBody className="flex flex-col items-center gap-4 py-6">
          <Avatar
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            className="w-24 h-24"
          />
          <h2 className="text-xl font-semibold">Sameer Choudhary</h2>
          <p className="text-gray-600 text-sm">Web Developer | MERN Stack</p>
        </CardBody>
      </Card>
      
      <Card className="w-full max-w-md rounded-2xl shadow-md">
        <CardBody className="divide-y p-0">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="flex justify-between items-center p-4 hover:bg-gray-200 active:bg-gray-300 transition rounded-xl"
            >
              <span className="text-base font-medium text-gray-800">
                {item.title}
              </span>

              <ChevronRight size={20} className="text-gray-500" />
            </a>
          ))}
        </CardBody>
      </Card>
    </div>

    </DefaultLayout>
   
  );
}
