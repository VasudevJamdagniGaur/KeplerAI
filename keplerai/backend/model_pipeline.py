import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

class ExoplanetMLPipeline:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_columns = []
        self.is_trained = False
        
    def load_and_preprocess_data(self, csv_path):
        """Load and preprocess the KOI dataset"""
        print("Loading KOI dataset...")
        
        # Read the CSV file, skipping comment lines
        with open(csv_path, 'r') as f:
            lines = f.readlines()
        
        # Find the actual header line (starts with 'loc_rowid')
        header_line = None
        for i, line in enumerate(lines):
            if line.startswith('loc_rowid,'):
                header_line = i
                break
        
        if header_line is None:
            raise ValueError("Could not find header line in CSV file")
        
        # Read the data starting from the header line
        df = pd.read_csv(csv_path, skiprows=header_line)
        
        print(f"Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
        
        # Select relevant features for exoplanet classification
        feature_columns = [
            'koi_period', 'koi_impact', 'koi_duration', 'koi_depth',
            'koi_prad', 'koi_teq', 'koi_insol', 'koi_model_snr',
            'koi_steff', 'koi_slogg', 'koi_srad', 'koi_kepmag',
            'koi_fpflag_nt', 'koi_fpflag_ss', 'koi_fpflag_co', 'koi_fpflag_ec'
        ]
        
        # Filter out rows where target variable is missing
        df = df.dropna(subset=['koi_disposition'])
        
        # Create target variable based on disposition
        # CONFIRMED = 1, CANDIDATE = 0, FALSE POSITIVE = -1
        disposition_mapping = {
            'CONFIRMED': 1,
            'CANDIDATE': 0, 
            'FALSE POSITIVE': -1
        }
        
        df['target'] = df['koi_disposition'].map(disposition_mapping)
        
        # Remove rows with unknown dispositions
        df = df.dropna(subset=['target'])
        
        # Select features and handle missing values
        X = df[feature_columns].copy()
        y = df['target'].copy()
        
        # Fill missing values with median for numerical columns
        for col in X.select_dtypes(include=[np.number]).columns:
            X[col] = X[col].fillna(X[col].median())
        
        # Fill missing values with mode for categorical columns
        for col in X.select_dtypes(include=['object']).columns:
            X[col] = X[col].fillna(X[col].mode()[0] if not X[col].mode().empty else 0)
        
        self.feature_columns = feature_columns
        
        print(f"Preprocessed dataset: {X.shape[0]} samples, {X.shape[1]} features")
        print(f"Target distribution:\n{y.value_counts()}")
        
        return X, y
    
    def train_model(self, X, y):
        """Train the Random Forest model"""
        print("Training Random Forest model...")
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale the features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train the model
        self.model.fit(X_train_scaled, y_train)
        
        # Make predictions
        y_pred = self.model.predict(X_test_scaled)
        
        # Calculate accuracy
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Model accuracy: {accuracy:.4f}")
        
        # Print classification report
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, 
                                  target_names=['FALSE POSITIVE', 'CANDIDATE', 'CONFIRMED']))
        
        self.is_trained = True
        return accuracy
    
    def save_model(self, model_path):
        """Save the trained model and scaler"""
        if not self.is_trained:
            raise ValueError("Model must be trained before saving")
        
        os.makedirs(os.path.dirname(model_path), exist_ok=True)
        
        # Save model and scaler
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'feature_columns': self.feature_columns
        }, model_path)
        
        print(f"Model saved to {model_path}")
    
    def load_model(self, model_path):
        """Load a trained model"""
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        model_data = joblib.load(model_path)
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.feature_columns = model_data['feature_columns']
        self.is_trained = True
        
        print(f"Model loaded from {model_path}")
    
    def predict(self, X):
        """Make predictions on new data"""
        if not self.is_trained:
            raise ValueError("Model must be trained or loaded before making predictions")
        
        # Ensure X has the same columns as training data
        X_processed = X[self.feature_columns].copy()
        
        # Fill missing values
        for col in X_processed.select_dtypes(include=[np.number]).columns:
            X_processed[col] = X_processed[col].fillna(X_processed[col].median())
        
        for col in X_processed.select_dtypes(include=['object']).columns:
            X_processed[col] = X_processed[col].fillna(X_processed[col].mode()[0] if not X_processed[col].mode().empty else 0)
        
        # Scale the features
        X_scaled = self.scaler.transform(X_processed)
        
        # Make predictions
        predictions = self.model.predict(X_scaled)
        probabilities = self.model.predict_proba(X_scaled)
        
        return predictions, probabilities
    
    def get_feature_importance(self):
        """Get feature importance from the trained model"""
        if not self.is_trained:
            raise ValueError("Model must be trained before getting feature importance")
        
        importance = self.model.feature_importances_
        feature_importance = dict(zip(self.feature_columns, importance))
        
        # Sort by importance
        sorted_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
        
        return sorted_features

def train_exoplanet_model():
    """Main function to train the exoplanet model"""
    pipeline = ExoplanetMLPipeline()
    
    # Load and preprocess data
    X, y = pipeline.load_and_preprocess_data('KOI.csv')
    
    # Train model
    accuracy = pipeline.train_model(X, y)
    
    # Save model
    pipeline.save_model('models/rf_model.joblib')
    
    # Print feature importance
    print("\nTop 10 Most Important Features:")
    feature_importance = pipeline.get_feature_importance()
    for i, (feature, importance) in enumerate(feature_importance[:10]):
        print(f"{i+1}. {feature}: {importance:.4f}")
    
    return pipeline

if __name__ == "__main__":
    train_exoplanet_model()
