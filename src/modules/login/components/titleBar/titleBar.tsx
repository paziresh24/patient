import Text from '@/common/components/atom/text';

interface LoginTitleBarProps {
  title: string;
  description: string;
}

export const LoginTitleBar = ({ title, description }: LoginTitleBarProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <Text fontWeight="black" fontSize="lg">
        {title}
      </Text>
      <Text fontSize="sm">{description}</Text>
    </div>
  );
};

export default LoginTitleBar;
