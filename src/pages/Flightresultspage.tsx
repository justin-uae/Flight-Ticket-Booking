import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { searchFlights } from '../slices/flightSlice';
import FlightResults from './FlightResults';
import { Plane, Search, Calendar, Users } from 'lucide-react';
import { destinationCities, uaeAirports } from '../AirportData/AirportData';

const FlightResultsPage = () => {
    const dispatch = useAppDispatch();
    const { searchParams: existingSearchParams, loading } = useAppSelector((state) => state.flights);

    // Local search form state
    const [searchParams, setSearchParams] = useState({
        from: '',
        to: '',
        date: '',
        passengers: '1'
    });

    // Track if we've performed a search
    const [hasSearched, setHasSearched] = useState(false);

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
        } else {
            // Set default date to today
            setSearchParams(prev => ({
                ...prev,
                date: getTodayDate()
            }));
        }
    }, [existingSearchParams]);

    // Handle search form submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setHasSearched(true);
        dispatch(searchFlights(searchParams));
    };

    // If we have performed a search, show results (even if loading or no results yet)
    if (hasSearched && existingSearchParams) {
        return <FlightResults searchParams={existingSearchParams} />;
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
                        Find the best deals on flights from UAE to your destination
                    </p>
                </div>

                {/* Search Form Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200">
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
                            {/* From - UAE Airports */}
                            <div>
                                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                                    From (UAE)
                                </label>
                                <div className="relative">
                                    <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        value={searchParams.from}
                                        onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 focus:border-blue-600 focus:outline-none transition bg-gray-50 hover:bg-white"
                                        required
                                    >
                                        <option value="">Select UAE City</option>
                                        {uaeAirports?.map((airport, index) => (
                                            <option key={`${airport.full}-${index}`} value={airport.full}>
                                                {airport.name} ({airport.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* To - Destination Cities */}
                            <div>
                                <label className="block text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">
                                    To (Destination)
                                </label>
                                <div className="relative">
                                    <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90" />
                                    <select
                                        value={searchParams.to}
                                        onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 focus:border-blue-600 focus:outline-none transition bg-gray-50 hover:bg-white"
                                        required
                                    >
                                        <option value="">Select Destination</option>
                                        {Object.entries(destinationCities)?.map(([country, cities]) => (
                                            <optgroup key={country} label={country}>
                                                {cities.map((city, index) => (
                                                    <option key={`${city.full}-${index}`} value={city.full}>
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
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 focus:border-blue-600 focus:outline-none transition bg-gray-50 hover:bg-white"
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
                                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 focus:border-blue-600 focus:outline-none transition bg-gray-50 hover:bg-white"
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
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-black text-gray-900 mb-2">Flexible Dates</h3>
                        <p className="text-sm text-gray-600 font-medium">
                            Choose from available dates
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightResultsPage;