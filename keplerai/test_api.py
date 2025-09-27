#!/usr/bin/env python3
"""
Simple test script to verify KeplerAI API is working
"""

import requests
import json
import time

def test_api():
    """Test the KeplerAI API endpoints"""
    
    # Wait a moment for the server to start
    print("Waiting for server to start...")
    time.sleep(3)
    
    base_url = "http://localhost:5000"
    
    # Test 1: Check if API is running
    print("\n1. Testing API status...")
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✓ API is running!")
            print(f"Response: {response.json()}")
        else:
            print(f"✗ API returned status code: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to API. Make sure the Flask server is running.")
        return False
    
    # Test 2: Check model info
    print("\n2. Testing model info...")
    try:
        response = requests.get(f"{base_url}/model_info")
        if response.status_code == 200:
            data = response.json()
            print("✓ Model info retrieved!")
            print(f"Model trained: {data.get('is_trained', False)}")
            print(f"Feature columns: {len(data.get('feature_columns', []))}")
        else:
            print(f"✗ Model info failed: {response.status_code}")
    except Exception as e:
        print(f"✗ Error getting model info: {e}")
    
    # Test 3: Test prediction with sample data
    print("\n3. Testing prediction...")
    sample_data = {
        "koi_period": 10.5,
        "koi_impact": 0.3,
        "koi_duration": 2.5,
        "koi_depth": 500,
        "koi_prad": 1.2,
        "koi_teq": 300,
        "koi_insol": 1.0,
        "koi_model_snr": 15.0,
        "koi_steff": 5500,
        "koi_slogg": 4.5,
        "koi_srad": 1.0,
        "koi_kepmag": 12.0,
        "koi_fpflag_nt": 0,
        "koi_fpflag_ss": 0,
        "koi_fpflag_co": 0,
        "koi_fpflag_ec": 0
    }
    
    try:
        response = requests.post(f"{base_url}/predict", json=sample_data)
        if response.status_code == 200:
            data = response.json()
            print("✓ Prediction successful!")
            print(f"Classification: {data.get('classification', 'Unknown')}")
            print(f"Confidence: {data.get('confidence_score', 0)}%")
            print(f"Explanation: {data.get('ai_explanation', 'No explanation')[:100]}...")
        else:
            print(f"✗ Prediction failed: {response.status_code}")
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"✗ Error making prediction: {e}")
    
    print("\n" + "="*50)
    print("API testing completed!")
    print("If all tests passed, your KeplerAI application is ready!")
    print("Open http://localhost:3000 in your browser to use the web interface.")

if __name__ == "__main__":
    test_api()
