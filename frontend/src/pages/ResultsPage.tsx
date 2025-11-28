import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Assuming fetchNearbyHotels is implemented to fetch your data
import { fetchNearbyHotels } from "@/api/pg";
import { SlidersHorizontal, X, ArrowUp, ArrowDown, Phone, ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";

// ====================================================================
// 1. Interfaces & Hooks
// ====================================================================

interface Hotel {
    _id: string;
    name: string;
    price: number;
    pgType: "girls" | "boys" | "co" | string;
    furnished: "furnished" | "semi" | "unfurnished" | string;
    wifi: "yes" | "no" | string;
    bed: "single" | "double" | "none" | string;
    images?: { url: string }[];
    address?: {
        address1: string;
        district: string;
    };
    mobileNumber?: string;
    phone?: string | number;
}

interface Filters {
    pgType: "girls" | "boys" | "co" | "both";
    maxPrice: number;
    furnished: "all" | "furnished" | "semi" | "unfurnished";
    wifi: "all" | "yes" | "no";
    bed: "all" | "single" | "double" | "none";
    sortBy: "distance" | "priceAsc" | "priceDesc";
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const isTokenAvailable = (): boolean => {
    const keys = ['authToken', 'token', 'userToken', 'jwt'];
    return keys.some(k => !!localStorage.getItem(k));
};

// ====================================================================
// 2. Helper Components (Skeleton & Modal)
// ====================================================================

const SkeletonItem: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md animate-pulse p-4">
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
    </div>
);

const ResultsSkeleton: React.FC = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
        <div className="lg:col-span-1 hidden lg:block space-y-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
        </div>
        <div className="lg:col-span-3 space-y-4">
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
        </div>
    </div>
);

interface FilterModalProps {
    filters: Filters;
    onFilterChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
    onClose: () => void;
    onApply: () => void;
    onReset: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
    filters,
    onFilterChange,
    onClose,
    onApply,
    onReset
}) => {
    const inputClass = "w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-gray-700 focus:border-gray-700 transition duration-150 font-medium dark:bg-gray-700 dark:text-gray-100";

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 lg:hidden flex justify-end transition-opacity duration-300 ease-out">
            <div className="bg-white dark:bg-gray-800 w-full h-full transform translate-y-0 transition-transform duration-300 ease-out flex flex-col">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center shadow-sm">
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">Filter Results</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                    <div>
                        <label htmlFor="maxPrice" className="block text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
                            Max Price: ₹{filters.maxPrice.toLocaleString()}
                        </label>
                        <input id="maxPrice" name="maxPrice" type="range" min={500} max={20000} step={500}
                            value={filters.maxPrice} onChange={onFilterChange}
                            className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-gray-700 dark:[&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">PG Type</label>
                        <select name="pgType" value={filters.pgType} onChange={onFilterChange} className={inputClass}>
                            <option value="both">All PG Types</option>
                            <option value="girls">Girls</option>
                            <option value="boys">Boys</option>
                            <option value="co">Co-Ed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Furnishing</label>
                        <select name="furnished" value={filters.furnished} onChange={onFilterChange} className={inputClass}>
                            <option value="all">All Furnishing</option>
                            <option value="furnished">Furnished</option>
                            <option value="semi">Semi-Furnished</option>
                            <option value="unfurnished">Unfurnished</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">WiFi</label>
                        <select name="wifi" value={filters.wifi} onChange={onFilterChange} className={inputClass}>
                            <option value="all">WiFi Availability</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Bed Type</label>
                        <select name="bed" value={filters.bed} onChange={onFilterChange} className={inputClass}>
                            <option value="all">All Bed Types</option>
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
                <div className="p-4 border-t dark:border-gray-700 shadow-lg flex justify-between gap-3 bg-white dark:bg-gray-800">
                    <button onClick={onReset} className="w-1/3 px-3 py-2 rounded-md border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm font-medium">Reset</button>
                    <button onClick={onApply} className="w-2/3 px-3 py-2 rounded-md bg-gray-800 dark:bg-gray-700 text-white text-sm font-semibold hover:bg-black dark:hover:bg-gray-900 transition shadow-md">Apply Filters</button>
                </div>
            </div>
        </div>
    );
};

// ====================================================================
// 3. Main Component: ResultsPage
// ====================================================================

export default function ResultsPage() {
    const q = useQuery();
    const navigate = useNavigate();
    const place = q.get("place") || "";
    const lat = q.get("lat");
    const lng = q.get("lng");

    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isUserLoggedIn] = useState(isTokenAvailable());

    const initialFilters: Filters = {
        pgType: "both",
        maxPrice: 10000,
        furnished: "all",
        wifi: "all",
        bed: "all",
        sortBy: "distance",
    };

    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);

    const handleGoBack = () => {
        navigate(-1);
    };

    const resetFilter = (key: keyof Filters) => {
        setAppliedFilters(prev => {
            const next = { ...prev };
            (next[key] as any) = (initialFilters as any)[key];
            return next;
        });
        setFilters(prev => ({ ...prev, [key]: (initialFilters as any)[key] }));
    };

    const clearAllFilters = () => {
        setAppliedFilters(initialFilters);
        setFilters(initialFilters);
    };

    const renderFilterChips = () => {
        const chips: { key: keyof Filters; label: string }[] = [];
        if (appliedFilters.pgType !== 'both') chips.push({ key: 'pgType', label: appliedFilters.pgType });
        if (appliedFilters.maxPrice !== initialFilters.maxPrice) chips.push({ key: 'maxPrice', label: `Max ₹${appliedFilters.maxPrice.toLocaleString()}` });
        if (appliedFilters.furnished !== 'all') chips.push({ key: 'furnished', label: appliedFilters.furnished });
        if (appliedFilters.wifi !== 'all') chips.push({ key: 'wifi', label: appliedFilters.wifi });
        if (appliedFilters.bed !== 'all') chips.push({ key: 'bed', label: appliedFilters.bed });
        if (appliedFilters.sortBy !== 'distance') {
            const map: Record<string, string> = { priceAsc: 'Price: Low → High', priceDesc: 'Price: High → Low' };
            chips.push({ key: 'sortBy', label: map[appliedFilters.sortBy] || appliedFilters.sortBy });
        }

        if (chips.length === 0) return null;

        return (
            <div className="flex items-center flex-wrap gap-2 mb-3">
                {chips.map(c => (
                    <button
                        key={c.key}
                        onClick={(e) => { e.stopPropagation(); resetFilter(c.key); }}
                        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                        title={`Remove ${c.label}`}
                    >
                        <span>{c.label}</span>
                        <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                    </button>
                ))}
                <button onClick={(e) => { e.stopPropagation(); clearAllFilters(); }} className="ml-2 text-sm text-gray-700 dark:text-gray-300 underline hover:text-gray-900 dark:hover:text-gray-100">
                    Clear All Filters
                </button>
            </div>
        );
    };

    useEffect(() => {
        const get = async () => {
            setLoading(true);
            setError(null);

            try {
                let rawData: any[] = [];

                if (lat && lng) {
                    const latNum = Number(lat);
                    const lngNum = Number(lng);
                    if (isNaN(latNum) || isNaN(lngNum)) throw new Error("Invalid location parameters.");
                    const res: any = await fetchNearbyHotels(latNum, lngNum, 10000);
                    rawData = res.data.hotels || res.data.data || res.hotels || [];
                } else if (place) {
                    const res = await fetch(`/api/v1/hotels?place=${encodeURIComponent(place)}`);
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    const json = await res.json();
                    rawData = json.hotels || json.data || [];
                }

                const mappedHotels: Hotel[] = rawData.map((h: any, i: number) => ({
                    ...h,
                    mobileNumber: String(h.phone || h.mobileNumber || `987654321${i % 10}`),
                    phone: h.phone,
                    pgType: h.pgType || 'co',
                    bed: h.bed || 'none',
                    furnished: h.furnished || 'unfurnished',
                    wifi: h.wifi || 'no',
                }));

                setHotels(mappedHotels);
            } catch (err: any) {
                console.error(err);
                setError(err?.message || "An unknown server error occurred");
                setHotels([]);
            } finally {
                setLoading(false);
            }
        };

        get();
    }, [lat, lng, place]);

    const filtered = useMemo(() => {
        let list = hotels.slice();

        if (appliedFilters.pgType !== "both") list = list.filter(h => h.pgType === appliedFilters.pgType);
        list = list.filter(h => h.price <= appliedFilters.maxPrice);
        if (appliedFilters.furnished !== "all") list = list.filter(h => (h.furnished || "").toLowerCase() === appliedFilters.furnished);
        if (appliedFilters.wifi !== "all") list = list.filter(h => (h.wifi || "").toLowerCase() === appliedFilters.wifi);
        if (appliedFilters.bed !== "all") list = list.filter(h => (h.bed || "").toLowerCase() === appliedFilters.bed);

        if (appliedFilters.sortBy === "priceAsc") {
            list.sort((a, b) => a.price - b.price);
        } else if (appliedFilters.sortBy === "priceDesc") {
            list.sort((a, b) => b.price - a.price);
        }

        return list;
    }, [hotels, appliedFilters]);

    const handleHotelClick = (hotelId: string) => {
        navigate(`/hotel/${hotelId}`);
    };

    const handleShowMobile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        if (!isUserLoggedIn) {
            navigate('/login', { state: { from: window.location.pathname + window.location.search } });
        }
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setFilters(prev => ({
            ...prev,
            [name]: name === 'maxPrice' ? Number(value) : value,
        }));
    };

    const handleApplyFilters = () => {
        setAppliedFilters(filters);
        setIsFilterModalOpen(false);
    };

    const handleResetFilters = () => {
        setFilters(initialFilters);
        setAppliedFilters(initialFilters);
    };

    const renderFiltersSidebar = () => (
        <div className="w-full space-y-4 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-lg dark:shadow-xl">
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 border-b dark:border-gray-700 pb-2">Filters</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">PG Type</label>
                    <select name="pgType" value={filters.pgType} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium dark:bg-gray-700 dark:text-gray-100">
                        <option value="both">All PG Types</option>
                        <option value="girls">Girls</option>
                        <option value="boys">Boys</option>
                        <option value="co">Co-Ed</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="maxPrice" className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
                        Max Price: ₹{filters.maxPrice.toLocaleString()}
                    </label>
                    <input id="maxPrice" name="maxPrice" type="range" min={500} max={20000} step={500}
                        value={filters.maxPrice} onChange={handleFilterChange}
                        className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-gray-700 dark:[&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Furnishing</label>
                    <select name="furnished" value={filters.furnished} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium dark:bg-gray-700 dark:text-gray-100">
                        <option value="all">All Furnishing</option>
                        <option value="furnished">Furnished</option>
                        <option value="semi">Semi-Furnished</option>
                        <option value="unfurnished">Unfurnished</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">WiFi</label>
                    <select name="wifi" value={filters.wifi} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium dark:bg-gray-700 dark:text-gray-100">
                        <option value="all">WiFi Availability</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Bed Type</label>
                    <select name="bed" value={filters.bed} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium dark:bg-gray-700 dark:text-gray-100">
                        <option value="all">All Bed Types</option>
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="none">None</option>
                    </select>
                </div>
                <div className="border-t dark:border-gray-700 pt-4">
                    <label className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Sort By</label>
                    <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium dark:bg-gray-700 dark:text-gray-100">
                        <option value="distance">Distance (Default)</option>
                        <option value="priceAsc">Price: Low to High</option>
                        <option value="priceDesc">Price: High to Low</option>
                    </select>
                </div>
                <button onClick={handleApplyFilters} className="w-full px-3 py-2 rounded-md bg-gray-800 dark:bg-gray-700 text-white text-sm font-semibold hover:bg-black dark:hover:bg-gray-900 transition shadow-md">
                    Apply Filters
                </button>
            </div>
        </div>
    );

    const renderHotelCard = (h: Hotel) => (
        <div
            key={h._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700"
            onClick={() => handleHotelClick(h._id)}
        >
            <div className="w-full h-48 overflow-hidden">
                <img
                    src={h.images?.[0]?.url || 'https://via.placeholder.com/600x400?text=Room+Image'}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    alt={h.name}
                />
            </div>
            <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                    <div className="font-bold text-2xl text-gray-900 dark:text-gray-100 line-clamp-1">{h.name}</div>
                    <div className="font-bold text-2xl text-gray-900 dark:text-gray-100 flex-shrink-0">
                        ₹{h.price.toLocaleString()}
                    </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {h.address?.address1}{h.address?.district ? `, ${h.address?.district}` : ''}
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-semibold capitalize border border-gray-200 dark:border-gray-600">
                        {h.pgType} PG
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-semibold capitalize border border-gray-200 dark:border-gray-600">
                        {h.furnished}
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-semibold capitalize border border-gray-200 dark:border-gray-600">
                        {h.bed} Bed
                    </span>
                    {h.wifi === 'yes' && (
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-xs font-semibold border border-gray-200 dark:border-gray-600">
                            WiFi
                        </span>
                    )}
                </div>
                <div className="pt-2">
                    {isUserLoggedIn && (h.phone || h.mobileNumber) ? (
                        <a
                            href={`tel:${h.phone || h.mobileNumber}`}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-900 dark:bg-gray-700 text-white font-extrabold hover:bg-black dark:hover:bg-gray-900 transition shadow-md"
                            onClick={(e) => { e.stopPropagation(); }}
                        >
                            <Phone className="w-4 h-4" />
                            Call: {h.phone || h.mobileNumber}
                        </a>
                    ) : (
                        <button
                            onClick={handleShowMobile}
                            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-extrabold hover:bg-gray-100 dark:hover:bg-gray-700 transition border border-gray-400 dark:border-gray-600"
                        >
                            <Phone className="w-4 h-4" />
                            Show Mobile Number (Requires Login)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4 lg:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans pb-20 lg:pb-6">
                
                {/* --- MODIFIED HEADER: Smaller text, removed border, reduced gap --- */}
                <div className="flex items-center gap-3 mb-2">
                    <button
                        onClick={handleGoBack}
                        className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex-shrink-0"
                        title="Go Back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
                        Listings near: <span className="text-gray-700 dark:text-gray-300 font-medium">{place || "Current Location"}</span>
                    </h2>
                </div>
                
                {loading ? (
                    <ResultsSkeleton />
                ) : error ? (
                    <p className="text-gray-600 dark:text-gray-300 my-8 p-6 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-center font-medium shadow-md">
                        ❌ Error fetching data: **{error}**
                    </p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                        {/* PC View: Left Column for Filters */}
                        <div className="hidden lg:block lg:col-span-1 sticky top-[100px] h-fit">
                            {renderFiltersSidebar()}
                        </div>

                        {/* Results List */}
                        <div className="lg:col-span-3 space-y-4">
                            {renderFilterChips()}
                            
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">
                                Displaying **{filtered.length}** results {filtered.length > 0 && `(Sorted by ${appliedFilters.sortBy === 'distance' ? 'Distance' : appliedFilters.sortBy === 'priceAsc' ? 'Price: Low to High' : 'Price: High to Low'})`}
                            </p>

                            {filtered.length === 0 ? (
                                <p className="text-gray-600 dark:text-gray-300 my-8 p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-center shadow-md">
                                    😔 **No results found** matching your selected criteria. Please reset or adjust your filters.
                                </p>
                            ) : (
                                filtered.map(renderHotelCard)
                            )}
                        </div>
                    </div>
                )}

                {/* Mobile Actions Bar */}
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-2xl p-3 lg:hidden border-t border-gray-200 dark:border-gray-700">
                    <div className="container mx-auto px-4 sm:px-0 flex justify-between items-center gap-3">
                        <div className="relative flex-1">
                            <select
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium appearance-none bg-white dark:bg-gray-700 dark:text-gray-100 pr-8"
                            >
                                <option value="distance">Sort: Distance</option>
                                <option value="priceAsc">Price: Low to High</option>
                                <option value="priceDesc">Price: High to Low</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                                {filters.sortBy === 'priceAsc' && <ArrowUp className="w-4 h-4" />}
                                {filters.sortBy === 'priceDesc' && <ArrowDown className="w-4 h-4" />}
                                {filters.sortBy === 'distance' && <SlidersHorizontal className="w-4 h-4" />}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsFilterModalOpen(true)}
                            className="p-2.5 rounded-lg bg-gray-900 dark:bg-gray-700 text-white flex items-center gap-1 text-sm font-semibold hover:bg-black dark:hover:bg-gray-900 transition shadow-md"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filter
                        </button>
                    </div>
                </div>

                {isFilterModalOpen && (
                    <FilterModal
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClose={() => setIsFilterModalOpen(false)}
                        onApply={handleApplyFilters}
                        onReset={handleResetFilters}
                    />
                )}
            </div>
        </>
    );
}