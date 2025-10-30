// components/VerifyCredentialForm.tsx
import { useState } from 'react';
import { useCredVault } from '../contexts/CredVaultContext';
import { PublicKey } from '@solana/web3.js';
import { showNotification } from '../utils/notifications';

export const VerifyCredentialForm = () => {
  const { program, connection } = useCredVault();
  const [credentialPublicKey, setCredentialPublicKey] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program || !connection) {
      showNotification('Error', 'Program not initialized', 'error');
      return;
    }

    setLoading(true);
    setVerificationResult(null);
    
    try {
      // In a real implementation, we would call the service method
      // For now, we'll use mock verification
      const isValid = true; // Mock result
      
      setVerificationResult({
        isValid,
        credentialId: credentialPublicKey,
        timestamp: new Date().toISOString(),
      });
      
      showNotification('Verification Complete', `Credential is ${isValid ? 'valid' : 'invalid'}`, 'info');
    } catch (error) {
      console.error('Error verifying credential:', error);
      showNotification('Verification Failed', `Error: ${(error as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Verify a Credential</h3>
      
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label htmlFor="credentialPublicKey" className="block text-sm font-medium text-gray-700">
            Credential Public Key
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="credentialPublicKey"
              id="credentialPublicKey"
              value={credentialPublicKey}
              onChange={(e) => setCredentialPublicKey(e.target.value)}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Public key of the credential account"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !credentialPublicKey}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Credential'}
          </button>
        </div>
      </form>
      
      {verificationResult && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h4 className="text-md font-medium text-gray-900">Verification Result</h4>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Credential ID</p>
              <p className="text-sm font-mono break-all">{verificationResult.credentialId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={`text-sm font-medium ${
                verificationResult.isValid ? 'text-green-600' : 'text-red-600'
              }`}>
                {verificationResult.isValid ? 'Valid' : 'Invalid'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">Verified at</p>
              <p className="text-sm">{new Date(verificationResult.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};