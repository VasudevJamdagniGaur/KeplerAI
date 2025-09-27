# KeplerAI - Exoplanet Classification System

KeplerAI is an advanced machine learning application that analyzes celestial body data to determine if an object is an exoplanet. Built with a modern web interface and powered by a Random Forest classifier trained on NASA's Kepler Object of Interest (KOI) dataset.

## Features

- **Modern Web Interface**: Beautiful, responsive React frontend with animated splash screen
- **Machine Learning Analysis**: Random Forest classifier trained on real exoplanet data
- **Multiple Input Methods**: Manual data entry or CSV file upload
- **Comprehensive Results**: 
  - Classification (Confirmed Exoplanet / Candidate / False Positive)
  - Confidence score with probability breakdown
  - AI-generated explanations in plain language
  - Key contributing features identification
- **Real-time Visualization**: Interactive charts and probability bars

## Project Structure

```
keplerai/
├─ backend/
│  ├─ train_model.py          # ML model training script
│  ├─ app.py                  # Flask API server
│  ├─ model_pipeline.py       # ML pipeline and preprocessing
│  ├─ utils.py                # Helper functions and explanations
│  ├─ requirements.txt        # Python dependencies
│  ├─ KOI.csv                 # NASA Kepler dataset
│  └─ models/
│     └─ rf_model.joblib      # Trained model (generated)
├─ frontend/
│  ├─ public/
│  │  ├─ index.html
│  │  └─ rocket-logo.svg      # Animated rocket logo
│  ├─ src/
│  │  ├─ App.jsx              # Main React component
│  │  ├─ App.css              # Global styles
│  │  ├─ index.js             # React entry point
│  │  └─ components/
│  │     ├─ SplashScreen.jsx  # Landing page
│  │     ├─ Dashboard.jsx     # Main interface
│  │     ├─ UploadForm.jsx    # Data input form
│  │     └─ ResultsDisplay.jsx # Results visualization
│  └─ package.json            # Node.js dependencies
└─ README.md
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd keplerai/backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Train the machine learning model:
```bash
python train_model.py
```

4. Start the Flask API server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd keplerai/frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

### 1. Splash Screen
- Launch the application to see the animated splash screen
- Click "Let's Go" to proceed to the dashboard

### 2. Dashboard
- Choose between manual data entry or CSV file upload
- For manual entry: Fill in the celestial body parameters
- For CSV upload: Select a file with KOI-format data

### 3. Analysis Results
- View the classification result (Confirmed/Candidate/False Positive)
- Check the confidence score and probability breakdown
- Read the AI-generated explanation
- Review key contributing features

## API Endpoints

- `GET /` - API status
- `POST /predict` - Single prediction from JSON data
- `POST /predict_csv` - Batch prediction from CSV file
- `GET /model_info` - Model information and feature importance
- `POST /train` - Retrain the model (development)

## Data Format

The application expects data in the Kepler Object of Interest (KOI) format with these key features:

- `koi_period`: Orbital period in days
- `koi_impact`: Impact parameter
- `koi_duration`: Transit duration in hours
- `koi_depth`: Transit depth in parts per million
- `koi_prad`: Planetary radius in Earth radii
- `koi_teq`: Equilibrium temperature in Kelvin
- `koi_insol`: Insolation flux relative to Earth
- `koi_model_snr`: Transit signal-to-noise ratio
- `koi_steff`: Stellar effective temperature
- `koi_slogg`: Stellar surface gravity
- `koi_srad`: Stellar radius in Solar radii
- `koi_kepmag`: Kepler-band magnitude
- `koi_fpflag_*`: False positive flags (0 or 1)

## Machine Learning Model

- **Algorithm**: Random Forest Classifier
- **Features**: 16 key astronomical parameters
- **Target**: 3-class classification (Confirmed/Candidate/False Positive)
- **Preprocessing**: Standard scaling and missing value imputation
- **Validation**: 80/20 train-test split with stratified sampling

## Technology Stack

### Backend
- Python 3.8+
- Flask (Web framework)
- scikit-learn (Machine learning)
- pandas (Data manipulation)
- numpy (Numerical computing)
- joblib (Model serialization)

### Frontend
- React 18
- CSS3 with animations
- Axios (HTTP client)
- Modern ES6+ JavaScript

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- NASA Exoplanet Archive for the KOI dataset
- Kepler Space Telescope mission
- Scikit-learn and the Python data science community
- React and the modern web development ecosystem
