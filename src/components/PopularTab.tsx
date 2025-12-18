import { useEffect } from 'react';
import { MapPin, Sparkles, Plane, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getPopularDestinations } from '../slices/destinationSlice';
import { searchFlights } from '../slices/flightSlice';

export default function PopularDestinations() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { destinations, loading, error } = useAppSelector((state) => state.destinations);

    useEffect(() => {
        dispatch(getPopularDestinations());
    }, [dispatch]);

    const handleDestinationClick = async (destination: any) => {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const fromAirport = 'Dubai International Airport (DXB)';

        try {
            await dispatch(searchFlights({
                from: fromAirport,
                to: destination.airportFull,
                date: dateString,
                passengers: '1 Adult'
            })).unwrap();
            navigate('/flights');
        } catch (error) {
            console.error('Failed to search flights for destination:', error);
            navigate('/flights');
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-b from-white via-gray-50/20 to-white py-12 sm:py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <Plane className="w-12 h-12 text-blue-600 animate-bounce mx-auto mb-4" />
                            <p className="text-lg font-bold text-gray-900">Loading popular destinations...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-b from-white via-gray-50/20 to-white py-12 sm:py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-2 border-red-200">
                        <p className="text-red-600 font-bold">{error}</p>
                        <button
                            onClick={() => dispatch(getPopularDestinations())}
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (destinations.length === 0) {
        return null;
    }

    // Show only first 9 destinations
    const displayDestinations = destinations.slice(0, 9);

    return (
        <div className="bg-gradient-to-b from-white via-gray-50/20 to-white py-12 sm:py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        <span className="text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-wider">
                            Featured
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2">
                        Popular Destinations
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base font-medium">
                        Discover trending routes and best flight deals from Dubai
                    </p>
                </div>

                {/* Destinations Grid - 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 lg:gap-8">
                    {displayDestinations.map((destination, index) => (
                        <div
                            key={destination.id}
                            className="group cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
                            onClick={() => handleDestinationClick(destination)}
                        >
                            {/* Boarding Pass Card */}
                            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 h-full">

                                {/* Header Section - Airline/Route Info */}
                                <div className="bg-blue-600 px-4 sm:px-5 py-2.5 sm:py-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                            <span className="text-white font-bold text-sm sm:text-base uppercase tracking-wide">
                                                Flight to {destination.city}
                                            </span>
                                        </div>
                                        {index < 3 && (
                                            <div className="bg-white/25 backdrop-blur-sm text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                <span className="hidden sm:inline">Top</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Main Content Area */}
                                <div className="p-3.5 sm:p-4">
                                    {/* Destination Header */}
                                    <div className="flex items-start justify-between mb-3 pb-3 border-b-2 border-dashed border-gray-200">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <MapPin className="w-4 h-4 text-blue-600" />
                                                <span className="text-xs sm:text-sm text-gray-600 font-bold uppercase tracking-wide">
                                                    Destination
                                                </span>
                                            </div>
                                            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-0.5">
                                                {destination.city}
                                            </h3>
                                            <p className="text-base sm:text-lg text-gray-700 font-semibold">
                                                {destination.country}
                                            </p>
                                        </div>

                                        {/* Price Box */}
                                        <div className="bg-blue-50 rounded-lg px-3 sm:px-4 py-2 border border-blue-200 ml-3">
                                            <div className="text-center">
                                                <div className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">
                                                    From
                                                </div>
                                                <div className="text-2xl sm:text-3xl font-black text-blue-600">
                                                    {Math.round(destination.priceFrom)}
                                                </div>
                                                <div className="text-sm text-gray-700 font-bold">
                                                    {destination.currency}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image Section */}
                                    <div className="relative h-28 sm:h-32 md:h-36 rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-gray-100 to-gray-200">
                                        <LazyLoadImage
                                            src={destination.image}
                                            alt={`${destination.city}, ${destination.country}`}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                            onError={(e) => {
                                                console.error('Destination image failed to load:', destination.image);
                                                e.currentTarget.src = `https://source.unsplash.com/800x600/?${encodeURIComponent(destination.city)},city,travel`;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    </div>

                                    {/* Flight Info Grid */}
                                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-3 pb-3 border-b-2 border-dashed border-gray-200">
                                        <div className="bg-gray-50 rounded-lg p-2.5">
                                            <div className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">
                                                Weekly Flights
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Plane className="w-4 h-4 text-blue-600" />
                                                <span className="text-lg sm:text-xl font-black text-gray-900">
                                                    {destination.flights || 0}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-2.5">
                                            <div className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">
                                                Available Options
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-4 h-4 text-blue-600" />
                                                <span className="text-lg sm:text-xl font-black text-gray-900">
                                                    {destination.flightOptions}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Airlines */}
                                    {destination.airlines && destination.airlines.length > 0 && (
                                        <div className="mb-3">
                                            <div className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">
                                                Airlines
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {destination.airlines.slice(0, 3).map((airline, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-blue-50 text-blue-700 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-md border border-blue-200"
                                                    >
                                                        {airline}
                                                    </span>
                                                ))}
                                                {destination.airlines.length > 3 && (
                                                    <span className="bg-gray-100 text-gray-700 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-md border border-gray-300">
                                                        +{destination.airlines.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Popular Routes */}
                                    <div className="mb-3">
                                        <div className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">
                                            Popular Routes From
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {destination.popularRoutes.slice(0, 3).map((route, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-blue-50 text-blue-700 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-md border border-blue-200"
                                                >
                                                    {route}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm sm:text-base text-gray-700 font-medium mb-3 line-clamp-2">
                                        {destination.description}
                                    </p>

                                    {/* View Flights Button */}
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base py-2.5 sm:py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2">
                                        <Plane className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span>
                                            View {destination.flightOptions === 1 ? 'Flight' : 'Flights'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                {destinations.length > 9 && (
                    <div className="text-center mt-10 sm:mt-12">
                        <button
                            onClick={() => navigate('/flights')}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base sm:text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Plane className="w-5 h-5" />
                            <span>View All Destinations</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}