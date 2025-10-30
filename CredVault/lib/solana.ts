import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { Program, Provider, AnchorProvider } from '@project-serum/anchor';
import { IDL as credVaultIDL } from './credVault';

// Define the program ID for the CredVault program (to be updated after Anchor deployment)
const CREDVAULT_PROGRAM_ID = process.env.NEXT_PUBLIC_CREDVAULT_PROGRAM_ID || '';

export const getCredVaultProgram = (provider: Provider) => {
  const program = new Program(
    credVaultIDL,
    new PublicKey(CREDVAULT_PROGRAM_ID),
    provider
  );
  return program;
};

export const getConnection = () => {
  return new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || clusterApiUrl('devnet'),
    'confirmed'
  );
};