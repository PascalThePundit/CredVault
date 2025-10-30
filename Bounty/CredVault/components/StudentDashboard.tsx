// components/StudentDashboard.tsx
import { useState, useEffect } from 'react';
import { useCredVault } from '../contexts/CredVaultContext';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { CredentialCard } from './CredentialCard';
import { ProofOfWorkCard } from './ProofOfWorkCard';
import { MintProofOfWorkForm } from './MintProofOfWorkForm';
import { credVaultService } from '../services/credVaultService';

export const StudentDashboard = () => {
  const wallet = useAnchorWallet();
  const { program, connection, loading: contextLoading, refreshData } = useCredVault();
  const [activeTab, setActiveTab] = useState<'credentials' | 'proofOfWork' | 'mintProof'>('credentials');
  const [credentials, setCredentials] = useState<any[]>([]);
  const [proofOfWorks, setProofOfWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wallet && program && connection) {
      fetchUserCredentials();
    }
  }, [wallet, program, connection]);

  const fetchUserCredentials = async () => {
    if (!wallet?.publicKey) return;
    
    setLoading(true);
    try {
      // Fetch credentials using the service
      const creds = await credVaultService.getCredentialsForUser(wallet.publicKey);
      setCredentials(creds);
      
      // Fetch proof of work items using the service
      const proofOfWork = await credVaultService.getProofOfWorkForUser(wallet.publicKey);
      setProofOfWorks(proofOfWork);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-4">
          <button
            onClick={() => setActiveTab('credentials')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'credentials'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Credentials
          </button>
          <button
            onClick={() => setActiveTab('proofOfWork')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'proofOfWork'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Projects
          </button>
          <button
            onClick={() => setActiveTab('mintProof')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mintProof'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Mint Project NFT
          </button>
        </nav>
      </div>
      
      <div className="p-6">
        {(loading || contextLoading) ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-2 text-gray-600">Loading your data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'credentials' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Credentials</h3>
                {credentials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {credentials.map((cred) => (
                      <CredentialCard key={cred.id} credential={cred} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-500 text-center py-4">No credentials yet. Issuers will be able to mint credentials for you.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'proofOfWork' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Project NFTs</h3>
                {proofOfWorks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {proofOfWorks.map((p) => (
                      <ProofOfWorkCard key={p.id} proofOfWork={p} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-500 text-center py-4">No project NFTs yet. Mint your projects to showcase them.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'mintProof' && <MintProofOfWorkForm />}
          </>
        )}
      </div>
    </div>
  );
};