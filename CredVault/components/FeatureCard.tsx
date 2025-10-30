import Card from './ui/Card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <Card className="bg-surface border-border transform transition-transform duration-200 hover:scale-102 hover:shadow-xl">
      <div className="flex flex-col items-center text-center">
        {icon && <div className="text-3xl text-primary mb-4">{icon}</div>}
        <h3 className="text-h3 font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-body text-text-secondary">{description}</p>
      </div>
    </Card>
  );
};

export default FeatureCard;
