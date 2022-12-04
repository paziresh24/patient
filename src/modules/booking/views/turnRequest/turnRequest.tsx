import TextField from '@/common/components/atom/textField';

interface TurnRequestProps {
  uploadRequired: boolean;
  uploader: boolean;
  rules?: Array<string>;
}

export const TurnRequest = (props: TurnRequestProps) => {
  const { uploadRequired, uploader, rules } = props;
  return (
    <>
      <div>
        <TextField size="large" multiLine label="لطفا توضیحات مورد نظر خود را وارد کنید" placeholder="توضیحات..." />
      </div>
    </>
  );
};

export default TurnRequest;
