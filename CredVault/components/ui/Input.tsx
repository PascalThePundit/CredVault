import { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    const baseStyles =
      'w-full bg-surface border-2 border-border rounded-md px-4 py-3 text-base text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:border-primary';

    const errorStyles = error ? 'border-error focus:ring-error' : '';

    const classes = [baseStyles, errorStyles, className].join(' ').trim();

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        <input ref={ref} className={classes} {...props} />
        {error && <p className="text-sm text-error mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
