// src/pages/MyRoom.tsx
import React from "react";
import DefaultLayout from "@/layouts/default";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardFooter, Image, Skeleton } from "@heroui/react";
import { jwtDecode } from "jwt-decode"; // use named import as per your setup

// Environment API base
const API_BASE: string = import.meta.env.VITE_Server_API_URL ?? "";

/* -------------------- Types -------------------- */
interface TokenPayload {
  id?: string;
  phoneNumber?: string; // e.g. "+918109543070"
  iat?: number;
  exp?: number;
}

interface ImageObject {
  public_id?: string;
  url: string;
  secure_url?: string;
}

interface HotelListing {
  _id: string;
  name: string;
  phone?: string;
  price: number;
  room: string;
  pgType: string;
  address: {
    address1: string;
    district: string;
    state: string;
  };
  bed: string;
  wifi: "yes" | "no";
  furnished: "furnished" | "semi" | "unfurnished";
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  images: ImageObject[];
  createdAt?: string;
}

/* -------------------- Helpers -------------------- */
/**
 * Read JWT token from localStorage (key: "token") and extract a normalized
 * 10-digit phone string (India assumption). Returns empty string on failure.
 */
function getUserPhoneFromToken(): string {
  try {
    const token = localStorage.getItem("token") ?? "";
    if (!token) return "";

    const decoded = jwtDecode<TokenPayload>(token);
    const raw = decoded?.phoneNumber ?? "";
    if (!raw) return "";

    // Normalize: strip non-digits and take last 10 digits (works for +91XXXXXXXXXX)
    const digitsOnly = raw.replace(/\D/g, "");
    if (digitsOnly.length <= 10) return digitsOnly;
    return digitsOnly.slice(-10);
  } catch (err) {
    // invalid token or decode error
    // console.error("Token decode error:", err);
    return "";
  }
}

/* -------------------- UI: Skeleton -------------------- */
const ListingSkeleton: React.FC = () => (
  <Card className="w-full">
    <Skeleton className="rounded-lg">
      <div className="h-48 w-full rounded-lg bg-default-300" />
    </Skeleton>
    <CardBody>
      <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-3 w-2/5 rounded-lg bg-default-300" />
        </Skeleton>
      </div>
    </CardBody>
    <CardFooter className="flex justify-end gap-2">
      <Skeleton className="w-16 h-8 rounded-lg bg-default-300" />
      <Skeleton className="w-24 h-8 rounded-lg bg-default-300" />
    </CardFooter>
  </Card>
);

/* -------------------- Listing Card -------------------- */
const ListingCard: React.FC<{ listing: HotelListing; onDelete: (id: string) => void }> = ({ listing, onDelete }) => {
  const primaryImageUrl =
    listing.images && listing.images.length > 0
      ? listing.images[0].url
      : "https://images.unsplash.com/photo-1549298285-d601b0f4989e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";

  const fullAddress = `${listing.address?.address1 ?? ""}, ${listing.address?.district ?? ""}, ${listing.address?.state ?? ""}`;

  return (
    <Card isHoverable>
      <Image isZoomed alt={listing.name} className="w-full h-48 object-cover" src={primaryImageUrl} />
      <CardBody>
        <h3 className="text-xl font-semibold mb-1">{listing.name}</h3>
        <p className="text-default-500 text-sm">{fullAddress}</p>

        <div className="mt-3 space-y-1 text-sm">
          <p>
            <strong>Rent:</strong>{" "}
            <span className="font-medium">₹{Number(listing.price ?? 0).toLocaleString()}/month</span>
          </p>
          <p>
            <strong>Type:</strong>{" "}
            <span className="capitalize">
              {listing.room} | {listing.pgType} | {listing.bed} bed
            </span>
          </p>
          <p>
            <strong>Amenities:</strong>{" "}
            <span className="capitalize">
              {listing.furnished} | Wifi: {listing.wifi}
            </span>
          </p>
        </div>
      </CardBody>

      <CardFooter className="flex justify-end gap-2">
        <Link to={`/edit-hotel/${listing._id}`}>
          
        </Link>

        <Button
          size="sm"
          variant="bordered"
          color="danger"
          onClick={() => {
            onDelete(listing._id);
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

/* -------------------- Main Component -------------------- */
export default function MyRoom(): JSX.Element {
  const [listings, setListings] = React.useState<HotelListing[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [toast, setToast] = React.useState<{ message: string; type?: "success" | "error" } | null>(null);

  // Memoize user phone so we don't recalc on every render
  const USER_PHONE = React.useMemo(() => getUserPhoneFromToken(), []);

  React.useEffect(() => {
    if (!USER_PHONE) {
      setLoading(false);
      setError("User phone number is missing. Please sign in to view your listings.");
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      const endpoint = `${API_BASE}api/v1/hotels/myroom/${encodeURIComponent(USER_PHONE)}`;

      try {
        const res = await fetch(endpoint, { method: "GET", signal });
        if (!res.ok) {
          const parsed = await res.json().catch(() => null);
          const message = parsed?.message ?? `Failed to fetch listings (status ${res.status})`;
          throw new Error(message);
        }

        const data = await res.json();
        const arr = Array.isArray(data) ? data : data ? [data] : [];
        setListings(arr);
      } catch (err: any) {
        if (err?.name === "AbortError") {
          return; // fetch aborted
        }
        console.error("Failed to load listings:", err);
        setError("Could not load your listings. Please check the network or server status.");
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();

    return () => controller.abort();
  }, [USER_PHONE]);

  /* Delete handler with optimistic UI and rollback */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing? This cannot be undone.")) return;

    const previous = listings;
    setListings((s) => s.filter((l) => l._id !== id));

    try {
      const endpoint = `${API_BASE}api/v1/hotels/delete/${encodeURIComponent(id)}`;
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const parsed = await res.json().catch(() => null);
        throw new Error(parsed?.message ?? `Delete failed (status ${res.status})`);
      }
      // success -> nothing to do (already removed)
      setToast({ message: "Listing deleted successfully.", type: "success" });
      window.setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error("Delete failed:", err);
      setListings(previous); // rollback
      setToast({ message: "Failed to delete listing. Please try again.", type: "error" });
      window.setTimeout(() => setToast(null), 4000);
    }
  };

  /* Render helper */
  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ListingSkeleton />
          <ListingSkeleton />
          <ListingSkeleton />
          <ListingSkeleton />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8 text-danger border-2 border-danger-200 rounded-lg">
          <p className="font-semibold mb-3">❌ {error}</p>
          <Button onClick={() => window.location.reload()} color="warning">
            Try Again
          </Button>
        </div>
      );
    }

    if (!listings || listings.length === 0) {
      return (
        <div className="text-center p-10 border-2 border-dashed rounded-lg bg-default-50">
          <p className="text-lg mb-4 text-default-600">You have no active listings yet.</p>
          <Link to="/addroom">
            <Button color="success" size="lg">
              Start Listing Your Property
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} onDelete={handleDelete} />
        ))}
      </div>
    );
  };

  return (
    <DefaultLayout>
      <div className="p-6 max-w-3xl mx-auto">
        {toast && (
          <div className="fixed right-4 top-6 z-50">
            <div
              className={`px-4 py-2 rounded shadow text-sm ${
                toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
              }`}
            >
              {toast.message}
            </div>
          </div>
        )}
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold"> My Listings</h1>
          <Link to="/addroom">
            <Button color="primary" size="md">
              + Add New Listing
            </Button>
          </Link>
        </header>

        {renderContent()}
      </div>
    </DefaultLayout>
  );
}
