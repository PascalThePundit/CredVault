import { forwardRef, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    const baseStyles =
      'w-full bg-surface border-2 border-border rounded-md px-4 py-3 text-base text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:border-primary appearance-none';

    const errorStyles = error ? 'border-error focus:ring-error' : '';

    const classes = [baseStyles, errorStyles, className].join(' ').trim();

    return (
      <div className="w-full relative">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        <select ref={ref} className={classes} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface-light text-text-primary">
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
        {error && <p className="text-sm text-error mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
