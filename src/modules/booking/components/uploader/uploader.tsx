import FileUploader from '@/common/components/atom/fileUploader';
import Text from '@/common/components/atom/text';
import CloseIcon from '@/common/components/icons/close';
import clsx from 'clsx';
import { Dispatch, SetStateAction } from 'react';

interface FileUploaderProp {
  files: any[];
  setFiles: Dispatch<SetStateAction<any[]>>;
  title?: string;
}

export const Uploader = (props: FileUploaderProp) => {
  const { files, setFiles, title } = props;

  const handleFileChange = (file: any) => {
    if (!file.target.files) return;

    setFiles(prev => [...prev, ...file.target.files]);
  };

  const handleRemoveFile = (index: number) => {
    const fileContainer = files.filter((_, i) => i !== index);

    setFiles(fileContainer);
  };

  return (
    <>
      {!!title && (
        <Text fontSize="sm" fontWeight="medium" className="text-black -mb-1 block">
          {title}
        </Text>
      )}
      <div className={clsx('bg-none', { ' bg-[#f8fafb] border rounded-lg !border-solid border-slate-300': !!files.length })}>
        <FileUploader
          classNameWrapper={files.length > 0 ? '!bg-none !border-none' : ''}
          onChange={handleFileChange}
          lable="مدارک مورد نظر خود را وارد کنید"
          multiple
        />
        {!!files.length && (
          <div className="mx-2 mb-2 flex flex-col gap-4">
            {files?.map((file, index) => (
              <div key={index} className="w-full flex justify-between h-auto p-5 bg-slate-300 rounded-lg">
                <Text>{file.name}</Text>
                <CloseIcon onClick={() => handleRemoveFile(index)} className="cursor-pointer" />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Uploader;
