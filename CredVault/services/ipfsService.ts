import { create, IPFSHTTPClient } from 'ipfs-http-client';

// Define types for our credential and project metadata
export interface CredentialMetadata {
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
  properties?: any;
}

export interface ProofOfWorkMetadata {
  name: string;
  description: string;
  image: string; // IPFS URI to project image
  externalUrl?: string;
  attributes: Attribute[];
  projectTitle: string;
  projectDescription: string;
  githubLink: string;
  demoLink: string;
  studentPublicKey: string;
  timestamp: string;
  version: string;
}

export interface Attribute {
  trait_type: string;
  value: string;
}

// IPFS Service class
class IPFSService {
  private client: IPFSHTTPClient;
  private projectId: string;
  private projectSecret: string;

  constructor() {
    const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
    const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;

    if (projectId && projectSecret) {
      this.projectId = projectId;
      this.projectSecret = projectSecret;

      const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
      this.client = create({
        url: 'https://ipfs.infura.io:5001/api/v0',
        headers: {
          authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET}`
          ).toString('base64')}`,
        },
      });
    } else {
      console.warn('IPFS Project ID and Secret are not set. IPFS functionality will be disabled.');
      this.client = undefined; // Explicitly set client to undefined
    }
  }

  // Upload a file or JSON object to IPFS
  async uploadToIPFS(content: string | Buffer | object): Promise<string> {
    if (!this.client) {
      console.warn('IPFS client not initialized. Cannot upload to IPFS.');
      return '';
    }
    try {
      let data;
      if (typeof content === 'string' || Buffer.isBuffer(content)) {
        data = content;
      } else {
        // If it's an object, convert it to string
        data = JSON.stringify(content);
      }

      const result = await this.client.add(data);
      return result.path;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw error;
    }
  }

  // Upload a credential metadata object to IPFS
  async uploadCredentialMetadata(metadata: CredentialMetadata): Promise<string> {
    try {
      const cid = await this.uploadToIPFS(metadata);
      return `ipfs://${cid}`;
    } catch (error) {
      console.error('Error uploading credential metadata:', error);
      throw error;
    }
  }

  // Upload a proof of work metadata object to IPFS
  async uploadProofOfWorkMetadata(metadata: ProofOfWorkMetadata): Promise<string> {
    try {
      const cid = await this.uploadToIPFS(metadata);
      return `ipfs://${cid}`;
    } catch (error) {
      console.error('Error uploading proof of work metadata:', error);
      throw error;
    }
  }

  // Retrieve content from IPFS using CID
  async getFromIPFS(cid: string): Promise<any> {
    if (!this.client) {
      console.warn('IPFS client not initialized. Cannot retrieve from IPFS.');
      return null;
    }
    try {
      // Remove 'ipfs://' prefix if present
      const cleanCid = cid.replace('ipfs://', '');
      
      const stream = this.client.cat(cleanCid);
      let data = '';
      
      for await (const chunk of stream) {
        data += chunk.toString();
      }
      
      try {
        // Try to parse as JSON
        return JSON.parse(data);
      } catch (e) {
        // If it's not JSON, return as string
        return data;
      }
    } catch (error) {
      console.error('Error retrieving from IPFS:', error);
      throw error;
    }
  }

  // Upload a file (like an image) to IPFS
  async uploadFile(file: File | Buffer | string): Promise<string> {
    try {
      const cid = await this.uploadToIPFS(file);
      return `ipfs://${cid}`;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw error;
    }
  }

  // Get a file URL from IPFS
  getFileUrl(cid: string): string {
    // Remove 'ipfs://' prefix if present
    const cleanCid = cid.replace('ipfs://', '');
    // Using a public IPFS gateway
    return `https://ipfs.io/ipfs/${cleanCid}`;
  }
}

export const ipfsService = new IPFSService();

// Example usage functions
export const uploadCredentialToIPFS = async (credentialData: Omit<CredentialMetadata, 'version'>): Promise<string> => {
  const metadata: CredentialMetadata = {
    ...credentialData,
    version: '1.0',
  };
  
  return await ipfsService.uploadCredentialMetadata(metadata);
};

export const uploadProofOfWorkToIPFS = async (proofOfWorkData: Omit<ProofOfWorkMetadata, 'version'>): Promise<string> => {
  const metadata: ProofOfWorkMetadata = {
    ...proofOfWorkData,
    version: '1.0',
  };
  
  return await ipfsService.uploadProofOfWorkMetadata(metadata);
};

export const getFromIPFS = async (cid: string): Promise<any> => {
  return await ipfsService.getFromIPFS(cid);
};