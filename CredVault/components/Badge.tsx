import { useState } from 'react';

interface BadgeProps {
  variant: 'verified' | 'pending' | 'expired';
  children: React.ReactNode;
}

const Badge = ({ variant, children }: BadgeProps) => {
  const badgeClass = {
    verified: 'badge-verified',
    pending: 'badge-pending',
    expired: 'badge-expired'
  }[variant];

  return (
    <span className={`badge ${badgeClass}`}>
      {children}
    </span>
  );
};

export default Badge;