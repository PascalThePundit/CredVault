import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '../components/AuthProvider';

export const WalletConnection = () => {
  const { connected, publicKey } = useWallet();
  const { connectWallet, disconnectWallet } = useAuth();

  return (
    <div className="wallet-connection">
      {connected ? (
        <div className="connected-info">
          <span>Connected: {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}</span>
          <button onClick={disconnectWallet} className="disconnect-btn">
            Disconnect
          </button>
        </div>
      ) : (
        <WalletMultiButton onClick={connectWallet} />
      )}
    </div>
  );
};