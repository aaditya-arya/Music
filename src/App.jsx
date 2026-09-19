import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ServicesCatalogPage from './pages/ServicesCatalogPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import CareersPage from './pages/CareersPage';
import AboutPage from './pages/AboutPage';
import WeHearYouPage from './pages/WeHearYouPage';
import AdminPortal from './pages/admin/AdminPortal';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="services" element={<ServicesCatalogPage />} />
              <Route path="services/:slug" element={<ServiceDetailPage />} />
              <Route path="careers" element={<CareersPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="we-hear-you" element={<WeHearYouPage />} />
            </Route>

            {/* Standalone Admin Portal */}
            <Route path="/admin" element={<AdminPortal />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
