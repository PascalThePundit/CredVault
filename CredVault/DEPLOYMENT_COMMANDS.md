# Deployment Configuration and Commands for CredVault

## Environment Variables (.env)

```
# Solana Configuration
SOLANA_CLUSTER=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_COMMITMENT=confirmed

# Program Configuration
PROGRAM_ID_DEVELOPMENT=Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS
PROGRAM_ID_DEVNET=YOUR_DEPLOYED_PROGRAM_ID_HERE
PROGRAM_ID_MAINNET=

# Wallet Configuration
WALLET_PRIVATE_KEY=

# IPFS Configuration (for credential metadata)
IPFS_API_KEY=
IPFS_API_SECRET=
IPFS_GATEWAY=https://ipfs.io/ipfs/

# Arweave Configuration
ARWEAVE_GATEWAY=https://arweave.net/

# Frontend Configuration
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=YOUR_DEPLOYED_PROGRAM_ID_HERE
NEXT_PUBLIC_COMMITMENT=confirmed
NEXT_PUBLIC_WALLET_ADAPTER_NETWORK=devnet
NEXT_PUBLIC_CREDENTIAL_METADATA_GATEWAY=https://arweave.net/
```

## Deployment Commands

### Prerequisites
1. Install Rust: https://rustup.rs/
2. Install Solana CLI tools:
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
   ```
   On Windows:
   ```cmd
   cmd /c "curl -sSfL https://release.solana.com/stable/solana-release-x86_64-pc-windows-msvc-install.ps1 | powershell -command -"
   ```

3. Install Anchor:
   ```bash
   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
   avm install latest
   avm use latest
   ```

4. Install Solana SBF build tools:
   ```bash
   rustup target add wasm32-unknown-unknown
   cargo install cargo-build-sbf
   ```

5. Configure Solana:
   ```bash
   solana config set --url https://api.devnet.solana.com
   solana-keygen new --outfile ~/.config/solana/id.json
   ```

### Local Development Deployment
```bash
# Start local validator
solana-test-validator

# In another terminal, deploy to local cluster
anchor deploy
```

### Devnet Deployment
```bash
# Check wallet balance
solana balance

# Request airdrop if needed (devnet only)
solana airdrop 2

# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Verify deployment
solana program show [PROGRAM_ID]
```

### Verification and Testing
```bash
# Run program tests
anchor test --provider.cluster devnet

# Run frontend tests
npm run test-frontend
```

## Deployment Configuration Files

### Anchor.toml
```
[toolchain]
anchor_version = "0.30.1"

[features]
seeds = false

[programs.devnet]
credVault = "YOUR_DEPLOYED_PROGRAM_ID_HERE"

[registry]
url = "https://anchor.projectserum.com"

[provider]
cluster = "devnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.test.ts"
```

### Package.json Scripts
```
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.test.ts",
    "test-frontend": "node tests/frontend.test.js",
    "deploy-local": "solana-test-validator & anchor deploy",
    "deploy-devnet": "anchor deploy --provider.cluster devnet",
    "verify": "solana program show $(grep -o '\"credVault\" = \"[^\"]*' Anchor.toml | cut -d'\"' -f4)"
  }
}
```

## Deployment Checklist

- [ ] Verify sufficient SOL balance for deployment
- [ ] Confirm correct program ID in Anchor.toml
- [ ] Test all program functions locally first
- [ ] Run full test suite before deployment
- [ ] Update frontend with new program ID after deployment
- [ ] Verify deployment on Solana Explorer
- [ ] Update documentation with new deployment details

## Post-Deployment Verification

1. Check program status:
   ```bash
   solana program show [PROGRAM_ID]
   ```

2. Verify all program functions work correctly
3. Update frontend configuration with new program ID
4. Test credential minting and verification workflows
5. Ensure proper error handling and security checks

## Frontend Configuration

1. Configure environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   NEXT_PUBLIC_SOLANA_CLUSTER=devnet
   NEXT_PUBLIC_COMMITMENT=confirmed
   NEXT_PUBLIC_WALLET_ADAPTER_NETWORK=devnet
   NEXT_PUBLIC_PROGRAM_ID=YOUR_DEPLOYED_PROGRAM_ID_HERE
   NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
   NEXT_PUBLIC_CREDENTIAL_METADATA_GATEWAY=https://arweave.net/
   ```

2. Install frontend dependencies:
   ```bash
   cd CredVault
   npm install
   ```

3. Start the frontend:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:3000