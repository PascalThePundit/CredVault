import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: 'verified' | 'pending' | 'expired';
  children: React.ReactNode;
}

const Badge = ({ variant, children, className = '', ...props }: BadgeProps) => {
  const baseStyles = 'px-3 py-1 text-xs font-medium rounded-md';

  const variantStyles = {
    verified: 'bg-success text-white',
    pending: 'bg-warning text-gray-800',
    expired: 'bg-error text-white',
  };

  const classes = [baseStyles, variantStyles[variant], className].join(' ').trim();

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;
