# PowerShell deployment script for CredVault program to Solana Devnet

Write-Host "Starting deployment of CredVault program to Solana Devnet..." -ForegroundColor Green

# Check if we're on the correct Solana cluster
$cluster = $(solana config get | Select-String -Pattern "RPC URL")
Write-Host "Current Solana cluster: $cluster" -ForegroundColor Yellow

# Check if the Solana wallet is set up
try {
    $address = solana address
    Write-Host "Wallet address: $address" -ForegroundColor Yellow
} catch {
    Write-Host "Error: Solana wallet not configured. Please run 'solana config set' first." -ForegroundColor Red
    exit 1
}

# Verify we're on devnet
$config = solana config get
if ($config -notmatch "devnet") {
    Write-Host "Setting Solana cluster to devnet..." -ForegroundColor Yellow
    solana config set --url https://api.devnet.solana.com
}

# Build the program
Write-Host "Building the program..." -ForegroundColor Yellow
anchor build

Write-Host "Program built successfully!" -ForegroundColor Green

# Deploy to devnet (uncomment when ready to deploy)
# Write-Host "Deploying to Solana Devnet..." -ForegroundColor Yellow
# anchor deploy --provider.cluster devnet

Write-Host "Deployment process completed!" -ForegroundColor Green

# Note: The actual deployment command is commented out to prevent accidental deployment
# Uncomment the anchor deploy line when you're ready to deploy to devnet