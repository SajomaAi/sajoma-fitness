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
import BarcodeScannerPage from './components/BarcodeScannerPage';
import RemindersPage from './components/RemindersPage';
import ProgressPhotosPage from './components/ProgressPhotosPage';
import JournalPage from './components/JournalPage';
import SubscriptionPage from './components/SubscriptionPage';
import './App.css';
import './responsive.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn && !hasCompletedOnboarding) setShowOnboarding(true);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    if (localStorage.getItem('hasCompletedOnboarding') !== 'true') setShowOnboarding(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  const handleOnboardingComplete = (preferences: any) => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    setShowOnboarding(false);
  };

  const P = ({ children }: { children: React.ReactNode }) =>
    isLoggedIn ? <>{children}</> : <Navigate to="/login" />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <HomePage />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<P><DashboardPage /></P>} />
        <Route path="/water-tracker" element={<P><WaterTrackerPage /></P>} />
        <Route path="/meal-logger" element={<P><MealLoggerPage /></P>} />
        <Route path="/meal-result" element={<P><MealResultScreen /></P>} />
        <Route path="/health-tracker" element={<P><HealthTrackerPage /></P>} />
        <Route path="/settings" element={<P><SettingsPage onLogout={handleLogout} /></P>} />
        <Route path="/exercise" element={<P><ExercisePage /></P>} />
        <Route path="/barcode-scanner" element={<P><BarcodeScannerPage /></P>} />
        <Route path="/reminders" element={<P><RemindersPage /></P>} />
        <Route path="/progress-photos" element={<P><ProgressPhotosPage /></P>} />
        <Route path="/journal" element={<P><JournalPage /></P>} />
        <Route path="/subscription" element={<P><SubscriptionPage /></P>} />
      </Routes>
      {showOnboarding && <OnboardingWizard onComplete={() => handleOnboardingComplete({})} />}
    </Router>
  );
}

export default App;
