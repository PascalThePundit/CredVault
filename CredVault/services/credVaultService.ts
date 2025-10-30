// services/credVaultService.ts
import { Connection, PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { Program, BN, AnchorProvider } from '@project-serum/anchor';
import { IDL, CredVault } from '../lib/credVault';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { showNotification } from '../utils/notifications';
import { uploadCredentialToIPFS, uploadProofOfWorkToIPFS, CredentialMetadata, ProofOfWorkMetadata } from './ipfsService';
import { solanaPayService, MintFeePayment, VerificationFeePayment } from './paymentService';

export interface CredentialData {
  studentPublicKey: string;
  skillName: string;
  issuerName: string;
  issueDate: number; // Unix timestamp
  issuerReputation?: number; // Added issuer reputation
  validityScore?: number; // Added credential validity score
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
  private program: Program<CredVault> | null = null;
  private connection: Connection | null = null;
  private provider: AnchorProvider | null = null;

  setProgram(program: Program<CredVault>, connection: Connection, provider: AnchorProvider) {
    this.program = program;
    this.connection = connection;
    this.provider = provider;
  }

  async mintCredential(data: CredentialData): Promise<{ tx: string; credentialPDA: PublicKey }> {
    if (!this.program || !this.provider) throw new Error('Program not initialized');
    
    try {
      // Upload credential metadata to IPFS first
      const metadata: Omit<CredentialMetadata, 'version'> = {
        name: data.skillName,
        description: `Credential for ${data.skillName} issued to a student`,
        image: 'ipfs://QmSomeDefaultCredentialImage',
        attributes: [
          { trait_type: 'Skill', value: data.skillName },
          { trait_type: 'Issuer', value: data.issuerName },
          { trait_type: 'Date', value: new Date(data.issueDate * 1000).toISOString() },
        ],
        issuerName: data.issuerName,
        issuerPublicKey: this.provider.publicKey.toBase58(),
        skillName: data.skillName,
        issueDate: new Date(data.issueDate * 1000).toISOString(),
        credentialType: 'skill',
      };

      const metadataUri = await uploadCredentialToIPFS(metadata);

      // Generate the PDA for the credential account
      const [credentialPDA] = await PublicKey.findProgramAddress(
        [
          Buffer.from('credential'),
          new PublicKey(data.studentPublicKey).toBuffer(),
          this.provider.publicKey.toBase58() === data.issuerPublicKey ? this.provider.publicKey.toBuffer() : new PublicKey(data.issuerPublicKey).toBuffer(), // Use the actual issuer's key
          Buffer.from(data.skillName),
        ],
        this.program.programId
      );

      const tx = await this.program.methods
        .issueCredential(
          JSON.stringify({
            skillName: data.skillName,
            issueDate: new BN(data.issueDate).toString(), // Convert BN to string for JSON
            metadataUri: metadataUri,
          })
        )
        .accounts({
          credentialAccount: credentialPDA,
          issuer: this.provider.publicKey, // Use the actual issuer



        })
        .rpc();

      showNotification('Credential Minted', `Transaction: ${tx}`, 'success');
      return { tx, credentialPDA };
    } catch (error) {
      console.error('Error minting credential:', error);
      showNotification('Mint Failed', `Error: ${(error as Error).message}`, 'error');
      throw error;
    }
  }

  async mintBatchCredentials(credentials: CredentialData[]): Promise<Array<{ status: 'fulfilled' | 'rejected'; value?: { tx: string; credentialPDA: PublicKey }; reason?: any }>> {
    if (!this.program || !this.provider) throw new Error('Program not initialized');

    const mintPromises = credentials.map(credentialData => this.mintCredential(credentialData));
    const results = await Promise.allSettled(mintPromises);

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        showNotification('Batch Mint Success', `Credential ${index + 1} minted with transaction: ${result.value?.tx}`, 'success');
      } else {
        showNotification('Batch Mint Failed', `Credential ${index + 1} failed: ${(result.reason as Error).message}`, 'error');
      }
    });

    return results;
  }


  /*
  async mintProofOfWork(data: ProofOfWorkData): Promise<string> {
    if (!this.program || !this.provider) throw new Error('Program not initialized');
    
    try {
      // Upload proof of work metadata to IPFS first
      const metadata: Omit<ProofOfWorkMetadata, 'version'> = {
        name: data.projectTitle,
        description: data.projectDescription,
        image: 'ipfs://QmSomeDefaultProjectImage',
        attributes: [
          { trait_type: 'Project', value: data.projectTitle },
          { trait_type: 'GitHub', value: data.githubLink ? 'Available' : 'Not Provided' },
          { trait_type: 'Demo', value: data.demoLink ? 'Available' : 'Not Provided' },
        ],
        projectTitle: data.projectTitle,
        projectDescription: data.projectDescription,
        githubLink: data.githubLink,
        demoLink: data.demoLink,
        studentPublicKey: this.provider.publicKey.toBase58(),
        timestamp: new Date().toISOString(),
      };

      const metadataUri = await uploadProofOfWorkToIPFS(metadata);

      // Generate the PDA for the proof of work account
      const [proofOfWorkPDA] = await PublicKey.findProgramAddress(
        [
          Buffer.from('proof-of-work'),
          this.provider.publicKey.toBuffer(), // Student's pubkey
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
          student: this.provider.publicKey,
          tokenMetadata: await PublicKey.findProgramAddress(
            [Buffer.from('metadata'), new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s').toBuffer(), proofOfWorkPDA.toBuffer()],
            new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
          )[0],
          proofOfWorkMint: await PublicKey.findProgramAddress(
            [Buffer.from('mint'), proofOfWorkPDA.toBuffer()],
            this.program.programId
          )[0],
          proofOfWorkTokenAccount: await PublicKey.findProgramAddress(
            [Buffer.from('token'), proofOfWorkPDA.toBuffer()],
            this.program.programId
          )[0],
          masterEdition: await PublicKey.findProgramAddress(
            [Buffer.from('metadata'), new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s').toBuffer(), proofOfWorkPDA.toBuffer(), Buffer.from('edition')],
            new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
          )[0],
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
  */

  async verifyCredential(params: VerifyCredentialParams): Promise<any> {
    if (!this.program || !this.connection) throw new Error('Program not initialized');
    
    try {
      const credentialPublicKey = new PublicKey(params.credentialPublicKey);
      const credentialAccount = await this.program.account.credentialAccount.fetch(credentialPublicKey);

      if (credentialAccount) {
        // Assuming credentialData is a JSON string stored in the account
        const parsedCredentialData = JSON.parse(credentialAccount.credentialData);
        return {
          isVerified: true,
          owner: credentialAccount.owner.toBase58(),
          issuer: credentialAccount.issuer.toBase58(),
          issuedAt: new Date(credentialAccount.issuedAt.toNumber() * 1000).toISOString(),
          ...parsedCredentialData,
        };
      } else {
        return { isVerified: false };
      }
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

  // Process mint fee payment
  async processMintFeePayment(issuer: PublicKey, mintFee: number): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    try {
      const paymentParams: MintFeePayment = {
        issuer,
        mintFee,
      };
      
      // In a real implementation, this would make the actual payment
      // For this example, we'll simulate a successful payment
      return 'mock_tx_signature';
    } catch (error) {
      console.error('Error processing mint fee payment:', error);
      showNotification('Payment Failed', `Error: ${(error as Error).message}`, 'error');
      throw error;
    }
  }

  // Process verification fee payment
  async processVerificationFeePayment(employer: PublicKey, candidatePublicKey: PublicKey, verificationFee: number): Promise<string> {
    if (!this.provider) throw new Error('Program not initialized');
    
    try {
      const paymentParams: VerificationFeePayment = {
        employer,
        candidatePublicKey,
        verificationFee,
      };
      
      // In a real implementation, this would make the actual payment
      // For this example, we'll simulate a successful payment
      return 'mock_tx_signature';
    } catch (error) {
      console.error('Error processing verification fee payment:', error);
      showNotification('Payment Failed', `Error: ${(error as Error).message}`, 'error');
      throw error;
    }
  }
  async getAllPublicCredentials(): Promise<any[]> {
    if (!this.program) throw new Error('Program not initialized');

    try {
      // In a real implementation, this would fetch all credential accounts
      // that are marked as public or are discoverable.
      // For now, returning mock data.
      const mockPublicCredentials = [
        {
          id: 'pub_1',
          issuer: 'Dev Academy Nigeria',
          skillName: 'Solana Development',
          issueDate: '2023-06-01',
          owner: 'StudentA_PublicKey',
          metadataUri: 'https://ipfs.io/ipfs/Qm...',
          issuerReputation: 4.5, // Simulated reputation
        },
        {
          id: 'pub_2',
          issuer: 'Solana Foundation',
          skillName: 'Anchor Framework',
          issueDate: '2023-08-15',
          owner: 'StudentB_PublicKey',
          metadataUri: 'https://ipfs.io/ipfs/Qm...',
          issuerReputation: 4.8, // Simulated reputation
        },
        {
          id: 'pub_3',
          issuer: 'Web3 University',
          skillName: 'Rust Programming',
          issueDate: '2023-09-20',
          owner: 'StudentA_PublicKey',
          metadataUri: 'https://ipfs.io/ipfs/Qm...',
          issuerReputation: 4.2, // Simulated reputation
        },
      ];
      return mockPublicCredentials;
    } catch (error) {
      console.error('Error fetching public credentials:', error);
      showNotification('Fetch Failed', `Error: ${(error as Error).message}`, 'error');
      throw error;
    }
  }
}

export const credVaultService = new CredVaultService();