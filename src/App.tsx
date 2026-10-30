import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { WhatsAppButton } from './components/ui/WhatsAppButton';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { QRMenuPage } from './pages/QRMenuPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReservationPage } from './pages/ReservationPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLayout } from './components/layout/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminMenuPage } from './pages/admin/AdminMenuPage';
import { AdminReservationsPage } from './pages/admin/AdminReservationsPage';
import { AdminQRStudioPage } from './pages/admin/AdminQRStudioPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Public Layout Wrapper
const PublicLayout: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isTableMenu = location.pathname === '/qr' || searchParams.has('table');

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] text-[#12141A]">
      {!isTableMenu && <Navbar />}
      <CartDrawer />
      <div className="flex-1">
        <Outlet />
      </div>
      {/* Floating WhatsApp Chat Widget (matching farzicafe.com) */}
      <WhatsAppButton />
      {!isTableMenu && <Footer />}
    </div>
  );
};

// Menu Router Helper: if ?table= param is present, load the mobile-first QR table menu directly
const MenuRouteHandler: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hasTable = searchParams.has('table');

  return hasTable ? <QRMenuPage /> : <MenuPage />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Public Customer Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuRouteHandler />} />
            <Route path="/qr" element={<QRMenuPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/reservations" element={<ReservationPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="menu" element={<AdminMenuPage />} />
            <Route path="reservations" element={<AdminReservationsPage />} />
            <Route path="qr" element={<AdminQRStudioPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
