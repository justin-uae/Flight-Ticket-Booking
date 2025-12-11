import { useParams, useNavigate } from 'react-router-dom';
import { Plane, Star, Wifi, Utensils, Tv, Coffee, ArrowLeft, Phone, CheckCircle, Luggage, Sparkles } from 'lucide-react';

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
    departureAirport: string;
    arrivalAirport: string;
    aircraftType: string;
    cabinClass: string;
    baggage: {
        checked: string;
        cabin: string;
    };
}

const FlightDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const whatsappNumber = import.meta.env.VITE_CONTACT_NUMBER;

    // Mock flight data - in real app, fetch based on ID
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
            amenities: ['WiFi', 'Meal', 'Entertainment'],
            departureAirport: 'Dubai International Airport (DXB)',
            arrivalAirport: 'Mumbai International Airport (BOM)',
            aircraftType: 'Boeing 777-300ER',
            cabinClass: 'Economy',
            baggage: {
                checked: '30kg',
                cabin: '7kg'
            }
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
            amenities: ['WiFi', 'Meal', 'Lounge Access'],
            departureAirport: 'Abu Dhabi International Airport (AUH)',
            arrivalAirport: 'Mumbai International Airport (BOM)',
            aircraftType: 'Airbus A380',
            cabinClass: 'Economy',
            baggage: {
                checked: '30kg',
                cabin: '7kg'
            }
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
            amenities: ['Meal', 'Entertainment'],
            departureAirport: 'Sharjah International Airport (SHJ)',
            arrivalAirport: 'Mumbai International Airport (BOM)',
            aircraftType: 'Airbus A320',
            cabinClass: 'Economy',
            baggage: {
                checked: '20kg',
                cabin: '7kg'
            }
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
            amenities: ['WiFi', 'Meal'],
            departureAirport: 'Dubai International Airport (DXB)',
            arrivalAirport: 'Mumbai International Airport (BOM)',
            aircraftType: 'Boeing 737 MAX',
            cabinClass: 'Economy',
            baggage: {
                checked: '20kg',
                cabin: '7kg'
            }
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
            amenities: ['Meal'],
            departureAirport: 'Dubai International Airport (DXB)',
            arrivalAirport: 'Mumbai International Airport (BOM)',
            aircraftType: 'Boeing 737-800',
            cabinClass: 'Economy',
            baggage: {
                checked: '15kg',
                cabin: '7kg'
            }
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
            amenities: ['Meal', 'Entertainment'],
            departureAirport: 'Dubai International Airport (DXB)',
            arrivalAirport: 'Mumbai International Airport (BOM)',
            aircraftType: 'Airbus A320neo',
            cabinClass: 'Economy',
            baggage: {
                checked: '15kg',
                cabin: '7kg'
            }
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
            amenities: ['WiFi', 'Meal', 'Entertainment', 'Lounge Access'],
            departureAirport: 'Dubai International Airport (DXB)',
            arrivalAirport: 'Mumbai International Airport (BOM)',
            aircraftType: 'Boeing 777-300ER',
            cabinClass: 'Economy',
            baggage: {
                checked: '30kg',
                cabin: '7kg'
            }
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
            amenities: ['Meal'],
            departureAirport: 'Dubai International Airport (DXB)',
            arrivalAirport: 'Mumbai International Airport (BOM)',
            aircraftType: 'Boeing 737',
            cabinClass: 'Economy',
            baggage: {
                checked: '15kg',
                cabin: '7kg'
            }
        }
    ];

    const flight = mockFlights.find(f => f.id === id);

    if (!flight) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 pt-16 sm:pt-20 pb-8 sm:pb-12 px-3 sm:px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12">
                        <Plane className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Flight not found</h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">We couldn't find the flight you're looking for.</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base transition transform hover:scale-105 shadow-lg"
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
        const message = `Hi, I'm interested in booking flight ${flight.flightNumber} (${flight.airline}) from ${flight.departureAirport} to ${flight.arrivalAirport}. Price: ${flight.price} ${flight.currency}. Can you help me with the booking?`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Extract airport codes (last 3 characters in parentheses)
    const getDepartureCode = () => flight.departureAirport.match(/\(([^)]+)\)/)?.[1] || 'DEP';
    const getArrivalCode = () => flight.arrivalAirport.match(/\(([^)]+)\)/)?.[1] || 'ARR';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-100 pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8 lg:pb-12">
            <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-gray-700 hover:text-purple-600 font-bold mb-4 sm:mb-6 transition bg-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg"
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs sm:text-sm lg:text-base">Back to Results</span>
                </button>

                {/* Boarding Pass Card */}
                <div className="relative">
                    {/* Main Boarding Pass */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-200 sm:border-2">
                        {/* Top Section - Purple Gradient Header */}
                        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative overflow-hidden">
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
                                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 font-semibold mb-2 sm:mb-3 line-clamp-2">{flight.departureAirport.split('(')[0].trim()}</p>
                                    <div className="bg-purple-50 border border-purple-200 sm:border-2 rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 inline-block">
                                        <p className="text-[10px] sm:text-xs text-gray-500 font-bold mb-0.5">Departure</p>
                                        <p className="text-xl sm:text-2xl lg:text-3xl font-black text-purple-600 leading-none">{flight.departureTime}</p>
                                    </div>
                                </div>

                                {/* Flight Path Icon */}
                                <div className="flex flex-col items-center justify-center px-2 sm:px-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-md opacity-30"></div>
                                        <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-2 sm:p-3 lg:p-4 rounded-full">
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
                                    <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 font-semibold mb-2 sm:mb-3 line-clamp-2">{flight.arrivalAirport.split('(')[0].trim()}</p>
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
                                <div className="bg-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-100 sm:border-2">
                                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                                        <p className="text-[10px] sm:text-xs text-purple-900 font-black uppercase tracking-wider">Amenities</p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                        {flight.amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center gap-1 bg-white rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 border border-purple-200">
                                                <div className="text-purple-600">{getAmenityIcon(amenity)}</div>
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
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
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
                    <div className="mt-4 sm:mt-6 lg:mt-8 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden">
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