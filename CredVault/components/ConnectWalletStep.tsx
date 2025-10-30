import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Button from './ui/Button';

interface ConnectWalletStepProps {
  onWalletConnected: (publicKey: string) => void;
}

const ConnectWalletStep: React.FC<ConnectWalletStepProps> = ({ onWalletConnected }) => {
  const { publicKey, connected } = useWallet();

  React.useEffect(() => {
    if (connected && publicKey) {
      onWalletConnected(publicKey.toBase58());
    }
  }, [connected, publicKey, onWalletConnected]);

  return (
    <div className="text-center space-y-4">
      <h3 className="text-xl font-semibold text-text-primary">Connect Your Wallet</h3>
      <p className="text-text-secondary">Please connect your Solana wallet to complete the registration.</p>
      <WalletMultiButton />
      {!connected && (
        <p className="text-sm text-red-500">Wallet not connected. Please connect your wallet to proceed.</p>
      )}
    </div>
  );
};

export default ConnectWalletStep;
