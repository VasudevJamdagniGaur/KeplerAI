import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setIsLoading(true);
    // Simulate loading time for better UX
    setTimeout(() => {
      setCurrentScreen('dashboard');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="App">
      {currentScreen === 'splash' && (
        <SplashScreen onStart={handleStart} isLoading={isLoading} />
      )}
      {currentScreen === 'dashboard' && (
        <Dashboard />
      )}
    </div>
  );
}

export default App;
