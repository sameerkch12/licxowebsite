import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// Assuming HeroUI components handle dark mode internally well, but we explicitly style backgrounds.
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import { Skeleton } from "@heroui/skeleton";
import DefaultLayout from "@/layouts/default";

const API_BASE = import.meta.env.VITE_Server_API_URL ?? "";

// --- Interfaces ---
interface ImageType {
  public_id: string;
  url: string;
  secure_url?: string;
}

interface AddressType {
  address1: string;
  district: string;
  state: string;
}

interface RoomType {
  _id: string;
  name: string;
  phone: number;
  address: AddressType;
  pgType: string;
  bed: string;
  price: number;
  room: string;
  wifi: string;
  furnished: string;
  images: ImageType[];
  status: string;
  createdAt?: string;
  location: { 
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

// --- Detail Item Component (Dark Mode Ready) ---
const DetailItem: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
    <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm
                   dark:bg-gray-700 dark:border-gray-600">
        <span className="text-xl mr-3 text-gray-700 dark:text-gray-400">{icon}</span>
        <div>
            <span className="text-sm font-medium text-gray-500 block dark:text-gray-400">{label}</span>
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">{value}</span>
        </div>
    </div>
);

// ------------------------------------
// Main Room Detail Component
// ------------------------------------
const RoomDetailComponent: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const id = params.id;
  
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string | undefined>(undefined);

  const openLightbox = (url?: string) => {
    if (!url) return;
    setLightboxImage(url);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxImage(undefined);
  };

  useEffect(() => {
    if (!id) {
      setError("Invalid room id");
      setLoading(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        const res = await fetch(
          `${API_BASE}api/v1/hotels/${encodeURIComponent(id)}`
        );
        const data = await res.json();

        if (!res.ok) {
          setError(data?.message || "Error fetching room");
          setLoading(false);
          return;
        }

        const roomData = data as RoomType;
        setRoom(roomData);
        if (roomData.images && roomData.images.length > 0) {
            setMainImage(roomData.images[0].url);
        }

        // Map URL Generation using coordinates
        const [longitude, latitude] = roomData.location.coordinates;
        const generatedMapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        setMapUrl(generatedMapUrl);

      } catch (err) {
        setError("Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  // Close lightbox on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // --- Loading State (Dark Mode Skeleton) ---
  if (loading) {
    return (
      <Card className="max-w-xl mx-auto mt-8 p-6 shadow-xl rounded-2xl animate-pulse dark:bg-gray-800">
        <Skeleton className="h-64 w-full rounded-lg mb-6 bg-gray-300 dark:bg-gray-600" /> 
        <div className="flex gap-3 mb-6 overflow-x-auto">
          <Skeleton className="h-20 w-24 rounded-md bg-gray-300 dark:bg-gray-600" />
          <Skeleton className="h-20 w-24 rounded-md bg-gray-300 dark:bg-gray-600" />
          <Skeleton className="h-20 w-24 rounded-md bg-gray-300 dark:bg-gray-600" />
        </div>
        <Skeleton className="h-10 w-3/4 mb-4 bg-gray-300 dark:bg-gray-600" />
        <Skeleton className="h-4 w-full mb-8 bg-gray-300 dark:bg-gray-600" />
        <Skeleton className="h-16 w-full mb-6 bg-gray-300 dark:bg-gray-600" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-12 w-full bg-gray-300 dark:bg-gray-600" />
          <Skeleton className="h-12 w-full bg-gray-300 dark:bg-gray-600" />
        </div>
      </Card>
    );
  }

  // --- Error/No Room State (Dark Mode Ready) ---
  if (error) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-center text-red-600 p-8 text-2xl font-semibold bg-red-50 rounded-lg shadow-md border border-red-200
                   dark:bg-red-900 dark:text-red-200 dark:border-red-700">
        🚨 Error: {error}
      </p>
    </div>
  );
  if (!room) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-center text-gray-600 p-8 text-2xl bg-gray-50 rounded-lg shadow-md border border-gray-200
                   dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
        🙁 No room found for this ID.
      </p>
    </div>
  );

  // -------------------------
  // Main Content (Dark Mode Implemented)
  // -------------------------
  return (
    <Card className="mb-10 max-w-2xl mx-auto shadow-2xl overflow-hidden bg-white border border-gray-100
                   dark:bg-gray-800 dark:border-gray-700">
      
      {/* Hero Image Section */}
      <div className="relative h-72 w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
        {mainImage ? (
          <div className="w-full h-full cursor-zoom-in" onClick={() => openLightbox(mainImage)}>
            <Image
              src={mainImage}
              alt={`${room.name} main image`}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
            />
          </div>
        ) : (
          <div className="text-gray-400 text-lg">No main image available</div>
        )}
      </div>

      {/* Image Thumbnails */}
      <div className="flex gap-3 overflow-x-auto p-4 bg-white border-b border-gray-200 -mt-8 relative z-10 rounded-b-xl shadow-inner
                   dark:bg-gray-800 dark:border-gray-700">
        {room.images?.length > 0 ? (
          room.images.map((img: ImageType, index: number) => (
            <div
              key={img.public_id}
              onClick={() => setMainImage(img.url)}
              className={`min-w-[100px] max-h-[75px] rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ease-in-out
                ${mainImage === img.url ? 'border-indigo-500 scale-105' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-500'}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setMainImage(img.url); } }}
            >
              <Image
                src={img.url}
                alt={`${room.name} thumbnail ${index + 1}`}
                width={100}
                height={75}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>
          ))
        ) : (
            <p className="text-gray-400 w-full text-center py-4 text-sm">No images to display</p>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
            <button
              aria-label="Close image"
              onClick={closeLightbox}
              className="absolute -top-10 right-2 md:top-4 md:right-6 z-50 text-white text-3xl leading-none bg-black bg-opacity-40 rounded-full p-1 hover:bg-opacity-60"
            >
              ✕
            </button>
            <Image
              src={lightboxImage}
              alt={`${room.name} enlarged`}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}

      <CardHeader className="p-6 pt-4 flex flex-col items-start gap-2">
        <h2 className="text-2xl font-extrabold text-gray-900 leading-tight dark:text-white">{room.name}</h2>
        <p className="text-xl font-semibold text-indigo-700 flex items-center gap-2 dark:text-indigo-400">
            <span className="text-2xl">🏷️</span> {room.pgType} Room - ₹{room.price.toLocaleString('en-IN')} <span className="text-base text-gray-500 dark:text-gray-400">/ month</span>
        </p>
        <p className="text-md text-gray-600 flex items-center gap-2 mt-1 dark:text-gray-300">
            <span className="text-xl">📞</span> {room.phone}
        </p>
      </CardHeader>

      <CardBody className="p-6 pt-0 space-y-6">
        
        {/* Navigation Section */}
        <section className="border-t border-gray-100 pt-6 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-4 flex items-center text-gray-800 dark:text-gray-200">
                <span className="mr-3 text-purple-600">🧭</span> Navigation
            </h3>
            
            {/* Map Link Button */}
            <a 
              href={mapUrl || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`
                block transition duration-300 p-4 rounded-xl border border-gray-200 shadow-md 
                ${mapUrl 
                    ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-xl cursor-pointer dark:bg-green-700 dark:hover:bg-green-600' 
                    : 'bg-gray-200 text-gray-500 pointer-events-none border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
                }
                flex items-center justify-between
              `}
            >
                <div>
                    <span className="text-lg font-bold flex items-center">
                        <span className="text-2xl mr-2">🌍</span> Explore Location
                    </span>
                    <p className={`mt-1 text-sm ${mapUrl ? 'text-green-200' : 'text-gray-400'}`}>
                        {room.address.address1}, {room.address.district}, {room.address.state}
                    </p>
                </div>
                <div className="flex items-center">
                    <span className={`text-2xl font-extrabold ml-3 ${mapUrl ? 'text-white' : 'text-gray-400'}`}>
                        →
                    </span>
                </div>
            </a>
        </section>

        {/* Property Features Section */}
        <section className="border-t border-gray-100 pt-6 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-4 flex items-center text-gray-800 dark:text-gray-200">
                <span className="mr-3 text-purple-600">🛠️</span> Property Features
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem label="Room Type" value={room.room} icon="🚪" />
                <DetailItem label="Bed Space" value={room.bed} icon="🛏️" />
                <DetailItem label="Furnished" value={room.furnished} icon="🛋️" />
                <DetailItem label="WiFi" value={room.wifi} icon="📶" />
                <DetailItem label="Monthly Price" value={`₹${room.price.toLocaleString('en-IN')}`} icon="💰" />
                <DetailItem label="Status" value={room.status} icon="✅" />
            </div>
        </section>

      </CardBody>
    </Card>
  );
};

// --- Default Layout Wrapper ---
export default function RoomDetail() {
  // IMPORTANT: Ensure your DefaultLayout, or a parent wrapper, enables Dark Mode
  // by toggling the 'dark' class on the HTML or Body tag based on user preference/system settings.
  return (
    <DefaultLayout>
      <RoomDetailComponent />
    </DefaultLayout>
  );
}