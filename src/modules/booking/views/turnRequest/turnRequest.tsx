import Button from '@/common/components/atom/button';
import RulesBox from '@/common/components/atom/rulesBox';
import TextField from '@/common/components/atom/textField';
import { useState } from 'react';
import Uploader from '../../components/uploader';

interface TurnRequestProps {
  uploadRequired: boolean;
  descriptionTitle?: string;
  placeholder?: string;
  uploaderTitle?: string;
  rulesBoxTitle?: string;
  checkboxText?: string;
  rules: Array<string>;
  onSubmit: (data: TurnRequestInformation) => void;
  loading?: boolean;
}

export type TurnRequestInformation = {
  checkedRules?: boolean;
  files?: Array<any>;
  description: string;
};

export const TurnRequest = (props: TurnRequestProps) => {
  const {
    uploadRequired,
    rules,
    onSubmit,
    descriptionTitle,
    placeholder,
    uploaderTitle,
    rulesBoxTitle,
    checkboxText,
    loading = false,
  } = props;
  const [files, setFiles] = useState<Array<any>>([]);
  const [acceptRules, setAcceptRules] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');

  const handleSubmit = () => {
    onSubmit({
      checkedRules: acceptRules,
      files: files,
      description: description,
    });
  };

  return (
    <>
      <div className="flex flex-col w-full gap-4">
        <TextField
          size="large"
          className="!bg-[#f8fafb] h-[10rem]"
          multiLine
          label={descriptionTitle}
          placeholder={placeholder}
          onChange={e => setDescription(e.target.value)}
        />
        <Uploader title={uploaderTitle} files={files} setFiles={setFiles} required={uploadRequired} />
        {rules?.length && <RulesBox checkedText={checkboxText} onChecked={setAcceptRules} rules={rules} title={rulesBoxTitle} />}
        <div className="fixed bottom-0 right-0 flex flex-col w-full p-4 bg-white border-t md:p-0 md:static md:border-none border-slate-100 md:w-auto md:bg-transparent shadow-card md:shadow-none">
          <Button loading={loading} className="self-end w-full md:w-1/5" onClick={handleSubmit}>
            ثبت درخواست
          </Button>
        </div>
      </div>
    </>
  );
};

export default TurnRequest;
