import { useEffect, useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { searchFlights } from '../slices/flightSlice';
import { getAirportData } from '../slices/airportSlice';
import FlightResults from './FlightResults';
import { Plane, Search, Calendar, Users, ArrowDownUp, MapPin } from 'lucide-react';

const FlightResultsPage = () => {
    const dispatch = useAppDispatch();
    const { searchParams: existingSearchParams, loading } = useAppSelector((state) => state.flights);
    const { uaeAirports, destinationCities } = useAppSelector((state) => state.airports);

    // Local search form state
    const [searchParams, setSearchParams] = useState({
        from: '',
        to: '',
        date: '',
        passengers: '1'
    });

    // Track direction: true = UAE->International, false = International->UAE
    const [isOutbound, setIsOutbound] = useState(true);

    // Track if we've performed a search
    const [hasSearched, setHasSearched] = useState(false);

    // Dropdown and search state
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);
    const [fromSearchQuery, setFromSearchQuery] = useState('');
    const [toSearchQuery, setToSearchQuery] = useState('');

    const fromDropdownRef = useRef<HTMLDivElement>(null);
    const toDropdownRef = useRef<HTMLDivElement>(null);
    const fromSearchInputRef = useRef<HTMLInputElement>(null);
    const toSearchInputRef = useRef<HTMLInputElement>(null);

    // Fetch airport data if not already loaded
    useEffect(() => {
        if (uaeAirports.length === 0 && Object.keys(destinationCities).length === 0) {
            dispatch(getAirportData());
        }
    }, [dispatch, uaeAirports.length, destinationCities]);

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

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Initialize with existing search params if available
    useEffect(() => {
        if (existingSearchParams) {
            setSearchParams(existingSearchParams);
            setHasSearched(true);

            // Determine direction based on existing search
            const fromIsUAE = uaeAirports.some(a => a.full === existingSearchParams.from);
            setIsOutbound(fromIsUAE);
        } else {
            // Set default date to today
            setSearchParams(prev => ({
                ...prev,
                date: getTodayDate()
            }));
        }
    }, [existingSearchParams, uaeAirports]);

    // Smart swap function
    const handleSwapLocations = () => {
        if (!searchParams.from || !searchParams.to) return;

        const tempFrom = searchParams.from;
        setSearchParams({
            ...searchParams,
            from: searchParams.to,
            to: tempFrom
        });
        setIsOutbound(!isOutbound);
    };

    // Get available FROM airports based on direction
    const getFromAirports = () => {
        if (isOutbound) {
            return uaeAirports;
        } else {
            return Object.values(destinationCities).flat();
        }
    };

    // Get available TO airports based on direction
    const getToAirports = () => {
        if (isOutbound) {
            return destinationCities;
        } else {
            return { 'UAE': uaeAirports };
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

    // Handle search form submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setHasSearched(true);
        dispatch(searchFlights(searchParams));
    };

    // Helper function to get airport display text
    const getAirportDisplayText = (location: string) => {
        const uaeAirport = uaeAirports.find(a => a.full === location);
        if (uaeAirport) {
            return `${uaeAirport.name} (${uaeAirport.code})`;
        }

        const destCity = Object.values(destinationCities).flat().find(c => c.full === location);
        if (destCity) {
            return `${destCity.name} (${destCity.code})`;
        }

        return location;
    };

    // If we have performed a search, show results (even if loading or no results yet)
    if (hasSearched && existingSearchParams) {
        return <FlightResults searchParams={existingSearchParams} isOutbound={isOutbound} />;
    }

    // Otherwise, show the search form
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 pt-16 sm:pt-20 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
                            <Plane className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">
                            Compare Flight Prices
                        </h1>
                    </div>
                    <p className="text-base sm:text-lg text-gray-600 font-semibold">
                        Find the best deals on flights {isOutbound ? 'from UAE to your destination' : 'to UAE from international cities'}
                    </p>
                </div>

                {/* Search Form Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-visible border-2 border-gray-200">
                    {/* Header */}
                    <div className="bg-blue-600 px-6 py-4">
                        <h2 className="text-xl sm:text-2xl font-black text-white">Search Flights</h2>
                        <p className="text-sm text-white/80 font-medium mt-1">
                            Enter your travel details to find available flights
                        </p>
                    </div>

                    {/* Perforated Line */}
                    <div className="relative h-6 bg-white">
                        <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 -translate-y-1/2"></div>
                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-50 rounded-full -translate-y-1/2"></div>
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-slate-50 rounded-full -translate-y-1/2"></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSearch} className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            {/* From */}
                            <div className="relative" ref={fromDropdownRef}>
                                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                                    {isOutbound ? 'From (UAE)' : 'From (International)'}
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowFromDropdown(!showFromDropdown);
                                        setFromSearchQuery('');
                                    }}
                                    className="w-full flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border-2 border-gray-200 hover:border-blue-400 transition shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full flex-shrink-0">
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className={`text-base ${searchParams.from ? 'text-gray-900 font-semibold' : 'text-gray-500 font-normal'}`}>
                                            {searchParams.from ? getAirportDisplayText(searchParams.from).split('(')[0].trim() : isOutbound ? 'From (UAE)' : 'From (International)'}
                                        </div>
                                    </div>
                                </button>

                                {/* From Dropdown */}
                                {showFromDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-3 max-h-80 overflow-y-auto z-[100]">
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
                                                        type="button"
                                                        onClick={() => {
                                                            setSearchParams({ ...searchParams, from: airport.full });
                                                            setShowFromDropdown(false);
                                                            setFromSearchQuery('');
                                                        }}
                                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${searchParams.from === airport.full
                                                            ? 'bg-blue-50 border-2 border-blue-400'
                                                            : 'bg-gray-50 hover:bg-blue-50 border-2 border-transparent'
                                                            }`}
                                                    >
                                                        <div className={`p-2 rounded-lg ${searchParams.from === airport.full ? 'bg-blue-600' : 'bg-blue-100'}`}>
                                                            <MapPin className={`w-4 h-4 ${searchParams.from === airport.full ? 'text-white' : 'text-blue-600'}`} />
                                                        </div>
                                                        <div className="text-left flex-1">
                                                            <div className={`font-bold text-base ${searchParams.from === airport.full ? 'text-blue-900' : 'text-gray-900'}`}>
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

                            {/* To */}
                            <div className="relative" ref={toDropdownRef}>
                                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                                    {isOutbound ? 'To (International)' : 'To (UAE)'}
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowToDropdown(!showToDropdown);
                                        setToSearchQuery('');
                                    }}
                                    className="w-full flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border-2 border-gray-200 hover:border-blue-400 transition shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 border-2 border-gray-300 rounded-full flex-shrink-0 bg-white">
                                        <div className="w-3 h-3 border-2 border-gray-400 rounded-full"></div>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className={`text-base ${searchParams.to ? 'text-gray-900 font-semibold' : 'text-gray-500 font-normal'}`}>
                                            {searchParams.to ? getAirportDisplayText(searchParams.to).split('(')[0].trim() : isOutbound ? 'To (International)' : 'To (UAE)'}
                                        </div>
                                    </div>
                                </button>

                                {/* To Dropdown */}
                                {showToDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-3 max-h-96 overflow-y-auto z-[100]">
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
                                                                type="button"
                                                                onClick={() => {
                                                                    setSearchParams({ ...searchParams, to: city.full });
                                                                    setShowToDropdown(false);
                                                                    setToSearchQuery('');
                                                                }}
                                                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${searchParams.to === city.full
                                                                    ? 'bg-blue-50 border-2 border-blue-400'
                                                                    : 'bg-gray-50 hover:bg-blue-50 border-2 border-transparent'
                                                                    }`}
                                                            >
                                                                <div className={`p-2 rounded-lg ${searchParams.to === city.full ? 'bg-blue-600' : 'bg-blue-100'}`}>
                                                                    <MapPin className={`w-4 h-4 ${searchParams.to === city.full ? 'text-white' : 'text-blue-600'}`} />
                                                                </div>
                                                                <div className="text-left flex-1">
                                                                    <div className={`font-bold text-base ${searchParams.to === city.full ? 'text-blue-900' : 'text-gray-900'}`}>
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

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                                    Departure Date
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="date"
                                        value={searchParams.date}
                                        onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                                        min={getTodayDate()}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 focus:border-blue-600 focus:outline-none transition bg-gray-50 hover:bg-white [color-scheme:light]"
                                        style={{ colorScheme: 'light' }}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Passengers */}
                            <div>
                                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                                    Passengers
                                </label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        value={searchParams.passengers}
                                        onChange={(e) => setSearchParams({ ...searchParams, passengers: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 focus:border-blue-600 focus:outline-none transition bg-gray-50 hover:bg-white cursor-pointer"
                                        required
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? 'Passenger' : 'Passengers'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Swap Button */}
                        <div className="flex items-center justify-center mb-6">
                            <button
                                type="button"
                                onClick={handleSwapLocations}
                                disabled={!searchParams.from || !searchParams.to}
                                className="flex items-center gap-2 bg-white border-2 border-blue-300 rounded-xl px-6 py-3 hover:bg-blue-50 hover:border-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                title="Swap departure and arrival"
                            >
                                <ArrowDownUp className="w-5 h-5 text-blue-600" />
                                <span className="font-bold text-blue-600">Swap Locations</span>
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-xl transition shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <Search className="w-6 h-6" />
                            {loading ? 'Searching...' : 'Search Flights'}
                        </button>

                        {/* Help Text */}
                        <p className="text-center text-sm text-gray-500 mt-4 font-medium">
                            We'll search through multiple airlines to find you the best prices
                        </p>
                    </form>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 text-center">
                        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Search className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-black text-gray-900 mb-2">Compare Prices</h3>
                        <p className="text-sm text-gray-600 font-medium">
                            Search multiple airlines at once
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 text-center">
                        <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Plane className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-black text-gray-900 mb-2">Best Deals</h3>
                        <p className="text-sm text-gray-600 font-medium">
                            Find the lowest fares available
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200 text-center">
                        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <ArrowDownUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-black text-gray-900 mb-2">Flexible Routes</h3>
                        <p className="text-sm text-gray-600 font-medium">
                            Swap locations for return flights
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightResultsPage;