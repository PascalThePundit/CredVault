interface SectionHeaderProps {
  title: string;
  description?: string;
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-h2 font-bold text-text-primary">{title}</h2>
      {description && <p className="text-body text-text-secondary mt-2">{description}</p>}
    </div>
  );
};

export default SectionHeader;
