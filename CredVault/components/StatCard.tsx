import Card from './ui/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => {
  return (
    <Card className="bg-surface border-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-body text-text-secondary mb-1">{label}</p>
          <h2 className="text-h2 font-bold text-text-primary">{value}</h2>
        </div>
        {icon && <div className="text-3xl text-primary">{icon}</div>}
      </div>
    </Card>
  );
};

export default StatCard;
