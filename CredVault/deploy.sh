#!/bin/bash

# Deployment script for CredVault program to Solana Devnet

set -e  # Exit on any error

echo "Starting deployment of CredVault program to Solana Devnet..."

# Check if we're on the correct Solana cluster
echo "Current Solana cluster: $(solana config get | grep 'RPC URL')"

# Check if the Solana wallet is set up
if ! solana address > /dev/null 2>&1; then
    echo "Error: Solana wallet not configured. Please run 'solana config set' first."
    exit 1
fi

# Verify we're on devnet
if [[ "$(solana config get | grep 'RPC URL' | grep -o 'devnet')" != "devnet" ]]; then
    echo "Setting Solana cluster to devnet..."
    solana config set --url https://api.devnet.solana.com
fi

# Build the program
echo "Building the program..."
anchor build

echo "Program built successfully!"

# Deploy to devnet
echo "Deploying to Solana Devnet..."
anchor deploy --provider.cluster devnet

echo "Deployment completed successfully!"

# Show the deployed program ID
PROGRAM_ID=$(solana program show --verbose | grep -A 1 "credVault" | tail -1 | awk '{print $1}')
if [ ! -z "$PROGRAM_ID" ]; then
    echo "Deployed Program ID: $PROGRAM_ID"
    
    # Update Anchor.toml with the new program ID
    sed -i "s/YOUR_DEPLOYED_PROGRAM_ID_HERE/$PROGRAM_ID/g" Anchor.toml
    echo "Updated Anchor.toml with new program ID"
fi

echo "Deployment process completed!"