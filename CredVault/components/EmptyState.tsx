import Button from './ui/Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const EmptyState = ({ icon, title, description, ctaText, onCtaClick }: EmptyStateProps) => {
  return (
    <div className="text-center p-12">
      {icon && <div className="text-5xl text-primary mb-6 mx-auto w-fit">{icon}</div>}
      <h3 className="text-h3 font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-body text-text-secondary max-w-md mx-auto mb-8">{description}</p>
      {ctaText && onCtaClick && (
        <Button onClick={onCtaClick} variant="primary" size="medium">
          {ctaText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
