import Button from '@/common/components/atom/button';
import RulesBox from '@/common/components/atom/rulesBox';
import TextField from '@/common/components/atom/textField';
import { useEffect, useRef, useState } from 'react';
import Uploader from '../../components/uploader';
import Loading from '@/common/components/atom/loading';
import classNames from '@/common/utils/classNames';
import { useFeatureIsOn } from '@growthbook/growthbook-react';

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
  center_id?: string;
  service_id?: string;
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
    loading,
    center_id,
    service_id,
  } = props;
  const [files, setFiles] = useState<Array<any>>([]);
  const [acceptRules, setAcceptRules] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [height, setHeight] = useState<number>(0);
  const ref = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [formLoaded, setFormLoaded] = useState(false);
  const useDymamicForm = useFeatureIsOn('book-request-form');

  const handleSubmit = () => {
    if (useDymamicForm) {
      const iframe = ref.current as any;
      setIsLoading(true);
      iframe.contentWindow.postMessage({ type: 'form-submit' }, '*');
      return;
    }
    onSubmit({
      checkedRules: acceptRules,
      files: files,
      description: description,
    });
  };

  useEffect(() => {
    window.addEventListener('message', event => {
      if (event.data.type === 'form-height') {
        setHeight(event.data.height);
        setIsLoading(false);
      }
      if (event.data.type === 'form-loaded') {
        setFormLoaded(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!window.isMessageListenerAdded) {
      window.addEventListener('message', event => {
        if (event.data.type === 'form-submit-data') {
          onSubmit({
            description: JSON.stringify(event.data.data),
          });
          setIsLoading(false);
        }
      });
      window.isMessageListenerAdded = true;
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsAppLoading(false);
    }, 3000);
  }, []);

  if (useDymamicForm) {
    return (
      <>
        <div className="flex flex-col w-full gap-4">
          {isAppLoading && (
            <div className="flex flex-col gap-2 w-full items-center text-sm font-medium">
              <Loading className="w-6" />
              <span>کمی منتظر بمانید.</span>
            </div>
          )}
          <iframe
            className={classNames({ hidden: isAppLoading })}
            onLoad={() => setIsAppLoading(false)}
            ref={ref}
            src={`https://paziresh24-form.darkube.app/?center_id=${center_id}&service_id=${service_id}`}
            height={height + 'px'}
          />
          {!isAppLoading && formLoaded && (
            <div className="fixed bottom-0 right-0 flex flex-col w-full p-4 bg-white border-t md:p-0 md:static md:border-none border-slate-100 md:w-auto md:bg-transparent shadow-card md:shadow-none">
              <Button loading={loading || isLoading} className="self-end w-full md:w-1/5" onClick={handleSubmit}>
                ثبت درخواست
              </Button>
            </div>
          )}
        </div>
      </>
    );
  }

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
