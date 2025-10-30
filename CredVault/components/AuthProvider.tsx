import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  isConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    // Check if user was previously connected
    const connected = localStorage.getItem('walletConnected');
    const address = localStorage.getItem('walletAddress');
    
    if (connected === 'true' && address) {
      setIsConnected(true);
      setWalletAddress(address);
    }
  }, []);

  const connectWallet = () => {
    // Simulate wallet connection
    const mockAddress = '0x1234567890123456789012345678901234567890';
    setIsConnected(true);
    setWalletAddress(mockAddress);
    localStorage.setItem('walletConnected', 'true');
    localStorage.setItem('walletAddress', mockAddress);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
  };

  return (
    <AuthContext.Provider value={{ 
      isConnected, 
      walletAddress, 
      connectWallet, 
      disconnectWallet 
    }}>
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