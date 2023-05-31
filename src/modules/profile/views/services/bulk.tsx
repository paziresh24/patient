import Card from '@/common/components/atom/card';
import Text from '@/common/components/atom/text';

export const BulkService = () => {
  return (
    <Card className="!rounded-none md:!rounded-lg">
      <Text fontWeight="bold" fontSize="sm">
        نوبت دهی این پزشک در پذیرش24 غیر فعال می باشد. شما میتوانید از پزشکان حاذق در این حوزه نوبت بگیرید.
      </Text>
    </Card>
  );
};

export default BulkService;
