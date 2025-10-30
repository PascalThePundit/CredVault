import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = '', ...props }: CardProps) => {
  const baseStyles =
    'bg-surface/10 backdrop-blur-default border border-border rounded-lg shadow-subtle p-6';

  const classes = [baseStyles, className].join(' ').trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
