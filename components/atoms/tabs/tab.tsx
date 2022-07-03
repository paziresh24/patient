interface TabProps {
  value?: string | number;
  label: string;
  className?: string;
}
export const Tab = ({ label, value, className }: TabProps) => {
  return <span>{label}</span>;
};

export default Tab;
