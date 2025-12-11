import { useState } from 'react';
import { Plane, Star, Filter, SortAsc } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FlightResultsProps {
    searchParams: {
        from: string;
        to: string;
        date: string;
        passengers: string;
    };
}

interface Flight {
    id: string;
    airline: string;
    logo: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    stops: number;
    price: number;
    currency: string;
    seats: number;
    rating: number;
    amenities: string[];
}

const FlightResults: React.FC<FlightResultsProps> = ({ searchParams }) => {
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');
    const [filterStops, setFilterStops] = useState<'all' | 'direct' | '1-stop'>('all');

    // Mock flight data - replace with actual API data
    const mockFlights: Flight[] = [
        {
            id: '1',
            airline: 'Emirates',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg',
            flightNumber: 'EK 512',
            departureTime: '08:30',
            arrivalTime: '12:45',
            duration: '4h 15m',
            stops: 0,
            price: 850,
            currency: 'AED',
            seats: 12,
            rating: 4.8,
            amenities: ['WiFi', 'Meal', 'Entertainment']
        },
        {
            id: '2',
            airline: 'Etihad Airways',
            logo: 'https://www.pngarts.com/files/10/Etihad-Airways-Logo-PNG-Transparent-Image.png',
            flightNumber: 'EY 234',
            departureTime: '10:15',
            arrivalTime: '14:50',
            duration: '4h 35m',
            stops: 0,
            price: 920,
            currency: 'AED',
            seats: 8,
            rating: 4.7,
            amenities: ['WiFi', 'Meal', 'Lounge Access']
        },
        {
            id: '3',
            airline: 'Air Arabia',
            logo: 'https://download.logo.wine/logo/Air_Arabia/Air_Arabia-Logo.wine.png',
            flightNumber: 'G9 456',
            departureTime: '14:00',
            arrivalTime: '18:30',
            duration: '4h 30m',
            stops: 0,
            price: 650,
            currency: 'AED',
            seats: 20,
            rating: 4.5,
            amenities: ['Meal', 'Entertainment']
        },
        {
            id: '4',
            airline: 'flydubai',
            logo: 'https://tse3.mm.bing.net/th/id/OIP.Uijx8pVRQQKgkJ4iX7KC1gHaEK?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
            flightNumber: 'FZ 789',
            departureTime: '16:45',
            arrivalTime: '21:15',
            duration: '4h 30m',
            stops: 0,
            price: 720,
            currency: 'AED',
            seats: 15,
            rating: 4.6,
            amenities: ['WiFi', 'Meal']
        },
        {
            id: '5',
            airline: 'Air India Express',
            logo: 'https://tse4.mm.bing.net/th/id/OIP.7sCkPxrsUrJAk_jsvzKvvwHaEK?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
            flightNumber: 'IX 442',
            departureTime: '06:00',
            arrivalTime: '11:20',
            duration: '5h 20m',
            stops: 1,
            price: 580,
            currency: 'AED',
            seats: 25,
            rating: 4.3,
            amenities: ['Meal']
        },
        {
            id: '6',
            airline: 'IndiGo',
            logo: 'https://seekvectorlogo.com/wp-content/uploads/2022/01/indigo-vector-logo-2022.png',
            flightNumber: '6E 1234',
            departureTime: '12:30',
            arrivalTime: '18:10',
            duration: '5h 40m',
            stops: 1,
            price: 620,
            currency: 'AED',
            seats: 18,
            rating: 4.4,
            amenities: ['Meal', 'Entertainment']
        },
        {
            id: '7',
            airline: 'Emirates',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg',
            flightNumber: 'EK 516',
            departureTime: '20:00',
            arrivalTime: '00:30',
            duration: '4h 30m',
            stops: 0,
            price: 890,
            currency: 'AED',
            seats: 10,
            rating: 4.8,
            amenities: ['WiFi', 'Meal', 'Entertainment', 'Lounge Access']
        },
        {
            id: '8',
            airline: 'SpiceJet',
            logo: 'https://tse3.mm.bing.net/th/id/OIP.XBPqoJkGfA9QDGJAXFS1aAHaEK?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
            flightNumber: 'SG 88',
            departureTime: '18:30',
            arrivalTime: '00:20',
            duration: '5h 50m',
            stops: 1,
            price: 560,
            currency: 'AED',
            seats: 22,
            rating: 4.2,
            amenities: ['Meal']
        }
    ];

    // Filter and sort flights
    const getFilteredFlights = () => {
        let filtered = [...mockFlights];

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

    const handleFlightSelect = (flight: Flight) => {
        navigate(`/flight/${flight.id}`);
    };

    const handleModifySearch = () => {
        navigate('/');
    };

    // Extract airport codes
    const getFromCode = () => searchParams.from.match(/\(([^)]+)\)/)?.[1] || searchParams.from.slice(0, 3).toUpperCase();
    const getToCode = () => searchParams.to.match(/\(([^)]+)\)/)?.[1] || searchParams.to.slice(0, 3).toUpperCase();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-100 pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                {/* Search Summary Card - Boarding Pass Style */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden mb-3 sm:mb-4 border border-gray-200 sm:border-2">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 px-3 sm:px-4 py-2.5 sm:py-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider mb-0.5">Your Search</p>
                                <h2 className="text-base sm:text-lg font-black text-white">Flight Results</h2>
                            </div>
                            <button
                                onClick={handleModifySearch}
                                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs transition"
                            >
                                Modify
                            </button>
                        </div>
                    </div>

                    {/* Perforated Line */}
                    <div className="relative h-4 sm:h-5 bg-white">
                        <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 -translate-y-1/2"></div>
                        <div className="absolute top-1/2 -left-2 w-4 h-4 sm:-left-2.5 sm:w-5 sm:h-5 bg-slate-100 rounded-full -translate-y-1/2"></div>
                        <div className="absolute top-1/2 -right-2 w-4 h-4 sm:-right-2.5 sm:w-5 sm:h-5 bg-slate-100 rounded-full -translate-y-1/2"></div>
                    </div>

                    {/* Search Details */}
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">From</p>
                                <p className="text-lg sm:text-xl font-black text-gray-900">{getFromCode()}</p>
                                <p className="text-[10px] text-gray-600 font-semibold truncate">{searchParams.from.split('(')[0].trim()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">To</p>
                                <p className="text-lg sm:text-xl font-black text-gray-900">{getToCode()}</p>
                                <p className="text-[10px] text-gray-600 font-semibold truncate">{searchParams.to.split('(')[0].trim()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Date</p>
                                <p className="text-xs sm:text-sm font-black text-gray-900">{searchParams.date}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Passengers</p>
                                <p className="text-xs sm:text-sm font-black text-gray-900">{searchParams.passengers}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Card */}
                <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Filters */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <Filter className="w-3.5 h-3.5 text-gray-600" />
                                <span className="font-bold text-gray-900 text-xs">Filters:</span>
                            </div>
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => setFilterStops('all')}
                                    className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition ${filterStops === 'all'
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilterStops('direct')}
                                    className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition ${filterStops === 'direct'
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    Direct
                                </button>
                                <button
                                    onClick={() => setFilterStops('1-stop')}
                                    className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition ${filterStops === '1-stop'
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    1 Stop
                                </button>
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <SortAsc className="w-3.5 h-3.5 text-gray-600" />
                                <span className="font-bold text-gray-900 text-xs">Sort:</span>
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 font-bold text-gray-700 text-[10px] cursor-pointer hover:border-purple-500 transition"
                            >
                                <option value="price">Price</option>
                                <option value="duration">Duration</option>
                                <option value="departure">Departure</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-2 px-1">
                    <p className="text-gray-700 font-bold text-xs">
                        <span className="text-purple-600">{filteredFlights.length}</span> flights available
                    </p>
                </div>

                {/* Flight Results - Boarding Pass Style Cards */}
                <div className="space-y-2.5 sm:space-y-3">
                    {filteredFlights.map((flight) => (
                        <div
                            key={flight.id}
                            className="bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-200 sm:border-2 group"
                        >
                            {/* Mobile Layout */}
                            <div className="md:hidden">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5">
                                                <img src={flight.logo} alt={flight.airline} className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <p className="text-white font-black text-xs">{flight.airline}</p>
                                                <p className="text-white/80 text-[10px] font-bold">{flight.flightNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                            <span className="text-[10px] font-black text-white">{flight.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Perforated Line */}
                                <div className="relative h-4 bg-white">
                                    <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 -translate-y-1/2"></div>
                                    <div className="absolute top-1/2 -left-2 w-4 h-4 bg-slate-100 rounded-full -translate-y-1/2"></div>
                                    <div className="absolute top-1/2 -right-2 w-4 h-4 bg-slate-100 rounded-full -translate-y-1/2"></div>
                                </div>

                                {/* Content */}
                                <div className="p-3">
                                    {/* Flight Route */}
                                    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mb-3">
                                        <div className="text-left">
                                            <p className="text-[9px] text-gray-500 font-bold uppercase mb-0.5">Departure</p>
                                            <p className="text-2xl font-black text-gray-900 leading-none">{flight.departureTime}</p>
                                        </div>
                                        <div className="flex flex-col items-center justify-center px-1">
                                            <Plane className="w-4 h-4 text-purple-600 rotate-90" />
                                            <p className="text-[9px] text-gray-600 font-bold mt-0.5">{flight.duration}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-gray-500 font-bold uppercase mb-0.5">Arrival</p>
                                            <p className="text-2xl font-black text-gray-900 leading-none">{flight.arrivalTime}</p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-dashed border-gray-200">
                                        <div className="flex gap-2 text-[10px] text-gray-600 font-bold">
                                            <span>{flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}</span>
                                            <span>•</span>
                                            <span className="text-green-600">{flight.seats} seats</span>
                                        </div>
                                        {/* Amenities inline */}
                                        <div className="flex gap-1">
                                            {flight.amenities.slice(0, 2).map((amenity, index) => (
                                                <span key={index} className="bg-purple-50 text-purple-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price & CTA */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase mb-0.5">Price</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-purple-600">{flight.price}</span>
                                                <span className="text-[10px] text-gray-600 font-bold">{flight.currency}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleFlightSelect(flight)}
                                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-black px-5 py-2 rounded-lg text-xs transition shadow-md active:scale-95"
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden md:block">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
                                                <img src={flight.logo} alt={flight.airline} className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <p className="text-white font-black text-sm">{flight.airline}</p>
                                                <p className="text-white/80 text-xs font-bold">{flight.flightNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-xs font-black text-white">{flight.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Perforated Line */}
                                <div className="relative h-5 bg-white">
                                    <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 -translate-y-1/2"></div>
                                    <div className="absolute top-1/2 -left-2.5 w-5 h-5 bg-slate-100 rounded-full -translate-y-1/2"></div>
                                    <div className="absolute top-1/2 -right-2.5 w-5 h-5 bg-slate-100 rounded-full -translate-y-1/2"></div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex items-center gap-4">
                                        {/* Flight Route */}
                                        <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-3">
                                            <div className="text-left">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Departure</p>
                                                <p className="text-3xl font-black text-gray-900 leading-none">{flight.departureTime}</p>
                                            </div>
                                            <div className="flex flex-col items-center justify-center px-3">
                                                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-1.5 rounded-full">
                                                    <Plane className="w-4 h-4 text-white rotate-90" />
                                                </div>
                                                <p className="text-[10px] text-gray-600 font-bold mt-1">{flight.duration}</p>
                                                <p className="text-[9px] text-gray-500 font-medium">
                                                    {flight.stops === 0 ? 'Direct' : `${flight.stops} Stop`}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Arrival</p>
                                                <p className="text-3xl font-black text-gray-900 leading-none">{flight.arrivalTime}</p>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-16 w-px bg-gray-200"></div>

                                        {/* Price & Details */}
                                        <div className="text-right">
                                            <div className="mb-2">
                                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Price</p>
                                                <div className="flex items-baseline justify-end gap-1">
                                                    <span className="text-4xl font-black text-purple-600">{flight.price}</span>
                                                    <span className="text-sm font-bold text-gray-600">{flight.currency}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-green-600 font-black mb-2">{flight.seats} seats</p>
                                            <button
                                                onClick={() => handleFlightSelect(flight)}
                                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-black px-6 py-2.5 rounded-lg text-xs transition shadow-md hover:shadow-lg transform hover:scale-105"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t-2 border-dashed border-gray-200">
                                        {flight.amenities.map((amenity, index) => (
                                            <span key={index} className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-md border border-purple-200">
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
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 text-center border border-gray-200 sm:border-2">
                        <Plane className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">No flights found</h3>
                        <p className="text-sm text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
                        <button
                            onClick={handleModifySearch}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-black px-8 py-4 rounded-2xl transition shadow-lg transform hover:scale-105"
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