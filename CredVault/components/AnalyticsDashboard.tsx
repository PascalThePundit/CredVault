// components/AnalyticsDashboard.tsx
import React from 'react';
import Card from './ui/Card';
import StatCard from './StatCard';
import SectionHeader from './SectionHeader';

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <SectionHeader title="Credential Analytics" />

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard label="Total Credentials Issued" value="1,234" />
        <StatCard label="Total Verifications" value="5,678" />
        <StatCard label="Active Issuers" value="87" />
        <StatCard label="Daily Active Users" value="500" />
        <StatCard label="New Users This Month" value="120" />
        <StatCard label="API Calls (Last 24h)" value="10,000" />
      </div>

      <Card className="p-6">
        <h3 className="text-h3 font-bold text-text-primary mb-4">Credential Issuance Trends</h3>
        <p className="text-text-secondary">[Placeholder for a chart showing issuance over time]</p>
        <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-h3 font-bold text-text-primary mb-4">Top Skills Issued</h3>
        <ul className="list-disc list-inside text-text-primary">
          <li>Solana Development (250)</li>
          <li>Web3 Fundamentals (180)</li>
          <li>Rust Programming (150)</li>
          <li>Smart Contract Security (120)</li>
        </ul>
      </Card>

      <Card className="p-6">
        <h3 className="text-h3 font-bold text-text-primary mb-4">Verification Activity</h3>
        <p className="text-text-secondary">[Placeholder for a chart showing verification activity by employer type]</p>
        <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-h3 font-bold text-text-primary mb-4">User Engagement</h3>
        <p className="text-text-secondary">[Placeholder for a chart showing user engagement over time]</p>
        <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-h3 font-bold text-text-primary mb-4">Credential Impact Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Employment Rate of Credential Holders" value="75%" />
          <StatCard label="Average Salary Increase" value="15%" />
          <StatCard label="Industry Adoption Rate" value="40%" />
          <StatCard label="Credential Revocation Rate" value="2%" />
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
