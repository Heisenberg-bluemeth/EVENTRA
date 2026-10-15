import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { EventraProvider } from './context/EventraContext';
import { GlobalAtmosphereCanvas } from './components/3d/GlobalAtmosphereCanvas';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { CalendarPage } from './pages/CalendarPage';
import { SportsPage } from './pages/SportsPage';
import { MoviesPage } from './pages/MoviesPage';
import { ConcertsPage } from './pages/ConcertsPage';
import { CategoryPage } from './pages/CategoryPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { VenueSelectionPage } from './pages/VenueSelectionPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { TicketsPage } from './pages/TicketsPage';
import { WishlistPage } from './pages/WishlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';

// Scroll to top helper on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <EventraProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-midnight-950 text-slate-100 relative">
          {/* Persistent Background 3D Atmosphere Canvas */}
          <GlobalAtmosphereCanvas />

          {/* Navigation Bar */}
          <Navbar />

          {/* Main Route Viewport */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/sports" element={<SportsPage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/concerts" element={<ConcertsPage />} />
              <Route path="/category/:cat" element={<CategoryPage />} />
              <Route path="/event/:id" element={<EventDetailsPage />} />
              <Route path="/venue/:id" element={<VenueSelectionPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/confirmation/:bookingRef" element={<ConfirmationPage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* Catch-all redirect */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </EventraProvider>
  );
};

export default App;
