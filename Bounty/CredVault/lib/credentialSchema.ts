// Credential schema definitions for CredVault
export interface BaseCredential {
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

export interface ProofOfWork {
  projectId: string;
  projectName: string;
  projectDescription: string;
  projectUrl?: string;
  repositoryUrl?: string;
  artifacts: Artifact[];
  completionDate: number; // Unix timestamp
}

export interface Artifact {
  type: ArtifactType;
  name: string;
  uri: string; // Link to the artifact
  description?: string;
}

export enum CredentialType {
  SKILL = 'skill',
  CERTIFICATION = 'certification',
  ACHIEVEMENT = 'achievement',
  PROOF_OF_WORK = 'proof-of-work',
  HACKATHON = 'hackathon',
  TRAINING = 'training',
}

export enum CredentialStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

export interface CredentialMetadata {
  name: string;
  description: string;
  image: string; // URI to credential image
  attributes: Attribute[];
  properties?: any; // Additional properties specific to the credential type
}

export interface Attribute {
  trait_type: string;
  value: string;
}

// Interface for credential verification
export interface VerificationData {
  verified: boolean;
  verifiedAt?: number; // Unix timestamp
  verifiedBy?: string; // Public key of verifier
  verificationDetails?: string;
}

// Interface for employer dashboard
export interface EmployerDashboardData {
  organizationName: string;
  organizationPublicKey: string;
  issuedCredentials: number;
  verifiedCredentials: number;
  activeVerifications: number;
}

// Interface for credential request (when someone requests a credential)
export interface CredentialRequest {
  id: string;
  requesterPublicKey: string;
  issuerPublicKey: string;
  credentialType: CredentialType;
  requestData: any; // Specific data required for the credential type
  requestedAt: number; // Unix timestamp
  status: CredentialRequestStatus;
  response?: CredentialRequestResponse;
}

export enum CredentialRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export interface CredentialRequestResponse {
  responseAt: number; // Unix timestamp
  responderPublicKey: string;
  status: CredentialRequestStatus;
  message?: string;
}

// Interface for training organizations
export interface TrainingOrganization {
  publicKey: string;
  organizationName: string;
  description: string;
  website?: string;
  registeredCredentials: number;
  verificationLevel: VerificationLevel;
}

export enum VerificationLevel {
  UNVERIFIED = 0,
  VERIFIED = 1,
  PREMIUM = 2,
  OFFICIAL = 3,
}

// Interface for credential verification requests
export interface VerificationRequest {
  id: string;
  credentialId: string;
  requesterPublicKey: string; // Who is requesting verification
  targetPublicKey: string; // Whose credential is being verified
  requestedAt: number;
  status: VerificationRequestStatus;
  result?: VerificationResult;
}

export enum VerificationRequestStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface VerificationResult {
  verified: boolean;
  verifiedAt: number;
  verifierPublicKey: string;
  verificationMethod: VerificationMethod;
  confidenceScore?: number; // 0-100 percentage
  details?: string;
}

export enum VerificationMethod {
  MANUAL = 'manual',
  AUTOMATED = 'automated',
  BLOCKCHAIN = 'blockchain',
  THIRD_PARTY = 'third_party',
}