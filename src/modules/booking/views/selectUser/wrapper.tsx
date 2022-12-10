import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import { UserInfo } from '@/modules/login/store/userInfo';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { BaseInfo } from '../../types/baseInfo';
import SelectUser from './selectUser';

interface SelectTimeWrapperProps extends BaseInfo {
  onSubmit: (userInfo: UserInfo) => void;
}

export const SelectUserWrapper = (props: SelectTimeWrapperProps) => {
  const { onSubmit, ...baseInfo } = props;
  const [userSelected, setUserSelected] = useState<UserInfo>({});

  const handleSubmit = (info: UserInfo) => {
    if (!info?.id) return toast.error('لطفا بیمار مورد نظر خود را انتخاب کنید');
    onSubmit(info);
  };

  const handleSelect = (info: UserInfo) => {
    setUserSelected(info);
  };

  return (
    <div className="flex flex-col space-y-3">
      <Text fontWeight="bold">لطفا بیمار را انتخاب کنید</Text>
      <SelectUser {...baseInfo} onSelect={handleSelect} />
      <Button className="self-end w-1/5" onClick={() => handleSubmit(userSelected)}>
        ادامه
      </Button>
    </div>
  );
};

export default SelectUserWrapper;
