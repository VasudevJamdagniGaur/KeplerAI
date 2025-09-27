import numpy as np
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.utils import PlotlyJSONEncoder
import json

def generate_explanation(prediction, probabilities, feature_importance, input_data):
    """Generate a human-readable explanation for the prediction"""
    
    # Map prediction to labels
    disposition_map = {-1: "FALSE POSITIVE", 0: "CANDIDATE", 1: "CONFIRMED"}
    classification = disposition_map.get(prediction, "UNKNOWN")
    
    # Get confidence
    confidence = max(probabilities) * 100
    
    # Get top contributing features
    top_features = [feature for feature, _ in feature_importance[:3]]
    
    # Generate explanation based on classification
    if classification == "CONFIRMED":
        explanation = f"Based on the analysis, this celestial body shows strong characteristics of a confirmed exoplanet with {confidence:.1f}% confidence. "
        explanation += f"The key indicators are {', '.join(top_features[:2])}. "
        explanation += "The transit signals are consistent with planetary characteristics, showing clear periodic dips in stellar brightness."
        
    elif classification == "CANDIDATE":
        explanation = f"This object shows promising signs of being an exoplanet candidate with {confidence:.1f}% confidence. "
        explanation += f"The main factors suggesting this are {', '.join(top_features[:2])}. "
        explanation += "However, additional observations or analysis may be needed to confirm its planetary nature."
        
    else:  # FALSE POSITIVE
        explanation = f"The analysis suggests this is likely a false positive with {confidence:.1f}% confidence. "
        explanation += f"The primary indicators are {', '.join(top_features[:2])}. "
        explanation += "The observed signals are more consistent with stellar variability, instrumental noise, or other astrophysical phenomena rather than planetary transits."
    
    # Add specific feature insights
    if 'koi_period' in input_data and not pd.isna(input_data['koi_period']):
        period = input_data['koi_period']
        if period < 1:
            explanation += f" The very short orbital period of {period:.2f} days is unusual for typical exoplanets."
        elif period > 1000:
            explanation += f" The long orbital period of {period:.2f} days suggests a distant orbit."
    
    if 'koi_depth' in input_data and not pd.isna(input_data['koi_depth']):
        depth = input_data['koi_depth']
        if depth < 100:
            explanation += f" The shallow transit depth of {depth:.0f} ppm suggests a small planet or grazing transit."
        elif depth > 10000:
            explanation += f" The deep transit depth of {depth:.0f} ppm indicates a large planet or stellar companion."
    
    return explanation

def create_visualization_data(df, predictions, probabilities):
    """Create data for visualization components"""
    
    # Create scatter plot data for period vs depth
    viz_data = {
        "scatter_plot": {
            "x": df['koi_period'].tolist() if 'koi_period' in df.columns else [],
            "y": df['koi_depth'].tolist() if 'koi_depth' in df.columns else [],
            "predictions": predictions.tolist(),
            "confidence": [max(prob) * 100 for prob in probabilities]
        },
        "classification_distribution": {
            "confirmed": int(np.sum(predictions == 1)),
            "candidate": int(np.sum(predictions == 0)),
            "false_positive": int(np.sum(predictions == -1))
        },
        "confidence_distribution": {
            "high_confidence": int(np.sum([max(prob) > 0.8 for prob in probabilities])),
            "medium_confidence": int(np.sum([0.6 <= max(prob) <= 0.8 for prob in probabilities])),
            "low_confidence": int(np.sum([max(prob) < 0.6 for prob in probabilities]))
        }
    }
    
    return viz_data

def create_period_depth_plot(df, predictions, probabilities):
    """Create a period vs depth scatter plot"""
    
    if 'koi_period' not in df.columns or 'koi_depth' not in df.columns:
        return None
    
    # Create color mapping for predictions
    color_map = {-1: 'red', 0: 'orange', 1: 'green'}
    colors = [color_map[pred] for pred in predictions]
    
    # Create hover text
    hover_text = []
    for i, (pred, prob) in enumerate(zip(predictions, probabilities)):
        disposition_map = {-1: "FALSE POSITIVE", 0: "CANDIDATE", 1: "CONFIRMED"}
        classification = disposition_map.get(pred, "UNKNOWN")
        confidence = max(prob) * 100
        hover_text.append(f"Classification: {classification}<br>Confidence: {confidence:.1f}%")
    
    fig = go.Figure(data=go.Scatter(
        x=df['koi_period'],
        y=df['koi_depth'],
        mode='markers',
        marker=dict(
            color=colors,
            size=8,
            opacity=0.7
        ),
        text=hover_text,
        hovertemplate='Period: %{x:.2f} days<br>Depth: %{y:.0f} ppm<br>%{text}<extra></extra>'
    ))
    
    fig.update_layout(
        title="Exoplanet Classification: Orbital Period vs Transit Depth",
        xaxis_title="Orbital Period (days)",
        yaxis_title="Transit Depth (ppm)",
        xaxis_type="log",
        yaxis_type="log",
        showlegend=False
    )
    
    return json.dumps(fig, cls=PlotlyJSONEncoder)

def create_confidence_histogram(probabilities):
    """Create a histogram of confidence scores"""
    
    confidence_scores = [max(prob) * 100 for prob in probabilities]
    
    fig = go.Figure(data=[go.Histogram(
        x=confidence_scores,
        nbinsx=20,
        marker_color='lightblue',
        opacity=0.7
    )])
    
    fig.update_layout(
        title="Distribution of Prediction Confidence Scores",
        xaxis_title="Confidence Score (%)",
        yaxis_title="Count",
        showlegend=False
    )
    
    return json.dumps(fig, cls=PlotlyJSONEncoder)

def map_disposition_to_label(disposition):
    """Map disposition string to numeric label"""
    mapping = {
        'CONFIRMED': 1,
        'CANDIDATE': 0,
        'FALSE POSITIVE': -1
    }
    return mapping.get(disposition, 0)

def get_feature_descriptions():
    """Get human-readable descriptions of features"""
    return {
        'koi_period': 'Orbital Period (days) - Time for one complete orbit',
        'koi_impact': 'Impact Parameter - How close the transit passes to star center',
        'koi_duration': 'Transit Duration (hours) - How long the transit lasts',
        'koi_depth': 'Transit Depth (ppm) - How much the star dims during transit',
        'koi_prad': 'Planetary Radius (Earth radii) - Size of the planet',
        'koi_teq': 'Equilibrium Temperature (K) - Estimated surface temperature',
        'koi_insol': 'Insolation Flux (Earth flux) - Amount of stellar energy received',
        'koi_model_snr': 'Transit Signal-to-Noise - Quality of the transit signal',
        'koi_steff': 'Stellar Effective Temperature (K) - Temperature of the host star',
        'koi_slogg': 'Stellar Surface Gravity - Surface gravity of the host star',
        'koi_srad': 'Stellar Radius (Solar radii) - Size of the host star',
        'koi_kepmag': 'Kepler-band Magnitude - Brightness of the star in Kepler band',
        'koi_fpflag_nt': 'Not Transit-Like Flag - Indicates non-transit-like behavior',
        'koi_fpflag_ss': 'Stellar Eclipse Flag - Indicates stellar eclipse rather than planet',
        'koi_fpflag_co': 'Centroid Offset Flag - Indicates source of signal is offset',
        'koi_fpflag_ec': 'Ephemeris Match Flag - Indicates contamination from other source'
    }
