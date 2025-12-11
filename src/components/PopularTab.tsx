import { useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Sparkles, Plane, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface Destination {
    id: string;
    city: string;
    country: string;
    image: string;
    description: string;
    priceFrom: number;
    currency: string;
    popularRoutes: string[];
    flights: number;
}

export default function PopularDestinations() {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Mock popular destinations - replace with API data
    const destinations: Destination[] = useMemo(() => [
        {
            id: '1',
            city: 'Mumbai',
            country: 'India',
            image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
            description: 'Gateway of India & Marine Drive',
            priceFrom: 580,
            currency: 'AED',
            popularRoutes: ['Dubai', 'Abu Dhabi', 'Sharjah'],
            flights: 45
        },
        {
            id: '2',
            city: 'Delhi',
            country: 'India',
            image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
            description: 'Capital city with historic landmarks',
            priceFrom: 620,
            currency: 'AED',
            popularRoutes: ['Dubai', 'Abu Dhabi'],
            flights: 38
        },
        {
            id: '3',
            city: 'Karachi',
            country: 'Pakistan',
            image: 'https://images.unsplash.com/photo-1598948485421-33a1655d3c18?w=800&q=80',
            description: 'Coastal metropolis & business hub',
            priceFrom: 690,
            currency: 'AED',
            popularRoutes: ['Dubai', 'Sharjah'],
            flights: 32
        },
        {
            id: '4',
            city: 'Manila',
            country: 'Philippines',
            image: 'https://images.unsplash.com/photo-1583421284390-db7f7c0b692e?w=800&q=80',
            description: 'Pearl of the Orient Seas',
            priceFrom: 850,
            currency: 'AED',
            popularRoutes: ['Dubai', 'Abu Dhabi'],
            flights: 28
        },
        {
            id: '5',
            city: 'Bangalore',
            country: 'India',
            image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80',
            description: 'Silicon Valley of India',
            priceFrom: 650,
            currency: 'AED',
            popularRoutes: ['Dubai', 'Abu Dhabi', 'Sharjah'],
            flights: 35
        },
        {
            id: '6',
            city: 'Lahore',
            country: 'Pakistan',
            image: 'https://images.unsplash.com/photo-1588417849633-5b8b1c01b04c?w=800&q=80',
            description: 'Cultural heart of Pakistan',
            priceFrom: 720,
            currency: 'AED',
            popularRoutes: ['Dubai', 'Sharjah'],
            flights: 30
        },
        {
            id: '7',
            city: 'Cebu City',
            country: 'Philippines',
            image: 'https://images.unsplash.com/photo-1606926963485-25f5ad0c4251?w=800&q=80',
            description: 'Queen City of the South',
            priceFrom: 920,
            currency: 'AED',
            popularRoutes: ['Dubai'],
            flights: 20
        },
        {
            id: '8',
            city: 'Hyderabad',
            country: 'India',
            image: 'https://images.unsplash.com/photo-1576485375217-d6a95e34d3b6?w=800&q=80',
            description: 'City of Pearls',
            priceFrom: 630,
            currency: 'AED',
            popularRoutes: ['Dubai', 'Abu Dhabi'],
            flights: 33
        },
        {
            id: '9',
            city: 'Islamabad',
            country: 'Pakistan',
            image: 'https://images.unsplash.com/photo-1580913428706-c311e67898b3?w=800&q=80',
            description: 'Modern capital city',
            priceFrom: 750,
            currency: 'AED',
            popularRoutes: ['Dubai', 'Sharjah'],
            flights: 26
        },
        {
            id: '10',
            city: 'Davao City',
            country: 'Philippines',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
            description: 'Gateway to Mindanao',
            priceFrom: 880,
            currency: 'AED',
            popularRoutes: ['Dubai'],
            flights: 18
        }
    ], []);

    const handleDestinationClick = (destination: Destination) => {
        // Get today's date for default search
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];

        // Navigate to results with pre-filled destination
        navigate('/results', {
            state: {
                from: 'Dubai', // Default departure city
                to: `${destination.city}, ${destination.country}`,
                date: dateString,
                passengers: '1 Adult'
            }
        });
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="bg-gradient-to-b from-white via-gray-50/20 to-white py-12 sm:py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 sm:mb-10 md:mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                            <span className="text-purple-600 text-xs sm:text-sm font-bold uppercase tracking-wider">Featured</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
                            Popular Destinations
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base font-medium mt-2">
                            Discover trending routes and best flight deals
                        </p>
                    </div>
                    <div className="hidden sm:flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="bg-white border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 rounded-full p-3 transition-all shadow-md hover:shadow-lg group"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="bg-white border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 rounded-full p-3 transition-all shadow-md hover:shadow-lg group"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                        </button>
                    </div>
                </div>

                {/* Destinations Scrollable Row */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
                    style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {destinations.map((destination, index) => (
                        <div
                            key={destination.id}
                            className="group cursor-pointer w-[75vw] sm:w-[45vw] md:w-[320px] lg:w-[300px] flex-shrink-0 transform hover:scale-[1.02] transition-all duration-300"
                            onClick={() => handleDestinationClick(destination)}
                        >
                            {/* Card Container */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200">
                                {/* Image */}
                                <div className="relative h-52 sm:h-56 md:h-60 lg:h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                    <LazyLoadImage
                                        src={destination.image}
                                        alt={`${destination.city}, ${destination.country}`}
                                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                        onError={(e) => {
                                            console.error('Destination image failed to load:', destination.image);
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';
                                        }}
                                    />

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                                    {/* Trending Badge - Show for first 3 destinations */}
                                    {index < 3 && (
                                        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>Trending</span>
                                        </div>
                                    )}

                                    {/* Price Badge */}
                                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-xl border border-gray-200">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[9px] text-gray-500 font-semibold leading-tight">From</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-sm sm:text-base md:text-lg font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
                                                    {destination.priceFrom}
                                                </span>
                                                <span className="text-[9px] text-gray-600 font-semibold">{destination.currency}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* City Name Overlay */}
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-lg mb-1">
                                            {destination.city}
                                        </h3>
                                        <p className="text-sm text-white/90 font-medium drop-shadow-md">
                                            {destination.country}
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {/* Description */}
                                    <p className="text-xs sm:text-sm text-gray-600 font-medium mb-3 line-clamp-1">
                                        {destination.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                                        <div className="flex items-center gap-1.5">
                                            <Plane className="w-4 h-4 text-purple-600" />
                                            <span className="text-xs text-gray-700 font-semibold">
                                                {destination.flights} flights/week
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                            <span className="text-xs text-gray-600 font-medium">
                                                {destination.popularRoutes.length} routes
                                            </span>
                                        </div>
                                    </div>

                                    {/* Popular Routes */}
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-500 font-semibold mb-2">Popular from:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {destination.popularRoutes.map((route, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-full"
                                                >
                                                    {route}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Search Flights Button */}
                                    <button className="w-full bg-gradient-to-r from-gray-50 to-gray-100 group-hover:from-purple-600 group-hover:to-blue-600 text-gray-700 group-hover:text-white font-bold text-sm py-2.5 rounded-lg transition-all duration-300 border-2 border-gray-200 group-hover:border-transparent shadow-sm group-hover:shadow-md flex items-center justify-center gap-2">
                                        <Plane className="w-4 h-4" />
                                        Search Flights
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                {/* <div className="text-center mt-10 sm:mt-12 md:mt-14">
                    <Link to={"/destinations"}>
                        <button className="group relative bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white font-bold px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base md:text-lg rounded-full transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden">
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Explore All Destinations
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    </Link>
                </div> */}
            </div>
        </div>
    );
}