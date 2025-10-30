// components/ProofOfWorkCard.tsx
import { useState } from 'react';

interface ProofOfWorkProps {
  proofOfWork: {
    id: string;
    title: string;
    description: string;
    githubLink: string;
    demoLink: string;
    timestamp: string;
  };
}

export const ProofOfWorkCard = ({ proofOfWork }: ProofOfWorkProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{proofOfWork.title}</h3>
          <p className="text-sm text-gray-500">{proofOfWork.timestamp}</p>
        </div>
        <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{proofOfWork.description}</p>
      
      <div className="mt-4 flex space-x-3">
        <a
          href={proofOfWork.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          GitHub
        </a>
        <span>•</span>
        <a
          href={proofOfWork.demoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Demo
        </a>
      </div>
      
      <div className="mt-4">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">{proofOfWork.description}</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-gray-500">Project ID</p>
              <p className="text-gray-900 font-mono break-all">{proofOfWork.id}</p>
            </div>
            <div>
              <p className="text-gray-500">Created</p>
              <p className="text-gray-900">{proofOfWork.timestamp}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};