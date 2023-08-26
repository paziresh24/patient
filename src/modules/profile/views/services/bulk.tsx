import Alert from '@/common/components/atom/alert/alert';
import Card from '@/common/components/atom/card';
import Text from '@/common/components/atom/text/text';
import ErrorIcon from '@/common/components/icons/error';

export const BulkService = () => {
  return (
    <Card className="space-y-3 !rounded-none md:!rounded-lg">
      <Alert severity="error" className="flex items-center p-3 text-red-500 space-s-2">
        <ErrorIcon className="w-5 h-5" />
        <Text className="text-sm font-medium">نوبت دهی این پزشک در پذیرش24 غیرفعال است.</Text>
      </Alert>
      <Text fontWeight="medium" fontSize="sm" className="text-slate-500">
        شما می توانید از سایر پزشکان حاذق در این حوزه نوبت بگیرید.
      </Text>
    </Card>
  );
};

export default BulkService;
