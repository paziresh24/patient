import RulesBox from '@/common/components/atom/rulesBox';
import TextField from '@/common/components/atom/textField';
import { useEffect, useState } from 'react';
import Uploader from '../../components/uploader';

interface TurnRequestProps {
  uploadRequired: boolean;
  rules: Array<string>;
  getData: (data: TurnRequestInformation) => void;
}
type TurnRequestInformation = {
  checkedRules?: boolean;
  files?: Array<any>;
  discription: string;
};

export const TurnRequest = (props: TurnRequestProps) => {
  const { uploadRequired, rules, getData } = props;
  const [files, setFiles] = useState<Array<any>>([]);
  const [acceptRules, setAcceptRules] = useState<boolean>(false);
  const [discription, setDiscription] = useState<string>('');

  const information: TurnRequestInformation = {
    checkedRules: acceptRules,
    files: files,
    discription: discription,
  };

  useEffect(() => {
    getData(information);
  }, [information]);

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <TextField
          size="large"
          className="!bg-[#f8fafb] h-[10rem]"
          multiLine
          label="لطفا توضیحات مورد نظر خود را وارد کنید"
          placeholder="توضیحات..."
          onChange={e => setDiscription(e.target.value)}
        />
        {uploadRequired && <Uploader lable="لطفا مدارک مورد نیاز خود را بارگذاری کنید" files={files} setFiles={setFiles} />}
        <RulesBox
          checkedText="قوانین را مطالعه کردم و پذیرفتم."
          onChecked={setAcceptRules}
          rules={rules}
          title="شرایط دریافت نوبت از پذیرش24"
        />
      </div>
    </>
  );
};

export default TurnRequest;
