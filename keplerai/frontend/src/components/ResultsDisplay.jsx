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
      
      <div className="predictions-list">
        {predictions.map((prediction, index) => {
          const predictionResult = getPredictionResult(prediction.classification);
          const supportingData = getSupportingData(prediction);
          
          return (
            <div key={index} className="prediction-card">
              {/* Output Section */}
              <div className="output-section">
                <h3 className="section-title">Output</h3>
                <div className="output-content">
                  <div className="prediction-statement" style={{color: predictionResult.color}}>
                    <span className="prediction-icon">{predictionResult.icon}</span>
                    <span className="prediction-text">{predictionResult.text}</span>
                  </div>
                </div>
              </div>

              {/* Reason Section */}
              <div className="reason-section">
                <h3 className="section-title">Reason</h3>
                <div className="reason-content">
                  <p>{prediction.ai_explanation}</p>
                </div>
              </div>

              {/* Classification Section */}
              <div className="classification-section">
                <h3 className="section-title">Classification</h3>
                <div className="classification-content">
                  <div className="classification-badge" style={{backgroundColor: predictionResult.color}}>
                    <span className="classification-icon">{predictionResult.icon}</span>
                    <span className="classification-text">{prediction.classification}</span>
                  </div>
                </div>
              </div>

              {/* Main Objective Section */}
              <div className="objective-section">
                <h3 className="section-title">Main Objective</h3>
                <div className="objective-content">
                  <p>To determine if the celestial body is an exoplanet based on transit photometry data analysis using machine learning classification.</p>
                </div>
              </div>

              {/* Confidence Score Section */}
              <div className="confidence-section">
                <h3 className="section-title">Confidence Score</h3>
                <div className="confidence-content">
                  <div className="confidence-display">
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
                    <div className="confidence-label">Model Certainty</div>
                  </div>
                </div>
              </div>

              {/* AI Explanation Section */}
              <div className="ai-explanation-section">
                <h3 className="section-title">AI Explanation</h3>
                <div className="ai-explanation-content">
                  <p><strong>Plain-language reasoning generated by LLaMA 3:</strong></p>
                  <p>{prediction.ai_explanation}</p>
                </div>
              </div>

              {/* Key Contributing Features Section */}
              {prediction.key_contributing_features && (
                <div className="features-section">
                  <h3 className="section-title">Key Contributing Features</h3>
                  <div className="features-content">
                    <p><em>For transparency (e.g., "Orbital period and transit depth were the strongest factors"):</em></p>
                    <div className="features-list">
                      {prediction.key_contributing_features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="feature-tag">
                          {feature.replace('koi_', '').replace('_', ' ').toUpperCase()}
                        </span>
                      ))}
                    </div>
                    <p className="features-description">
                      {prediction.key_contributing_features.slice(0, 2).map(f => f.replace('koi_', '').replace('_', ' ')).join(' and ')} were the strongest factors in this classification.
                    </p>
                  </div>
                </div>
              )}

              {/* Visualization Section */}
              <div className="visualization-section">
                <h3 className="section-title">Visualization</h3>
                <div className="visualization-content">
                  <p><em>Graph showing where this candidate falls relative to confirmed planets:</em></p>
                  
                  <div className="visualization-grid">
                    <div className="planet-visualization">
                      <div className="star"></div>
                      <div className="orbit">
                        <div className="planet" style={{backgroundColor: predictionResult.color}}></div>
                      </div>
                      <div className="planet-label">Detected Planet</div>
                    </div>
                    
                    <div className="light-curve">
                      <div className="light-curve-label">Light Curve Analysis</div>
                      <div className="light-curve-graph">
                        <div className="light-curve-line"></div>
                        <div className="transit-dip" style={{backgroundColor: predictionResult.color}}></div>
                      </div>
                      <div className="curve-description">Transit depth: {prediction.koi_depth || 'N/A'} ppm</div>
                    </div>
                  </div>

                  <div className="parameter-comparison">
                    <h4>Parameter Comparison</h4>
                    <div className="comparison-table">
                      <div className="comparison-row">
                        <span className="param-label">Orbital Period</span>
                        <span className="param-value">{prediction.koi_period || 'N/A'} days</span>
                        <span className="param-status">Typical for exoplanets: 1-365 days</span>
                      </div>
                      <div className="comparison-row">
                        <span className="param-label">Planetary Radius</span>
                        <span className="param-value">{prediction.koi_prad || 'N/A'} R⊕</span>
                        <span className="param-status">Earth-like: 0.5-2.0 R⊕</span>
                      </div>
                      <div className="comparison-row">
                        <span className="param-label">Transit Depth</span>
                        <span className="param-value">{prediction.koi_depth || 'N/A'} ppm</span>
                        <span className="param-status">Detectable: >100 ppm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  className="details-button"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? 'Hide Technical Details' : 'Show Technical Details'}
                </button>
                <button 
                  className="save-button"
                  onClick={() => saveResult(prediction)}
                >
                  💾 Save Result
                </button>
              </div>

              {/* Technical Details (Expandable) */}
              {showDetails && (
                <div className="technical-details">
                  <h4>📊 Technical Analysis</h4>
                  <div className="probability-breakdown">
                    <h5>Probability Breakdown</h5>
                    <div className="probability-bars">
                      <div className="probability-item">
                        <span className="prob-label">False Positive</span>
                        <div className="prob-bar">
                          <div 
                            className="prob-fill false-positive" 
                            style={{width: `${(prediction.prediction_details?.false_positive_prob || 0) * 100}%`}}
                          ></div>
                          <span className="prob-value">{((prediction.prediction_details?.false_positive_prob || 0) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="probability-item">
                        <span className="prob-label">Candidate</span>
                        <div className="prob-bar">
                          <div 
                            className="prob-fill candidate" 
                            style={{width: `${(prediction.prediction_details?.candidate_prob || 0) * 100}%`}}
                          ></div>
                          <span className="prob-value">{((prediction.prediction_details?.candidate_prob || 0) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="probability-item">
                        <span className="prob-label">Confirmed</span>
                        <div className="prob-bar">
                          <div 
                            className="prob-fill confirmed" 
                            style={{width: `${(prediction.prediction_details?.confirmed_prob || 0) * 100}%`}}
                          ></div>
                          <span className="prob-value">{((prediction.prediction_details?.confirmed_prob || 0) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="supporting-data">
                    <h5>Supporting Data</h5>
                    <div className="data-table">
                      {supportingData.map((item, idx) => (
                        <div key={idx} className="data-row">
                          <span className="data-label">{item.label}</span>
                          <span className="data-value">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
    </div>
  );
};

export default ResultsDisplay;
