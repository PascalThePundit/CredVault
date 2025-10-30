// components/MintCredentialForm.tsx
import { useState } from 'react';
import { useCredVault } from '../contexts/CredVaultContext';
import { showNotification } from '../utils/notifications';

export const MintCredentialForm = () => {
  const { program, connection, loading: contextLoading, error: contextError } = useCredVault();
  const [formData, setFormData] = useState({
    studentPublicKey: '',
    skillName: '',
    issueDate: new Date().toISOString().split('T')[0],
    credentialUri: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program || !connection) {
      showNotification('Error', 'Program not initialized', 'error');
      return;
    }

    setLoading(true);
    
    try {
      // Format the date as a Unix timestamp
      const issueDate = Math.floor(new Date(formData.issueDate).getTime() / 1000);
      
      // In a real implementation, we would call the service method
      // For now, we'll show a notification that the action would happen
      showNotification('Credential Minting', 'Minting credential in a real implementation', 'info');
      
      // Reset form
      setFormData({
        studentPublicKey: '',
        skillName: '',
        issueDate: new Date().toISOString().split('T')[0],
        credentialUri: '',
      });
    } catch (error) {
      console.error('Error minting credential:', error);
      showNotification('Mint Failed', `Error: ${(error as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label htmlFor="studentPublicKey" className="block text-sm font-medium text-gray-700">
            Student Public Key
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="studentPublicKey"
              id="studentPublicKey"
              value={formData.studentPublicKey}
              onChange={handleChange}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Student's Solana public key"
            />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="skillName" className="block text-sm font-medium text-gray-700">
            Skill/Credential Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="skillName"
              id="skillName"
              value={formData.skillName}
              onChange={handleChange}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="e.g. JavaScript Fundamentals"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
            Issue Date
          </label>
          <div className="mt-1">
            <input
              type="date"
              name="issueDate"
              id="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="credentialUri" className="block text-sm font-medium text-gray-700">
            Credential URI
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="credentialUri"
              id="credentialUri"
              value={formData.credentialUri}
              onChange={handleChange}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="IPFS URI for credential metadata"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            URI to the credential's metadata on IPFS (e.g., ipfs://Qm...)
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || contextLoading}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Minting...' : 'Mint Credential'}
        </button>
      </div>
    </form>
  );
};