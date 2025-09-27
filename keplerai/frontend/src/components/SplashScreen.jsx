import React from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onStart, isLoading }) => {
  return (
    <div className="splash-container">
      <div className="rocket-container">
        <img 
          src="/rocket-logo.svg" 
          alt="KeplerAI Rocket Logo" 
          className="rocket-logo"
        />
      </div>
      
      <h1 className="app-title">KeplerAI</h1>
      
      <p className="app-subtitle">
        Advanced Exoplanet Classification using Machine Learning
        <br />
        Discover the secrets of distant worlds with AI-powered analysis
      </p>
      
      <button 
        className="start-button" 
        onClick={onStart}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="loading-spinner"></div>
            Loading...
          </>
        ) : (
          "Let's Go"
        )}
      </button>
    </div>
  );
};

export default SplashScreen;
