// hooks/useAnchorProgram.ts
import { useEffect, useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { IDL, CredVault } from '../lib/credVault';

export const useAnchorProgram = () => {
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Program<CredVault> | null>(null);
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

  return { program, connection, loading, error };
};