import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import WaterTrackerPage from './components/WaterTrackerPage';
import MealLoggerPage from './components/MealLoggerPage';
import MealResultScreen from './components/MealResultScreen';
import HealthTrackerPage from './components/HealthTrackerPage';
import SettingsPage from './components/SettingsPage';
import OnboardingWizard from './components/OnboardingWizard';
import ExercisePage from './components/ExercisePage';
import MeditationPage from './components/MeditationPage';
import BarcodeScannerPage from './components/BarcodeScannerPage';
import RemindersPage from './components/RemindersPage';
import ProgressPhotosPage from './components/ProgressPhotosPage';
import JournalPage from './components/JournalPage';
import SubscriptionPage from './components/SubscriptionPage';
import PremiumPaywall from './components/PremiumPaywall';
import HamburgerMenu from './components/HamburgerMenu';
import BottomNav from './components/BottomNav';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { supabase } from './lib/supabase';
import './App.css';
import './responsive.css';

function AppInner() {
  const { session, profile, loading, signOut, refreshProfile } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = !!session;

  useEffect(() => {
    if (session && profile && !profile.onboarded_at) setShowOnboarding(true);
    else setShowOnboarding(false);
  }, [session, profile]);

  const handleLogin = () => { /* Auth state change handled by AuthContext listener */ };

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const handleOnboardingComplete = async () => {
    if (session?.user) {
      await supabase.from('profiles').update({ onboarded_at: new Date().toISOString() }).eq('id', session.user.id);
      await refreshProfile();
    }
    setShowOnboarding(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const P = ({ children }: { children: React.ReactNode }) =>
    isLoggedIn ? <>{children}</> : <Navigate to="/login" />;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA' }}>
        <div style={{ fontSize: '0.9rem', color: '#6C757D' }}>Loading…</div>
      </div>
    );
  }

  return (
    <Router basename="/sajoma-fitness">
      <div className="app-container">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <HomePage />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/dashboard" element={<P><DashboardPage onOpenMenu={toggleMenu} /></P>} />
          <Route path="/water-tracker" element={<P><WaterTrackerPage onOpenMenu={toggleMenu} /></P>} />
          <Route path="/meal-logger" element={<P><MealLoggerPage onOpenMenu={toggleMenu} /></P>} />
          <Route path="/meal-result" element={<P><MealResultScreen onOpenMenu={toggleMenu} /></P>} />
          <Route path="/health-tracker" element={<P><HealthTrackerPage onOpenMenu={toggleMenu} /></P>} />
          <Route path="/settings" element={<P><SettingsPage onLogout={handleLogout} onOpenMenu={toggleMenu} /></P>} />
          <Route path="/exercise" element={<P><ExercisePage onOpenMenu={toggleMenu} /></P>} />
          <Route path="/meditation" element={<P><MeditationPage onOpenMenu={toggleMenu} /></P>} />
          <Route path="/barcode-scanner" element={<P><BarcodeScannerPage onOpenMenu={toggleMenu} /></P>} />
          <Route path="/reminders" element={<P><RemindersPage onOpenMenu={toggleMenu} /></P>} />
          <Route path="/progress-photos" element={<P><ProgressPhotosPage onOpenMenu={toggleMenu} /></P>} />
          <Route path="/journal" element={<P><JournalPage onOpenMenu={toggleMenu} /></P>} />
          <Route path="/subscription" element={<P><SubscriptionPage onOpenMenu={toggleMenu} /></P>} />
          <Route path="/premium" element={<P><PremiumPaywall onOpenMenu={toggleMenu} /></P>} />
        </Routes>

        {isLoggedIn && !showOnboarding && <BottomNav />}

        {isLoggedIn && (
          <HamburgerMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onLogout={handleLogout}
          />
        )}

        {showOnboarding && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
            <OnboardingWizard onComplete={handleOnboardingComplete} />
          </div>
        )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AppInner />
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
