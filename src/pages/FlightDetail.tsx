import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Plane, Star, Wifi, Utensils, Tv, Coffee, ArrowLeft, Phone, CheckCircle, Luggage, Sparkles, ArrowDownUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getFlightById } from '../slices/flightSlice';
import { searchFlights } from '../slices/flightSlice';

const FlightDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { selectedFlight: flight, loading, error, searchParams } = useAppSelector((state) => state.flights);
    const whatsappNumber = import.meta.env.VITE_CONTACT_NUMBER;

    // Get isOutbound from location state (passed from FlightResults)
    const isOutbound = location.state?.isOutbound ?? true;

    useEffect(() => {
        if (id) {
            dispatch(getFlightById(id));
        }
    }, [id, dispatch]);

    // Handle return flight search (swap locations)
    const handleSearchReturnFlight = async () => {
        if (!searchParams) return;

        // Swap the from and to locations
        const returnSearchParams = {
            ...searchParams,
            from: searchParams.to,
            to: searchParams.from
        };

        // Dispatch search with swapped locations
        await dispatch(searchFlights(returnSearchParams));

        // Navigate to flights page with swapped direction
        navigate('/flights', { state: { isOutbound: !isOutbound } });
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-100 pt-16 sm:pt-20 flex items-center justify-center">
                <div className="text-center">
                    <Plane className="w-16 h-16 text-blue-600 animate-bounce mx-auto mb-4" />
                    <p className="text-xl font-bold text-gray-900">Loading flight details...</p>
                </div>
            </div>
        );
    }

    // Error or not found state
    if (error || !flight) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-100 pt-16 sm:pt-20 pb-8 sm:pb-12 px-3 sm:px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12">
                        <Plane className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Flight not found</h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                            {error || "We couldn't find the flight you're looking for."}
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base transition transform hover:scale-105 shadow-lg"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const getAmenityIcon = (amenity: string) => {
        switch (amenity.toLowerCase()) {
            case 'wifi':
                return <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
            case 'meal':
                return <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
            case 'entertainment':
                return <Tv className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
            case 'lounge access':
                return <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
            default:
                return <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
        }
    };

    const handleWhatsAppEnquiry = () => {
        // Use searchParams if available, otherwise fallback to flight data
        const fromLocation = searchParams?.from || flight.departureAirport;
        const toLocation = searchParams?.to || flight.arrivalAirport;

        const message = `Hi, I'm interested in booking flight ${flight.flightNumber} (${flight.airline}) from ${fromLocation} to ${toLocation}. Price: ${flight.price} ${flight.currency}. Can you help me with the booking?`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Extract airport codes from searchParams (preferred) or flight data (fallback)
    const getDepartureCode = () => {
        if (searchParams?.from) {
            return searchParams.from.match(/\(([^)]+)\)/)?.[1] || searchParams.from.slice(0, 3).toUpperCase();
        }
        return flight.departureAirport.match(/\(([^)]+)\)/)?.[1] || 'DEP';
    };

    const getArrivalCode = () => {
        if (searchParams?.to) {
            return searchParams.to.match(/\(([^)]+)\)/)?.[1] || searchParams.to.slice(0, 3).toUpperCase();
        }
        return flight.arrivalAirport.match(/\(([^)]+)\)/)?.[1] || 'ARR';
    };

    // Get full location names from searchParams (preferred) or flight data (fallback)
    const getDepartureCity = () => {
        if (searchParams?.from) {
            return searchParams.from.split('(')[0].trim();
        }
        return flight.departureAirport.split('(')[0].trim();
    };

    const getArrivalCity = () => {
        if (searchParams?.to) {
            return searchParams.to.split('(')[0].trim();
        }
        return flight.arrivalAirport.split('(')[0].trim();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-100 pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8 lg:pb-12">
            <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-gray-700 hover:text-blue-600 font-bold mb-4 sm:mb-6 transition bg-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg"
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs sm:text-sm lg:text-base">Back to Results</span>
                </button>

                {/* Return Flight Search Button (if search params available) */}
                {searchParams && (
                    <div className="mb-4 sm:mb-6">
                        <button
                            onClick={handleSearchReturnFlight}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 sm:gap-3"
                        >
                            <ArrowDownUp className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Search Return Flight</span>
                            <span className="text-xs sm:text-sm opacity-90">
                                ({getArrivalCode()} → {getDepartureCode()})
                            </span>
                        </button>
                    </div>
                )}

                {/* Boarding Pass Card */}
                <div className="relative">
                    {/* Main Boarding Pass */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200 sm:border-2">
                        {/* Top Section - Blue Header */}
                        <div className="bg-blue-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 sm:w-40 sm:h-40 bg-white/10 rounded-full blur-2xl"></div>

                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                {/* Airline Logo & Name */}
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center p-2 sm:p-3 flex-shrink-0">
                                        <img src={flight.logo} alt={flight.airline} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Airline</p>
                                        <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-white">{flight.airline}</h1>
                                    </div>
                                </div>

                                {/* Flight Number Badge */}
                                <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg sm:rounded-xl px-4 sm:px-6 py-2 sm:py-3">
                                    <p className="text-white/80 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Flight</p>
                                    <p className="text-xl sm:text-2xl font-black text-white">{flight.flightNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Perforated Tear Line */}
                        <div className="relative h-6 sm:h-8 bg-white">
                            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 -translate-y-1/2"></div>
                            {/* Circle cutouts */}
                            <div className="absolute top-1/2 -left-3 w-6 h-6 sm:-left-4 sm:w-8 sm:h-8 bg-slate-100 rounded-full -translate-y-1/2"></div>
                            <div className="absolute top-1/2 -right-3 w-6 h-6 sm:-right-4 sm:w-8 sm:h-8 bg-slate-100 rounded-full -translate-y-1/2"></div>
                        </div>

                        {/* Main Content */}
                        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                            {/* Route Information - Large */}
                            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 mb-6 sm:mb-8">
                                {/* Departure */}
                                <div className="text-left">
                                    <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">From</p>
                                    <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-1 sm:mb-2 leading-none">{getDepartureCode()}</div>
                                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 font-semibold mb-2 sm:mb-3 line-clamp-2">{getDepartureCity()}</p>
                                    <div className="bg-blue-50 border border-blue-200 sm:border-2 rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 inline-block">
                                        <p className="text-[10px] sm:text-xs text-gray-500 font-bold mb-0.5">Departure</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-black text-blue-600 leading-none">{flight.departureTime}</p>
                                    </div>
                                </div>

                                {/* Flight Path Icon */}
                                <div className="flex flex-col items-center justify-center px-2 sm:px-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-30"></div>
                                        <div className="relative bg-blue-600 p-2 sm:p-3 lg:p-4 rounded-full">
                                            <Plane className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white rotate-90" />
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:mt-3 text-center bg-gray-100 rounded-md sm:rounded-lg px-2 sm:px-3 py-1">
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-900">{flight.duration}</p>
                                    </div>
                                </div>

                                {/* Arrival */}
                                <div className="text-right">
                                    <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">To</p>
                                    <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-1 sm:mb-2 leading-none">{getArrivalCode()}</div>
                                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 font-semibold mb-2 sm:mb-3 line-clamp-2">{getArrivalCity()}</p>
                                    <div className="bg-blue-50 border border-blue-200 sm:border-2 rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 inline-block">
                                        <p className="text-[10px] sm:text-xs text-gray-500 font-bold mb-0.5">Arrival</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-black text-blue-600 leading-none">{flight.arrivalTime}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t-2 border-dashed border-gray-200 my-4 sm:my-6"></div>

                            {/* Flight Details Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
                                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 border border-gray-200">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 sm:mb-2">Class</p>
                                    <p className="text-sm sm:text-base lg:text-lg font-black text-gray-900 truncate">{flight.cabinClass}</p>
                                </div>

                                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 border border-gray-200">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 sm:mb-2">Aircraft</p>
                                    <p className="text-[11px] sm:text-xs lg:text-sm font-black text-gray-900 line-clamp-2">{flight.aircraftType}</p>
                                </div>

                                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 border border-gray-200">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 sm:mb-2">Stops</p>
                                    <p className="text-sm sm:text-base lg:text-lg font-black text-gray-900">
                                        {flight.stops === 0 ? 'Direct' : flight.stops}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 border border-gray-200">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 sm:mb-2">Seats</p>
                                    <p className="text-sm sm:text-base lg:text-lg font-black text-green-600">{flight.seats} left</p>
                                </div>
                            </div>

                            {/* Amenities & Baggage */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                {/* Amenities */}
                                <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100 sm:border-2">
                                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                                        <p className="text-[10px] sm:text-xs text-blue-900 font-black uppercase tracking-wider">Amenities</p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {flight.amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center gap-1 bg-white rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-blue-200">
                                                <div className="text-blue-600">{getAmenityIcon(amenity)}</div>
                                                <span className="text-[10px] sm:text-xs font-bold text-gray-900">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Baggage */}
                                <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100 sm:border-2">
                                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                        <Luggage className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                                        <p className="text-[10px] sm:text-xs text-blue-900 font-black uppercase tracking-wider">Baggage</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between bg-white rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-blue-200">
                                            <span className="text-[10px] sm:text-xs font-bold text-gray-600">Checked</span>
                                            <span className="text-xs sm:text-sm font-black text-gray-900">{flight.baggage.checked}</span>
                                        </div>
                                        <div className="flex items-center justify-between bg-white rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-blue-200">
                                            <span className="text-[10px] sm:text-xs font-bold text-gray-600">Cabin</span>
                                            <span className="text-xs sm:text-sm font-black text-gray-900">{flight.baggage.cabin}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="bg-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                                <p className="text-white/80 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1 sm:mb-2">Price Per Person</p>
                                <div className="flex items-baseline justify-center gap-1 sm:gap-2">
                                    <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white">{flight.price}</span>
                                    <span className="text-xl sm:text-2xl font-bold text-white/80">{flight.currency}</span>
                                </div>
                                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                                    <span className="text-sm sm:text-base text-white font-bold">{flight.rating} Rating</span>
                                </div>
                            </div>
                        </div>

                        {/* Perforated Tear Line */}
                        <div className="relative h-6 sm:h-8 bg-white">
                            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 -translate-y-1/2"></div>
                            {/* Circle cutouts */}
                            <div className="absolute top-1/2 -left-3 w-6 h-6 sm:-left-4 sm:w-8 sm:h-8 bg-slate-100 rounded-full -translate-y-1/2"></div>
                            <div className="absolute top-1/2 -right-3 w-6 h-6 sm:-right-4 sm:w-8 sm:h-8 bg-slate-100 rounded-full -translate-y-1/2"></div>
                        </div>

                        {/* Bottom Stub - Important Information */}
                        <div className="bg-amber-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-amber-100 sm:border-t-2">
                            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                                <h3 className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-wider">Important Information</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                <div className="flex items-start gap-2">
                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-[10px] sm:text-xs text-gray-700 font-medium">Arrive 3 hours before departure</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-[10px] sm:text-xs text-gray-700 font-medium">Valid passport & visa required</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-[10px] sm:text-xs text-gray-700 font-medium">Timings subject to change</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p className="text-[10px] sm:text-xs text-gray-700 font-medium">Excess baggage fees may apply</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp CTA - Outside Boarding Pass */}
                    <div className="mt-4 sm:mt-6 lg:mt-8 bg-green-600 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>

                        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                            <div className="text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 sm:mb-2">
                                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white">Ready to Book This Flight?</h3>
                                </div>
                                <p className="text-xs sm:text-sm text-white/90 font-medium">Get instant assistance on WhatsApp • Available 24/7</p>
                            </div>

                            <button
                                onClick={handleWhatsAppEnquiry}
                                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-green-600 font-black py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl text-sm sm:text-base transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap"
                            >
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                                Enquire on WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightDetail;