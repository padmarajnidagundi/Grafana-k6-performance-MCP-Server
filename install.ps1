# One-click installation script for Windows PowerShell
# Usage: Right-click and run with PowerShell, or run: ./install.ps1

Write-Host "Installing Node.js dependencies..."
npm install

Write-Host "Building the project..."
npm run build

Write-Host "Checking for k6 installation..."
if (-not (Get-Command k6 -ErrorAction SilentlyContinue)) {
    Write-Host "k6 not found. Installing k6 via Chocolatey..."
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "Chocolatey not found. Please install k6 manually: https://k6.io/docs/get-started/installation/"
    } else {
        choco install k6 -y
    }
} else {
    Write-Host "k6 is already installed."
}

Write-Host "Setup complete! To start the server, run:"
Write-Host "node build/index.js"
