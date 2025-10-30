// components/EmployerVerificationPortal.tsx
import React, { useState } from 'react';
import { credVaultService } from '../services/credVaultService';
import { showNotification } from '../utils/notifications';
import Input from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';
import { PublicKey } from '@solana/web3.js';

interface CredentialVerificationResult {
  isVerified: boolean;
  credentialPublicKey?: string;
  owner?: string;
  issuer?: string;
  issuedAt?: string;
  skillName?: string;
  metadataUri?: string;
  // Add other fields from CredentialData if needed
}

const EmployerVerificationPortal: React.FC = () => {
  const [credentialId, setCredentialId] = useState('');
  const [verificationResult, setVerificationResult] = useState<CredentialVerificationResult | null>(null);
  const [verificationHistory, setVerificationHistory] = useState<CredentialVerificationResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleVerifyCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialId) {
      showNotification('Input Required', 'Please enter a credential ID or public key.', 'error');
      return;
    }

    setLoading(true);
    setVerificationResult(null);
    try {
      const result = await credVaultService.verifyCredential({ credentialPublicKey: credentialId });

      const newResult: CredentialVerificationResult = {
        credentialPublicKey: credentialId,
        ...result,
      };
      setVerificationResult(newResult);
      setVerificationHistory((prevHistory) => [newResult, ...prevHistory]);

      if (result.isVerified) {
        showNotification('Verification Successful', 'The credential has been successfully verified.', 'success');
      } else {
        showNotification('Verification Failed', 'The credential could not be verified or does not exist.', 'warning');
      }
    } catch (error) {
      console.error('Error verifying credential:', error);
      showNotification('Verification Error', `Error: ${(error as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Credential Verification Portal</h2>
      <form onSubmit={handleVerifyCredential} className="space-y-4">
        <Input
          label="Credential ID or Public Key"
          placeholder="Enter credential ID or public key to verify"
          value={credentialId}
          onChange={(e) => setCredentialId(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Credential'}
        </Button>
      </form>

      {verificationResult && (
        <div className="mt-6 p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-2">Current Verification Result</h3>
          <p><strong>Status:</strong> {' '}
            <span className={verificationResult.isVerified ? 'text-green-600' : 'text-red-600'}>
              {verificationResult.isVerified ? 'Verified' : 'Not Verified'}
            </span>
          </p>
          {verificationResult.isVerified && (
            <div className="space-y-1 mt-2">
              <p><strong>Credential Public Key:</strong> {verificationResult.credentialPublicKey}</p>
              <p><strong>Owner:</strong> {verificationResult.owner}</p>
              <p><strong>Issuer:</strong> {verificationResult.issuer}</p>
              <p><strong>Skill Name:</strong> {verificationResult.skillName}</p>
              <p><strong>Issued At:</strong> {verificationResult.issuedAt}</p>
              {verificationResult.metadataUri && (
                <p><strong>Metadata URI:</strong> <a href={verificationResult.metadataUri} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{verificationResult.metadataUri}</a></p>
              )}
            </div>
          )}
        </div>
      )}

      {verificationHistory.length > 0 && (
        <div className="mt-8 p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-4">Verification History</h3>
          <div className="space-y-4">
            {verificationHistory.map((historyItem, index) => (
              <div key={index} className="p-3 border rounded-md bg-gray-50">
                <p><strong>Credential:</strong> {historyItem.credentialPublicKey?.substring(0, 8)}...</p>
                <p><strong>Status:</strong> {' '}
                  <span className={historyItem.isVerified ? 'text-green-600' : 'text-red-600'}>
                    {historyItem.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </p>
                {historyItem.skillName && <p><strong>Skill:</strong> {historyItem.skillName}</p>}
                {historyItem.issuedAt && <p><strong>Date:</strong> {new Date(historyItem.issuedAt).toLocaleDateString()}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default EmployerVerificationPortal;
