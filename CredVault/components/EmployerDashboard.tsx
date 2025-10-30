import { useState, useEffect, useMemo } from 'react';
import SectionHeader from './SectionHeader';
import StatCard from './StatCard';
import Card from './ui/Card';
import EmployerVerificationPortal from './EmployerVerificationPortal';
import { useAuth } from '../contexts/AuthContext';
import EmptyState from './EmptyState';
import { credVaultService } from '../services/credVaultService';
import LoadingSpinner from './LoadingSpinner';
import Input from './ui/Input';

const EmployerDashboard = () => {
  console.log('EmployerDashboard rendering...');
  const { user, loading: authLoading } = useAuth();
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [allPublicCredentials, setAllPublicCredentials] = useState<any[]>([]);
  const [credentialsLoading, setCredentialsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIssuer, setFilterIssuer] = useState('');
  useEffect(() => {
    const fetchPublicCredentials = async () => {
      try {
        setCredentialsLoading(true);
        const credentials = await credVaultService.getAllPublicCredentials();
        setAllPublicCredentials(credentials);
      } catch (error) {
        console.error('Error fetching public credentials:', error);
      } finally {
        setCredentialsLoading(false);
      }
    };

    if (!authLoading && user && user.type === 'employer') {
      fetchPublicCredentials();
    }
  }, [authLoading, user]);

  const filteredCredentials = useMemo(() => {
    let filtered = allPublicCredentials;

    if (searchTerm) {
      filtered = filtered.filter(
        (cred) =>
          cred.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cred.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cred.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterIssuer) {
      filtered = filtered.filter((cred) => cred.issuer.toLowerCase().includes(filterIssuer.toLowerCase()));
    }

    return filtered;
  }, [allPublicCredentials, searchTerm, filterIssuer]);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user || user.type !== 'employer') {
    return (
      <EmptyState
        title="Access Denied"
        description="You must be logged in as an employer to access this dashboard."
        ctaText="Login as Employer"
        onCtaClick={() => { /* TODO: Implement redirection to login or role selection */ }}
      />
    );
  }

  return (
    <div>
      <SectionHeader title="Employer Dashboard" />
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Credentials Verified" value={verifiedCount.toString()} />
        <StatCard label="Pending Verifications" value={pendingRequests.toString()} />
        <StatCard label="Total Verifications" value="150" /> {/* Placeholder */}
      </div>

      <Card className="mb-8">
        <h3 className="text-h3 font-bold text-text-primary mb-4">Verify Credentials</h3>
        <EmployerVerificationPortal />
      </Card>

      <Card className="mb-8">
        <h3 className="text-h3 font-bold text-text-primary mb-4">Discover Public Credentials</h3>
        <div className="flex space-x-4 mb-4">
          <Input
            placeholder="Search by skill, issuer, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Input
            placeholder="Filter by Issuer..."
            value={filterIssuer}
            onChange={(e) => setFilterIssuer(e.target.value)}
            className="w-1/3"
          />
        </div>
        {credentialsLoading ? (
          <LoadingSpinner />
        ) : filteredCredentials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCredentials.map((credential) => (
              <Card key={credential.id} className="p-4">
                <h4 className="font-semibold text-lg">{credential.skillName}</h4>
                <p className="text-sm text-text-secondary">Issuer: {credential.issuer} {credential.issuerReputation && <span className="text-yellow-500">({credential.issuerReputation} / 5)</span>}</p>
                <p className="text-sm text-text-secondary">Owner: {credential.owner?.substring(0, 8)}...</p>
                <p className="text-sm text-text-secondary">Issued: {credential.issueDate}</p>
                {credential.validityScore && <p className="text-sm text-text-secondary">Validity Score: {credential.validityScore}/100</p>}
                {credential.metadataUri && (
                  <a href={credential.metadataUri} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm mt-2 block">
                    View Details
                  </a>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Matching Credentials Found"
            description="Adjust your search or filter criteria."
          />
        )}
      </Card>

      <Card className="mb-8">
        <h3 className="text-h3 font-bold text-text-primary mb-4">Recommended Credentials</h3>
        {credentialsLoading ? (
          <LoadingSpinner />
        ) : allPublicCredentials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPublicCredentials
              .sort(() => 0.5 - Math.random())
              .slice(0, 3) // Display up to 3 random recommendations
              .map((credential) => (
                <Card key={credential.id} className="p-4 bg-blue-50 border-blue-200">
                  <h4 className="font-semibold text-lg">{credential.skillName}</h4>
                  <p className="text-sm text-text-secondary">Issuer: {credential.issuer} {credential.issuerReputation && <span className="text-yellow-500">({credential.issuerReputation} / 5)</span>}</p>
                  <p className="text-sm text-text-secondary">Owner: {credential.owner?.substring(0, 8)}...</p>
                  <p className="text-sm text-text-secondary">Issued: {credential.issueDate}</p>
                  {credential.validityScore && <p className="text-sm text-text-secondary">Validity Score: {credential.validityScore}/100</p>}
                  {credential.metadataUri && (
                    <a href={credential.metadataUri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mt-2 block">
                      View Details
                    </a>
                  )}
                </Card>
              ))}
          </div>
        ) : (
          <EmptyState
            title="No Recommendations Available"
            description="No public credentials to recommend at the moment."
          />
        )}
      </Card>

      <Card>
        <h3 className="text-h3 font-bold text-text-primary mb-4">Verification History</h3>
        <p className="text-text-secondary">Coming Soon: A list of all credentials you have verified.</p>
      </Card>
    </div>
  );
};

export default EmployerDashboard;
