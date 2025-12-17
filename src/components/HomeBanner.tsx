import { useState, useRef, useEffect } from 'react';
import { Calendar, Users, MapPin, ArrowDownUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Flight from '../assets/Flight.jpg';
import { searchFlights } from '../slices/flightSlice';
import { LazyImage } from './LazyImage';
import { getAirportData } from '../slices/airportSlice';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [passengers, setPassengers] = useState('1 Adult');
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasFetchedAirports, setHasFetchedAirports] = useState(false);
    const [fromSearchQuery, setFromSearchQuery] = useState('');
    const [toSearchQuery, setToSearchQuery] = useState('');

    // Track direction: true = UAE->International, false = International->UAE
    const [isOutbound, setIsOutbound] = useState(true);

    const fromDropdownRef = useRef<HTMLDivElement>(null);
    const toDropdownRef = useRef<HTMLDivElement>(null);
    const fromSearchInputRef = useRef<HTMLInputElement>(null);
    const toSearchInputRef = useRef<HTMLInputElement>(null);

    const { uaeAirports, destinationCities, bannerImage, loading: airportsLoading, error } = useAppSelector(
        (state) => state.airports
    );

    // Fetch airport data on component mount - ONLY ONCE
    useEffect(() => {
        if (!hasFetchedAirports && !airportsLoading) {
            dispatch(getAirportData());
            setHasFetchedAirports(true);
        }
    }, [dispatch, hasFetchedAirports, airportsLoading]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target as Node)) {
                setShowFromDropdown(false);
            }
            if (toDropdownRef.current && !toDropdownRef.current.contains(event.target as Node)) {
                setShowToDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (showFromDropdown && fromSearchInputRef.current) {
            fromSearchInputRef.current.focus();
        }
    }, [showFromDropdown]);

    useEffect(() => {
        if (showToDropdown && toSearchInputRef.current) {
            toSearchInputRef.current.focus();
        }
    }, [showToDropdown]);

    // Smart swap function that changes direction
    const handleSwapLocations = () => {
        if (!fromLocation || !toLocation) return;

        // Swap the locations
        const tempFrom = fromLocation;
        setFromLocation(toLocation);
        setToLocation(tempFrom);

        // Toggle direction
        setIsOutbound(!isOutbound);
    };

    // Get available FROM airports based on direction
    const getFromAirports = () => {
        if (isOutbound) {
            // Outbound: FROM should be UAE airports
            return uaeAirports;
        } else {
            // Inbound: FROM should be international destinations
            return Object.values(destinationCities).flat();
        }
    };

    // Get available TO airports based on direction
    const getToAirports = () => {
        if (isOutbound) {
            // Outbound: TO should be international destinations
            return destinationCities;
        } else {
            // Inbound: TO should be UAE airports
            return {
                'UAE': uaeAirports
            };
        }
    };

    // Filter FROM airports based on search query
    const fromAirports = getFromAirports();
    const filteredFromAirports = fromAirports.filter(airport =>
        airport.name.toLowerCase().includes(fromSearchQuery.toLowerCase()) ||
        airport.code.toLowerCase().includes(fromSearchQuery.toLowerCase())
    );

    // Filter TO airports based on search query
    const toAirports = getToAirports();
    const filteredToAirports = Object.entries(toAirports).reduce((acc, [country, cities]) => {
        const filtered = cities.filter(city =>
            city.name.toLowerCase().includes(toSearchQuery.toLowerCase()) ||
            city.code.toLowerCase().includes(toSearchQuery.toLowerCase())
        );
        if (filtered.length > 0) {
            acc[country] = filtered;
        }
        return acc;
    }, {} as typeof destinationCities);

    const handleSearch = async () => {
        if (!fromLocation || !toLocation || !date) {
            alert('Please fill in all required fields');
            return;
        }

        if (fromLocation === toLocation) {
            alert('Departure and arrival cities must be different');
            return;
        }

        setLoading(true);

        try {
            await dispatch(searchFlights({
                from: fromLocation,
                to: toLocation,
                date: date,
                passengers: passengers
            })).unwrap();

            navigate('/flights');
        } catch (error) {
            console.error('Search error:', error);
            alert('Failed to search flights. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while airports are loading (first time only)
    if (airportsLoading && !hasFetchedAirports) {
        return (
            <div className="relative min-h-screen overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={Flight}
                        alt="Flight Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl px-8 py-6 shadow-2xl">
                        <div className="text-blue-600 text-xl font-bold">Loading airports...</div>
                    </div>
                </div>
            </div>
        );
    }

    // If there's an error or no data, show a message but still render the form
    const hasAirportData = uaeAirports.length > 0 && Object.keys(destinationCities).length > 0;

    // Helper function to find airport display text
    const getAirportDisplayText = (location: string) => {
        // Try UAE airports first
        const uaeAirport = uaeAirports.find(a => a.full === location);
        if (uaeAirport) {
            return `${uaeAirport.name} (${uaeAirport.code})`;
        }

        // Try destination cities
        const destCity = Object.values(destinationCities).flat().find(c => c.full === location);
        if (destCity) {
            return `${destCity.name} (${destCity.code})`;
        }

        return '';
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <LazyImage
                    src={bannerImage || Flight}
                    alt="Flight Background"
                    className="w-full h-full object-cover object-center"
                />
                {/* Dark Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/0 to-black/0"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 min-h-screen flex items-center">
                <div className="w-full flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">

                    {/* Left Side - Booking Form Card */}
                    <div className="w-full lg:w-[500px] xl:w-[550px]">
                        {/* Title Above Card */}
                        <div className="mb-6 sm:mb-8">
                            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight [text-shadow:_2px_2px_8px_rgb(0_0_0_/_80%)]">
                                Find Your Perfect Flight
                            </h1>
                            <p className="text-white text-base sm:text-lg lg:text-2xl font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_1px_1px_4px_rgb(0_0_0_/_70%)]">
                                Compare flights and book the best deals
                            </p>
                        </div>

                        {/* Error Message if no airport data */}
                        {!hasAirportData && error && (
                            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-4 backdrop-blur-sm">
                                <p className="font-semibold">Airport data unavailable</p>
                                <p className="text-sm">Please contact support or try again later.</p>
                            </div>
                        )}

                        {/* Clean Modern Search Card */}
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-visible p-4 sm:p-8 border border-white/40">
                            <div className="space-y-4">
                                {/* From Location */}
                                <div className="relative" ref={fromDropdownRef}>
                                    <button
                                        onClick={() => {
                                            setShowFromDropdown(!showFromDropdown);
                                            setFromSearchQuery('');
                                        }}
                                        disabled={!hasAirportData}
                                        className="w-full flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border-2 border-gray-200 hover:border-blue-400 transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full flex-shrink-0">
                                            <div className="w-3 h-3 bg-white rounded-full"></div>
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className={`text-base ${fromLocation ? 'text-gray-900 font-semibold' : 'text-gray-500 font-normal'}`}>
                                                {fromLocation ? getAirportDisplayText(fromLocation) : isOutbound ? 'From (UAE)' : 'From (International)'}
                                            </div>
                                        </div>
                                    </button>

                                    {/* Dropdown - Shows EITHER UAE airports OR International based on direction */}
                                    {showFromDropdown && hasAirportData && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-3 max-h-80 overflow-y-auto z-[100]">
                                            {/* Search Input */}
                                            <div className="mb-3 sticky top-0 bg-white z-10 pb-2">
                                                <input
                                                    ref={fromSearchInputRef}
                                                    type="text"
                                                    value={fromSearchQuery}
                                                    onChange={(e) => setFromSearchQuery(e.target.value)}
                                                    placeholder="Search city or airport code..."
                                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 text-sm"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                {filteredFromAirports.length > 0 ? (
                                                    filteredFromAirports.map((airport, index) => (
                                                        <button
                                                            key={`${airport.full}-${index}`}
                                                            onClick={() => {
                                                                setFromLocation(airport.full);
                                                                setShowFromDropdown(false);
                                                                setFromSearchQuery('');
                                                            }}
                                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${fromLocation === airport.full
                                                                ? 'bg-blue-50 border-2 border-blue-400'
                                                                : 'bg-gray-50 hover:bg-blue-50 border-2 border-transparent'
                                                                }`}
                                                        >
                                                            <div className={`p-2 rounded-lg ${fromLocation === airport.full ? 'bg-blue-600' : 'bg-blue-100'}`}>
                                                                <MapPin className={`w-4 h-4 ${fromLocation === airport.full ? 'text-white' : 'text-blue-600'}`} />
                                                            </div>
                                                            <div className="text-left flex-1">
                                                                <div className={`font-bold text-base ${fromLocation === airport.full ? 'text-blue-900' : 'text-gray-900'}`}>
                                                                    {airport.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500 font-semibold">{airport.code}</div>
                                                            </div>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-4 text-gray-500">
                                                        No airports found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Swap Button and Dotted Line */}
                                <div className="flex items-center justify-center relative h-6">
                                    <div className="absolute top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-400"></div>
                                    <button
                                        onClick={handleSwapLocations}
                                        disabled={!fromLocation || !toLocation}
                                        className="relative z-10 bg-white border-2 border-gray-300 rounded-full p-2 hover:bg-blue-50 hover:border-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                        title="Swap locations"
                                    >
                                        <ArrowDownUp className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>

                                {/* To Location */}
                                <div className="relative" ref={toDropdownRef}>
                                    <button
                                        onClick={() => {
                                            setShowToDropdown(!showToDropdown);
                                            setToSearchQuery('');
                                        }}
                                        disabled={!hasAirportData}
                                        className="w-full flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border-2 border-gray-200 hover:border-blue-400 transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 border-2 border-gray-300 rounded-full flex-shrink-0 bg-white">
                                            <div className="w-3 h-3 border-2 border-gray-400 rounded-full"></div>
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className={`text-base ${toLocation ? 'text-gray-900 font-semibold' : 'text-gray-500 font-normal'}`}>
                                                {toLocation ? getAirportDisplayText(toLocation) : isOutbound ? 'To (International)' : 'To (UAE)'}
                                            </div>
                                        </div>
                                    </button>

                                    {/* Dropdown with Country Groups */}
                                    {showToDropdown && hasAirportData && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-3 max-h-96 overflow-y-auto z-[100]">
                                            {/* Search Input */}
                                            <div className="mb-3 sticky top-0 bg-white z-10 pb-2">
                                                <input
                                                    ref={toSearchInputRef}
                                                    type="text"
                                                    value={toSearchQuery}
                                                    onChange={(e) => setToSearchQuery(e.target.value)}
                                                    placeholder="Search city or airport code..."
                                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-400 text-sm"
                                                />
                                            </div>

                                            {Object.keys(filteredToAirports).length > 0 ? (
                                                Object.entries(filteredToAirports).map(([country, cities]) => (
                                                    <div key={country} className="mb-4 last:mb-0">
                                                        <h3 className="text-xs font-black text-gray-600 uppercase tracking-wider mb-2 px-2">
                                                            {country}
                                                        </h3>
                                                        <div className="space-y-1.5">
                                                            {cities.map((city, index) => (
                                                                <button
                                                                    key={index}
                                                                    onClick={() => {
                                                                        setToLocation(city.full);
                                                                        setShowToDropdown(false);
                                                                        setToSearchQuery('');
                                                                    }}
                                                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${toLocation === city.full
                                                                        ? 'bg-blue-50 border-2 border-blue-400'
                                                                        : 'bg-gray-50 hover:bg-blue-50 border-2 border-transparent'
                                                                        }`}
                                                                >
                                                                    <div className={`p-2 rounded-lg ${toLocation === city.full ? 'bg-blue-600' : 'bg-blue-100'}`}>
                                                                        <MapPin className={`w-4 h-4 ${toLocation === city.full ? 'text-white' : 'text-blue-600'}`} />
                                                                    </div>
                                                                    <div className="text-left flex-1">
                                                                        <div className={`font-bold text-base ${toLocation === city.full ? 'text-blue-900' : 'text-gray-900'}`}>
                                                                            {city.name}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 font-semibold">{city.code}</div>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-4 text-gray-500">
                                                    No destinations found
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Date and Passengers - Side by Side */}
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    {/* Date */}
                                    <div>
                                        <div className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-4 border-2 border-gray-200 hover:border-blue-400 transition shadow-sm hover:shadow-md">
                                            <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                placeholder="Date"
                                                className="flex-1 outline-none bg-transparent text-gray-900 text-sm font-bold min-w-0 [color-scheme:light]"
                                                style={{ colorScheme: 'light' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Passengers */}
                                    <div>
                                        <div className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-4 border-2 border-gray-200 hover:border-blue-400 transition shadow-sm hover:shadow-md">
                                            <Users className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                            <select
                                                value={passengers}
                                                onChange={(e) => setPassengers(e.target.value)}
                                                className="flex-1 outline-none bg-transparent text-gray-900 text-sm font-bold min-w-0 cursor-pointer"
                                            >
                                                <option>1 Adult</option>
                                                <option>2 Adults</option>
                                                <option>3 Adults</option>
                                                <option>4 Adults</option>
                                                <option>5 Adults</option>
                                                <option>6 Adults</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Search Button */}
                                <button
                                    onClick={handleSearch}
                                    disabled={loading || !hasAirportData}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    <span>{loading ? 'Searching...' : 'Search Flights'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Optional Content Space */}
                    <div className="hidden lg:block flex-1">
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;