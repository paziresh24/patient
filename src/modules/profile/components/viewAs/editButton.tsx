import Button, { ButtonProps } from '@/common/components/atom/button/button';
import Text from '@/common/components/atom/text/text';
import EditIcon from '@/common/components/icons/edit';
import classNames from '@/common/utils/classNames';

export const EditButton = ({ ...props }: Omit<ButtonProps, 'children'>) => {
  return (
    <Button
      {...props}
      variant="secondary"
      size="sm"
      className={classNames(props.className, 'text-slate-600 border-slate-400  border-dotted')}
    >
      <EditIcon className="w-5 h-5" />
      <Text fontWeight="medium">ویرایش</Text>
    </Button>
  );
};

export default EditButton;
