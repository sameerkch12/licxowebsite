import React from "react";
import { Form, Input, Select, SelectItem, Button } from "@heroui/react";
import DefaultLayout from "@/layouts/default";
import { useNavigate } from "react-router-dom";


// --- Type Definitions ---
const API_BASE = import.meta.env.VITE_Server_API_URL ?? "";

/** Interface for a file/preview object in the imagePreviews state */
interface ImagePreview {
  file: File;
  url: string;
}

/** Type for the validation errors object */
type ValidationErrors = {
  [key: string]: string;
};

// --- Component ---

export default function CreateHotelForm(): JSX.Element {
  // State
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [serverMsg, setServerMsg] = React.useState<string | null>(null);
  const [location, setLocation] = React.useState({
    state: "",
    district: ""
  });

  // Ref for the native file input element
  const fileRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Keep selected files and their preview URLs for UI
  const [imagePreviews, setImagePreviews] = React.useState<ImagePreview[]>([]);

  // State for latitude and longitude, controlled for the UI to update with useMyLocation
  const [latLng, setLatLng] = React.useState({ latitude: "", longitude: "" });

  // Helper to update previews when user picks files
  const handleFilesChange = (files: FileList | null) => {
    if (!files) return;

    // Revoke old URLs to prevent memory leaks
    imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));

    const arr: ImagePreview[] = Array.from(files).map((f: File) => ({
      file: f,
      url: URL.createObjectURL(f)
    }));

    setImagePreviews(arr);
  };

  React.useEffect(() => {
    // Cleanup on unmount
    return () => {
      imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [imagePreviews]); // dependency array ensures cleanup function is current

  // Helper to set DOM form input values (used by useMyLocation)
  const setFieldValue = (name: "latitude" | "longitude", value: string) => {
    setLatLng((prev) => ({ ...prev, [name]: value }));
  };

  // Basic validation for required fields
  const validate = (data: FormData, files: FileList | null): ValidationErrors => {
    const e: ValidationErrors = {};

    // Helper function for required string fields
    const checkRequired = (key: string, message: string) => {
      // Explicitly check if images are required and present
      if (files && files.length === 0) {
        e.images = "Please add at least one image"; // 👈 Using the 'files' parameter here
      }
      if (!data.get(key)?.toString().trim()) {
        e[key] = message;
      }
    };

    checkRequired(" owner name", "Name is required");
    checkRequired("phone", "Phone is required");
    checkRequired("price", "Price is required");
    checkRequired("room", "Room info is required");
    checkRequired("pgType", "PG Type is required");
    checkRequired("address1", "Address is required");
    checkRequired("district", "District is required");
    checkRequired("state", "State is required");
    checkRequired("bed", "Bed info is required");
    checkRequired("wifi", "Wifi (yes/no) is required");
    checkRequired("furnished", "Furnished info required");

    // Latitude & longitude should exist and be parseable numbers
    const lat = data.get("latitude");
    const lng = data.get("longitude");

    if (!lat || isNaN(parseFloat(lat.toString()))) {
      e.latitude = "Valid latitude required";
    }
    if (!lng || isNaN(parseFloat(lng.toString()))) {
      e.longitude = "Valid longitude required";
    }

    return e;
  };

  const useMyLocation = (setter: typeof setFieldValue) => {
    setServerMsg(null);
    if (!navigator.geolocation) {
      setServerMsg("Geolocation not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos: GeolocationPosition) => {
        const { latitude, longitude } = pos.coords;
        // Set values using the helper function
        setter("latitude", String(latitude));
        setter("longitude", String(longitude));
        setServerMsg("Location filled from your device.");

        // Clear any previous latitude/longitude validation errors
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy.latitude;
          delete copy.longitude;
          return copy;
        });
      },
      (err: GeolocationPositionError) => {
        // Handle geolocation errors clearly
        if (err.code === err.PERMISSION_DENIED) {
          setServerMsg("Location permission denied. Allow location access to use this feature.");
        } else {
          setServerMsg("Unable to get location: " + err.message);
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerMsg(null);
    setErrors({});

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    // Get files from the ref
    const files: FileList | null = fileRef.current?.files ?? null;

    // Append files explicitly under `images` to match multer's field name
    if (files && files.length > 0) {
      fd.delete("images"); // Remove any existing entry (from standard form submission)
      for (let i = 0; i < files.length; i++) {
        fd.append("images", files[i]);
      }
    }

    const validationErrors = validate(fd, files);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {

      const res = await fetch( `${API_BASE}api/v1/hotels/create`, {
        method: "POST",
        body: fd,
      });

      // Handle non-JSON responses gracefully
      const json = await res.json().catch(() => ({ message: "No JSON response" }));

      if (!res.ok) {
        // Log the full error response for debugging
        console.error("Server Error Response:", json);
        setServerMsg(json.error || json.message || `Server returned ${res.status}`);
      } else {
        setServerMsg("Hotel created successfully");
      
        formEl.reset();
        if (fileRef.current) fileRef.current.value = "";

        // Clear previews and revoke URLs
        imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
        setImagePreviews([]);
        setLatLng({ latitude: "", longitude: "" }); // Reset lat/lng state
        setLocation({ state: "", district: "" }); // Reset location state
        setErrors({});
        navigate("/myroom");
      }
    } catch (err) {
      // Type assertion for network error
      setServerMsg("Network error: " + (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    setErrors({});
    setServerMsg(null);
    if (fileRef.current) fileRef.current.value = "";
    // Clear previews and revoke URLs
    imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    setImagePreviews([]);
    setLatLng({ latitude: "", longitude: "" }); // Reset lat/lng state
    setLocation({ state: "", district: "" }); // Reset location state
  };

  return (
    <DefaultLayout>
      <Form
        className="w-full p-6 justify-center items-center space-y-4"
        validationErrors={errors}
        onReset={onReset}
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-4 max-w-lg">
          {/* General Details */}
          <Input
            isRequired
            label="Owner Name"
            labelPlacement="outside"
            name="owner name"
            placeholder="Green Residency"
            errorMessage={() => errors.name}
          />

          <Input
            isRequired
            label="Phone"
            labelPlacement="outside"
            name="phone"
            placeholder="9876543210"
            type="tel"
            errorMessage={() => errors.phone}
          />

          <Input
            isRequired
            label="Price"
            labelPlacement="outside"
            name="price"
            placeholder="5000"
            type="number"
            errorMessage={() => errors.price}
          />


          {/* FIX: Removed duplicate Input with name="room". Keeping only the Select */}
          <Select
            isRequired
            label="Room Type (BHK)"
            labelPlacement="outside"
            name="room"
            placeholder="Select Room Type"
            errorMessage={() => errors.room}
          >
            <SelectItem key="1bhk">1 BHK</SelectItem>
            <SelectItem key="2bhk">2 BHK</SelectItem>
            <SelectItem key="3bhk">3 BHK</SelectItem>
            <SelectItem key="4bhk">4 BHK</SelectItem>
          </Select>

          <Select
            isRequired
            label="PG Type"
            labelPlacement="outside"
            name="pgType"
            placeholder="Select PG Type"
            errorMessage={() => errors.pgType}
          >
            <SelectItem key="boys">Boys</SelectItem>
            <SelectItem key="girls">Girls</SelectItem>
            <SelectItem key="co">Co-living</SelectItem>
          </Select>

          {/* Address Details */}
          <Input
            isRequired
            label="Address Line 1"
            labelPlacement="outside"
            name="address1"
            placeholder="Near City Mall"
            errorMessage={() => errors.address1}
          />

          <Input
            isRequired
            label="State"
            labelPlacement="outside"
            name="state"
            value={location.state}
            onChange={(e) =>
              setLocation((prev) => ({ ...prev, state: e.target.value }))
            }
            placeholder="Uttar Pradesh"
            errorMessage={() => errors.state}
          />

          {/* This is the CORRECT controlled Input for District */}
          <Input
            isRequired
            label="District"
            labelPlacement="outside"
            name="district"
            value={location.district}
            onChange={(e) =>
              setLocation((prev) => ({ ...prev, district: e.target.value }))
            }
            placeholder="Lucknow"
            errorMessage={() => errors.district}
          />
          {/* FIX: Removed duplicate Input with name="district" */}


          {/* Amenities/Features */}
          <Select
            isRequired
            label="Bed"
            labelPlacement="outside"
            name="bed"
            placeholder="Single / Double"
            errorMessage={() => errors.bed}
          >
            <SelectItem key="single">Single</SelectItem>
            <SelectItem key="double">Double</SelectItem>
          </Select>

          <Select
            isRequired
            label="Wifi"
            labelPlacement="outside"
            name="wifi"
            placeholder="yes / no"
            errorMessage={() => errors.wifi}
          >
            <SelectItem key="yes">yes</SelectItem>
            <SelectItem key="no">no</SelectItem>
          </Select>

          <Select
            isRequired
            label="Furnished"
            labelPlacement="outside"
            name="furnished"
            placeholder="furnished / semi / unfurnished"
            errorMessage={() => errors.furnished}
          >
            <SelectItem key="furnished">furnished</SelectItem>
            <SelectItem key="semi">semi</SelectItem>
            <SelectItem key="unfurnished">unfurnished</SelectItem>
          </Select>

          {/* Latitude & Longitude with Geolocation Button */}
          <div className="flex gap-2 items-end">
            <Input
              isRequired
              label="Latitude"
              labelPlacement="outside"
              name="latitude"
              value={latLng.latitude} // Controlled value from state
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLatLng({ ...latLng, latitude: e.target.value })}
              placeholder="26.8467"
              errorMessage={() => errors.latitude}
            />
            <Input
              isRequired
              label="Longitude"
              labelPlacement="outside"
              name="longitude"
              value={latLng.longitude} // Controlled value from state
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLatLng({ ...latLng, longitude: e.target.value })}
              placeholder="80.9462"
              errorMessage={() => errors.longitude}
            />
            <div className="mt-6">
              <Button
                type="button"
                onClick={() => useMyLocation(setFieldValue)}
                disabled={submitting}
              >
                Use my location
              </Button>
            </div>
          </div>

          {/* Native file input for images (multiple). */}
          <div>
            <label className="block mb-1 text-small">Images</label>
            <input
              ref={fileRef}
              name="images"
              type="file"
              multiple
              accept="image/*"
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) => handleFilesChange(ev.target.files)}
            />
            {errors.images && <div className="text-danger text-small">{errors.images}</div>}

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {imagePreviews.map((p, i) => (
                  <div key={i} className="border rounded overflow-hidden p-1">
                    <img src={p.url} alt={`preview-${i}`} className="w-full h-24 object-cover" />
                    <div className="text-xs truncate mt-1">{p.file.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button className="w-full" color="primary" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Create Hotel"}
            </Button>
            <Button type="reset" variant="bordered" disabled={submitting}>
              Reset
            </Button>
          </div>

          {serverMsg && <div className="text-small mt-2">{serverMsg}</div>}
        </div>
        <div> <br></br></div>
      </Form>
    </DefaultLayout>
  );
}
