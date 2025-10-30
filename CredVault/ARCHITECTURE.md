# CredVault System Architecture

## Overview
CredVault is a decentralized credentialing and employment network for Nigerian and African youth built on Solana. The system enables training organizations, hackathon programs, and employers to issue on-chain skill credentials and proof-of-work NFTs to users.

## High-Level Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Issuer        │    │                  │    │   Employer       │
│ (Training Org,  │    │                  │    │    /Verifier)    │
│ Hackathon,      │    │                  │    │                  │
│ Employer)       │    │                  │    │                  │
└─────────┬───────┘    │  Solana Network  │    └─────────┬────────┘
          │            │                  │              │
          │            └─────────┬────────┘              │
          │                      │                       │
          │                ┌─────▼─────┐                 │
         ┌▼─────────────────┤  CredVault│─────────────────▼┐
         │                  │  Program  │                  │
         │                  └───────────┘                  │
         │                                                 │
         │                    ┌─────────┐                  │
         │                    │  IPFS   │                  │
         │                    │ Storage │                  │
         │                    └─────────┘                  │
         │         ┌─────────────────────────┐             │
         └─────────┤   Next.js Application   ├─────────────┘
                   └─────────────────────────┘
```

## User Roles & Components

### 1. Issuer (Training Organizations, Hackathons, Employers)
- Can issue credentials to users
- Has verified status on the platform
- Can mint NFTs representing credentials
- Can manage their issued credentials

### 2. Youth/User (Learner)
- Can receive credentials from issuers
- Can showcase credentials in their profile
- Can grant verification access to employers
- Can manage their credential portfolio

### 3. Employer/Verifier
- Can verify credentials issued to users
- Can access verified credential information
- Can browse credentials for recruitment
- Can report invalid credentials

## Data Flow for Credential Minting

1. **Issuer Initiates Credential Issuance**
   - Issuer connects wallet to the platform
   - Issuer specifies recipient (public key) and credential details
   - Frontend calls Anchor program to initialize the credential account

2. **Credential Metadata Creation**
   - Credential details are formatted as JSON metadata
   - Metadata includes credential name, description, image URL, attributes
   - Metadata is uploaded to IPFS
   - IPFS hash is stored as the credential URI

3. **NFT Minting**
   - Anchor program creates a new mint account for the credential
   - Metadata account is created using the IPFS URI
   - Master edition is created to ensure the credential is non-transferable (Soulbound)
   - Credential account state is updated on-chain

4. **Credential Assignment**
   - Credential NFT is assigned to the user's wallet
   - On-chain record links the credential to both issuer and recipient
   - Event is emitted for frontend updates

## Data Flow for Credential Verification

1. **Verification Request**
   - Employer specifies user and credential to verify
   - Frontend checks on-chain state for credential validity
   - IPFS metadata is retrieved for credential details

2. **On-Chain Verification**
   - Smart contract verifies:
     - Credential account exists
     - Credential has not been revoked
     - Credential was issued by a verified issuer
     - Signature/ownership verification

3. **Verification Response**
   - Verified credential data is returned to the employer
   - Verification status is recorded on-chain
   - Employer can view credential details and issuer information

## Storage Structure

### On-Chain Data (Solana)
```
CredentialAccount:
├── owner: PublicKey (user who owns the credential)
├── issuer: PublicKey (organization that issued the credential) 
├── credential_data: String (serialized credential data)
├── issued_at: i64 (timestamp when issued)
├── bump: u8 (PDA bump seed)
└── status: u8 (0=active, 1=revoked, 2=expired)
```

### Off-Chain Data (IPFS)
```
Credential Metadata:
├── name: string (credential name)
├── description: string (credential description)
├── image: string (IPFS URI to credential image)
├── attributes: array
│   ├── trait_type: string (e.g., "Skill", "Level", "Category")
│   └── value: string (e.g., "JavaScript", "Intermediate", "Programming")
├── properties: object (additional credential-specific properties)
└── external_url: string (optional link to more info)
```

## Recommended File Structure

```
CredVault/
├── programs/                    # Anchor programs
│   └── credVault/
│       ├── src/
│       │   └── lib.rs          # Main program logic
│       ├── Cargo.toml          # Program dependencies
│       └── Xargo.toml          # Cross-compilation settings
├── migrations/                  # Deployment scripts
├── tests/                       # Program tests
├── target/                      # Compiled programs
├── Anchor.toml                 # Anchor configuration
├── app/                        # Next.js frontend
│   ├── public/                 # Static assets
│   ├── components/             # React components
│   │   ├── AuthProvider.tsx    # Authentication context
│   │   ├── WalletConnection.tsx # Wallet connection UI
│   │   ├── Header.tsx          # Navigation header
│   │   └── ...                 # Other components
│   ├── pages/                  # Next.js pages
│   │   ├── index.tsx           # Home page
│   │   ├── profile.tsx         # User profile
│   │   ├── credentials.tsx     # Credentials page
│   │   ├── dashboard.tsx       # Employer dashboard
│   │   └── ...                 # Other pages
│   ├── styles/                 # CSS styles
│   │   ├── globals.css         # Global styles
│   │   ├── Home.module.css     # Page-specific styles
│   │   └── Header.module.css   # Component styles
│   └── lib/                    # Utility functions
│       ├── solana.ts           # Solana utilities
│       ├── credentialSchema.ts # Credential data structures
│       └── credVault.ts        # Program IDL
├── idl/                        # Interface Description Language files
├── scripts/                    # Deployment and utility scripts
└── package.json               # Node.js dependencies
```

## Component Interactions

### Frontend Components
- `AuthProvider`: Manages user authentication state
- `WalletConnection`: Handles wallet connection logic
- `Header`: Navigation and wallet status display
- `CredentialsList`: Displays user's credentials
- `CredentialCard`: Individual credential display
- `IssuerDashboard`: For credential issuance management
- `EmployerDashboard`: For credential verification

### Smart Contract Functions
- `initialize_credential_account`: Set up a new credential account
- `issue_credential`: Issue a new credential NFT with metadata
- `revoke_credential`: Revoke an existing credential
- `verify_credential`: Verify a credential's authenticity
- `update_credential`: Update credential information (issuer only)

## Security Considerations

1. **Issuer Verification**: Only verified organizations can issue credentials
2. **Soulbound Tokens**: Credentials are non-transferable to prevent fraud
3. **Immutable Records**: On-chain credential records cannot be altered
4. **Access Control**: Employers can only verify credentials with user permission
5. **Metadata Integrity**: IPFS ensures metadata cannot be tampered with

## Scalability Features

1. **PDA-based Accounts**: Use Program Derived Addresses for efficient storage
2. **Metadata Offloading**: Store detailed metadata on IPFS to reduce chain costs
3. **Event-based Updates**: Use Solana events for real-time frontend updates
4. **Batch Operations**: Support for bulk credential issuance when needed

This architecture provides a robust, scalable foundation for CredVault that enables verifiable credentials for African youth while maintaining security and decentralization.