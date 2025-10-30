# CredVault Payment & Storage System

This document outlines the implementation of the payment system using Solana Pay and the storage layer using IPFS for the CredVault platform.

## 🚀 Features

### Payment System
- **Solana Pay Integration**: Accept payments in SOL for minting and verification
- **Mint Fee**: 0.05 SOL fee for minting each credential
- **Verification Fee**: Optional fee for employers to verify candidate credentials
- **Payment Portal**: Solana Pay QR codes for easy payment processing
- **Premium Verification**: Employers can pay to see verified skills & NFTs

### Storage Layer (IPFS)
- **Credential Metadata**: Store credential data in standardized JSON format
- **Project NFTs**: Store project metadata with images and links
- **IPFS Integration**: Upload and retrieve utility functions
- **Decentralized Storage**: All credential data stored on IPFS for immutability

## 📁 Project Structure

```
services/
├── paymentService.ts      # Solana Pay integration
├── ipfsService.ts         # IPFS upload/retrieve functionality
├── credVaultService.ts    # Updated service with payment & storage
└── ...
components/
├── SolanaPayQR.tsx        # Solana Pay QR code component
├── EmployerVerificationPortal.tsx  # Verification with payment
└── ...
```

## 🛠️ Implementation Details

### Payment System

#### Mint Fee Payment
- When an issuer mints a credential, they pay a small minting fee (default 0.05 SOL)
- Payment is processed before the credential is minted
- Fee can be customized via environment variables

#### Verification Fee Payment
- Employers can pay in SOL to verify candidate credentials
- Optional premium feature for enhanced verification
- Fee amount configurable per verification

#### Solana Pay Integration
```typescript
// Example usage for minting payment
import { solanaPayService } from '../services/paymentService';

const handleMintingPayment = async (issuer: PublicKey, mintFee: number) => {
  const paymentParams: MintFeePayment = {
    issuer,
    mintFee,
  };
  
  const signature = await solanaPayService.processMintFeePayment(
    paymentParams,
    issuerKeypair
  );
  
  return signature;
};
```

### Storage System (IPFS)

#### Credential Metadata
```typescript
interface CredentialMetadata {
  name: string;
  description: string;
  image: string; // IPFS URI to credential image
  attributes: Attribute[];
  issuerName: string;
  issuerPublicKey: string;
  skillName: string;
  issueDate: string;
  credentialType: string;
  version: string;
}
```

#### Proof of Work Metadata
```typescript
interface ProofOfWorkMetadata {
  name: string;
  description: string;
  image: string; // IPFS URI to project image
  attributes: Attribute[];
  projectTitle: string;
  projectDescription: string;
  githubLink: string;
  demoLink: string;
  studentPublicKey: string;
  timestamp: string;
  version: string;
}
```

#### IPFS Integration
```typescript
// Example usage for uploading credential metadata
import { uploadCredentialToIPFS } from '../services/ipfsService';

const uploadCredential = async (credentialData: Omit<CredentialMetadata, 'version'>) => {
  const metadataUri = await uploadCredentialToIPFS(credentialData);
  return metadataUri; // Returns IPFS URI like "ipfs://Qm..."
};
```

## 🧾 Payment Flow

1. **Issuer initiates credential minting**
2. **System requests payment of minting fee**
3. **Issuer pays via Solana Pay QR or wallet**
4. **Payment confirmation**
5. **Credential minted to blockchain with IPFS URI**

1. **Employer initiates candidate verification**
2. **System requests payment of verification fee**
3. **Employer pays via Solana Pay**
4. **Payment confirmation**
5. **Access to candidate's credentials and NFTs granted**

## 📦 Dependencies

```json
{
  "dependencies": {
    "@solana/spl-token": "^0.4.8",
    "ipfs-http-client": "^60.0.1",
    "qrcode.react": "^3.1.0",
    "bs58": "^5.0.0"
  }
}
```

## 🚀 Setup Instructions

### Environment Variables
Add the following to your `.env.local`:
```env
NEXT_PUBLIC_INFURA_PROJECT_ID=your_infura_project_id
NEXT_PUBLIC_INFURA_PROJECT_SECRET=your_infura_project_secret
NEXT_PUBLIC_CREDVAULT_PROGRAM_ID=your_program_id
NEXT_PUBLIC_SOLANA_RPC_HOST=https://api.devnet.solana.com
```

### Running the Application
1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Access the application at `http://localhost:3000`

## 🛡️ Security Considerations

- Payment transactions are secured with Solana's blockchain technology
- IPFS content is immutable once stored
- Credential URIs are stored on-chain ensuring authenticity
- All sensitive operations require wallet authentication

## 📊 Usage

- **Issuers**: Pay minting fees when creating credentials
- **Students**: Can mint proof-of-work NFTs without fees
- **Employers**: Pay verification fees to access candidate data
- **Verification**: Premium feature with payment requirement