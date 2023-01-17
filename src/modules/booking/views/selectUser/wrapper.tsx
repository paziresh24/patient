import Button from '@/common/components/atom/button';
import { UserInfo } from '@/modules/login/store/userInfo';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import SelectUser from './selectUser';

interface SelectTimeWrapperProps {
  onSubmit: (userInfo: UserInfo) => void;
  loading?: boolean;
  submitButtonText: string;
}

export const SelectUserWrapper = (props: SelectTimeWrapperProps) => {
  const { onSubmit, loading, submitButtonText } = props;
  const [userSelected, setUserSelected] = useState<UserInfo>({});

  const handleSubmit = (info: UserInfo) => {
    if (!info?.id) return toast.error('لطفا بیمار مورد نظر خود را انتخاب کنید');
    if (!info?.name) return toast.error('لطفا اطلاعات خود را تکمیل کنید.');

    onSubmit(info);
  };

  const handleSelect = (info: UserInfo) => {
    setUserSelected(info);
  };

  return (
    <div className="flex flex-col space-y-3">
      <SelectUser onSelect={handleSelect} />
      <div className="fixed bottom-0 right-0 flex flex-col w-full p-4 bg-white md:p-0 md:static md:w-auto md:bg-transparent shadow-card md:shadow-none">
        <Button loading={loading} className="self-end w-full md:w-1/5" onClick={() => handleSubmit(userSelected)}>
          {submitButtonText}
        </Button>
      </div>
    </div>
  );
};

export default SelectUserWrapper;
