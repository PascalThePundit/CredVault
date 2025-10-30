// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

interface User {
  publicKey: PublicKey;
  type: 'issuer' | 'student' | 'employer' | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userType: 'issuer' | 'student' | 'employer') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { publicKey, connected } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (connected && publicKey) {
      // In a real app, you would fetch user type from your backend
      // For now, we'll set a default type or allow the user to select
      setUser(prev => prev ? prev : { publicKey, type: null });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [connected, publicKey]);

  const login = (userType: 'issuer' | 'student' | 'employer') => {
    if (publicKey) {
      setUser({ publicKey, type: userType });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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