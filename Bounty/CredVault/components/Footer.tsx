// components/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <span className="text-lg font-bold text-indigo-600">CredVault</span>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; {new Date().getFullYear()} CredVault. Empowering African youth with verifiable credentials.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;