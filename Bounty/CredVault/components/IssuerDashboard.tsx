// components/IssuerDashboard.tsx
import { useState } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { IDL } from '../lib/credVault';
import { MintCredentialForm } from './MintCredentialForm';

export const IssuerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'mint' | 'issued'>('mint');

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-4">
          <button
            onClick={() => setActiveTab('mint')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mint'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Mint Credential
          </button>
          <button
            onClick={() => setActiveTab('issued')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'issued'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Issued Credentials
          </button>
        </nav>
      </div>
      
      <div className="p-6">
        {activeTab === 'mint' && <MintCredentialForm />}
        {activeTab === 'issued' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Previously Issued Credentials</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-500 text-center py-8">No credentials issued yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};