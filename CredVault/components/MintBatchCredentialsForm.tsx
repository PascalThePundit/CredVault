// components/MintBatchCredentialsForm.tsx
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { credVaultService } from '../services/credVaultService';
import { CredentialData } from '../services/credVaultService';
import { showNotification } from '../utils/notifications';
import Input from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';

interface MintBatchCredentialsFormProps {
  onBatchMintSuccess?: () => void;
}

const MintBatchCredentialsForm: React.FC<MintBatchCredentialsFormProps> = ({ onBatchMintSuccess }) => {
  const { publicKey } = useWallet();
  const [credentials, setCredentials] = useState<CredentialData[]>([
    { studentPublicKey: '', skillName: '', issuerName: '', issueDate: Date.now() / 1000 },
  ]);
  const [loading, setLoading] = useState(false);

  const handleCredentialChange = (index: number, field: keyof CredentialData, value: string | number) => {
    const newCredentials = [...credentials];
    if (field === 'issueDate' && typeof value === 'string') {
      newCredentials[index][field] = new Date(value).getTime() / 1000;
    } else {
      newCredentials[index][field] = value as any;
    }
    setCredentials(newCredentials);
  };

  const addCredentialEntry = () => {
    setCredentials([...credentials, { studentPublicKey: '', skillName: '', issuerName: '', issueDate: Date.now() / 1000 }]);
  };

  const removeCredentialEntry = (index: number) => {
    const newCredentials = credentials.filter((_, i) => i !== index);
    setCredentials(newCredentials);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) {
      showNotification('Wallet Not Connected', 'Please connect your wallet to mint credentials.', 'error');
      return;
    }

    setLoading(true);
    try {
      // Assuming the issuerName is the connected wallet's public key for simplicity,
      // or it could be a predefined name from the issuer's profile.
      const credentialsToMint = credentials.map(cred => ({
        ...cred,
        issuerName: cred.issuerName || publicKey.toBase58(), // Use provided issuerName or wallet pubkey
      }));

      const results = await credVaultService.mintBatchCredentials(credentialsToMint);
      
      const successfulMints = results.filter(r => r.status === 'fulfilled').length;
      const failedMints = results.filter(r => r.status === 'rejected').length;

      if (successfulMints > 0) {
        showNotification('Batch Mint Complete', `${successfulMints} credentials minted successfully.`, 'success');
        onBatchMintSuccess?.();
        setCredentials([{ studentPublicKey: '', skillName: '', issuerName: '', issueDate: Date.now() / 1000 }]); // Reset form
      }
      if (failedMints > 0) {
        showNotification('Batch Mint with Errors', `${failedMints} credentials failed to mint. Check console for details.`, 'warning');
      }
    } catch (error) {
      console.error('Error during batch minting:', error);
      showNotification('Batch Mint Failed', `Error: ${(error as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Mint Batch Credentials</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {credentials.map((cred, index) => (
          <div key={index} className="p-4 border rounded-md space-y-3 relative">
            <h3 className="text-lg font-medium mb-2">Credential #{index + 1}</h3>
            <Input
              label="Student Public Key"
              placeholder="e.g., G4xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={cred.studentPublicKey}
              onChange={(e) => handleCredentialChange(index, 'studentPublicKey', e.target.value)}
              required
            />
            <Input
              label="Skill Name"
              placeholder="e.g., Web Development Fundamentals"
              value={cred.skillName}
              onChange={(e) => handleCredentialChange(index, 'skillName', e.target.value)}
              required
            />
            <Input
              label="Issuer Name (Optional, defaults to your wallet)"
              placeholder="e.g., CredVault Academy"
              value={cred.issuerName}
              onChange={(e) => handleCredentialChange(index, 'issuerName', e.target.value)}
            />
            <Input
              label="Issue Date"
              type="date"
              value={new Date(cred.issueDate * 1000).toISOString().split('T')[0]}
              onChange={(e) => handleCredentialChange(index, 'issueDate', e.target.value)}
              required
            />
            {credentials.length > 1 && (
              <Button
                type="button"
                onClick={() => removeCredentialEntry(index)}
                variant="destructive"
                className="absolute top-2 right-2"
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <div className="flex justify-between items-center">
          <Button type="button" onClick={addCredentialEntry} variant="outline">
            Add Another Credential
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Minting...' : 'Mint All Credentials'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MintBatchCredentialsForm;
