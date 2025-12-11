import { useState, useRef, useEffect } from 'react';
import { Plane, Calendar, Users, ArrowRightLeft, ChevronDown, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Flight from '../assets/Flight.jpg';

const Home = () => {
    const navigate = useNavigate();
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState('1 Adult');
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);

    const fromDropdownRef = useRef<HTMLDivElement>(null);
    const toDropdownRef = useRef<HTMLDivElement>(null);

    // UAE Emirates
    const uaeEmirates = [
        'Abu Dhabi',
        'Dubai',
        'Sharjah',
        'Ajman',
        'Umm Al Quwain',
        'Ras Al Khaimah',
        'Fujairah'
    ];

    // Major cities in India, Pakistan, and Philippines
    const destinationCities = {
        India: [
            'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
            'Kolkata', 'Ahmedabad', 'Pune', 'Kochi', 'Goa'
        ],
        Pakistan: [
            'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi',
            'Faisalabad', 'Multan', 'Peshawar', 'Quetta'
        ],
        Philippines: [
            'Manila', 'Cebu City', 'Davao City', 'Quezon City',
            'Makati', 'Pasig', 'Iloilo City', 'Cagayan de Oro'
        ]
    };

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

    const handleSwapLocations = () => {
        const temp = fromLocation;
        setFromLocation(toLocation);
        setToLocation(temp);
    };

    const handleSearch = () => {
        if (!fromLocation || !toLocation || !date) {
            alert('Please fill in all required fields');
            return;
        }

        // Navigate to results page with search params
        navigate('/results', {
            state: {
                from: fromLocation,
                to: toLocation,
                date: date,
                passengers: passengers
            }
        });
    };

    return (
        <div className="relative min-h-screen overflow-hidden pt-8 sm:pt-10">
            {/* Background Image - Full screen */}
            <div className="absolute inset-0">
                <img
                    src={Flight}
                    alt="Flight Background"
                    className="w-full h-full object-cover"
                />
                {/* Gradient Overlay - Darker on left, lighter on right */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-1100/95 via-purple-600/30 to-transparent"></div>
            </div>

            {/* Decorative Elements */}
            <div className="hidden xl:block absolute top-32 right-64 w-48 h-24 bg-white/10 rounded-full blur-3xl"></div>
            <div className="hidden xl:block absolute top-48 right-32 w-64 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="hidden xl:block absolute bottom-32 right-20 w-6 h-6 bg-white rounded-full opacity-40"></div>
            <div className="hidden xl:block absolute top-1/3 right-12 w-8 h-8 bg-white rounded-full opacity-30"></div>

            {/* Content Container */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] gap-8 lg:gap-12">

                {/* Left Side - Booking Form */}
                <div className="w-full lg:w-1/2 lg:pr-8 xl:pr-12">
                    <div className="mb-8 sm:mb-10 lg:mb-12">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-2xl">
                            Where would you like to go?
                        </h1>
                        <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium drop-shadow-lg">
                            Compare flights from hundreds of airlines and find the best deals
                        </p>
                    </div>

                    {/* Booking Form Card */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 lg:p-8">
                        <div className="space-y-4 sm:space-y-5">
                            {/* From Location - Custom Dropdown */}
                            <div className="relative" ref={fromDropdownRef}>
                                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    From (Emirates)
                                </label>
                                <button
                                    onClick={() => setShowFromDropdown(!showFromDropdown)}
                                    className="w-full flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-4 sm:py-5 border-2 border-gray-200 hover:border-purple-500 hover:bg-white transition group"
                                >
                                    <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                                    <span className={`flex-1 text-left text-sm sm:text-base lg:text-lg font-medium ${fromLocation ? 'text-gray-800' : 'text-gray-400'}`}>
                                        {fromLocation || 'Select Emirate'}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showFromDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Custom Dropdown */}
                                {showFromDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-3 sm:p-4 max-h-80 overflow-y-auto z-50">
                                        <div className="grid grid-cols-1 gap-2">
                                            {uaeEmirates.map((emirate, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        setFromLocation(emirate);
                                                        setShowFromDropdown(false);
                                                    }}
                                                    className={`flex items-center gap-3 p-3 rounded-lg transition ${fromLocation === emirate
                                                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-400'
                                                        : 'bg-gray-50 hover:bg-purple-50 border-2 border-transparent hover:border-purple-200'
                                                        }`}
                                                >
                                                    <div className={`p-2 rounded-full ${fromLocation === emirate ? 'bg-purple-600' : 'bg-purple-100'
                                                        }`}>
                                                        <MapPin className={`w-4 h-4 ${fromLocation === emirate ? 'text-white' : 'text-purple-600'
                                                            }`} />
                                                    </div>
                                                    <span className={`font-semibold text-sm sm:text-base ${fromLocation === emirate ? 'text-purple-900' : 'text-gray-700'
                                                        }`}>
                                                        {emirate}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Swap Button */}
                            <div className="flex justify-center -my-1">
                                <button
                                    onClick={handleSwapLocations}
                                    className="bg-white border-2 border-gray-300 hover:border-purple-500 p-2.5 rounded-full transition shadow-md hover:shadow-lg group"
                                    title="Swap locations"
                                >
                                    <ArrowRightLeft className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition group-hover:rotate-180" />
                                </button>
                            </div>

                            {/* To Location - Custom Dropdown */}
                            <div className="relative" ref={toDropdownRef}>
                                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    To (Destination)
                                </label>
                                <button
                                    onClick={() => setShowToDropdown(!showToDropdown)}
                                    className="w-full flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-4 sm:py-5 border-2 border-gray-200 hover:border-blue-500 hover:bg-white transition group"
                                >
                                    <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 rotate-90" />
                                    <span className={`flex-1 text-left text-sm sm:text-base lg:text-lg font-medium ${toLocation ? 'text-gray-800' : 'text-gray-400'}`}>
                                        {toLocation || 'Select Destination'}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showToDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Custom Dropdown with Country Groups */}
                                {showToDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-3 sm:p-4 max-h-96 overflow-y-auto z-50">
                                        {Object.entries(destinationCities).map(([country, cities]) => (
                                            <div key={country} className="mb-4 last:mb-0">
                                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 px-2">
                                                    {country}
                                                </h3>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {cities.map((city, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => {
                                                                setToLocation(`${city}, ${country}`);
                                                                setShowToDropdown(false);
                                                            }}
                                                            className={`flex items-center gap-3 p-3 rounded-lg transition ${toLocation === `${city}, ${country}`
                                                                ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-400'
                                                                : 'bg-gray-50 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200'
                                                                }`}
                                                        >
                                                            <div className={`p-2 rounded-full ${toLocation === `${city}, ${country}` ? 'bg-blue-600' : 'bg-blue-100'
                                                                }`}>
                                                                <MapPin className={`w-4 h-4 ${toLocation === `${city}, ${country}` ? 'text-white' : 'text-blue-600'
                                                                    }`} />
                                                            </div>
                                                            <span className={`font-semibold text-sm sm:text-base ${toLocation === `${city}, ${country}` ? 'text-blue-900' : 'text-gray-700'
                                                                }`}>
                                                                {city}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Date and Passengers */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
                                {/* Date */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                        Date
                                    </label>
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-4 sm:py-5 border-2 border-gray-200 focus-within:border-purple-500 focus-within:bg-white transition group">
                                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0 group-focus-within:scale-110 transition-transform" />
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="flex-1 outline-none bg-transparent text-gray-800 text-sm sm:text-base lg:text-lg font-medium min-w-0"
                                        />
                                    </div>
                                </div>

                                {/* Passengers */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                        Passengers
                                    </label>
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-4 sm:py-5 border-2 border-gray-200 focus-within:border-purple-500 focus-within:bg-white transition group">
                                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0 group-focus-within:scale-110 transition-transform" />
                                        <select
                                            value={passengers}
                                            onChange={(e) => setPassengers(e.target.value)}
                                            className="flex-1 outline-none bg-transparent text-gray-800 text-sm sm:text-base lg:text-lg font-medium min-w-0 cursor-pointer"
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
                                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white font-bold py-4 sm:py-5 lg:py-6 rounded-xl shadow-2xl hover:shadow-3xl transition transform hover:scale-[1.02] text-base sm:text-lg lg:text-xl mt-2"
                            >
                                Search Flights
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;