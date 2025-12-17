import { useState, useEffect, useRef } from 'react';
import { Plane, Star, Filter, SortAsc, Search, Calendar, Users, X, ArrowDownUp, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { searchFlights } from '../slices/flightSlice';
import { getAirportData } from '../slices/airportSlice';

interface FlightResultsProps {
    searchParams: {
        from: string;
        to: string;
        date: string;
        passengers: string;
    };
    isOutbound: boolean;
}

const FlightResults: React.FC<FlightResultsProps> = ({ searchParams: initialSearchParams, isOutbound: initialIsOutbound }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { flights, loading, error } = useAppSelector((state) => state.flights);
    const { uaeAirports, destinationCities } = useAppSelector((state) => state.airports);

    // Search form state
    const [searchParams, setSearchParams] = useState(initialSearchParams);
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [isOutbound, setIsOutbound] = useState(initialIsOutbound);

    // Dropdown and search state
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);
    const [fromSearchQuery, setFromSearchQuery] = useState('');
    const [toSearchQuery, setToSearchQuery] = useState('');

    const fromDropdownRef = useRef<HTMLDivElement>(null);
    const toDropdownRef = useRef<HTMLDivElement>(null);
    const fromSearchInputRef = useRef<HTMLInputElement>(null);
    const toSearchInputRef = useRef<HTMLInputElement>(null);

    // Filter and sort state
    const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
    const [filterStops, setFilterStops] = useState<'all' | 'direct' | '1-stop'>('all');

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

    // Smart swap function
    const handleSwapLocations = () => {
        const tempFrom = searchParams.from;
        setSearchParams({
            ...searchParams,
            from: searchParams.to,
            to: tempFrom
        });
        setIsOutbound(!isOutbound);
    };

    // Handle search form submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(searchFlights(searchParams));
        setShowSearchForm(false);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setFilterStops('all');
        setSortBy('price');
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

    // Filter and sort flights from Redux store
    const getFilteredFlights = () => {
        let filtered = [...flights];

        // Apply stops filter
        if (filterStops === 'direct') {
            filtered = filtered.filter(f => f.stops === 0);
        } else if (filterStops === '1-stop') {
            filtered = filtered.filter(f => f.stops === 1);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            if (sortBy === 'price') return a.price - b.price;
            if (sortBy === 'duration') return parseInt(a.duration) - parseInt(b.duration);
            if (sortBy === 'departure') return a.departureTime.localeCompare(b.departureTime);
            return 0;
        });

        return filtered;
    };

    const filteredFlights = getFilteredFlights();

    const handleFlightSelect = (flightId: string) => {
        navigate(`/flight/${flightId}`, { state: { isOutbound } });
    };

    const handleModifySearch = () => {
        setShowSearchForm(!showSearchForm);
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

    // Extract airport codes
    const getFromCode = () => searchParams.from.match(/\(([^)]+)\)/)?.[1] || searchParams.from.slice(0, 3).toUpperCase();
    const getToCode = () => searchParams.to.match(/\(([^)]+)\)/)?.[1] || searchParams.to.slice(0, 3).toUpperCase();

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 pb-6 flex items-center justify-center">
                <div className="text-center">
                    <Plane className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600 animate-bounce mx-auto mb-4" />
                    <p className="text-xl sm:text-2xl font-black text-gray-900">Searching for flights...</p>
                    <p className="text-base sm:text-lg text-gray-600 mt-2 font-semibold">Finding the best options</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 pb-6 flex items-center justify-center px-4">
                <div className="text-center max-w-md mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border-2 border-red-200">
                        <Plane className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Search Failed</h3>
                        <p className="text-base text-red-600 mb-6 font-semibold">{error}</p>
                        <button
                            onClick={() => setShowSearchForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 rounded-lg transition text-base"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 pb-6">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                {/* Search Form (Collapsible) */}
                {showSearchForm && (
                    <div className="bg-white rounded-xl shadow-lg overflow-visible mb-4 border-2 border-blue-200">
                        <div className="bg-blue-600 px-4 py-3">
                            <h3 className="text-lg font-black text-white">Modify Your Search</h3>
                        </div>
                        <form onSubmit={handleSearch} className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                                {/* From */}
                                <div className="relative" ref={fromDropdownRef}>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        {isOutbound ? 'From (UAE)' : 'From (International)'}
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowFromDropdown(!showFromDropdown);
                                            setFromSearchQuery('');
                                        }}
                                        className="w-full flex items-center gap-3 bg-white rounded-lg px-4 py-3 border-2 border-gray-300 hover:border-blue-400 transition text-left"
                                    >
                                        <Plane className="w-5 h-5 text-gray-400" />
                                        <span className={`flex-1 text-sm ${searchParams.from ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                                            {searchParams.from ? getAirportDisplayText(searchParams.from).split('(')[0].trim() : 'Select'}
                                        </span>
                                    </button>

                                    {/* From Dropdown */}
                                    {showFromDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-3 max-h-80 overflow-y-auto z-[100]">
                                            <div className="mb-3 sticky top-0 bg-white z-10 pb-2">
                                                <input
                                                    ref={fromSearchInputRef}
                                                    type="text"
                                                    value={fromSearchQuery}
                                                    onChange={(e) => setFromSearchQuery(e.target.value)}
                                                    placeholder="Search..."
                                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-400 text-sm"
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
                                                                <div className={`font-bold text-sm ${searchParams.from === airport.full ? 'text-blue-900' : 'text-gray-900'}`}>
                                                                    {airport.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500 font-semibold">{airport.code}</div>
                                                            </div>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-4 text-gray-500 text-sm">No airports found</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Swap Button */}
                                <div className="flex items-end justify-center">
                                    <button
                                        type="button"
                                        onClick={handleSwapLocations}
                                        disabled={!searchParams.from || !searchParams.to}
                                        className="bg-white border-2 border-gray-300 rounded-lg p-3 hover:bg-blue-50 hover:border-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Swap locations"
                                    >
                                        <ArrowDownUp className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>

                                {/* To */}
                                <div className="relative" ref={toDropdownRef}>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        {isOutbound ? 'To (International)' : 'To (UAE)'}
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowToDropdown(!showToDropdown);
                                            setToSearchQuery('');
                                        }}
                                        className="w-full flex items-center gap-3 bg-white rounded-lg px-4 py-3 border-2 border-gray-300 hover:border-blue-400 transition text-left"
                                    >
                                        <Plane className="w-5 h-5 text-gray-400 rotate-90" />
                                        <span className={`flex-1 text-sm ${searchParams.to ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                                            {searchParams.to ? getAirportDisplayText(searchParams.to).split('(')[0].trim() : 'Select'}
                                        </span>
                                    </button>

                                    {/* To Dropdown */}
                                    {showToDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-3 max-h-96 overflow-y-auto z-[100]">
                                            <div className="mb-3 sticky top-0 bg-white z-10 pb-2">
                                                <input
                                                    ref={toSearchInputRef}
                                                    type="text"
                                                    value={toSearchQuery}
                                                    onChange={(e) => setToSearchQuery(e.target.value)}
                                                    placeholder="Search..."
                                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-400 text-sm"
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
                                                                        <div className={`font-bold text-sm ${searchParams.to === city.full ? 'text-blue-900' : 'text-gray-900'}`}>
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
                                                <div className="text-center py-4 text-gray-500 text-sm">No destinations found</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Departure Date
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="date"
                                            value={searchParams.date}
                                            onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                                            min={getTodayDate()}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 focus:border-blue-600 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Passengers */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Passengers
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            value={searchParams.passengers}
                                            onChange={(e) => setSearchParams({ ...searchParams, passengers: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 focus:border-blue-600 focus:outline-none"
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

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-6 rounded-lg transition shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Search className="w-5 h-5" />
                                    Search Flights
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowSearchForm(false)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Search Summary Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-3 border-2 border-gray-200">
                    {/* Header */}
                    <div className="bg-blue-600 px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/90 text-xs font-bold uppercase tracking-wider mb-0.5">Your Search</p>
                                <h2 className="text-lg sm:text-xl font-black text-white">Flight Results</h2>
                            </div>
                            <button
                                onClick={handleModifySearch}
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 text-white font-bold px-4 py-2 rounded-lg text-xs sm:text-sm transition"
                            >
                                {showSearchForm ? 'Hide' : 'Modify'}
                            </button>
                        </div>
                    </div>

                    {/* Perforated Line */}
                    <div className="relative h-4 bg-white">
                        <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 -translate-y-1/2"></div>
                        <div className="absolute top-1/2 -left-2 w-4 h-4 bg-gray-50 rounded-full -translate-y-1/2"></div>
                        <div className="absolute top-1/2 -right-2 w-4 h-4 bg-gray-50 rounded-full -translate-y-1/2"></div>
                    </div>

                    {/* Search Details */}
                    <div className="px-4 py-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">From</p>
                                <p className="text-xl sm:text-2xl font-black text-gray-900">{getFromCode()}</p>
                                <p className="text-xs text-gray-600 font-semibold truncate">{getAirportDisplayText(searchParams.from).split('(')[0].trim()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">To</p>
                                <p className="text-xl sm:text-2xl font-black text-gray-900">{getToCode()}</p>
                                <p className="text-xs text-gray-600 font-semibold truncate">{getAirportDisplayText(searchParams.to).split('(')[0].trim()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Date</p>
                                <p className="text-sm sm:text-base font-black text-gray-900">{searchParams.date}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Passengers</p>
                                <p className="text-sm sm:text-base font-black text-gray-900">{searchParams.passengers}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Sort */}
                <div className="bg-white rounded-lg shadow-md p-3 mb-3 border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Filters */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <Filter className="w-4 h-4 text-gray-600" />
                                <span className="font-black text-gray-900 text-sm">Filters:</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilterStops('all')}
                                    className={`px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition ${filterStops === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilterStops('direct')}
                                    className={`px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition ${filterStops === 'direct'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Direct
                                </button>
                                <button
                                    onClick={() => setFilterStops('1-stop')}
                                    className={`px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition ${filterStops === '1-stop'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    1 Stop
                                </button>
                            </div>
                        </div>

                        {/* Sort & Clear All */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                    <SortAsc className="w-4 h-4 text-gray-600" />
                                    <span className="font-black text-gray-900 text-sm">Sort:</span>
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 font-bold text-gray-700 text-xs sm:text-sm cursor-pointer hover:border-blue-500 transition"
                                >
                                    <option value="price">Price</option>
                                    <option value="duration">Duration</option>
                                    <option value="departure">Departure</option>
                                </select>
                            </div>

                            {/* Clear All Button */}
                            {(filterStops !== 'all' || sortBy !== 'price') && (
                                <button
                                    onClick={handleClearFilters}
                                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg text-xs sm:text-sm transition border border-red-200"
                                >
                                    <X className="w-4 h-4" />
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-2 px-1">
                    <p className="text-gray-700 font-bold text-sm">
                        <span className="text-blue-600 text-base">{filteredFlights.length}</span> flights available
                    </p>
                </div>

                {/* Flight Results */}
                <div className="space-y-3">
                    {filteredFlights.map((flight) => (
                        <div
                            key={flight.id}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-gray-200 hover:border-blue-300"
                        >
                            {/* Mobile Layout */}
                            <div className="md:hidden">
                                {/* Header */}
                                <div className="bg-blue-600 px-3 py-2.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5">
                                                <img src={flight.logo} alt={flight.airline} className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <p className="text-white font-black text-sm">{flight.airline}</p>
                                                <p className="text-white/90 text-xs font-bold">{flight.flightNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                            <span className="text-xs font-black text-white">{flight.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Perforated Line */}
                                <div className="relative h-4 bg-white">
                                    <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 -translate-y-1/2"></div>
                                    <div className="absolute top-1/2 -left-2 w-4 h-4 bg-gray-50 rounded-full -translate-y-1/2"></div>
                                    <div className="absolute top-1/2 -right-2 w-4 h-4 bg-gray-50 rounded-full -translate-y-1/2"></div>
                                </div>

                                {/* Content */}
                                <div className="p-3">
                                    {/* Flight Route */}
                                    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mb-3">
                                        <div className="text-left">
                                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Departure</p>
                                            <p className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">{flight.departureTime}</p>
                                        </div>
                                        <div className="flex flex-col items-center justify-center px-2">
                                            <div className="bg-blue-600 p-1.5 rounded-full">
                                                <Plane className="w-4 h-4 text-white rotate-90" />
                                            </div>
                                            <p className="text-xs text-gray-600 font-bold mt-1">{flight.duration}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Arrival</p>
                                            <p className="text-2xl sm:text-3xl font-black text-gray-900 leading-none">{flight.arrivalTime}</p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex items-center justify-between mb-2.5 pb-2.5 border-b-2 border-dashed border-gray-200">
                                        <div className="flex gap-2 text-xs sm:text-sm text-gray-600 font-bold">
                                            <span>{flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}</span>
                                            <span>•</span>
                                            <span className="text-green-600">{flight.seats} seats</span>
                                        </div>
                                        {/* Amenities inline */}
                                        <div className="flex gap-1">
                                            {flight.amenities.slice(0, 2).map((amenity, index) => (
                                                <span key={index} className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded border border-blue-200">
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price & CTA */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Price</p>
                                            <div className="flex items-baseline gap-1">
                                                {/* striked price */}
                                                <div className="text-lg text-gray-500 font-bold line-through mb-0.5">
                                                    {flight?.price + 100} AED
                                                </div>
                                                <span className="text-3xl font-black text-blue-600">{flight.price}</span>
                                                <span className="text-sm text-gray-600 font-bold">{flight.currency}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleFlightSelect(flight.id)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-5 py-2.5 rounded-lg text-sm transition shadow-md active:scale-95"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden md:block">
                                {/* Header */}
                                <div className="bg-blue-600 px-4 py-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
                                                <img src={flight.logo} alt={flight.airline} className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <p className="text-white font-black text-base">{flight.airline}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border-2 border-white/30">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm font-black text-white">{flight.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Perforated Line */}
                                <div className="relative h-4 bg-white">
                                    <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 -translate-y-1/2"></div>
                                    <div className="absolute top-1/2 -left-2 w-4 h-4 bg-gray-50 rounded-full -translate-y-1/2"></div>
                                    <div className="absolute top-1/2 -right-2 w-4 h-4 bg-gray-50 rounded-full -translate-y-1/2"></div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex items-center gap-4">
                                        {/* Flight Route */}
                                        <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-4">
                                            <div className="text-left">
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Departure</p>
                                                <p className="text-4xl font-black text-gray-900 leading-none">{flight.departureTime}</p>
                                            </div>
                                            <div className="flex flex-col items-center justify-center px-3">
                                                <div className="bg-blue-600 p-2 rounded-full">
                                                    <Plane className="w-5 h-5 text-white rotate-90" />
                                                </div>
                                                <p className="text-xs text-gray-600 font-bold mt-1.5">{flight.duration}</p>
                                                <p className="text-xs text-gray-500 font-semibold mt-0.5">
                                                    {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Arrival</p>
                                                <p className="text-4xl font-black text-gray-900 leading-none">{flight.arrivalTime}</p>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-20 w-px bg-gray-300"></div>

                                        {/* Price & Details */}
                                        <div className="text-right">
                                            <div className="mb-2">
                                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Price</p>
                                                <div className="flex items-baseline justify-end gap-1">
                                                    <div className="text-lg text-gray-500 font-bold line-through mb-0.5">
                                                        {flight?.price + 100} AED
                                                    </div>
                                                    <span className="text-5xl font-black text-blue-600">{flight.price}</span>
                                                    <span className="text-base font-bold text-gray-600">{flight.currency}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-green-600 font-black mb-3">{flight.seats} seats available</p>
                                            <button
                                                onClick={() => handleFlightSelect(flight.id)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 rounded-lg text-sm transition shadow-md hover:shadow-lg transform hover:scale-105"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t-2 border-dashed border-gray-200">
                                        {flight.amenities.map((amenity, index) => (
                                            <span key={index} className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded border border-blue-200">
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredFlights.length === 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-gray-200">
                        <Plane className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No flights found</h3>
                        <p className="text-base text-gray-600 mb-6 font-semibold">Try adjusting your filters or search criteria</p>
                        <button
                            onClick={() => setShowSearchForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-xl transition shadow-lg transform hover:scale-105 text-base"
                        >
                            Modify Search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightResults;