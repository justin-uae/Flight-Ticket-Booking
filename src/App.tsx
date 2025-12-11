import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { BrandedFallback } from './components/LoadingFallback';
import ScrollToTop from './helper/ScrollToTop';
import { fetchExchangeRates } from './slices/currencySlice';
import { WhatsAppButton } from './components/WhatsAppButton';
import FlightResultsPage from './pages/Flightresultspage';
import FlightDetail from './pages/FlightDetail';
import { useAppDispatch } from './store/hooks';

const FlightsBookingHero = lazy(() => import('./components/FlightsBookingHero'));
const Footer = lazy(() => import('./components/Footer'));
const Navbar = lazy(() => import('./components/Navbar'));
const ContactUsPage = lazy(() => import('./components/ContactUs'));
const FallbackPage = lazy(() => import('./components/FallBackPage'));
const AboutPage = lazy(() => import('./pages/AboutUs'));

function App() {
  const dispatch = useAppDispatch();


  useEffect(() => {
    // Fetch exchange rates on app load
    dispatch(fetchExchangeRates());

    // Refresh rates every 1 hour
    const interval = setInterval(() => {
      dispatch(fetchExchangeRates());
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<BrandedFallback />}>
        <Navbar />
        <main className="pt-10">
          <Routes>
            <Route path='/' element={<FlightsBookingHero />} />
            <Route path='/contact' element={<ContactUsPage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path="/flights" element={<FlightResultsPage />} />
            <Route path="/flight/:id" element={<FlightDetail />} />
            <Route path='*' element={<FallbackPage />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
        {/* <SimpleChatbot /> */}
      </Suspense>
    </BrowserRouter>
  );
}

export default App;