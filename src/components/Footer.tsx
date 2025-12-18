import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PaymentIcon } from 'react-svg-credit-card-payment-icons';

export default function Footer() {
  const phoneNumber = import.meta.env.VITE_CONTACT_NUMBER;
  const bookingEmail = import.meta.env.VITE_BOOKING_EMAIL;

  const quickLinks = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 border-t-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Company Info with Logo */}
          <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-auto">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-white group-hover:text-blue-600 transition-colors duration-300">
                  JETSET <span className="text-blue-600">Flights</span>
                </span>
              </div>
            </Link>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 md:gap-5">
              <div className="flex items-center gap-2 group">
                <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                </div>
                <span className="text-sm sm:text-base text-center sm:text-left font-semibold text-gray-300">
                  Hor Al Anz Building 101, Dubai, UAE
                </span>
              </div>

              <div className="flex items-center gap-2 group">
                <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                </div>

                <a href={`tel:+${phoneNumber}`}
                  className="text-sm sm:text-base hover:text-blue-600 transition-colors font-semibold"
                >
                  +{phoneNumber}
                </a>
              </div>

              <div className="flex items-center gap-2 group">
                <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                </div>

                <a href={`mailto:${bookingEmail}`}
                  className="text-sm sm:text-base hover:text-blue-600 transition-colors break-all sm:break-normal font-semibold"
                >
                  {bookingEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5 sm:gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-base sm:text-lg font-black hover:text-blue-600 transition-colors relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-center items-center gap-3 sm:gap-4">
          <span className="text-xs sm:text-sm text-gray-400 font-medium">We Accept:</span>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Visa */}
            <div className="rounded p-1.5 sm:p-2 shadow-lg hover:scale-105 transition-transform">
              <PaymentIcon className="w-10 h-6 sm:w-12 sm:h-7" type="Visa" format="flatRounded" />
            </div>
            <div className="rounded p-1.5 sm:p-2 shadow-lg hover:scale-105 transition-transform">
              <PaymentIcon className="w-10 h-6 sm:w-12 sm:h-7" type="Mastercard" format="flatRounded" />
            </div>
            <div className="rounded p-1.5 sm:p-2 shadow-lg hover:scale-105 transition-transform">
              <PaymentIcon className="w-10 h-6 sm:w-12 sm:h-7" type="Americanexpress" format="flatRounded" />

            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="mt-6 pt-5 border-t-2 border-gray-700">
          <p className="text-center text-sm sm:text-base text-gray-400 font-semibold">
            © 2025{' '}

            <a href={'https://www.compareflights.ae/'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-600 font-black transition-colors"
            >
              Compareflights.ae
            </a>{' '}
            is a trading style of Jetset Worldwide Travel & Tourism LLC. All rights reserved.
          </p>
        </div>
      </div >
    </footer >
  );
}