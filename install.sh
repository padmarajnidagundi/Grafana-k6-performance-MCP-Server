#!/bin/bash
# One-click installation script for Grafana k6 Performance MCP Server
# Usage: bash install.sh

set -e

echo "Installing Node.js dependencies..."
npm install

echo "Building the project..."
npm run build

echo "Checking for k6 installation..."
if ! command -v k6 &> /dev/null; then
  echo "k6 not found. Installing k6..."
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux install
    sudo gpg -k
    sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
    echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
    sudo apt-get update
    sudo apt-get install -y k6
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS install
    brew install k6
  else
    echo "Please install k6 manually: https://k6.io/docs/get-started/installation/"
  fi
else
  echo "k6 is already installed."
fi

echo "Setup complete! To start the server, run:"
echo "node build/index.js"
