import { MapPin, Zap, Users, ArrowRight, Star, Sparkles, Award, Shield, Clock, CheckCircle, TrendingUp, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Flight Booking Theme */}
            <div className="relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 pt-20 sm:pt-24 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-300 rounded-full blur-3xl opacity-20"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-6 px-2 leading-tight">
                        Your Gateway to{' '}
                        <span className="block mt-2 text-blue-600">
                            Seamless Flight Booking
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto px-2 font-medium">
                        We make it easy for travelers to find the best flights and experience exceptional service across the UAE and beyond
                    </p>
                </div>
            </div>

            {/* Features Grid - Flight Theme */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                    <div className="group p-5 sm:p-6 md:p-7 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:border-blue-400">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform">
                            <MapPin className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-black text-gray-900 mb-2">Global Destinations</h3>
                        <p className="text-sm sm:text-base text-gray-700 font-medium">Connect to hundreds of destinations worldwide with ease</p>
                    </div>

                    <div className="group p-5 sm:p-6 md:p-7 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:border-blue-400">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform">
                            <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-black text-gray-900 mb-2">Premium Airlines</h3>
                        <p className="text-sm sm:text-base text-gray-700 font-medium">Access to award-winning airlines with excellent service</p>
                    </div>

                    <div className="group p-5 sm:p-6 md:p-7 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:border-blue-400">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-black text-gray-900 mb-2">Instant Booking</h3>
                        <p className="text-sm sm:text-base text-gray-700 font-medium">Lightning-fast booking process with instant confirmation</p>
                    </div>

                    <div className="group p-5 sm:p-6 md:p-7 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-2 hover:border-blue-400">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-black text-gray-900 mb-2">Expert Support</h3>
                        <p className="text-sm sm:text-base text-gray-700 font-medium">24/7 dedicated customer support for all your travel needs</p>
                    </div>
                </div>
            </div>

            {/* Mission & Vision - Flight Theme */}
            <div className="relative bg-blue-600 py-8 sm:py-12 md:py-16 px-4 sm:px-6 my-6 sm:my-8 overflow-hidden">
                {/* Decorative patterns */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
                        <div className="text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 hover:bg-white/15 transition-all">
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <Plane className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Our Mission</h2>
                            </div>
                            <p className="text-sm sm:text-base md:text-lg text-white/95 leading-relaxed font-medium">
                                To make flight booking accessible, affordable, and hassle-free for everyone. We connect travelers with the best flights and exceptional service worldwide.
                            </p>
                        </div>
                        <div className="text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-7 md:p-8 hover:bg-white/15 transition-all">
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">Our Vision</h2>
                            </div>
                            <p className="text-sm sm:text-base md:text-lg text-white/95 leading-relaxed font-medium">
                                To become the most trusted platform for flight bookings across the Middle East, delivering exceptional value and creating memorable travel experiences.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us - Flight Theme */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
                <div className="text-center mb-8 sm:mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 border-2 border-blue-300">
                        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                        <span className="text-blue-700 text-xs sm:text-sm font-bold uppercase tracking-wider">Benefits</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 sm:mb-4 px-2">Why Choose Us?</h2>
                    <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto px-2">
                        Experience the difference with our seamless flight booking services
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                    <div className="flex gap-3 sm:gap-4 md:gap-5 p-5 sm:p-6 md:p-7 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all hover:border-blue-400">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-black text-sm sm:text-base md:text-lg text-gray-900 mb-1.5 sm:mb-2">Verified Airlines</h3>
                            <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">All airlines are verified and trusted for your safety and comfort</p>
                        </div>
                    </div>

                    <div className="flex gap-3 sm:gap-4 md:gap-5 p-5 sm:p-6 md:p-7 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all hover:border-blue-400">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-black text-sm sm:text-base md:text-lg text-gray-900 mb-1.5 sm:mb-2">Best Price Guarantee</h3>
                            <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">Competitive pricing with absolutely no hidden fees or surprises</p>
                        </div>
                    </div>

                    <div className="flex gap-3 sm:gap-4 md:gap-5 p-5 sm:p-6 md:p-7 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all hover:border-blue-400">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                            <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-black text-sm sm:text-base md:text-lg text-gray-900 mb-1.5 sm:mb-2">100% Secure Booking</h3>
                            <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">Safe payment options with instant email confirmation guaranteed</p>
                        </div>
                    </div>

                    <div className="flex gap-3 sm:gap-4 md:gap-5 p-5 sm:p-6 md:p-7 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all hover:border-blue-400">
                        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                            <Clock className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-black text-sm sm:text-base md:text-lg text-gray-900 mb-1.5 sm:mb-2">Flexible Cancellation</h3>
                            <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">Free cancellation up to 24 hours before your departure</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section - Flight Theme */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-8 sm:py-12 md:py-16 px-4 sm:px-6 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-blue-600/10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3 px-2">Our Journey in Numbers</h2>
                        <p className="text-gray-400 text-base sm:text-lg font-medium px-2">Trusted by thousands of travelers worldwide</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 text-center hover:bg-white/10 transition-all">
                            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-blue-500 mb-2 sm:mb-3">500+</h3>
                            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 font-bold uppercase tracking-wider">Airlines</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 text-center hover:bg-white/10 transition-all">
                            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-blue-500 mb-2 sm:mb-3">100K+</h3>
                            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 font-bold uppercase tracking-wider">Happy Travelers</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 text-center hover:bg-white/10 transition-all">
                            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-blue-500 mb-2 sm:mb-3">4.9★</h3>
                            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 font-bold uppercase tracking-wider">Average Rating</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 text-center hover:bg-white/10 transition-all">
                            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-blue-500 mb-2 sm:mb-3">24/7</h3>
                            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 font-bold uppercase tracking-wider">Support Available</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section - Flight Theme */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
                <div className="relative bg-blue-600 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-14 lg:p-16 text-center text-white shadow-2xl overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
                            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                            <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider">Start Your Journey</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 md:mb-5 px-2">Ready to Book Your Next Flight?</h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2 font-medium">
                            Start your next adventure today and discover why thousands of travelers choose us for their flight booking needs
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white text-blue-700 rounded-full font-black text-base sm:text-lg md:text-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                        >
                            Search Flights <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}