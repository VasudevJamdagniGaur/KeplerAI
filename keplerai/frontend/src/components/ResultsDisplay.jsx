import React from 'react';
import './ResultsDisplay.css';

const ResultsDisplay = ({ results, isLoading }) => {
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

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'CONFIRMED':
        return '#00ff88';
      case 'CANDIDATE':
        return '#ffaa00';
      case 'FALSE POSITIVE':
        return '#ff4444';
      default:
        return '#a0a0a0';
    }
  };

  const getClassificationIcon = (classification) => {
    switch (classification) {
      case 'CONFIRMED':
        return '✓';
      case 'CANDIDATE':
        return '?';
      case 'FALSE POSITIVE':
        return '✗';
      default:
        return '?';
    }
  };

  return (
    <div className="results-container">
      <h2 className="results-title">Analysis Results</h2>
      
      {isMultiple && (
        <div className="summary-stats">
          <h3>Summary</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{results.summary?.total_predictions || predictions.length}</span>
              <span className="stat-label">Total Analyzed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number" style={{color: '#00ff88'}}>
                {results.summary?.confirmed_count || predictions.filter(p => p.classification === 'CONFIRMED').length}
              </span>
              <span className="stat-label">Confirmed</span>
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
        {predictions.map((prediction, index) => (
          <div key={index} className="prediction-card">
            <div className="prediction-header">
              <div className="classification-badge" style={{backgroundColor: getClassificationColor(prediction.classification)}}>
                <span className="classification-icon">{getClassificationIcon(prediction.classification)}</span>
                <span className="classification-text">{prediction.classification}</span>
              </div>
              <div className="confidence-score">
                <span className="confidence-label">Confidence</span>
                <span className="confidence-value">{prediction.confidence_score}%</span>
              </div>
            </div>

            <div className="prediction-details">
              <div className="probability-bars">
                <h4>Probability Breakdown</h4>
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

              <div className="ai-explanation">
                <h4>AI Explanation</h4>
                <p>{prediction.ai_explanation}</p>
              </div>

              {prediction.key_contributing_features && (
                <div className="contributing-features">
                  <h4>Key Contributing Features</h4>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;
