#!/bin/bash

# Function to activate virtual environment
activate_venv() {
    source venv/bin/activate
}
# Function to deactivate virtual environment
deactivate_venv() {
    deactivate
}
cd "$(dirname "$0")"
echo "Current directory: $(pwd)"

# Create virtual environment and install dependencies
echo "Setting up virtual environment and installing dependencies..."
python3 -m venv venv
activate_venv
pip install -r Shap/requirements.txt

echo "Current directory: $(pwd)"
# Start Flask server in Shap directory
echo "Starting Flask server..."
(cd Shap && nohup python3 shap_values_gen.py &)
deactivate_venv

echo "Current directory: $(pwd)"
## Clone ATMSeer repository
echo "Cloning ATMSeer repository..."
git clone https://github.com/RohanAwhad/atmseer_fork.git ATMSeer
## Run install.sh in ATMSeer directory
echo "Running install.sh in ATMSeer directory..."
(cd ATMSeer && nohup sh install-docker-clean.sh &)

echo "Current directory: $(pwd)"
# Start Python HTTP server in frontend/dist directory
echo "Starting Python HTTP server in frontend/dist directory..."
(cd frontend/dist && nohup python3 -m http.server 8888 &)

# Open localhost:8888 in the default web browser
echo "Launching localhost:8888... on your default browser"
echo "If this doesn't workout please manually open localhost:8888 in Chrome "
sleep 15  # Wait for servers to start
xdg-open http://localhost:8888  # Adjust for your system's default web browser
