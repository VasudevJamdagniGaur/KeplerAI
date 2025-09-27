#!/usr/bin/env python3
"""
Test script to verify KeplerAI servers are running
"""

import requests
import time
import webbrowser

def test_servers():
    print("🚀 Testing KeplerAI Application...")
    print("=" * 50)
    
    # Test React Frontend
    print("1. Testing React Frontend (http://localhost:3000)...")
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("✅ React Frontend is running!")
        else:
            print(f"❌ React Frontend returned status: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ React Frontend is not running")
    except Exception as e:
        print(f"❌ Error testing React Frontend: {e}")
    
    # Test Flask Backend
    print("\n2. Testing Flask Backend (http://localhost:5000)...")
    try:
        response = requests.get("http://localhost:5000", timeout=5)
        if response.status_code == 200:
            print("✅ Flask Backend is running!")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Flask Backend returned status: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Flask Backend is not running")
    except Exception as e:
        print(f"❌ Error testing Flask Backend: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Application Status:")
    
    # Check if both servers are running
    frontend_running = False
    backend_running = False
    
    try:
        requests.get("http://localhost:3000", timeout=2)
        frontend_running = True
    except:
        pass
    
    try:
        requests.get("http://localhost:5000", timeout=2)
        backend_running = True
    except:
        pass
    
    if frontend_running and backend_running:
        print("🎉 SUCCESS! Both servers are running!")
        print("🌐 Opening application in browser...")
        webbrowser.open("http://localhost:3000")
    elif frontend_running:
        print("⚠️  Only React Frontend is running")
        print("🔧 Please start the Flask backend: cd backend && py app.py")
    elif backend_running:
        print("⚠️  Only Flask Backend is running")
        print("🔧 Please start the React frontend: cd frontend && npm start")
    else:
        print("❌ Neither server is running")
        print("🔧 Please run: start_servers.bat")
    
    print("\n📋 Manual Start Commands:")
    print("   Frontend: cd frontend && npm start")
    print("   Backend:  cd backend && py app.py")

if __name__ == "__main__":
    test_servers()
