// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { WalletProvider } from '../components/WalletProvider';
import { ConnectionProvider } from '@solana/wallet-adapter-react';
import { AuthProvider } from '../contexts/AuthContext';
import { CredVaultProvider } from '../contexts/CredVaultContext';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || 'https://api.devnet.solana.com'}>
      <WalletProvider>
        <AuthProvider>
          <CredVaultProvider>
            <Layout>
              <Toaster />
              <Component {...pageProps} />
            </Layout>
          </CredVaultProvider>
        </AuthProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;