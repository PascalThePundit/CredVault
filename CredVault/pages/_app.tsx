import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthProvider } from '../contexts/AuthContext';

// Import Solana wallet adapter components
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

function MyApp({ Component, pageProps }: AppProps) {
  // You can use the Solana cluster you want here
  const network = 'devnet'; // or 'mainnet-beta', 'testnet', 'localhost'
  const endpoint = useMemo(() => 'https://api.devnet.solana.com', [network]); // Replace with your RPC endpoint

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      // Add more wallets here
    ],
    [network]
  );

  return (
    <>
      <Head>
        <title>CredVault - Web3 Credential Verification</title>
        <meta name="description" content="Blockchain-based credential verification for the decentralized future" />
        <link rel="icon" href="/favicon.ico" />
        {/* The font import will be moved to _document.js later */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default MyApp;