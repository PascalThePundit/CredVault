// components/UserRoleSelector.tsx
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export const UserRoleSelector = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'issuer' | 'student' | 'employer' | null>(null);

  const handleRoleSelect = (role: 'issuer' | 'student' | 'employer') => {
    setSelectedRole(role);
  };

  const handleConfirm = () => {
    if (selectedRole) {
      login(selectedRole);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Select Your Role</h3>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-gray-500">Please select your role to access the appropriate dashboard:</p>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div 
                className={`border rounded-lg p-4 text-center cursor-pointer ${
                  selectedRole === 'issuer' 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-300'
                }`}
                onClick={() => handleRoleSelect('issuer')}
              >
                <div className="text-indigo-600">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="mt-2 text-sm font-medium text-gray-900">Issuer</h4>
                <p className="mt-1 text-xs text-gray-500">Training organizations, hackathons, employers</p>
              </div>

              <div 
                className={`border rounded-lg p-4 text-center cursor-pointer ${
                  selectedRole === 'student' 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-300'
                }`}
                onClick={() => handleRoleSelect('student')}
              >
                <div className="text-indigo-600">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="mt-2 text-sm font-medium text-gray-900">Student</h4>
                <p className="mt-1 text-xs text-gray-500">Learners receiving credentials</p>
              </div>

              <div 
                className={`border rounded-lg p-4 text-center cursor-pointer ${
                  selectedRole === 'employer' 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 hover:border-indigo-300'
                }`}
                onClick={() => handleRoleSelect('employer')}
              >
                <div className="text-indigo-600">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="mt-2 text-sm font-medium text-gray-900">Employer</h4>
                <p className="mt-1 text-xs text-gray-500">Companies verifying credentials</p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleConfirm}
                disabled={!selectedRole}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  selectedRole 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Continue as {selectedRole ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) : '...'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};