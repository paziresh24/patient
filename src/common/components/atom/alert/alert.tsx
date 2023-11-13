import classNames from '@/common/utils/classNames';

interface AlertProps {
  children: React.ReactNode;
  severity: 'error' | 'warning' | 'success' | 'info';
  className?: string;
}

const alertStyle = {
  info: 'bg-blue-50 border border-blue-300 rounded-lg',
  warning: 'bg-amber-50 border border-amber-300 rounded-lg',
  success: 'bg-green-50  border border-green-800 rounded-lg',
  error: 'bg-red-50 border border-red-300 rounded-lg',
};

export const Alert = (props: AlertProps) => {
  const { severity = 'success', children, className } = props;
  return <div className={classNames(alertStyle[severity], className)}>{children}</div>;
};

export default Alert;
