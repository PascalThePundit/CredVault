import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import IssuerDashboard from '../components/IssuerDashboard';
import StudentDashboard from '../components/StudentDashboard';
import VerifierDashboard from '../components/VerifierDashboard';
import EmployerDashboard from '../components/EmployerDashboard';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<'student' | 'issuer' | 'verifier' | 'employer'>('student');

  useEffect(() => {
    console.log('User object in dashboard:', user);
    if (user && user.type) {
      setActiveRole(user.type as 'student' | 'issuer' | 'verifier' | 'employer');
    } else if (!loading && !user) {
      // If not logged in, default to student view for demo purposes
      setActiveRole('student');
    }
  }, [user, loading]);

  const renderDashboard = () => {
    if (loading) {
      return <div className="text-center py-8">Loading dashboard...</div>;
    }

    if (!user) {
      return (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Welcome to the CredVault Demo!</h2>
          <p className="text-text-secondary mb-6">You are currently viewing the student dashboard demo. To access full features and manage your own credentials, please log in or register.</p>
          <Button variant="primary" onClick={() => router.push('/auth')}>Login / Register</Button>
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2 bg-surface p-1 rounded-lg">
              <Button
                variant={activeRole === 'student' ? 'primary' : 'ghost'}
                onClick={() => setActiveRole('student')}
              >
                Student Demo
              </Button>
              <Button
                variant={activeRole === 'issuer' ? 'primary' : 'ghost'}
                onClick={() => setActiveRole('issuer')}
              >
                Issuer Demo
              </Button>
              <Button
                variant={activeRole === 'verifier' ? 'primary' : 'ghost'}
                onClick={() => setActiveRole('verifier')}
              >
                Verifier Demo
              </Button>
            </div>
          </div>
          {activeRole === 'student' && <StudentDashboard />}
          {activeRole === 'issuer' && <IssuerDashboard />}
          {activeRole === 'verifier' && <VerifierDashboard />}
        </div>
      );
    }

    switch (activeRole) {
      case 'student':
        return <StudentDashboard />;
      case 'issuer':
        return <IssuerDashboard />;
      case 'verifier':
        return <VerifierDashboard />;
      case 'employer':
        return <EmployerDashboard />;
      default:
        return null;
    }
  };

  return (
    <Layout title="CredVault - Dashboard">
      <div className="container mx-auto px-4 py-8">
        {renderDashboard()}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
