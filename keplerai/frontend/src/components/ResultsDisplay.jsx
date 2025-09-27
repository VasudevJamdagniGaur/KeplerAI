import React, { useState } from 'react';
import './ResultsDisplay.css';

const ResultsDisplay = ({ results, isLoading }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [savedResults, setSavedResults] = useState([]);

  if (isLoading) {
    return (
      <div className="results-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Analyzing celestial body data...</p>
        </div>
      </div>
    );
  }

  if (!results) return null;

  // Handle both single prediction and multiple predictions
  const predictions = results.predictions || [results];
  const isMultiple = results.predictions && results.predictions.length > 1;

  const getPredictionResult = (classification) => {
    switch (classification) {
      case 'CONFIRMED':
        return {
          text: '🌌 Exoplanet Detected ✅',
          color: '#00ff88',
          icon: '✅'
        };
      case 'CANDIDATE':
        return {
          text: '🔍 Potential Exoplanet ⚠️',
          color: '#ffaa00',
          icon: '⚠️'
        };
      case 'FALSE POSITIVE':
        return {
          text: '❌ Not an Exoplanet',
          color: '#ff4444',
          icon: '❌'
        };
      default:
        return {
          text: '❓ Unknown Classification',
          color: '#a0a0a0',
          icon: '❓'
        };
    }
  };

  const getSupportingData = (prediction) => {
    return [
      { label: 'Orbital Period', value: `${prediction.koi_period || 'N/A'} days` },
      { label: 'Radius', value: `${prediction.koi_prad || 'N/A'} R⊕` },
      { label: 'Temperature', value: `${prediction.koi_teq || 'N/A'} K` },
      { label: 'Signal Strength', value: `${prediction.koi_model_snr || 'N/A'}` },
      { label: 'Transit Depth', value: `${prediction.koi_depth || 'N/A'} ppm` },
      { label: 'Stellar Temp', value: `${prediction.koi_steff || 'N/A'} K` }
    ];
  };

  const saveResult = (prediction) => {
    const resultToSave = {
      ...prediction,
      timestamp: new Date().toLocaleString(),
      id: Date.now()
    };
    setSavedResults(prev => [...prev, resultToSave]);
  };

  return (
    <div className="results-container">
      <h2 className="results-title">🚀 KeplerAI Analysis Results</h2>
      
      {isMultiple && (
        <div className="summary-stats">
          <h3>📊 Summary</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{results.summary?.total_predictions || predictions.length}</span>
              <span className="stat-label">Total Analyzed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" style={{color: '#00ff88'}}>
                {results.summary?.confirmed_count || predictions.filter(p => p.classification === 'CONFIRMED').length}
              </span>
              <span className="stat-label">Exoplanets</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" style={{color: '#ffaa00'}}>
                {results.summary?.candidate_count || predictions.filter(p => p.classification === 'CANDIDATE').length}
              </span>
              <span className="stat-label">Candidates</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" style={{color: '#ff4444'}}>
                {results.summary?.false_positive_count || predictions.filter(p => p.classification === 'FALSE POSITIVE').length}
              </span>
              <span className="stat-label">False Positives</span>
            </div>
          </div>
        </div>
      )}

      <div className="predictions-list">
        {predictions.map((prediction, index) => {
          const predictionResult = getPredictionResult(prediction.classification);
          const supportingData = getSupportingData(prediction);
          
          return (
            <div key={index} className="prediction-card">
              {/* Main Prediction Result */}
              <div className="prediction-result">
                <div className="prediction-statement" style={{color: predictionResult.color}}>
                  <span className="prediction-icon">{predictionResult.icon}</span>
                  <span className="prediction-text">{predictionResult.text}</span>
                </div>
                
                <div className="confidence-display">
                  <div className="confidence-label">Confidence</div>
                  <div className="confidence-value">{prediction.confidence_score}%</div>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill" 
                      style={{
                        width: `${prediction.confidence_score}%`,
                        backgroundColor: predictionResult.color
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Visual Representation */}
              <div className="visual-representation">
                <div className="planet-visualization">
                  <div className="star"></div>
                  <div className="orbit">
                    <div className="planet" style={{backgroundColor: predictionResult.color}}></div>
                  </div>
                </div>
                <div className="light-curve">
                  <div className="light-curve-label">Light Curve Analysis</div>
                  <div className="light-curve-graph">
                    <div className="light-curve-line"></div>
                    <div className="transit-dip" style={{backgroundColor: predictionResult.color}}></div>
                  </div>
                </div>
              </div>

              {/* Supporting Data Table */}
              <div className="supporting-data">
                <h4>📋 Supporting Data</h4>
                <div className="data-table">
                  {supportingData.map((item, idx) => (
                    <div key={idx} className="data-row">
                      <span className="data-label">{item.label}</span>
                      <span className="data-value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  className="details-button"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
                <button 
                  className="save-button"
                  onClick={() => saveResult(prediction)}
                >
                  💾 Save Result
                </button>
              </div>

              {/* Detailed Analysis (Expandable) */}
              {showDetails && (
                <div className="detailed-analysis">
                  <div className="probability-breakdown">
                    <h4>📊 Probability Breakdown</h4>
                    <div className="probability-bars">
                      <div className="probability-item">
                        <span className="prob-label">False Positive</span>
                        <div className="prob-bar">
                          <div 
                            className="prob-fill false-positive" 
                            style={{width: `${(prediction.prediction_details?.false_positive_prob || 0) * 100}%`}}
                          ></div>
                          <span className="prob-value">{(prediction.prediction_details?.false_positive_prob || 0) * 100:.1f}%</span>
                        </div>
                      </div>
                      <div className="probability-item">
                        <span className="prob-label">Candidate</span>
                        <div className="prob-bar">
                          <div 
                            className="prob-fill candidate" 
                            style={{width: `${(prediction.prediction_details?.candidate_prob || 0) * 100}%`}}
                          ></div>
                          <span className="prob-value">{(prediction.prediction_details?.candidate_prob || 0) * 100:.1f}%</span>
                        </div>
                      </div>
                      <div className="probability-item">
                        <span className="prob-label">Confirmed</span>
                        <div className="prob-bar">
                          <div 
                            className="prob-fill confirmed" 
                            style={{width: `${(prediction.prediction_details?.confirmed_prob || 0) * 100}%`}}
                          ></div>
                          <span className="prob-value">{(prediction.prediction_details?.confirmed_prob || 0) * 100:.1f}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ai-explanation">
                    <h4>🤖 Why this prediction?</h4>
                    <p>{prediction.ai_explanation}</p>
                  </div>

                  {prediction.key_contributing_features && (
                    <div className="contributing-features">
                      <h4>🔍 Key Contributing Features</h4>
                      <div className="features-list">
                        {prediction.key_contributing_features.map((feature, idx) => (
                          <span key={idx} className="feature-tag">
                            {feature.replace('koi_', '').replace('_', ' ').toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Analysis Timestamp */}
              <div className="analysis-timestamp">
                <span>🕒 Analyzed on: {new Date().toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Saved Results */}
      {savedResults.length > 0 && (
        <div className="saved-results">
          <h3>💾 Saved Results ({savedResults.length})</h3>
          <div className="saved-list">
            {savedResults.map((result, idx) => (
              <div key={result.id} className="saved-item">
                <span className="saved-classification">{result.classification}</span>
                <span className="saved-confidence">{result.confidence_score}%</span>
                <span className="saved-timestamp">{result.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
