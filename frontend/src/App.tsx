import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { BgmProvider } from './context/BgmContext';
import { LanguageProvider } from './context/LanguageContext';
import { FilmGrainOverlay } from './components/common/FilmGrainOverlay';
import { Navbar } from './components/layout/Navbar';
import { SettingsModal } from './components/common/SettingsModal';
import { CinematicBgmPlayer } from './components/common/CinematicBgmPlayer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TalentDiscoveryPage } from './pages/TalentDiscoveryPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { AiMatchPage } from './pages/AiMatchPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminCitadelPage } from './pages/AdminCitadelPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { GuestDashboardPage } from './pages/GuestDashboardPage';
import { MovieDiscoveryPage } from './pages/MovieDiscoveryPage';
import { EventBookingPage } from './pages/EventBookingPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to={adminOnly ? "/admin-login" : "/login"} replace />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const DashboardDispatcher: React.FC = () => {
  const { isGuest } = useAuth();
  if (isGuest) {
    return <GuestDashboardPage />;
  }
  return <DashboardPage />;
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070709] text-gray-100 flex flex-col relative selection:bg-amber-500/30 selection:text-amber-200">
      <FilmGrainOverlay />
      <Navbar />
      <SettingsModal />
      <CinematicBgmPlayer />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/movies" element={<MovieDiscoveryPage />} />
          <Route path="/events" element={<EventBookingPage />} />
          <Route path="/my-tickets" element={<EventBookingPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          
          {/* Main platform routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardDispatcher />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guest-dashboard"
            element={
              <ProtectedRoute>
                <GuestDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/talent"
            element={
              <ProtectedRoute>
                <TalentDiscoveryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities"
            element={
              <ProtectedRoute>
                <OpportunitiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-match"
            element={
              <ProtectedRoute>
                <AiMatchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminCitadelPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <NotificationProvider>
              <BgmProvider>
                <AppContent />
              </BgmProvider>
            </NotificationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
