# CredVault API Specification

This document outlines the API endpoints and data structures for the CredVault platform.

## Smart Contract (Anchor Program) Endpoints

### Credential Account Management

#### `initialize_credential_account`
- **Purpose**: Initialize a new credential account for a user
- **Accounts Required**:
  - `credential_account` (PDA): New credential account to be created
  - `user` (Signer): Wallet of the credential owner
  - `system_program`: Solana system program
- **Arguments**:
  - `bump` (u8): Bump seed for PDA
- **Returns**: Initialized CredentialAccount with basic fields

#### `issue_credential`
- **Purpose**: Issue a new credential NFT to a user
- **Accounts Required**:
  - `credential_account`: Existing credential account
  - `issuer` (Signer): Wallet of the issuing organization
  - `token_metadata`: Metadata account for the credential NFT
  - `credential_mint`: Mint account for the credential token
  - `credential_token_account`: Token account for the credential
  - `master_edition`: Master edition account for the NFT
  - `metadata_program`: Metaplex metadata program
  - `token_program`: SPL token program
  - `system_program`: Solana system program
  - `rent`: Rent sysvar
  - `associated_token_program`: Associated token program
- **Arguments**:
  - `credential_data` (String): Serialized credential data
  - `credential_name` (String): Name of the credential
  - `credential_symbol` (String): Symbol for the credential
  - `credential_uri` (String): URI to credential metadata on IPFS
- **Returns**: Credential issued with on-chain record

#### `revoke_credential`
- **Purpose**: Revoke a previously issued credential
- **Accounts Required**:
  - `credential_account`: Credential account to revoke
  - `issuer` (Signer): Original issuer of the credential
- **Arguments**: None
- **Returns**: Credential status updated to revoked

#### `verify_credential`
- **Purpose**: Verify the authenticity of a credential
- **Accounts Required**:
  - `credential_account`: Credential account to verify
  - `verifier` (Signer): Entity attempting verification
- **Arguments**: None
- **Returns**: Verification status and credential details

## Frontend API Endpoints (Next.js API Routes)

### Authentication Endpoints

#### `POST /api/auth/connect`
- **Purpose**: Handle wallet connection
- **Request Body**:
```json
{
  "publicKey": "String"
}
```
- **Response**:
```json
{
  "success": true,
  "user": {
    "publicKey": "String",
    "connected": true,
    "profile": "UserProfile Object"
  }
}
```

#### `POST /api/auth/disconnect`
- **Purpose**: Handle wallet disconnection
- **Response**:
```json
{
  "success": true
}
```

### Credential Management Endpoints

#### `GET /api/credentials`
- **Purpose**: Retrieve user's credentials
- **Query Parameters**:
  - `publicKey`: User's public key (optional, defaults to current user)
- **Response**:
```json
{
  "credentials": [
    {
      "id": "String",
      "name": "String",
      "issuer": "String",
      "type": "CredentialType",
      "issuedAt": "Number",
      "status": "String",
      "metadataUri": "String"
    }
  ]
}
```

#### `POST /api/credentials`
- **Purpose**: Issue a new credential (Issuer only)
- **Request Body**:
```json
{
  "recipientPublicKey": "String",
  "credentialData": {
    "name": "String",
    "description": "String",
    "type": "CredentialType",
    "image": "String", // IPFS URI
    "attributes": [
      {
        "trait_type": "String",
        "value": "String"
      }
    ]
  }
}
```
- **Response**:
```json
{
  "success": true,
  "credentialId": "String",
  "transactionSignature": "String"
}
```

#### `GET /api/credentials/:id`
- **Purpose**: Get specific credential details
- **Response**:
```json
{
  "id": "String",
  "owner": "String",
  "issuer": "String",
  "name": "String",
  "description": "String",
  "type": "CredentialType",
  "issuedAt": "Number",
  "expiresAt": "Number",
  "status": "CredentialStatus",
  "metadataUri": "String",
  "proofOfWork": "ProofOfWork Object"
}
```

### User Profile Endpoints

#### `GET /api/profile/:publicKey`
- **Purpose**: Get user profile
- **Response**:
```json
{
  "publicKey": "String",
  "displayName": "String",
  "email": "String",
  "avatar": "String",
  "bio": "String",
  "location": "String",
  "website": "String",
  "twitter": "String",
  "github": "String",
  "credentials": "Array of UserCredential",
  "verificationLevel": "Number"
}
```

#### `PUT /api/profile`
- **Purpose**: Update user profile
- **Request Body**:
```json
{
  "displayName": "String",
  "bio": "String",
  "location": "String",
  "website": "String",
  "twitter": "String",
  "github": "String"
}
```
- **Response**:
```json
{
  "success": true,
  "profile": "Updated UserProfile"
}
```

### Employer/Verification Endpoints

#### `POST /api/verify`
- **Purpose**: Request verification of a credential
- **Request Body**:
```json
{
  "credentialId": "String",
  "targetPublicKey": "String", // Whose credential to verify
  "requesterPublicKey": "String" // Who is requesting verification
}
```
- **Response**:
```json
{
  "success": true,
  "verificationId": "String",
  "status": "VerificationRequestStatus"
}
```

#### `GET /api/verify/:id`
- **Purpose**: Get verification result
- **Response**:
```json
{
  "id": "String",
  "credentialId": "String",
  "verified": "Boolean",
  "verifiedAt": "Number",
  "verifierPublicKey": "String",
  "verificationMethod": "VerificationMethod",
  "confidenceScore": "Number"
}
```

## Data Structures

### Credential Data Structure
```typescript
interface BaseCredential {
  id: string;
  owner: string; // Public key of the credential owner
  issuer: string; // Public key of the issuing organization
  name: string;
  description: string;
  type: CredentialType;
  issuedAt: number; // Unix timestamp
  expiresAt?: number; // Optional expiration timestamp
  status: CredentialStatus;
  metadataUri?: string; // URI to additional metadata
  proofOfWork?: ProofOfWork; // For proof-of-work credentials
}

interface ProofOfWork {
  projectId: string;
  projectName: string;
  projectDescription: string;
  projectUrl?: string;
  repositoryUrl?: string;
  artifacts: Artifact[];
  completionDate: number; // Unix timestamp
}

interface Artifact {
  type: ArtifactType;
  name: string;
  uri: string; // Link to the artifact
  description?: string;
}

enum CredentialType {
  SKILL = 'skill',
  CERTIFICATION = 'certification',
  ACHIEVEMENT = 'achievement',
  PROOF_OF_WORK = 'proof-of-work',
  HACKATHON = 'hackathon',
  TRAINING = 'training',
}

enum CredentialStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

interface CredentialMetadata {
  name: string;
  description: string;
  image: string; // URI to credential image
  attributes: Attribute[];
  properties?: any; // Additional properties specific to the credential type
}

interface Attribute {
  trait_type: string;
  value: string;
}
```

### User and Organization Structures
```typescript
interface UserProfile {
  publicKey: string;
  displayName?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  github?: string;
  credentials: UserCredential[];
  verificationLevel: VerificationLevel;
}

interface UserCredential {
  id: string;
  type: CredentialType;
  name: string;
  issuer: string;
  issuedAt: number;
  status: string;
  metadataUri?: string;
}

interface TrainingOrganization {
  publicKey: string;
  organizationName: string;
  description: string;
  website?: string;
  registeredCredentials: number;
  verificationLevel: VerificationLevel;
}

enum VerificationLevel {
  UNVERIFIED = 0,
  VERIFIED = 1,
  PREMIUM = 2,
  OFFICIAL = 3,
}
```

### Verification Structures
```typescript
interface VerificationRequest {
  id: string;
  credentialId: string;
  requesterPublicKey: string; // Who is requesting verification
  targetPublicKey: string; // Whose credential is being verified
  requestedAt: number;
  status: VerificationRequestStatus;
  result?: VerificationResult;
}

enum VerificationRequestStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

interface VerificationResult {
  verified: boolean;
  verifiedAt: number;
  verifierPublicKey: string;
  verificationMethod: VerificationMethod;
  confidenceScore?: number; // 0-100 percentage
  details?: string;
}

enum VerificationMethod {
  MANUAL = 'manual',
  AUTOMATED = 'automated',
  BLOCKCHAIN = 'blockchain',
  THIRD_PARTY = 'third_party',
}
```

## Error Handling

All API responses follow this standard error format:

```json
{
  "error": {
    "code": "String",
    "message": "String",
    "details": "Object" // Optional additional error details
  }
}
```

### Common Error Codes
- `INVALID_INPUT`: Request data is malformed or missing required fields
- `UNAUTHORIZED`: User lacks required permissions for the requested action
- `NOT_FOUND`: Requested resource does not exist
- `ALREADY_EXISTS`: Attempting to create a resource that already exists
- `BLOCKCHAIN_ERROR`: Error occurred during blockchain transaction
- `STORAGE_ERROR`: Error occurred during IPFS storage operation
- `VERIFICATION_FAILED`: Credential verification failed