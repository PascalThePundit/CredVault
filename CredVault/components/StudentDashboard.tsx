import { useState } from 'react';
import CredentialCard from './CredentialCard';
import StatCard from './StatCard';
import EmptyState from './EmptyState';
import SectionHeader from './SectionHeader';
import { showNotification } from '../utils/notifications';
import { useAuth } from '../contexts/AuthContext';
import Badge from './ui/Badge';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState([
    {
      id: 1,
      issuer: 'University of Blockchain',
      title: 'Computer Science Degree',
      date: 'May 15, 2023',
      status: 'verified' as const,
    },
    {
      id: 2,
      issuer: 'Solana Academy',
      title: 'Blockchain Development Certification',
      date: 'Aug 22, 2023',
      status: 'verified' as const,
    },
    {
      id: 3,
      issuer: 'Web3 Institute',
      title: 'Smart Contract Development',
      date: 'Nov 3, 2023',
      status: 'pending' as const,
    },
  ]);

  const handleShareCredential = (credentialId: number) => {
    showNotification(
      'Share Functionality',
      `Sharing for credential ID ${credentialId} is not yet fully implemented. This would generate a shareable link or manage permissions.`,
      'info'
    );
    // In a real implementation, this would open a modal for sharing options
    // or trigger a backend call to generate a shareable link.
  };

  return (
    <div>
      <SectionHeader title="My Credentials" />
      {user && (
        <div className="mb-4 flex items-center space-x-2">
          <p className="text-lg font-medium">Wallet: {user.publicKey?.toBase58().substring(0, 8)}...</p>
          <Badge variant={user.verificationLevel === 'verified' ? 'verified' : 'pending'}>
            {user.verificationLevel}
          </Badge>
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Credentials" value={credentials.length} />
        <StatCard label="Verified Skills" value={credentials.filter(c => c.status === 'verified').length} />
        <StatCard label="Proof-of-Work NFTs" value="3" />
      </div>

      {credentials.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {credentials.map((credential) => (
            <CredentialCard
              key={credential.id}
              issuer={credential.issuer}
              title={credential.title}
              date={credential.date}
              status={credential.status}
              validityScore={credential.validityScore} // Pass validity score
              onViewDetails={() => console.log('View details for:', credential.id)}
              onDownload={() => console.log('Download:', credential.id)}
              onShare={() => handleShareCredential(credential.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Credentials Yet"
          description="You don\'t have any credentials yet. Explore opportunities to earn your first credential."
          ctaText="Explore Opportunities"
          onCtaClick={() => {}}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
