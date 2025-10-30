# CredVault Smart Contract Documentation

## Overview

The CredVault smart contract is an Anchor program that enables the creation and management of verifiable credentials and proof-of-work NFTs on the Solana blockchain. The contract allows verified issuers to mint credentials to students, and students to mint proof-of-work NFTs representing completed projects or hackathon work.

## Core Concepts

### Soulbound Tokens (SBTs)
- Non-transferable tokens representing credentials
- Tied permanently to the recipient's wallet
- Prevents credential fraud and unauthorized transfers

### Proof-of-Work NFTs
- Transferable NFTs representing completed projects
- Created by students to showcase their work
- Include project details like GitHub and demo links

### Key Actors
- **Issuer**: Verified organizations that can mint credentials
- **Student**: Recipient of credentials and creator of proof-of-work NFTs
- **Verifier**: Entities that can verify credential authenticity

## Program Instructions

### `initialize_issuer`
Initializes an issuer account in the system.

**Accounts:**
- `[writable] issuer_account`: The new issuer account to initialize
- `[signer] authority`: The authority initializing the issuer
- `system_program`: Standard system program

**Arguments:**
- `bump`: Bump seed for the PDA

**Functionality:**
- Creates a new issuer account with the provided authority
- Sets the issuer as unverified initially (requires admin verification)
- Records the creation timestamp

### `mint_credential`
Mints a new credential SBT to a student's wallet.

**Accounts:**
- `[writable] credential_account`: The new credential account
- `[writable] issuer`: The verified issuer account
- `[signer] issuer_account`: The actual issuer signing the transaction
- `[signer] student`: The student receiving the credential
- `[writable] token_metadata`: Metadata account for the credential NFT
- `[writable] credential_mint`: Mint account for the credential token
- `[writable] credential_token_account`: Token account for the credential
- `[writable] master_edition`: Master edition account making it non-transferable
- `metadata_program`: Metaplex metadata program
- `token_program`: SPL token program
- `system_program`: Standard system program
- `rent`: Rent sysvar
- `associated_token_program`: Associated token program

**Arguments:**
- `skill_name`: Name of the skill/certification
- `issue_date`: Date when the credential was issued
- `credential_uri`: URI to credential metadata on IPFS

**Functionality:**
- Verifies the issuer is verified
- Creates a new credential account with all metadata
- Mints a non-transferable NFT (Soulbound Token)
- Links the credential to both issuer and student

### `mint_proof_of_work`
Mints a new proof-of-work NFT representing a completed project.

**Accounts:**
- `[writable] proof_of_work_account`: The new proof-of-work account
- `[signer] student`: The student creating the proof-of-work
- `[writable] token_metadata`: Metadata account for the proof-of-work NFT
- `[writable] proof_of_work_mint`: Mint account for the proof-of-work token
- `[writable] proof_of_work_token_account`: Token account for the proof-of-work
- `[writable] master_edition`: Master edition account
- `metadata_program`: Metaplex metadata program
- `token_program`: SPL token program
- `system_program`: Standard system program
- `rent`: Rent sysvar
- `associated_token_program`: Associated token program

**Arguments:**
- `project_title`: Title of the project
- `project_description`: Description of the project
- `github_link`: Link to the project's GitHub repository
- `demo_link`: Link to the project's demo

**Functionality:**
- Creates a new proof-of-work account with project details
- Mints a transferable NFT representing the project
- Links the NFT to the student who created it
- Sets up proper metadata for the NFT

### `verify_credential`
Verifies the authenticity and validity of a credential.

**Accounts:**
- `[writable] credential_account`: The credential to verify

**Functionality:**
- Checks if the credential exists and is valid
- Returns whether the credential is active and not revoked
- Provides verification status

### `verify_proof_of_work`
Verifies the authenticity and existence of a proof-of-work NFT.

**Accounts:**
- `[writable] proof_of_work_account`: The proof-of-work to verify

**Functionality:**
- Checks if the proof-of-work exists
- Returns whether the proof-of-work is valid
- Provides verification status

### `update_metadata`
Allows credential issuer to update credential metadata.

**Accounts:**
- `[writable] credential_account`: The credential to update
- `[signer] issuer`: The original issuer of the credential
- `[writable] token_metadata`: The metadata account to update
- `[writable] mint`: The mint account
- `metadata_program`: Metaplex metadata program
- `system_program`: Standard system program

**Arguments:**
- `new_skill_name`: Optional new skill name
- `new_credential_uri`: Optional new credential URI

**Functionality:**
- Verifies the caller is the original issuer
- Updates specified metadata fields
- Updates on-chain metadata via Metaplex

### `update_proof_of_work_metadata`
Allows student to update proof-of-work metadata.

**Accounts:**
- `[writable] proof_of_work_account`: The proof-of-work to update
- `[signer] student`: The original creator of the proof-of-work
- `[writable] token_metadata`: The metadata account to update
- `[writable] mint`: The mint account
- `metadata_program`: Metaplex metadata program
- `system_program`: Standard system program

**Arguments:**
- `new_project_title`: Optional new project title
- `new_project_description`: Optional new project description
- `new_github_link`: Optional new GitHub link
- `new_demo_link`: Optional new demo link

**Functionality:**
- Verifies the caller is the original creator
- Updates specified metadata fields
- Updates on-chain metadata via Metaplex

### `revoke_credential`
Allows issuer to revoke a previously issued credential.

**Accounts:**
- `[writable] credential_account`: The credential to revoke
- `[signer] issuer`: The original issuer of the credential

**Functionality:**
- Verifies the caller is the original issuer
- Marks the credential as revoked
- Records the revocation timestamp

## Account Structures

### `IssuerAccount`
```rust
pub struct IssuerAccount {
    pub issuer_pubkey: Pubkey,  // Public key of the issuer
    pub bump: u8,               // Bump seed for PDA
    pub is_verified: bool,      // Whether the issuer is verified
    pub created_at: i64,        // Creation timestamp
}
```

### `CredentialAccount`
```rust
pub struct CredentialAccount {
    pub issuer_pubkey: Pubkey,  // Public key of the issuing organization
    pub student_pubkey: Pubkey, // Public key of the credential recipient
    pub skill_name: String,     // Name of the skill/certification
    pub issue_date: i64,        // Date when credential was issued
    pub credential_uri: String, // URI to credential metadata on IPFS
    pub is_soulbound: bool,     // Flag indicating non-transferability
    pub is_revoked: bool,       // Whether the credential has been revoked
    pub created_at: i64,        // Creation timestamp
    pub revoked_at: Option<i64>, // Revocation timestamp (if revoked)
    pub bump: u8,               // Bump seed for PDA
}
```

### `ProofOfWorkAccount`
```rust
pub struct ProofOfWorkAccount {
    pub student_pubkey: Pubkey,      // Public key of the student who created this
    pub project_title: String,       // Title of the project
    pub project_description: String, // Description of the project
    pub github_link: String,         // Link to the GitHub repository
    pub demo_link: String,           // Link to the project demo
    pub timestamp: i64,              // Timestamp when the project was created
    pub is_transferable: bool,       // Whether this NFT is transferable
    pub created_at: i64,             // Creation timestamp of the account
    pub bump: u8,                    // Bump seed for PDA
}
```

## Key Differences Between Credentials and Proof-of-Work NFTs

| Feature | Credentials (SBTs) | Proof-of-Work NFTs |
|---------|-------------------|-------------------|
| Transferability | Non-transferable (Soulbound) | Transferable |
| Creator | Issuer mints for student | Student mints for themselves |
| Verification | Issuer verification required | Self-attested |
| Use Case | Formal credentials from institutions | Personal project showcase |
| Royalties | No resale rights | 5% creator royalty |

## Security Features

### Access Control
- Only verified issuers can mint credentials
- Only original creators can update proof-of-work metadata
- Only original issuers can update/revoke credentials
- Credential verification is permissionless

### Soulbound Token Enforcement
- Master edition with max_supply = 0 ensures non-transferability for credentials
- On-chain flag for soulbound status

### Verification Checks
- Issuer verification status checked on credential mint
- Authority verification for all sensitive operations
- Timestamp validation

## Integration Notes

### Frontend Integration
- Wallet connection required for all operations
- Transaction signing for credential and proof-of-work minting
- Metadata stored on IPFS for decentralized access

### Metadata Standards
- Follows Metaplex token metadata standards
- Credential and proof-of-work URIs point to IPFS-hosted JSON
- JSON includes appropriate project details for proof-of-work NFTs

### Best Practices
- Always verify issuer status before accepting credentials
- Implement proper error handling for all operations
- Cache verification results appropriately
- Monitor account changes for responsive UI updates

## Gas Optimization
- Efficient PDA derivation for account lookups
- Minimal on-chain storage with IPFS for metadata
- Batch operations where possible

This smart contract provides a robust foundation for verifiable credentials and proof-of-work NFTs on Solana while maintaining the security and decentralization properties of the blockchain.