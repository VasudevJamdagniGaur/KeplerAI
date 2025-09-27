import React, { useState } from 'react';
import UploadForm from './UploadForm';
import ResultsDisplay from './ResultsDisplay';
import './Dashboard.css';

const Dashboard = () => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResults = (data) => {
    setResults(data);
  };

  const handleLoading = (loading) => {
    setIsLoading(loading);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <img 
          src="/rocket-logo.svg" 
          alt="KeplerAI Logo" 
          className="dashboard-logo"
        />
        <h1 className="dashboard-title">KeplerAI Dashboard</h1>
      </div>
      
      <div className="main-content">
        <div className="dashboard-grid">
          <div className="upload-section">
            <h2 className="section-title">Exoplanet Analysis</h2>
            <p className="section-description">
              Upload a CSV file or enter data manually to analyze celestial bodies 
              and determine if they are exoplanets using our advanced ML model.
            </p>
            
            <UploadForm 
              onResults={handleResults}
              onLoading={handleLoading}
            />
          </div>
          
          {results && (
            <div className="results-section">
              <ResultsDisplay 
                results={results}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
