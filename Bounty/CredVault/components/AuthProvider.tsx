import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { CredentialType, VerificationLevel } from '../lib/credentialSchema';

interface User {
  publicKey: PublicKey | null;
  connected: boolean;
  profile?: UserProfile;
}

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

interface AuthContextType {
  user: User | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  getUserProfile: () => Promise<UserProfile | null>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected, connect, disconnect } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      const userData: User = {
        publicKey,
        connected: true,
        profile: profile || undefined,
      };
      setUser(userData);
    } else {
      setUser(null);
    }
  }, [connected, publicKey, profile]);

  const connectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setUser(null);
    setProfile(null);
  };

  const getUserProfile = async (): Promise<UserProfile | null> => {
    if (!publicKey) return null;
    
    // In a real implementation, this would fetch from a backend or blockchain
    // For now, we'll return a mock profile
    const mockProfile: UserProfile = {
      publicKey: publicKey.toString(),
      displayName: `User ${publicKey.toString().substring(0, 4)}...${publicKey.toString().substring(publicKey.toString().length - 4)}`,
      email: '',
      avatar: '',
      bio: 'CredVault user',
      location: '',
      website: '',
      twitter: '',
      github: '',
      credentials: [],
      verificationLevel: VerificationLevel.UNVERIFIED,
    };
    
    setProfile(mockProfile);
    return mockProfile;
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!publicKey) return false;
    
    // In a real implementation, this would update on a backend or blockchain
    // For now, we'll just update the local state
    if (profile) {
      const updatedProfile = { ...profile, ...profileData };
      setProfile(updatedProfile);
      return true;
    }
    
    return false;
  };

  const refreshUserProfile = async () => {
    if (publicKey) {
      await getUserProfile();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        connectWallet,
        disconnectWallet,
        getUserProfile,
        updateUserProfile,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}