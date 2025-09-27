#!/usr/bin/env python3
"""
Training script for KeplerAI exoplanet classification model
"""

from model_pipeline import train_exoplanet_model

if __name__ == "__main__":
    print("Starting KeplerAI model training...")
    print("=" * 50)
    
    try:
        pipeline = train_exoplanet_model()
        print("\n" + "=" * 50)
        print("Model training completed successfully!")
        print("The model has been saved to models/rf_model.joblib")
        print("You can now start the Flask API with: python app.py")
        
    except Exception as e:
        print(f"\nError during training: {e}")
        print("Please check the KOI.csv file and try again.")
