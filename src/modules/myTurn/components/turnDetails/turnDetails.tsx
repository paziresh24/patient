import Text from '@/components/atom/text';

interface TurnDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * the details items in list
   * value in item can be string or react element
   */
  items: Array<{ id: number; name: string; value: string | React.ReactNode }>;
}

export const TurnDetails: React.FC<TurnDetailsProps> = props => {
  const { items, ...rest } = props;
  return (
    <div className="flex flex-col w-full bg-gray p-3 px-4 space-y-4 rounded-md cursor-pointer" {...rest}>
      {items.map(item => (
        <div key={item.id} className="flex items-center justify-between">
          <Text fontSize="sm">{item.name}:</Text>
          <Text fontWeight="bold" fontSize="sm">
            {item.value}
          </Text>
        </div>
      ))}
    </div>
  );
};

export default TurnDetails;
