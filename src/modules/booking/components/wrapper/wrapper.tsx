import Text from '@/common/components/atom/text';

interface WrapperProps {
  title?: string;
  Component: any;
  TopComponent?: any;
  data?: any;
  nextStep?: (data: any) => void;
}

export const Wrapper = ({ title, Component, TopComponent, data, nextStep }: WrapperProps) => {
  console.log(TopComponent);
  return (
    <div className="flex flex-col space-y-3">
      {title && <Text fontWeight="bold">{title}</Text>}
      {TopComponent}
      <Component {...data} onSelect={nextStep} onSubmit={nextStep} />
    </div>
  );
};

export default Wrapper;
