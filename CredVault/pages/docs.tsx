import React, { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Docs = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'for-students', title: 'For Students' },
    { id: 'for-issuers', title: 'For Issuers' },
    { id: 'api-reference', title: 'API Reference' },
    { id: 'faq', title: 'FAQ' },
  ];

  const SectionContent: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <details open className="mb-4">
      <summary className="text-xl font-bold text-text-primary cursor-pointer hover:text-primary transition-colors">{title}</summary>
      <div className="prose prose-invert max-w-none mt-4 text-text-secondary">{children}</div>
    </details>
  );

  const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-surface rounded-lg p-4 my-4 text-sm font-mono text-text-primary relative">
        <Button variant="icon" size="icon" className="absolute top-2 right-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></Button>
        <pre><code>{children}</code></pre>
    </div>
  );

  const docsContent = {
    'getting-started': (
        <SectionContent title="Getting Started">
            <p>CredVault is a blockchain-based credential verification platform built on Solana...</p>
            <h4 className="text-lg font-bold mt-6 mb-2">Prerequisites</h4>
            <ul>
                <li>A Solana-compatible wallet (Phantom, Solflare, etc.)</li>
                <li>Some SOL for transaction fees</li>
                <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
            </ul>
            <h4 className="text-lg font-bold mt-6 mb-2">Quick Start</h4>
            <ol>
                <li>Connect your wallet to CredVault...</li>
                <li>Navigate to the Dashboard...</li>
            </ol>
        </SectionContent>
    ),
    'for-students': (
        <SectionContent title="For Students">
            <p>As a student, you can receive blockchain-verified credentials...</p>
        </SectionContent>
    ),
    'for-issuers': (
        <SectionContent title="For Issuers">
            <p>As an issuer, you can create and issue blockchain-verified credentials...</p>
        </SectionContent>
    ),
    'api-reference': (
        <SectionContent title="API Reference">
            <p>All API requests require authentication using an API key...</p>
            <CodeBlock>
                {`GET /api/credentials/abc123

curl -X GET "https://api.credvault.dev/api/credentials/abc123" \\
-H "Authorization: Bearer YOUR_API_KEY"`}
            </CodeBlock>
            <CodeBlock>
                {`POST /api/credentials

curl -X POST "https://api.credvault.dev/api/credentials" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{"recipient": "wallet_address", "type": "degree"}'`}
            </CodeBlock>
        </SectionContent>
    ),
    faq: (
        <SectionContent title="Frequently Asked Questions">
            <details className="mb-2">
                <summary className="font-semibold cursor-pointer">What is a blockchain-verified credential?</summary>
                <p className="mt-2">A blockchain-verified credential is a digital certificate that is stored immutably on the Solana blockchain...</p>
            </details>
            <details className="mb-2">
                <summary className="font-semibold cursor-pointer">How do I receive a credential?</summary>
                <p className="mt-2">To receive a credential, you must apply through a verified issuer in our network...</p>
            </details>
        </SectionContent>
    ),
  };

  return (
    <Layout title="CredVault - Documentation">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/4">
            <div className="sticky top-24">
              <h2 className="text-xl font-bold text-text-primary mb-4">Documentation</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? 'primary' : 'ghost'}
                    onClick={() => setActiveSection(section.id)}
                    className="w-full justify-start"
                  >
                    {section.title}
                  </Button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="md:w-3/4">
            <Card>
              {docsContent[activeSection as keyof typeof docsContent]}
            </Card>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Docs;
