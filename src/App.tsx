import Navbar from './components/Navbar';
import { Footer } from './components/Footer';
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
import './App.css';
import './responsive.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user is logged in (in a real app, this would check localStorage or a token)
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';
    
    setIsLoggedIn(loggedIn);
    
    // Show onboarding if user is logged in but hasn't completed onboarding
    if (loggedIn && !hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    // Note: We don't remove onboarding status so returning users don't see it again
  };

  const handleOnboardingComplete = (preferences: any) => {
    console.log('Onboarding completed with preferences:', preferences);
    localStorage.setItem('hasCompletedOnboarding', 'true');
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    setShowOnboarding(false);
  };

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route 
              path="/dashboard" 
              element={isLoggedIn ? <DashboardPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/water-tracker" 
              element={isLoggedIn ? <WaterTrackerPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/meal-logger" 
              element={isLoggedIn ? <MealLoggerPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/meal-result" 
              element={isLoggedIn ? <MealResultScreen /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/health-tracker" 
              element={isLoggedIn ? <HealthTrackerPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/settings" 
              element={isLoggedIn ? <SettingsPage onLogout={handleLogout} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <Footer />
        
        {/* Onboarding Wizard */}
        {showOnboarding && (
          <OnboardingWizard onComplete={handleOnboardingComplete} />
        )}
      </div>
    </Router>
  );
}

export default App;
