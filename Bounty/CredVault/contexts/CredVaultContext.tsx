// contexts/CredVaultContext.tsx
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { IDL } from '../lib/credVault';
import { credVaultService } from '../services/credVaultService';

interface CredVaultContextType {
  program: Program | null;
  connection: Connection | null;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

const CredVaultContext = createContext<CredVaultContextType | undefined>(undefined);

export const CredVaultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Program | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupProgram = async () => {
      if (!wallet) {
        setError('Wallet not connected');
        setLoading(false);
        return;
      }

      try {
        // Use environment variable for RPC endpoint, default to devnet
        const rpcEndpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.devnet.solana.com';
        const solConnection = new Connection(rpcEndpoint);
        
        // Create the provider
        const provider = new AnchorProvider(solConnection, wallet, {
          commitment: 'confirmed',
        });
        
        // Create the program instance
        const credVaultProgram = new Program(
          IDL,
          new PublicKey(process.env.NEXT_PUBLIC_CREDVAULT_PROGRAM_ID!),
          provider
        );
        
        setConnection(solConnection);
        setProgram(credVaultProgram);
        
        // Update the service with the new program and connection
        credVaultService.setProgram(credVaultProgram, solConnection);
        
        setError(null);
      } catch (err) {
        console.error('Error setting up Anchor program:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    setupProgram();
  }, [wallet]);

  const refreshData = () => {
    // This could be used to refresh data from the blockchain
    // For now, it just triggers a re-render
    setProgram(program);
  };

  return (
    <CredVaultContext.Provider value={{ program, connection, loading, error, refreshData }}>
      {children}
    </CredVaultContext.Provider>
  );
};

export const useCredVault = () => {
  const context = useContext(CredVaultContext);
  if (context === undefined) {
    throw new Error('useCredVault must be used within a CredVaultProvider');
  }
  return context;
};