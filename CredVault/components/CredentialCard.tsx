import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

interface CredentialCardProps {
  issuer: string;
  title: string;
  date: string;
  status: 'verified' | 'pending' | 'expired';
  validityScore?: number; // Added validity score
  onViewDetails?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

const CredentialCard = ({ issuer, title, date, status, validityScore, onViewDetails, onDownload, onShare }: CredentialCardProps) => {
  return (
    <Card className="bg-surface border-border transition-shadow duration-200 hover:shadow-xl">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-text-secondary">{issuer}</p>
          <h3 className="text-lg font-semibold text-text-primary mt-1">{title}</h3>
          <p className="text-sm text-text-secondary mt-1">{date}</p>
          {validityScore !== undefined && (
            <p className="text-sm text-text-secondary">Validity: {validityScore}/100</p>
          )}
        </div>
        <Badge variant={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
      </div>
      <div className="flex justify-end items-center mt-4 space-x-2">
        {onViewDetails && (
          <Button variant="ghost" size="small" onClick={onViewDetails}>
            View Details
          </Button>
        )}
        {onDownload && (
          <Button variant="icon" size="icon" onClick={onDownload}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </Button>
        )}
        {onShare && (
          <Button variant="icon" size="icon" onClick={onShare}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CredentialCard;
