// pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';

const Home: NextPage = () => {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>CredVault - Decentralized Credentialing Platform</title>
        <meta name="description" content="Secure, verifiable credentials for African youth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Decentralized Credentialing for African Youth
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-xl text-indigo-100">
                Secure, verifiable credentials and proof-of-work NFTs on Solana for Nigerian and African talent.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                {connected ? (
                  <Link href="/dashboard" className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50">
                    Go to Dashboard
                  </Link>
                ) : (
                  <div className="px-6 py-3 bg-white text-indigo-700 font-medium rounded-md">
                    Connect Wallet to Get Started
                  </div>
                )}
                <Link href="/about" className="px-6 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-indigo-600">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Transforming Credential Verification
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                CredVault enables trust through blockchain technology
              </p>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="text-center p-6">
                  <div className="inline-block p-3 bg-indigo-100 rounded-full">
                    <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Verifiable Credentials</h3>
                  <p className="mt-2 text-base text-gray-500">
                    On-chain credentials that cannot be falsified, providing employers with trustable verification.
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="inline-block p-3 bg-indigo-100 rounded-full">
                    <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Proof of Work NFTs</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Showcase completed projects and hackathon work with transferable NFTs.
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="inline-block p-3 bg-indigo-100 rounded-full">
                    <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Global Opportunities</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Connect African talent with global employers and opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-indigo-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-indigo-200">Join the credential revolution.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                {connected ? (
                  <Link href="/dashboard" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50">
                    Go to Dashboard
                  </Link>
                ) : (
                  <div className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white">
                    Connect Wallet First
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;