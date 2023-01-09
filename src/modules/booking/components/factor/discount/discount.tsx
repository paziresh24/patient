import Button from '@/common/components/atom/button';
import TextField from '@/common/components/atom/textField';
import clsx from 'clsx';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface DiscountProps {
  onSubmit: (code: string) => void;
  status?: 'default' | 'successful' | 'unSuccessful';
  errorMessage?: string;
  loading?: boolean;
}

export const Discount = (props: DiscountProps) => {
  const { errorMessage, status = 'default', onSubmit, loading } = props;
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    if (!code) return toast.error('لطفا کد تخفیف را وارد کنید.');
    onSubmit(code);
  };

  return (
    <div className="flex w-full items-top space-s-2">
      <TextField
        helperText={(status === 'unSuccessful' && errorMessage) || ''}
        onChange={e => setCode(e.target.value)}
        error={status === 'unSuccessful'}
        classNameWrapper="w-3/4"
        className={clsx({
          'border-teal-500 border-2 outline-teal-500': status === 'successful',
          'border-2': status === 'unSuccessful',
        })}
        readOnly={status === 'successful'}
        placeholder="کد تخفیف را وارد کنید ..."
      />
      <Button loading={loading} className="!w-1/4" onClick={handleSubmit} disabled={status === 'successful'}>
        {status === 'successful' ? 'تایید شد' : 'اعمال'}
      </Button>
    </div>
  );
};
export default Discount;
