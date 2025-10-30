import type { NextPage } from 'next';
import Head from 'next/head';
import Header from '../components/Header';
import { useAuth } from '../components/AuthProvider';
import { CredentialType } from '../lib/credentialSchema';

const Credentials: NextPage = () => {
  const { user } = useAuth();

  // Mock credentials data
  const mockCredentials = [
    {
      id: '1',
      name: 'JavaScript Fundamentals',
      issuer: 'Dev Academy Nigeria',
      type: CredentialType.SKILL,
      issuedAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      status: 'Active',
    },
    {
      id: '2',
      name: 'Solana Development',
      issuer: 'Solana Foundation',
      type: CredentialType.CERTIFICATION,
      issuedAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
      status: 'Active',
    },
    {
      id: '3',
      name: 'Hackathon Winner',
      issuer: 'Nigeria Tech Week',
      type: CredentialType.HACKATHON,
      issuedAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
      status: 'Active',
    }
  ];

  if (!user) {
    return (
      <div>
        <Head>
          <title>CredVault - Credentials</title>
          <meta name="description" content="Your credentials on CredVault" />
        </Head>

        <Header />
        
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Credentials</h1>
          <p>Please connect your wallet to view your credentials.</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>CredVault - Credentials</title>
        <meta name="description" content="Your credentials on CredVault" />
      </Head>

      <Header />
      
      <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <h1>Your Credentials</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          {mockCredentials.map((credential) => (
            <div key={credential.id} style={{
              border: '1px solid #eaeaea',
              borderRadius: '8px',
              padding: '1.5rem',
              backgroundColor: '#f8f9fa'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{credential.name}</h3>
              <p style={{ margin: '0.5rem 0', color: '#666' }}>{credential.issuer}</p>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                Type: <span style={{ textTransform: 'capitalize' }}>{credential.type}</span>
              </p>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                Status: <span style={{ color: '#28a745', fontWeight: 'bold' }}>{credential.status}</span>
              </p>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#888' }}>
                Issued: {new Date(credential.issuedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Credentials;