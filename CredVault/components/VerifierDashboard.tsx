import { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import Badge from './ui/Badge';
import EmptyState from './EmptyState';
import SectionHeader from './SectionHeader';
import CredentialCard from './CredentialCard';

const VerifierDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<'success' | 'not-found' | 'none'>('none');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      const isSuccess = Math.random() > 0.3;
      setVerificationResult(isSuccess ? 'success' : 'not-found');
    }
  };

  const handleTryAgain = () => {
    setVerificationResult('none');
    setSearchQuery('');
  };

  return (
    <div>
      <SectionHeader title="Verify Credentials" />
      <Card className="mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <Input
            type="text"
            placeholder="Search by Credential ID or Wallet Address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="primary" size="large" className="w-full">Search</Button>
        </form>
        <div className="flex items-center my-4">
          <hr className="w-full border-border" />
          <span className="px-4 text-text-secondary">or</span>
          <hr className="w-full border-border" />
        </div>
        <Button variant="outline" size="large" className="w-full">Browse Recent</Button>
      </Card>

      {verificationResult === 'success' && (
        <CredentialCard
          issuer="University of Blockchain"
          title="Computer Science Degree"
          date="May 15, 2023"
          status="verified"
        />
      )}

      {verificationResult === 'not-found' && (
        <EmptyState
          title="Credential Not Found"
          description="Try searching with a different ID or wallet address."
          ctaText="Search Again"
          onCtaClick={handleTryAgain}
        />
      )}

      {verificationResult === 'none' && (
        <div className="text-center py-8">
          <p className="text-text-secondary">Enter a credential ID or wallet address to verify credentials.</p>
        </div>
      )}
    </div>
  );
};

export default VerifierDashboard;
