import React, { useState } from 'react';
import axios from 'axios';
import './UploadForm.css';

const UploadForm = ({ onResults, onLoading }) => {
  const [uploadType, setUploadType] = useState('manual');
  const [formData, setFormData] = useState({
    // Required fields
    koi_period: '',
    koi_duration: '',
    koi_depth: '',
    koi_prad: '',
    koi_teq: '',
    koi_insol: '',
    koi_model_snr: '',
    koi_steff: '',
    koi_srad: '',
    // Optional fields
    koi_impact: '',
    koi_score: '',
    koi_slogg: ''
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    onLoading(true);

    try {
      let response;
      
      if (uploadType === 'manual') {
        // Convert form data to numbers where appropriate
        const numericData = {};
        Object.keys(formData).forEach(key => {
          const value = formData[key];
          if (key.startsWith('koi_fpflag_')) {
            numericData[key] = parseInt(value);
          } else {
            numericData[key] = value === '' ? null : parseFloat(value);
          }
        });

        response = await axios.post('http://localhost:5000/predict', numericData);
      } else {
        // File upload
        const formDataFile = new FormData();
        formDataFile.append('file', file);
        
        response = await axios.post('http://localhost:5000/predict_csv', formDataFile, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      onResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while processing your request');
    } finally {
      onLoading(false);
    }
  };

  const requiredFields = {
    koi_period: 'Orbital Period (days)',
    koi_duration: 'Transit Duration (hours)',
    koi_depth: 'Transit Depth (ppm)',
    koi_prad: 'Planetary Radius (Earth radii)',
    koi_teq: 'Equilibrium Temperature (K)',
    koi_insol: 'Insolation Flux (Earth flux)',
    koi_model_snr: 'Transit Signal-to-Noise',
    koi_steff: 'Stellar Effective Temperature (K)',
    koi_srad: 'Stellar Radius (Solar radii)'
  };

  const optionalFields = {
    koi_impact: 'Impact Parameter',
    koi_score: 'Disposition Score',
    koi_slogg: 'Stellar Surface Gravity'
  };

  return (
    <div className="upload-form-container">
      <div className="upload-type-selector">
        <button
          className={`type-button ${uploadType === 'manual' ? 'active' : ''}`}
          onClick={() => setUploadType('manual')}
        >
          Manual Input
        </button>
        <button
          className={`type-button ${uploadType === 'file' ? 'active' : ''}`}
          onClick={() => setUploadType('file')}
        >
          Upload CSV
        </button>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        {uploadType === 'manual' ? (
          <div className="manual-input-section">
            <h3>Enter Celestial Body Data</h3>
            
            {/* Required Fields */}
            <div className="field-section">
              <h4 className="section-header required">Required Fields *</h4>
              <div className="form-grid">
                {Object.keys(requiredFields).map(field => (
                  <div key={field} className="form-group required">
                    <label htmlFor={field}>
                      {requiredFields[field]} *
                    </label>
                    <input
                      type="number"
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      step="any"
                      placeholder={`Enter ${requiredFields[field].toLowerCase()}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Fields */}
            <div className="field-section">
              <h4 className="section-header optional">Optional Fields</h4>
              <div className="form-grid">
                {Object.keys(optionalFields).map(field => (
                  <div key={field} className="form-group optional">
                    <label htmlFor={field}>
                      {optionalFields[field]}
                    </label>
                    <input
                      type="number"
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      step="any"
                      placeholder={`Enter ${optionalFields[field].toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="file-upload-section">
            <h3>Upload CSV File</h3>
            <div className="file-input-container">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="file-input"
                id="csv-file"
              />
              <label htmlFor="csv-file" className="file-input-label">
                {file ? file.name : 'Choose CSV File'}
              </label>
            </div>
            <p className="file-help">
              Upload a CSV file with celestial body data. The file should contain columns 
              matching the Kepler Object of Interest (KOI) dataset format.
            </p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-button" disabled={uploadType === 'file' && !file}>
          Analyze Exoplanet
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
