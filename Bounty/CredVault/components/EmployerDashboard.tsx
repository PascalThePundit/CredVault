// components/EmployerDashboard.tsx
import { useState } from 'react';
import { VerifyCredentialForm } from './VerifyCredentialForm';

export const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'verify' | 'search'>('verify');

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-4">
          <button
            onClick={() => setActiveTab('verify')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'verify'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Verify Credentials
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'search'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Search Talent
          </button>
        </nav>
      </div>
      
      <div className="p-6">
        {activeTab === 'verify' && <VerifyCredentialForm />}
        {activeTab === 'search' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Search for Credentials</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-500 text-center py-8">Search functionality coming soon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};