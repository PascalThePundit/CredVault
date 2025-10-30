import { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';
import FeatureCard from '../components/FeatureCard';
import CredentialCard from '../components/CredentialCard';

export default function Verify() {
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
    <Layout title="CredVault - Verify Credentials">
      <div className="container mx-auto px-4 py-16">
        <SectionHeader
          title="Verify Credentials"
          description="Instantly verify blockchain-based credentials"
        />

        <Card className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="space-y-4">
            <Input
              type="text"
              placeholder="Search by Credential ID or Wallet Address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size={20}
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
            <div className="max-w-3xl mx-auto">
                <CredentialCard
                    issuer="University of Blockchain"
                    title="Computer Science Degree"
                    date="May 15, 2023"
                    status="verified"
                />
                <div className="flex justify-center space-x-4 mt-4">
                    <Button variant="primary">Download</Button>
                    <Button variant="outline">Share</Button>
                    <Button variant="outline">View on Blockchain</Button>
                </div>
            </div>
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

        <div className="max-w-5xl mx-auto mt-24">
            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard title="Instant Verification" description="Verify credentials in seconds without contacting the issuer." icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} />
                <FeatureCard title="Blockchain Secured" description="All credentials are secured on the Solana blockchain for immutability." icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>} />
                <FeatureCard title="Shareable Proof" description="Share verifiable credentials with employers and institutions." icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-8.316l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.998a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path></svg>} />
            </div>
        </div>
      </div>
    </Layout>
  );
}
