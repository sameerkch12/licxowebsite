import React from "react";
import { Form, Input, Select, SelectItem, Button, Spinner } from "@heroui/react";
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

// --- Custom Toast Helper (For demonstration, replace with a real library like react-toastify) ---
// In a real app, this would use a proper UI component/hook.
const showNotification = (message: string, type: 'success' | 'error') => {
    console.log(`[${type.toUpperCase()}]: ${message}`);
    // Ideally, trigger a visible, floating toast component here.
    alert(`${type.toUpperCase()}: ${message}`); // Simple fallback
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
    
    // Clear image error when files are added
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.images;
      return copy;
    });
  };

  React.useEffect(() => {
    // Cleanup on unmount (revoking URLs)
    return () => {
      imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures cleanup runs once on unmount

  // Cleanup effect for when imagePreviews change (needed if we were dynamically removing images)
  React.useEffect(() => {
     // This effect ensures that the cleanup function in the *return* above uses the latest imagePreviews
     // if the component were to unmount after a preview change. For this specific cleanup structure, 
     // an empty array in the first useEffect is often enough, but keeping this pattern here for robustness.
     return () => {
        imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
     };
  }, [imagePreviews]);

  // Helper to set DOM form input values (used by useMyLocation)
  const setFieldValue = (name: "latitude" | "longitude", value: string) => {
    setLatLng((prev) => ({ ...prev, [name]: value }));
  };

  // Basic validation for required fields
  const validate = (data: FormData, files: FileList | null): ValidationErrors => {
    const e: ValidationErrors = {};

    // Helper function for required string fields
    const checkRequired = (key: string, message: string) => {
      if (!data.get(key)?.toString().trim()) {
        e[key] = message;
      }
    };

    // Images validation
    if (!files || files.length === 0) {
      e.images = "Please add at least one image";
    }

    checkRequired("name", "Name is required");
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

    // Latitude & longitude validation
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

    const files: FileList | null = fileRef.current?.files ?? null;

    // Append files explicitly under `images` for Multer
    if (files && files.length > 0) {
      fd.delete("images");
      for (let i = 0; i < files.length; i++) {
        fd.append("images", files[i]);
      }
    }

    const validationErrors = validate(fd, files);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Optional: Scroll to the first error
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}api/v1/hotels/create`, {
        method: "POST",
        body: fd,
      });

      const json = await res.json().catch(() => ({ message: "No JSON response" }));

      if (!res.ok) {
        console.error("Server Error Response:", json);
        const errorMsg = json.error || json.message || `Server returned ${res.status}`;
        setServerMsg(errorMsg);
        showNotification(errorMsg, 'error'); // Show error notification
      } else {
        // --- Success Handling ---
        setServerMsg("Hotel created successfully!");
        showNotification("Hotel created successfully!", 'success'); // Show success notification
        
        // Reset form and state
        formEl.reset();
        if (fileRef.current) fileRef.current.value = "";

        imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
        setImagePreviews([]);
        setLatLng({ latitude: "", longitude: "" }); 
        setLocation({ state: "", district: "" }); 
        setErrors({});
        
        // Navigate after a short delay for user to see the success message
        setTimeout(() => navigate("/myroom"), 1500); 
      }
    } catch (err) {
      const errorMsg = "Network error: " + (err as Error).message;
      setServerMsg(errorMsg);
      showNotification(errorMsg, 'error'); // Show network error notification
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    setErrors({});
    setServerMsg(null);
    if (fileRef.current) fileRef.current.value = "";
    imagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    setImagePreviews([]);
    setLatLng({ latitude: "", longitude: "" }); 
    setLocation({ state: "", district: "" });
  };
  
  const isImageSelected = imagePreviews.length > 0;

  return (
    <DefaultLayout>
      <Form
        className="w-full p-6 justify-center items-center space-y-4 mb-10"
        validationErrors={errors}
        onReset={onReset}
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-4 max-w-lg">
          
          {/* General Details */}
          <Input isRequired label="Name" labelPlacement="outside" name="name" errorMessage={() => errors.name} />
          <Input isRequired label="Phone" labelPlacement="outside" name="phone" type="tel" errorMessage={() => errors.phone} />
          <Input isRequired label="Price" labelPlacement="outside" name="price" type="number" errorMessage={() => errors.price} />
          <Select isRequired label="Room Type (BHK)" labelPlacement="outside" name="room" errorMessage={() => errors.room}>
            <SelectItem key="1bhk">1 BHK</SelectItem>
            <SelectItem key="2bhk">2 BHK</SelectItem>
            <SelectItem key="3bhk">3 BHK</SelectItem>
            <SelectItem key="4bhk">4 BHK</SelectItem>
          </Select>
          <Select isRequired label="PG Type" labelPlacement="outside" name="pgType" errorMessage={() => errors.pgType}>
            <SelectItem key="boys">Boys</SelectItem>
            <SelectItem key="girls">Girls</SelectItem>
            <SelectItem key="co">Co-living</SelectItem>
          </Select>

          {/* Address Details */}
          <Input isRequired label="Address Line 1" labelPlacement="outside" name="address1" errorMessage={() => errors.address1} />
          <Input 
            isRequired 
            label="State" 
            labelPlacement="outside" 
            name="state" 
            value={location.state}
            onChange={(e) => setLocation((prev) => ({ ...prev, state: e.target.value }))}
            errorMessage={() => errors.state}
          />
          <Input 
            isRequired 
            label="District" 
            labelPlacement="outside" 
            name="district" 
            value={location.district}
            onChange={(e) => setLocation((prev) => ({ ...prev, district: e.target.value }))}
            errorMessage={() => errors.district}
          />

          {/* Amenities/Features */}
          <Select isRequired label="Bed" labelPlacement="outside" name="bed" errorMessage={() => errors.bed}>
            <SelectItem key="single">Single</SelectItem>
            <SelectItem key="double">Double</SelectItem>
          </Select>
          <Select isRequired label="Wifi" labelPlacement="outside" name="wifi" errorMessage={() => errors.wifi}>
            <SelectItem key="yes">Yes</SelectItem>
            <SelectItem key="no">No</SelectItem>
          </Select>
          <Select isRequired label="Furnished" labelPlacement="outside" name="furnished" errorMessage={() => errors.furnished}>
            <SelectItem key="furnished">Furnished</SelectItem>
            <SelectItem key="semi">Semi</SelectItem>
            <SelectItem key="unfurnished">Unfurnished</SelectItem>
          </Select>

          {/* Latitude & Longitude with Geolocation Button */}
          <div className="flex gap-2 items-end">
            <Input
              isRequired
              label="Latitude"
              labelPlacement="outside"
              name="latitude"
              value={latLng.latitude} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLatLng({ ...latLng, latitude: e.target.value })}
              errorMessage={() => errors.latitude}
            />
            <Input
              isRequired
              label="Longitude"
              labelPlacement="outside"
              name="longitude"
              value={latLng.longitude} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLatLng({ ...latLng, longitude: e.target.value })}
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

          {/* 📸 ENHANCED IMAGE UPLOAD SECTION */}
          <div>
            <label className="block mb-1 text-small **font-semibold**">📸 Hotel Images (Required)</label>
            <input
              ref={fileRef}
              name="images"
              type="file"
              multiple
              accept="image/*"
              className="**hidden**" // Hide the native input
              id="file-upload"
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) => handleFilesChange(ev.target.files)}
            />

            {/* Custom File Input/Drop Area UI */}
            <label
              htmlFor="file-upload"
              className={`
                flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${isImageSelected 
                    ? '**border-success-400** bg-success-50' 
                    : errors.images 
                        ? '**border-danger-400** bg-danger-50'
                        : '**border-gray-400** hover:border-blue-500 hover:bg-gray-50'
                }
              `}
            >
              {isImageSelected ? (
                <>
                  <p className="text-medium text-success-600">
                    **✅ {imagePreviews.length} Image(s) Selected** - Click to change
                  </p>
                  <p className="text-small text-gray-500">
                    (Click anywhere in this box to select more/new files)
                  </p>
                </>
              ) : (
                <>
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <p className="text-medium text-gray-500 mt-1">
                    **Click to upload** or **drag and drop** photos
                  </p>
                  <p className="text-small text-gray-400">
                    JPG, PNG, GIF (At least one image is required)
                  </p>
                </>
              )}
            </label>

            {errors.images && <div className="text-danger text-small mt-1">{errors.images}</div>}

            {/* Previews */}
            {isImageSelected && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {imagePreviews.map((p, i) => (
                  <div key={i} className="border rounded overflow-hidden relative shadow-sm">
                    <img src={p.url} alt={`preview-${i}`} className="w-full h-24 object-cover" />
                    <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-bl">
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {/* 2. SUBMIT BUTTON WITH LOADING SPINNER */}
            <Button className="w-full" color="primary" type="submit" disabled={submitting}>
              {submitting ? (
                <span className="flex items-center justify-center">
                  <Spinner size="sm" color="white" className="mr-2" />
                  **Creating Hotel...**
                </span>
              ) : (
                "Create Hotel"
              )}
            </Button>
            <Button type="reset" variant="bordered" disabled={submitting}>
              Reset
            </Button>
          </div>

          {/* Server Message/Simple Toast Display */}
          {serverMsg && (
            <div className={`text-small mt-2 p-3 rounded-lg border 
              ${serverMsg.includes('successfully') ? 'bg-green-50 text-green-700 border-green-300' : 'bg-red-50 text-red-700 border-red-300'}
            `}>
              {serverMsg}
            </div>
          )}
        </div>
      </Form>
    </DefaultLayout>
  );
}
