# CredVault Deployment Configuration

## Anchor.toml (Updated)
```toml
[features]
seeds = false
[programs.devnet]
credVault = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"

[registry]
url = "https://anchor.projectserum.com"

[provider]
cluster = "devnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

## Package.json Scripts
```json
{
  "scripts": {
    "build": "anchor build",
    "deploy": "anchor deploy",
    "test": "anchor test",
    "dev": "next dev",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## Deployment Commands

### For Anchor Program:
```bash
# Build the program
anchor build

# Deploy to Devnet
anchor deploy --provider.cluster devnet

# Run tests
anchor test
```

### For Frontend:
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_SOLANA_RPC_HOST=https://api.devnet.solana.com
NEXT_PUBLIC_CREDVAULT_PROGRAM_ID=your_program_id_here
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_infura_project_secret
NEXT_PUBLIC_ISSUER_PUBLIC_KEY=your_issuer_public_key
```

### Anchor Environment
Make sure you have Solana CLI and Anchor installed:
```bash
# Install Solana
sh -c "$(curl -sSfL https://release.solana.com/v1.16.12/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

## Deployment Steps

1. **Setup Solana CLI and Wallet**:
   ```bash
   solana config set --url devnet
   solana-keygen new
   ```

2. **Airdrop SOL for Devnet Deployment**:
   ```bash
   solana airdrop 2
   ```

3. **Build and Deploy the Program**:
   ```bash
   anchor build
   anchor deploy --provider.cluster devnet
   ```

4. **Update Frontend Environment Variables**:
   - Update NEXT_PUBLIC_CREDVAULT_PROGRAM_ID with the deployed program ID
   - Update other configuration values as needed

5. **Deploy Frontend**:
   - Host on Vercel, Netlify, or your preferred hosting platform
   - Ensure environment variables are set in your deployment environment

## Verification Steps

1. **Test Program Deployment**:
   ```bash
   anchor test
   ```

2. **Check Program on Explorer**:
   - Visit Solana Explorer with your program ID
   - Verify the program is deployed and functional

3. **Test Frontend Connection**:
   - Connect wallet and verify it can interact with the program
   - Test minting and verification functions

## Security Best Practices

- Never commit private keys or sensitive information
- Use environment variables for configuration
- Verify the program ID in production environments
- Test all functions on Devnet before Mainnet deployment
- Implement proper access controls and validation checks