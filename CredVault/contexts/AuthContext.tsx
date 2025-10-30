// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui'; // Import useWalletModal
import { PublicKey } from '@solana/web3.js';

interface User {
  publicKey: PublicKey | null; // Can be null until wallet is connected
  type: 'issuer' | 'student' | 'employer' | null;
  verificationLevel: 'none' | 'basic' | 'verified';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Add setUser to context
  isConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { publicKey, connected, disconnect } = useWallet(); // Get disconnect from useWallet
  const { setVisible } = useWalletModal(); // Get setVisible from useWalletModal
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Derive isConnected and walletAddress
  const isConnected = connected;
  const walletAddress = publicKey ? publicKey.toBase58() : null;

  // Implement connectWallet and disconnectWallet
  const connectWallet = () => {
    setVisible(true); // Open the wallet modal
  };

  const disconnectWallet = () => {
    disconnect(); // Disconnect the wallet
    // Optionally, also log out the user from the app's auth system
    logout();
  };

  useEffect(() => {
    // Simulate loading user from local storage or session
    const storedUser = localStorage.getItem('credvault_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Ensure publicKey is a PublicKey object if it exists
      if (parsedUser.publicKey) {
        parsedUser.publicKey = new PublicKey(parsedUser.publicKey);
      }
      // Ensure user.type is one of the valid roles, or default to 'student'
      const validRoles: Array<User['type']> = ['issuer', 'student', 'employer'];
      if (!validRoles.includes(parsedUser.type)) {
        parsedUser.type = 'student'; // Default to student if type is invalid or missing
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('credvault_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('credvault_user');
    }
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, isConnected, walletAddress, connectWallet, disconnectWallet }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};