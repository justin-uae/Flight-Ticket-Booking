import { useState, useRef, useEffect } from 'react';
import { Calendar, Users, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import Flight from '../assets/Flight.jpg';
import { searchFlights } from '../slices/flightSlice';
import { destinationCities, uaeAirports } from '../AirportData/AirportData';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState('1 Adult');
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    const fromDropdownRef = useRef<HTMLDivElement>(null);
    const toDropdownRef = useRef<HTMLDivElement>(null);

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

    const handleSearch = async () => {
        if (!fromLocation || !toLocation || !date) {
            alert('Please fill in all required fields');
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

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={Flight}
                    alt="Flight Background"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">

                    {/* Left Side - Booking Form Card */}
                    <div className="w-full lg:w-[500px] xl:w-[550px]">
                        {/* Title Above Card */}
                        <div className="mb-6 sm:mb-8">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 drop-shadow-2xl leading-tight">
                                Find Your Perfect Flight
                            </h1>
                            <p className="text-white text-base sm:text-lg lg:text-xl font-semibold drop-shadow-lg">
                                Compare flights and book the best deals
                            </p>
                        </div>

                        {/* Clean Modern Search Card */}
                        <div className="bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl overflow-visible p-6 sm:p-8 border border-white/40">
                            <div className="space-y-4">
                                {/* From Location */}
                                <div className="relative" ref={fromDropdownRef}>
                                    <button
                                        onClick={() => setShowFromDropdown(!showFromDropdown)}
                                        className="w-full flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/60 hover:border-blue-400 hover:bg-white/80 transition shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full flex-shrink-0">
                                            <div className="w-3 h-3 bg-white rounded-full"></div>
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className={`text-base ${fromLocation ? 'text-gray-900 font-semibold' : 'text-gray-500 font-normal'}`}>
                                                {fromLocation ? uaeAirports.find(a => a.full === fromLocation)?.name + ' (' + uaeAirports.find(a => a.full === fromLocation)?.code + ')' : 'Select City (Boarding point)'}
                                            </div>
                                        </div>
                                    </button>

                                    {/* Dropdown */}
                                    {showFromDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 p-3 max-h-80 overflow-y-auto z-[100]">
                                            <div className="space-y-1.5">
                                                {uaeAirports.map((airport, index) => (
                                                    <button
                                                        key={`${airport.full}-${index}`}
                                                        onClick={() => {
                                                            setFromLocation(airport.full);
                                                            setShowFromDropdown(false);
                                                        }}
                                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${fromLocation === airport.full
                                                            ? 'bg-blue-100/80 backdrop-blur-sm border border-blue-400'
                                                            : 'bg-gray-50/80 backdrop-blur-sm hover:bg-blue-50/80 border border-transparent'
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
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Dotted Line Connection */}
                                <div className="flex items-center justify-center relative h-6">
                                    <div className="absolute left-[28px] top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-400"></div>
                                </div>

                                {/* To Location */}
                                <div className="relative" ref={toDropdownRef}>
                                    <button
                                        onClick={() => setShowToDropdown(!showToDropdown)}
                                        className="w-full flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/60 hover:border-blue-400 hover:bg-white/80 transition shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 border-2 border-gray-300 rounded-full flex-shrink-0 bg-white/50">
                                            <div className="w-3 h-3 border-2 border-gray-400 rounded-full"></div>
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className={`text-base ${toLocation ? 'text-gray-900 font-semibold' : 'text-gray-500 font-normal'}`}>
                                                {toLocation ? Object.values(destinationCities).flat().find(c => c.full === toLocation)?.name + ' (' + Object.values(destinationCities).flat().find(c => c.full === toLocation)?.code + ')' : 'Your Destination'}
                                            </div>
                                        </div>
                                    </button>

                                    {/* Dropdown with Country Groups */}
                                    {showToDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 p-3 max-h-96 overflow-y-auto z-[100]">
                                            {Object.entries(destinationCities).map(([country, cities]) => (
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
                                                                }}
                                                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${toLocation === city.full
                                                                    ? 'bg-blue-100/80 backdrop-blur-sm border border-blue-400'
                                                                    : 'bg-gray-50/80 backdrop-blur-sm hover:bg-blue-50/80 border border-transparent'
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
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Date and Passengers - Side by Side */}
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    {/* Date */}
                                    <div>
                                        <div className="w-full flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-4 border border-white/60 hover:border-blue-400 hover:bg-white/80 transition shadow-sm hover:shadow-md">
                                            <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                placeholder="Date"
                                                className="flex-1 outline-none bg-transparent text-gray-900 text-sm font-semibold min-w-0"
                                            />
                                        </div>
                                    </div>

                                    {/* Passengers */}
                                    <div>
                                        <div className="w-full flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-4 border border-white/60 hover:border-blue-400 hover:bg-white/80 transition shadow-sm hover:shadow-md">
                                            <Users className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                            <select
                                                value={passengers}
                                                onChange={(e) => setPassengers(e.target.value)}
                                                className="flex-1 outline-none bg-transparent text-gray-900 text-sm font-semibold min-w-0 cursor-pointer"
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
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                >
                                    <span>{loading ? 'Searching...' : 'Search Flights'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Optional Content Space */}
                    <div className="hidden lg:block flex-1">
                        {/* This space can be used for additional content, features, or left empty */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;