from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
import json
from model_pipeline import ExoplanetMLPipeline
from utils import generate_explanation, create_visualization_data

app = Flask(__name__)
CORS(app)

# Initialize the ML pipeline
pipeline = ExoplanetMLPipeline()

# Load the trained model if it exists
model_path = 'models/rf_model.joblib'
if os.path.exists(model_path):
    try:
        pipeline.load_model(model_path)
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Please train the model first by running train_model.py")

@app.route('/')
def index():
    return jsonify({"message": "KeplerAI API is running!"})

@app.route('/predict', methods=['POST'])
def predict():
    """Predict if a celestial body is an exoplanet"""
    try:
        if not pipeline.is_trained:
            return jsonify({"error": "Model not trained. Please train the model first."}), 500
        
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Convert input data to DataFrame
        if isinstance(data, dict):
            # Single prediction
            df = pd.DataFrame([data])
        elif isinstance(data, list):
            # Multiple predictions
            df = pd.DataFrame(data)
        else:
            return jsonify({"error": "Invalid data format"}), 400
        
        # Make predictions
        predictions, probabilities = pipeline.predict(df)
        
        # Get feature importance for explanation
        feature_importance = pipeline.get_feature_importance()
        
        results = []
        
        for i, (prediction, prob) in enumerate(zip(predictions, probabilities)):
            # Map prediction to labels
            disposition_map = {-1: "FALSE POSITIVE", 0: "CANDIDATE", 1: "CONFIRMED"}
            classification = disposition_map.get(prediction, "UNKNOWN")
            
            # Get confidence score (max probability)
            confidence = float(max(prob)) * 100
            
            # Get input data for this prediction
            input_data = data[i] if isinstance(data, list) else data
            
            # Generate AI explanation
            explanation = generate_explanation(prediction, prob, feature_importance, input_data)
            
            # Get top contributing features
            top_features = [feature for feature, _ in feature_importance[:5]]
            
            result = {
                "classification": classification,
                "confidence_score": round(confidence, 2),
                "ai_explanation": explanation,
                "key_contributing_features": top_features,
                "prediction_details": {
                    "false_positive_prob": float(prob[0]),
                    "candidate_prob": float(prob[1]),
                    "confirmed_prob": float(prob[2])
                },
                # Include input data for supporting data table
                "koi_period": input_data.get('koi_period'),
                "koi_prad": input_data.get('koi_prad'),
                "koi_teq": input_data.get('koi_teq'),
                "koi_model_snr": input_data.get('koi_model_snr'),
                "koi_depth": input_data.get('koi_depth'),
                "koi_steff": input_data.get('koi_steff')
            }
            
            results.append(result)
        
        # If single prediction, return the first result
        if len(results) == 1:
            return jsonify(results[0])
        else:
            return jsonify({"predictions": results})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict_csv', methods=['POST'])
def predict_csv():
    """Predict exoplanets from uploaded CSV file"""
    try:
        if not pipeline.is_trained:
            return jsonify({"error": "Model not trained. Please train the model first."}), 500
        
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not file.filename.endswith('.csv'):
            return jsonify({"error": "File must be a CSV"}), 400
        
        # Read the CSV file
        df = pd.read_csv(file)
        
        # Make predictions
        predictions, probabilities = pipeline.predict(df)
        
        # Get feature importance
        feature_importance = pipeline.get_feature_importance()
        
        results = []
        disposition_map = {-1: "FALSE POSITIVE", 0: "CANDIDATE", 1: "CONFIRMED"}
        
        for i, (prediction, prob) in enumerate(zip(predictions, probabilities)):
            classification = disposition_map.get(prediction, "UNKNOWN")
            confidence = float(max(prob)) * 100
            
            # Generate explanation for this row
            row_data = df.iloc[i].to_dict()
            explanation = generate_explanation(prediction, prob, feature_importance, row_data)
            
            result = {
                "row_index": i,
                "classification": classification,
                "confidence_score": round(confidence, 2),
                "ai_explanation": explanation,
                "prediction_details": {
                    "false_positive_prob": float(prob[0]),
                    "candidate_prob": float(prob[1]),
                    "confirmed_prob": float(prob[2])
                }
            }
            
            results.append(result)
        
        # Create visualization data
        viz_data = create_visualization_data(df, predictions, probabilities)
        
        return jsonify({
            "predictions": results,
            "visualization_data": viz_data,
            "summary": {
                "total_predictions": len(results),
                "confirmed_count": sum(1 for r in results if r["classification"] == "CONFIRMED"),
                "candidate_count": sum(1 for r in results if r["classification"] == "CANDIDATE"),
                "false_positive_count": sum(1 for r in results if r["classification"] == "FALSE POSITIVE")
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/model_info', methods=['GET'])
def model_info():
    """Get information about the trained model"""
    try:
        if not pipeline.is_trained:
            return jsonify({"error": "Model not trained"}), 400
        
        feature_importance = pipeline.get_feature_importance()
        
        return jsonify({
            "is_trained": pipeline.is_trained,
            "feature_columns": pipeline.feature_columns,
            "feature_importance": feature_importance[:10],  # Top 10 features
            "model_type": "Random Forest Classifier"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/train', methods=['POST'])
def train_model():
    """Train the model (for development/testing)"""
    try:
        from train_model import train_exoplanet_model
        pipeline = train_exoplanet_model()
        
        return jsonify({
            "message": "Model trained successfully!",
            "feature_columns": pipeline.feature_columns
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
