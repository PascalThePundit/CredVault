// components/MintProofOfWorkForm.tsx
import { useState } from 'react';
import { useCredVault } from '../contexts/CredVaultContext';
import { showNotification } from '../utils/notifications';

export const MintProofOfWorkForm = () => {
  const { program, connection, loading: contextLoading } = useCredVault();
  const [formData, setFormData] = useState({
    projectTitle: '',
    projectDescription: '',
    githubLink: '',
    demoLink: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // In a real implementation, we would call the service method
      // For now, we'll show a notification that the action would happen
      showNotification('Project NFT Minting', 'Minting project NFT in a real implementation', 'info');
      
      // Reset form
      setFormData({
        projectTitle: '',
        projectDescription: '',
        githubLink: '',
        demoLink: '',
      });
    } catch (error) {
      console.error('Error minting proof of work NFT:', error);
      showNotification('Mint Failed', `Error: ${(error as Error).message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700">
            Project Title
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="projectTitle"
              id="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="e.g. Portfolio Website"
            />
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
            Project Description
          </label>
          <div className="mt-1">
            <textarea
              id="projectDescription"
              name="projectDescription"
              rows={3}
              value={formData.projectDescription}
              onChange={handleChange}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Describe your project, technologies used, and key features..."
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700">
            GitHub Repository
          </label>
          <div className="mt-1">
            <input
              type="url"
              name="githubLink"
              id="githubLink"
              value={formData.githubLink}
              onChange={handleChange}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="https://github.com/username/repo"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="demoLink" className="block text-sm font-medium text-gray-700">
            Demo/Website Link
          </label>
          <div className="mt-1">
            <input
              type="url"
              name="demoLink"
              id="demoLink"
              value={formData.demoLink}
              onChange={handleChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || contextLoading}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Minting...' : 'Mint Project NFT'}
        </button>
      </div>
    </form>
  );
};