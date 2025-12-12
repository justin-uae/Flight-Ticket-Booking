import { useState, useEffect } from 'react';
import { Plane, Star, Filter, SortAsc, Search, Calendar, Users, X } from 'lucide-react';
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
}

const FlightResults: React.FC<FlightResultsProps> = ({ searchParams: initialSearchParams }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { flights, loading, error } = useAppSelector((state) => state.flights);
    const { uaeAirports, destinationCities } = useAppSelector((state) => state.airports);

    // Search form state
    const [searchParams, setSearchParams] = useState(initialSearchParams);
    const [showSearchForm, setShowSearchForm] = useState(false);

    // Filter and sort state
    const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
    const [filterStops, setFilterStops] = useState<'all' | 'direct' | '1-stop'>('all');

    // Fetch airport data if not already loaded
    useEffect(() => {
        if (uaeAirports.length === 0 && Object.keys(destinationCities).length === 0) {
            dispatch(getAirportData());
        }
    }, [dispatch, uaeAirports.length, destinationCities]);

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
        navigate(`/flight/${flightId}`);
    };

    const handleModifySearch = () => {
        setShowSearchForm(!showSearchForm);
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
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 border-2 border-blue-200">
                        <div className="bg-blue-600 px-4 py-3">
                            <h3 className="text-lg font-black text-white">Modify Your Search</h3>
                        </div>
                        <form onSubmit={handleSearch} className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                {/* From - UAE Airports */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        From (UAE)
                                    </label>
                                    <div className="relative">
                                        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            value={searchParams.from}
                                            onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 focus:border-blue-600 focus:outline-none"
                                            required
                                        >
                                            <option value="">Select UAE City</option>
                                            {uaeAirports.map((airport, index) => (
                                                <option key={`${airport.full}-${index}`} value={airport.full}>
                                                    {airport.name} ({airport.code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* To - Destination Cities */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        To (Destination)
                                    </label>
                                    <div className="relative">
                                        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90" />
                                        <select
                                            value={searchParams.to}
                                            onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 focus:border-blue-600 focus:outline-none"
                                            required
                                        >
                                            <option value="">Select Destination</option>
                                            {Object.entries(destinationCities).map(([country, cities]) => (
                                                <optgroup key={country} label={country}>
                                                    {cities.map((city) => (
                                                        <option key={city.full} value={city.full}>
                                                            {city.name} ({city.code})
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </select>
                                    </div>
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
                                <p className="text-xs text-gray-600 font-semibold truncate">{searchParams.from.split('(')[0].trim()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">To</p>
                                <p className="text-xl sm:text-2xl font-black text-gray-900">{getToCode()}</p>
                                <p className="text-xs text-gray-600 font-semibold truncate">{searchParams.to.split('(')[0].trim()}</p>
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
                                                <p className="text-white/90 text-sm font-bold">{flight.flightNumber}</p>
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