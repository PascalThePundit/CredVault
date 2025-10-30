import MintBatchCredentialsForm from './MintBatchCredentialsForm';
import { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Textarea from './ui/Textarea';
import Card from './ui/Card';
import StatCard from './StatCard';
import Badge from './ui/Badge';
import SectionHeader from './SectionHeader';
import EmptyState from './EmptyState';
import { useAuth } from '../contexts/AuthContext';
import AnalyticsDashboard from './AnalyticsDashboard';

const IssuerDashboard = () => {
  const { user } = useAuth();
  const [issuedCredentials, setIssuedCredentials] = useState([
    {
      id: 1,
      student: 'John Doe',
      credential: 'Blockchain Certificate',
      date: 'Oct 10, 2023',
      status: 'verified' as const,
    },
    {
      id: 2,
      student: 'Jane Smith',
      credential: 'Web3 Fundamentals',
      date: 'Oct 12, 2023',
      status: 'pending' as const,
    },
  ]);



  return (
    <div>
      <SectionHeader title="Issue Credentials" />
      {user && (
        <div className="mb-4 flex items-center space-x-2">
          <p className="text-lg font-medium">Wallet: {user.publicKey?.toBase58().substring(0, 8)}...</p>
          <Badge variant={
            user.verificationLevel === 'verified' ? 'verified' :
            user.verificationLevel === 'basic' ? 'pending' :
            'expired'
          }>
            {user.verificationLevel}
          </Badge>
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Credentials Issued" value="42" />
        <StatCard label="Verification Rate" value="98%" />
        <StatCard label="Pending Requests" value="3" />
      </div>

      <MintBatchCredentialsForm />

      <Card className="mb-8">
        <h3 className="text-h3 font-bold text-text-primary mb-4">Recent Issuances</h3>
        {issuedCredentials.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-text-secondary">Student</th>
                  <th className="text-left py-3 text-text-secondary">Credential</th>
                  <th className="text-left py-3 text-text-secondary">Date</th>
                  <th className="text-left py-3 text-text-secondary">Status</th>
                  <th className="text-left py-3 text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issuedCredentials.map((issuance) => (
                  <tr key={issuance.id} className="border-b border-border last:border-b-0">
                    <td className="py-3 text-text-primary">{issuance.student}</td>
                    <td className="py-3 text-text-primary">{issuance.credential}</td>
                    <td className="py-3 text-text-primary">{issuance.date}</td>
                    <td className="py-3">
                      <Badge variant={issuance.status}>{issuance.status}</Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <Button variant="icon" size="icon"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></Button>
                        <Button variant="icon" size="icon"><svg className="w-5 h5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></Button>
                        <Button variant="icon" size="icon"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Credentials Issued Yet"
            description="You haven't issued any credentials yet. Issue your first credential to get started."
            ctaText="Issue Your First Credential"
            onCtaClick={() => {}}
          />
        )}
      </Card>

      <AnalyticsDashboard />
    </div>
  );
};

export default IssuerDashboard;
