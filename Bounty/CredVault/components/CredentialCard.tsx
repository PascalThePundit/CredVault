// components/CredentialCard.tsx
import { useState } from 'react';

interface CredentialProps {
  credential: {
    id: string;
    issuer: string;
    skill: string;
    issueDate: string;
    isVerified: boolean;
    isRevoked: boolean;
    credentialUri: string;
  };
}

export const CredentialCard = ({ credential }: CredentialProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{credential.skill}</h3>
          <p className="text-sm text-gray-500">Issued by: {credential.issuer}</p>
        </div>
        <div className="flex items-center">
          {credential.isVerified ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Not Verified
            </span>
          )}
          {credential.isRevoked && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Revoked
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">{credential.issueDate}</span>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Credential ID</p>
              <p className="text-gray-900 font-mono break-all text-xs">{credential.id}</p>
            </div>
            <div>
              <p className="text-gray-500">Metadata</p>
              <a 
                href={credential.credentialUri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline break-all text-xs"
              >
                View on IPFS
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};