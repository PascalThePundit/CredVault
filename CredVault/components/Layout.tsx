import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'CredVault' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected, walletAddress, connectWallet, disconnectWallet } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-surface/50 backdrop-blur-default border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-text-primary">CredVault</Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link href="/#features" className="text-text-secondary hover:text-primary transition-colors">Features</Link>
              <Link href="/#how-it-works" className="text-text-secondary hover:text-primary transition-colors">How It Works</Link>
              <Link href="/docs" className="text-text-secondary hover:text-primary transition-colors">Docs</Link>
            </nav>

            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  <span className="hidden sm:inline text-text-primary text-sm bg-surface px-3 py-2 rounded-md">{walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : ''}</span>
                  <Button onClick={disconnectWallet} variant="outline" size="small">Disconnect</Button>
                </div>
              ) : (
                <Button onClick={connectWallet} variant="connect" size="medium">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14a2 2 0 0 1 2 2v4zM3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/></svg>
                  Connect Wallet
                </Button>
              )}
              <div className="md:hidden">
                <Button onClick={toggleMenu} variant="icon" size="icon">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </Button>
              </div>
            </div>
          </div>

                      {isMenuOpen && (
                        <div className="md:hidden py-4 border-t border-border">
                          <div className="flex flex-col space-y-3 px-2">
                            <Link href="/#features" className="text-text-secondary hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Features</Link>
                            <Link href="/#how-it-works" className="text-text-secondary hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>How It Works</Link>
                            <Link href="/docs" className="text-text-secondary hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Docs</Link>
                          </div>
                        </div>
                      )}        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-surface border-t border-border mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-text-primary font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-text-secondary hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="/dashboard" className="text-text-secondary hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/verify" className="text-text-secondary hover:text-primary transition-colors">Verify</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-text-primary font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-text-primary font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-text-secondary hover:text-primary transition-colors">Documentation</Link></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">API</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-text-primary font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="text-text-secondary hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-text-secondary text-sm">&copy; {new Date().getFullYear()} CredVault. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-text-secondary hover:text-primary"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              <a href="#" className="text-text-secondary hover:text-primary"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>
              <a href="#" className="text-text-secondary hover:text-primary"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
