import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PublicKey } from '@solana/web3.js';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { showNotification } from '../utils/notifications';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const AuthPage: React.FC = () => {
  const { user, login, isConnected, walletAddress } = useAuth();
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const [selectedRole, setSelectedRole] = useState<'student' | 'issuer' | 'employer' | null>(null);
  const [loadingWallet, setLoadingWallet] = useState(false);

  // Redirect if already fully logged in (wallet connected and role selected)
  useEffect(() => {
    if (user && user.publicKey && user.type) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleConnectWallet = async () => {
    if (!selectedRole) {
      showNotification('Error', 'Please select a role first.', 'error');
      return;
    }

    if (!connected) {
      setVisible(true); // Open wallet modal
      return;
    }

    if (publicKey && selectedRole) {
      setLoadingWallet(true);
      try {
        const newUser = {
          publicKey: publicKey,
          type: selectedRole,
          verificationLevel: 'basic', // Default to basic for demo
          isEmailVerified: true, // Temporarily true for demo
          isPhoneVerified: true, // Temporarily true for demo
        };
        login(newUser);
        showNotification('Wallet Connected', `Logged in as ${selectedRole}!`, 'success');
        router.push('/dashboard');
      } catch (error) {
        console.error('Wallet connection error:', error);
        showNotification('Error', 'Failed to connect wallet or log in.', 'error');
      } finally {
        setLoadingWallet(false);
      }
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 w-full max-w-md space-y-6 bg-white/25 backdrop-blur-xl shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to CredVault</h2>
          <p className="text-lg text-gray-600 mb-8">Select your role to continue:</p>

          <div className="flex justify-center space-x-4 mb-8">
            <Button
              variant={selectedRole === 'student' ? 'primary' : 'secondary'}
              onClick={() => setSelectedRole('student')}
            >
              Student
            </Button>
            <Button
              variant={selectedRole === 'issuer' ? 'primary' : 'secondary'}
              onClick={() => setSelectedRole('issuer')}
            >
              Issuer
            </Button>
            <Button
              variant={selectedRole === 'employer' ? 'primary' : 'secondary'}
              onClick={() => setSelectedRole('employer')}
            >
              Employer
            </Button>
          </div>

          <Button
            variant="primary"
            onClick={handleConnectWallet}
            disabled={!selectedRole || loadingWallet}
            className="w-full"
          >
            {loadingWallet ? 'Connecting Wallet...' : (connected ? 'Continue to Dashboard' : 'Connect Wallet')}
          </Button>

          {connected && walletAddress && (
            <p className="text-sm text-gray-500 mt-4">
              Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 6)}
            </p>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default AuthPage;
