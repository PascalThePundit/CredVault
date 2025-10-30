// services/credVaultService.ts
import { useAnchorProgram } from '../hooks/useAnchorProgram';
import { Connection, PublicKey, Keypair, TOKEN_PROGRAM_ID, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { Program, BN } from '@project-serum/anchor';
import { IDL } from '../lib/credVault';
import { showNotification } from '../utils/notifications';

export interface CredentialData {
  studentPublicKey: string;
  skillName: string;
  issueDate: number; // Unix timestamp
  credentialUri: string;
}

export interface ProofOfWorkData {
  projectTitle: string;
  projectDescription: string;
  githubLink: string;
  demoLink: string;
}

export interface VerifyCredentialParams {
  credentialPublicKey: string;
}

class CredVaultService {
  private program: Program | null = null;
  private connection: Connection | null = null;

  setProgram(program: Program, connection: Connection) {
    this.program = program;
    this.connection = connection;
  }

  async mintCredential(data: CredentialData): Promise<string> {
    if (!this.program) throw new Error('Program not initialized');
    
    try {
      // Generate the PDA for the credential account
      const [credentialPDA] = await PublicKey.findProgramAddress(
        [
          Buffer.from('credential'),
          new PublicKey(data.studentPublicKey).toBuffer(),
          // For simplicity in this example, using a random key for issuer
          // In a real implementation, this would be the issuer's key
        ],
        this.program.programId
      );

      const tx = await this.program.methods
        .mintCredential(
          data.skillName,
          new BN(data.issueDate),
          data.credentialUri
        )
        .accounts({
          credentialAccount: credentialPDA,
          issuer: new PublicKey(process.env.NEXT_PUBLIC_ISSUER_PUBLIC_KEY!), // This should be the verified issuer
          issuerAccount: this.program.provider.publicKey,
          student: new PublicKey(data.studentPublicKey),
          tokenMetadata: Keypair.generate().publicKey, // This would be computed properly
          credentialMint: Keypair.generate().publicKey, // This would be computed properly
          credentialTokenAccount: Keypair.generate().publicKey, // This would be computed properly
          masterEdition: Keypair.generate().publicKey, // This would be computed properly
          metadataProgram: new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
          associatedTokenProgram: new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
        })
        .rpc();

      showNotification('Credential Minted', `Transaction: ${tx}`, 'success');
      return tx;
    } catch (error) {
      console.error('Error minting credential:', error);
      showNotification('Mint Failed', `Error: ${(error as Error).message}`, 'error');
      throw error;
    }
  }

  async mintProofOfWork(data: ProofOfWorkData): Promise<string> {
    if (!this.program) throw new Error('Program not initialized');
    
    try {
      // Generate the PDA for the proof of work account
      const [proofOfWorkPDA] = await PublicKey.findProgramAddress(
        [
          Buffer.from('proof-of-work'),
          this.program.provider.publicKey.toBuffer(), // Student's pubkey
          Buffer.from(data.projectTitle),
        ],
        this.program.programId
      );

      const tx = await this.program.methods
        .mintProofOfWork(
          data.projectTitle,
          data.projectDescription,
          data.githubLink,
          data.demoLink
        )
        .accounts({
          proofOfWorkAccount: proofOfWorkPDA,
          student: this.program.provider.publicKey,
          tokenMetadata: Keypair.generate().publicKey, // This would be computed properly
          proofOfWorkMint: Keypair.generate().publicKey, // This would be computed properly
          proofOfWorkTokenAccount: Keypair.generate().publicKey, // This would be computed properly
          masterEdition: Keypair.generate().publicKey, // This would be computed properly
          metadataProgram: new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
          associatedTokenProgram: new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
        })
        .rpc();

      showNotification('Proof of Work Minted', `Transaction: ${tx}`, 'success');
      return tx;
    } catch (error) {
      console.error('Error minting proof of work:', error);
      showNotification('Mint Failed', `Error: ${(error as Error).message}`, 'error');
      throw error;
    }
  }

  async verifyCredential(params: VerifyCredentialParams): Promise<boolean> {
    if (!this.program) throw new Error('Program not initialized');
    
    try {
      // In a real implementation, this would call the verify_credential method
      // For now, we'll just check if the account exists and return true
      const credentialAccount = await this.connection?.getAccountInfo(
        new PublicKey(params.credentialPublicKey)
      );

      return credentialAccount !== null;
    } catch (error) {
      console.error('Error verifying credential:', error);
      showNotification('Verification Failed', `Error: ${(error as Error).message}`, 'error');
      throw error;
    }
  }

  async getCredentialsForUser(userPublicKey: PublicKey): Promise<any[]> {
    if (!this.program) throw new Error('Program not initialized');
    
    try {
      // In a real implementation, this would fetch credential accounts associated with the user
      // For now, returning mock data
      const mockCredentials = [
        {
          id: '1',
          issuer: 'Dev Academy Nigeria',
          skill: 'JavaScript Fundamentals',
          issueDate: '2023-05-15',
          isVerified: true,
          isRevoked: false,
          credentialUri: 'https://ipfs.io/ipfs/Qm...',
        },
        {
          id: '2',
          issuer: 'Solana Foundation',
          skill: 'Blockchain Development',
          issueDate: '2023-07-20',
          isVerified: true,
          isRevoked: false,
          credentialUri: 'https://ipfs.io/ipfs/Qm...',
        },
      ];
      
      return mockCredentials;
    } catch (error) {
      console.error('Error fetching credentials:', error);
      showNotification('Fetch Failed', `Error: ${(error as Error).message}`, 'error');
      throw error;
    }
  }

  async getProofOfWorkForUser(userPublicKey: PublicKey): Promise<any[]> {
    if (!this.program) throw new Error('Program not initialized');
    
    try {
      // In a real implementation, this would fetch proof of work accounts associated with the user
      // For now, returning mock data
      const mockProofOfWork = [
        {
          id: '1',
          title: 'Portfolio Website',
          description: 'A responsive portfolio website built with React and Tailwind CSS',
          githubLink: 'https://github.com/example/portfolio',
          demoLink: 'https://example.github.io/portfolio',
          timestamp: '2023-08-10',
        },
        {
          id: '2',
          title: 'Solana Token Swap',
          description: 'A decentralized token swap application on Solana',
          githubLink: 'https://github.com/example/token-swap',
          demoLink: 'https://example.github.io/token-swap',
          timestamp: '2023-09-05',
        },
      ];
      
      return mockProofOfWork;
    } catch (error) {
      console.error('Error fetching proof of work:', error);
      showNotification('Fetch Failed', `Error: ${(error as Error).message}`, 'error');
      throw error;
    }
  }
}

import { TOKEN_PROGRAM_ID, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';

export const credVaultService = new CredVaultService();