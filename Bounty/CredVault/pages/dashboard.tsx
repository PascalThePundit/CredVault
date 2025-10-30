// pages/dashboard.tsx
import type { NextPage } from 'next';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { UserRoleSelector } from '../components/UserRoleSelector';
import { IssuerDashboard } from '../components/IssuerDashboard';
import { StudentDashboard } from '../components/StudentDashboard';
import { EmployerDashboard } from '../components/EmployerDashboard';

const Dashboard: NextPage = () => {
  const { user, loading } = useAuth();
  const { connected } = useWallet();

  if (!connected) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-4 text-lg text-gray-600">Please connect your wallet to access the dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!user?.type) {
    return <UserRoleSelector />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Welcome, {user.type.charAt(0).toUpperCase() + user.type.slice(1)}</p>
      </div>

      {user.type === 'issuer' && <IssuerDashboard />}
      {user.type === 'student' && <StudentDashboard />}
      {user.type === 'employer' && <EmployerDashboard />}
    </div>
  );
};

export default Dashboard;