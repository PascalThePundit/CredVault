import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon' | 'connect' | 'danger';
  size?: 'large' | 'medium' | 'small' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      loading,
      icon,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';

    const variantStyles = {
      primary:
        'bg-primary text-white hover:bg-purple-700 active:bg-purple-800 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed',
      secondary:
        'bg-secondary text-white hover:bg-teal-700 active:bg-teal-800 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed',
      outline:
        'bg-transparent text-text-primary border-2 border-border hover:bg-surface-light hover:border-primary active:bg-gray-800 disabled:border-gray-600 disabled:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed',
      ghost:
        'bg-transparent text-text-primary hover:bg-surface active:bg-surface-light disabled:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed',
      icon: 'bg-transparent hover:bg-surface-light hover:text-primary active:bg-gray-800 disabled:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed',
      connect:
        'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-glow active:shadow-none disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed',
      danger:
        'bg-error text-white hover:bg-red-700 active:bg-red-800 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed',
    };

    const sizeStyles = {
      large: 'h-12 px-4 text-base rounded-md',
      medium: 'h-11 px-6 text-base rounded-md',
      small: 'h-9 px-4 text-sm rounded-md',
      icon: 'h-10 w-10 rounded-md',
    };

    const loadingSpinner = (
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );

    const classes = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      'transform hover:scale-102 active:scale-98',
      className,
    ]
      .join(' ')
      .trim();

    return (
      <button ref={ref} className={classes} disabled={loading || props.disabled} {...props}>
        {loading ? (
          loadingSpinner
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
