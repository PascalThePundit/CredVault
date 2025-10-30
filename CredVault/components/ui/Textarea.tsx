import { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    const baseStyles =
      'w-full bg-surface border-2 border-border rounded-md px-4 py-3 text-base text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:border-primary min-h-[120px] resize-y';

    const errorStyles = error ? 'border-error focus:ring-error' : '';

    const classes = [baseStyles, errorStyles, className].join(' ').trim();

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-text-primary mb-2">
            {label}
          </label>
        )}
        <textarea ref={ref} className={classes} {...props} />
        {error && <p className="text-sm text-error mt-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
