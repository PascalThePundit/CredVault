import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import FeatureCard from '../components/FeatureCard';
import StatCard from '../components/StatCard';
import SectionHeader from '../components/SectionHeader';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <Layout>
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-h1 font-bold text-text-primary mb-4">Empower Your Future with Verifiable Credentials</h1>
          <p className="text-body text-text-secondary max-w-2xl mx-auto mb-8">CredVault is a decentralized platform built on Solana, enabling institutions to issue verifiable credentials and individuals to own, manage, and share their achievements securely.</p>
          <div className="flex justify-center space-x-4">
            <Button variant="primary" size="large" onClick={() => router.push('/auth')}>Get Started</Button>
            <Button variant="outline" size="large" onClick={() => router.push('/docs')}>Learn More</Button>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-surface">
        <div className="container mx-auto px-4">
          <SectionHeader title="How CredVault Works" description="A seamless process to secure and verify your achievements on the Solana blockchain." />
          <div className="grid md:grid-cols-4 gap-8 mt-12">
            <Card><div className="text-center"><div className="text-primary text-3xl mb-4">1</div><h3 className="text-h3 mb-2">Issue</h3><p className="text-text-secondary">Institutions mint verifiable credentials as non-transferable NFTs on Solana, with metadata securely stored on IPFS.</p></div></Card>
            <Card><div className="text-center"><div className="text-primary text-3xl mb-4">2</div><h3 className="text-h3 mb-2">Own</h3><p className="text-text-secondary">Individuals gain full ownership and control over their digital credentials, managing them in their Solana wallet.</p></div></Card>
            <Card><div className="text-center"><div className="text-primary text-3xl mb-4">3</div><h3 className="text-h3 mb-2">Share</h3><p className="text-text-secondary">Easily present your verified credentials to employers, educational institutions, or other verifiers with a simple link or QR code.</p></div></Card>
            <Card><div className="text-center"><div className="text-primary text-3xl mb-4">4</div><h3 className="text-h3 mb-2">Verify</h3><p className="text-text-secondary">Employers and third parties can instantly and cryptographically verify the authenticity and integrity of any credential on the Solana blockchain.</p></div></Card>
          </div>
        </div>
      </section>

      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeader title="Key Features" description="Discover the advanced capabilities that make CredVault the future of verifiable credentials." />
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <FeatureCard title="Solana-Powered" description="Leveraging Solana's high throughput and low transaction costs for efficient, scalable, and eco-friendly credential management." icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>} />
            <FeatureCard title="Verifiable NFTs" description="Credentials are issued as unique, non-transferable NFTs, ensuring immutable authenticity and verifiable ownership on the blockchain." icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.279a11.952 11.952 0 01-.548-8.256C18.647 3.075 17.5 2 15.5 2H8.5C6.5 2 5.353 3.075 4.93 4.465a11.952 11.952 0 01-.548 8.256C3.075 18.647 2 17.5 2 15.5v-7c0-2 1.075-3.147 2.465-3.57a11.952 11.952 0 018.256-.548z"></path></svg>} />
            <FeatureCard title="IPFS Storage" description="Securely and decentrally store rich credential metadata and associated artifacts on IPFS, ensuring data availability and censorship resistance." icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>} />
            <FeatureCard title="Role-Based Access" description="Tailored user experiences and functionalities for students, credential issuers, and employers/verifiers, streamlining their interactions." icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h-2A4 4 0 0011 16V7a4 4 0 00-4-4H5a4 4 0 00-4 4v9a4 4 0 004 4h2m3-12h6m-6 4h6m-6 4h6"></path></svg>} />
            <FeatureCard title="Proof of Work" description="Showcase practical skills and real-world experience by minting verifiable Proof of Work credentials, enhancing your professional profile." icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M17 16l4-4m-4 4l-4-4"></path></svg>} />
            <FeatureCard title="Secure Verification" description="Instant, tamper-proof, and cryptographic verification of credentials, eliminating fraud and building trust in digital achievements." icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.279a11.952 11.952 0 01-.548-8.256C18.647 3.075 17.5 2 15.5 2H8.5C6.5 2 5.353 3.075 4.93 4.465a11.952 11.952 0 01-.548 8.256C3.075 18.647 2 17.5 2 15.5v-7c0-2 1.075-3.147 2.465-3.57a11.952 11.952 0 018.256-.548z"></path></svg>} />
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4">
          <SectionHeader title="Impact & Growth" description="Key metrics showcasing CredVault's growing reach and effectiveness in the decentralized credential space." />
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <StatCard label="Users Empowered" value="10,000+" />
            <StatCard label="Credentials Issued" value="50,000+" />
            <StatCard label="Verifications Processed" value="100,000+" />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-h2 font-bold text-text-primary mb-4">Ready to Transform Your Credentials?</h2>
          <div className="flex justify-center space-x-4">
            <Button variant="primary" size="large" onClick={() => router.push('/auth')}>Create Account</Button>
            <Button variant="outline" size="large" onClick={() => router.push('/dashboard')}>Explore Demo</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
