import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:4000",
});

export const fetchNearbyHotels = (lat: number, lng: number, radius = 5000) =>
  api.get("/api/v1/hotels/search", { params: { lat, lng, radius } });

export const fetchHotelsByPlace = (place: string) =>
  api.get("/api/v1/hotels?place=" + encodeURIComponent(place)); // optional fallback if you implement this
