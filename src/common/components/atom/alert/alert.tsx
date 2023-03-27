import clsx from 'clsx';

interface AlertProps {
  children: React.ReactNode;
  severity: 'error' | 'warning' | 'success' | 'info';
  className?: string;
}

const alertStyle = {
  info: 'bg-blue-50 border border-blue-800 rounded-lg',
  warning: 'bg-yellow-50 border border-yellow-300 rounded-lg',
  success: 'bg-green-50  border border-green-800 rounded-lg',
  error: 'bg-red-50  border border-red-600 rounded-lg',
};

export const Alert = (props: AlertProps) => {
  const { severity = 'success', children, className } = props;
  return <div className={clsx(alertStyle[severity], className)}>{children}</div>;
};

export default Alert;
