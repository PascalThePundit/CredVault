interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner = ({ size = 'medium' }: LoadingSpinnerProps) => {
  const sizeStyles = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div
      className={`animate-spin rounded-full border-4 border-primary border-t-transparent ${sizeStyles[size]}`}
    ></div>
  );
};

export default LoadingSpinner;
