export function BrandedFallback() {
    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 overflow-hidden">
            {/* Animated Background Particles - Sky Theme */}
            <div className="absolute inset-0">
                {[...Array(40)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-blue-300"
                        style={{
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                            opacity: Math.random() * 0.7 + 0.3
                        }}
                    />
                ))}
            </div>

            {/* Cloud Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <svg className="absolute bottom-0 w-full h-48" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,60 Q300,0 600,60 T1200,60 L1200,120 L0,120 Z" fill="rgba(59, 130, 246, 0.2)" />
                    <path d="M0,80 Q300,40 600,80 T1200,80 L1200,120 L0,120 Z" fill="rgba(37, 99, 235, 0.2)" />
                </svg>
            </div>

            {/* Main Loader Container */}
            <div className="relative z-10 text-center">
                {/* Circular Loader with Rings - Aviation Theme */}
                <div className="relative w-44 h-44 mx-auto mb-10">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-600 animate-spin-slow shadow-2xl shadow-blue-500/30"></div>

                    {/* Middle Ring */}
                    <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-blue-400 border-r-blue-500 animate-spin-reverse shadow-xl shadow-blue-500/20"></div>

                    {/* Inner Ring */}
                    <div className="absolute inset-6 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-700 animate-spin-slower"></div>

                    {/* Center Icon - Airplane */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            {/* Airplane Icon */}
                            <svg
                                className="w-20 h-20 text-white animate-pulse-scale"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                            </svg>

                            {/* Glowing Effect - Sky Colors */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 blur-2xl opacity-60 animate-pulse"></div>
                        </div>
                    </div>

                    {/* Orbiting Dots - Aviation Theme */}
                    <div className="absolute inset-0 animate-spin-orbital">
                        <div className="absolute top-0 left-1/2 w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full -translate-x-1/2 shadow-lg shadow-blue-500/50"></div>
                    </div>
                    <div className="absolute inset-0 animate-spin-orbital-reverse">
                        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full -translate-x-1/2 shadow-lg shadow-blue-600/50"></div>
                    </div>
                    <div className="absolute inset-0 animate-spin-orbital-slow">
                        <div className="absolute left-0 top-1/2 w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full -translate-y-1/2 shadow-lg shadow-blue-500/50"></div>
                    </div>
                </div>

                {/* Brand Text - Flight Booking Theme */}
                <div className="space-y-5">
                    <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent animate-gradient drop-shadow-2xl">
                        Compare Flights
                    </h1>

                    {/* Animated Subtitle */}
                    <div className="flex items-center justify-center gap-3 text-gray-100 flex-wrap">
                        <span className="text-xl font-bold animate-fade-in">Find Your</span>
                        <span className="text-xl font-black text-blue-400 animate-text-glow">Perfect Flight</span>
                    </div>

                    {/* Progress Bar - Aviation Theme */}
                    <div className="w-72 h-2 mx-auto bg-slate-900/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-700/30 shadow-inner">
                        <div className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 animate-progress rounded-full shadow-lg shadow-blue-500/50"></div>
                    </div>

                    {/* Loading Dots - Sky Colors */}
                    <div className="flex items-center justify-center gap-3 pt-6">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-dot shadow-lg shadow-blue-500/50"></div>
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce-dot shadow-lg shadow-blue-600/50" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-dot shadow-lg shadow-blue-500/50" style={{ animationDelay: '0.3s' }}></div>
                    </div>

                    {/* Status Text */}
                    <p className="text-gray-200/80 text-sm font-semibold tracking-wider uppercase pt-4">
                        Preparing Your Journey...
                    </p>
                </div>
            </div>

            {/* Floating Elements - Aviation Theme */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Top Right */}
                <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full blur-3xl animate-float-slow"></div>

                {/* Bottom Left */}
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-full blur-3xl animate-float-slower"></div>

                {/* Middle Large Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse-slow"></div>

                {/* Additional Accent Glows */}
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-float-slower"></div>
                <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-blue-600/10 rounded-full blur-2xl animate-float-slow"></div>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }

                @keyframes spin-slower {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes spin-orbital {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes spin-orbital-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }

                @keyframes spin-orbital-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes pulse-scale {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                }

                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes fade-in {
                    0%, 50% { opacity: 0.6; }
                    100% { opacity: 1; }
                }

                @keyframes text-glow {
                    0%, 100% {
                        text-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
                    }
                    50% {
                        text-shadow: 0 0 25px rgba(59, 130, 246, 0.9), 0 0 35px rgba(59, 130, 246, 0.7);
                    }
                }

                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                @keyframes bounce-dot {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes float-slow {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(25px, -25px); }
                }

                @keyframes float-slower {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-35px, 35px); }
                }

                @keyframes twinkle {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.8);
                    }
                }

                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 0.1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.25;
                        transform: scale(1.08);
                    }
                }

                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }

                .animate-spin-reverse {
                    animation: spin-reverse 2s linear infinite;
                }

                .animate-spin-slower {
                    animation: spin-slower 4s linear infinite;
                }

                .animate-spin-orbital {
                    animation: spin-orbital 3s linear infinite;
                }

                .animate-spin-orbital-reverse {
                    animation: spin-orbital-reverse 4s linear infinite;
                }

                .animate-spin-orbital-slow {
                    animation: spin-orbital-slow 5s linear infinite;
                }

                .animate-pulse-scale {
                    animation: pulse-scale 2.5s ease-in-out infinite;
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }

                .animate-fade-in {
                    animation: fade-in 2s ease-in-out infinite;
                }

                .animate-text-glow {
                    animation: text-glow 2s ease-in-out infinite;
                }

                .animate-progress {
                    animation: progress 1.8s ease-in-out infinite;
                }

                .animate-bounce-dot {
                    animation: bounce-dot 1.2s ease-in-out infinite;
                }

                .animate-float-slow {
                    animation: float-slow 7s ease-in-out infinite;
                }

                .animate-float-slower {
                    animation: float-slower 9s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}