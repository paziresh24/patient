import RulesBox from '@/common/components/atom/rulesBox';
import TextField from '@/common/components/atom/textField';
import { useEffect, useState } from 'react';
import Uploader from '../../components/uploader';

interface TurnRequestProps {
  uploadRequired: boolean;
  discriptionTitle?: string;
  placeholder?: string;
  uploaderTitle?: string;
  rulesBoxTitle?: string;
  checkboxText?: string;
  rules: Array<string>;
  getData: (data: TurnRequestInformation) => void;
}
type TurnRequestInformation = {
  checkedRules?: boolean;
  files?: Array<any>;
  discription: string;
};

export const TurnRequest = (props: TurnRequestProps) => {
  const { uploadRequired, rules, getData, discriptionTitle, placeholder, uploaderTitle, rulesBoxTitle, checkboxText } = props;
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
          label={discriptionTitle}
          placeholder={placeholder}
          onChange={e => setDiscription(e.target.value)}
        />
        {uploadRequired && <Uploader title={uploaderTitle} files={files} setFiles={setFiles} />}
        {rules.length && <RulesBox checkedText={checkboxText} onChecked={setAcceptRules} rules={rules} title={rulesBoxTitle} />}
      </div>
    </>
  );
};

export default TurnRequest;
