import Text from '@/components/atom/text';
import TrashIcon from '@/components/icons/trash';
import { Button, FormControlLabel, IconButton } from '@mui/material';
import { cloneDeep } from 'lodash';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface ItemSchema {
  label?: string;
  component: any;
  key: string;
  type: 'textField' | 'autoComplete';
  deleteble?: Boolean;
}

export interface SectionSchema {
  title: string;
  key: string;
  items: ItemSchema[];
  extendable?: Boolean;
  addButtonText?: string;
  limitExtend?: number;
}

interface FormProps {
  actionExtend?: {
    [key in string]: () => void;
  };
}

export const useCreateForm = (schema: SectionSchema[]) => {
  const [schemaClone, setSchemaClone] = useState<SectionSchema[]>(cloneDeep(schema));
  const { handleSubmit, control, setValue, reset, unregister } = useForm();

  // useEffect(() => {
  //   setSchemaClone(JSON.parse(JSON.stringify(schema)));
  // }, []);

  const addField = ({ sectionKey, item, defaultValue }: { sectionKey: string; item: ItemSchema; defaultValue: any }) => {
    const dupicateKey = schemaClone.flatMap(section =>
      section.items.filter(sectionItem => sectionItem.key.startsWith(item.key)).map(sectionItem => sectionItem.key),
    );

    const key = dupicateKey.length >= 1 ? `${item.key}${dupicateKey.length + 1}` : item.key;
    const newSchema = [...schemaClone];
    newSchema[newSchema.findIndex((section: any) => sectionKey === section.key)]?.items?.push({
      ...item,
      key,
    });
    setSchemaClone(newSchema);
    setValue(key, defaultValue);
  };

  const handleRemove = (key: string) => {
    const newSchema = schemaClone.map(section => {
      const items = section.items.filter(item => item.key !== key);
      return { ...section, items };
    });
    unregister(key);
    setSchemaClone(newSchema);
  };

  const Form = (props: FormProps) => (
    <div className="flex flex-col space-y-5">
      {schemaClone.map((section, index) => (
        <div key={section.key} className="flex flex-col space-y-5">
          {section.title && <Text>{section.title}</Text>}
          {section.items.map(({ component: Component, ...item }) => (
            <div key={item.key} className="flex flex-col space-y-5 w-full">
              <div className="flex space-s-2 items-end w-full">
                <FormControlLabel
                  control={
                    <Controller
                      name={item.key}
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Component
                          onChange={item.type === 'autoComplete' ? (_: Event, value: any) => onChange(value) : onChange}
                          value={value}
                        />
                      )}
                    />
                  }
                  label={item.label}
                  labelPlacement="top"
                  className="!items-start gap-3 !m-0 w-full"
                />
                {item.deleteble && (
                  <IconButton className="!border !border-solid !border-[#bac8f8] !rounded-md" onClick={() => handleRemove(item.key)}>
                    <TrashIcon className="fill-slate-500" />
                  </IconButton>
                )}
              </div>
            </div>
          ))}
          {section.items.filter(({ key }) => key !== schema.find(({ key }) => key === section.key)?.items?.[0]?.key).length <
            (section?.limitExtend ?? Infinity) &&
            section.extendable && (
              <Button
                size="medium"
                className="self-start"
                onClick={props?.actionExtend?.[section.key]}
                startIcon={
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_711_2888)">
                      <path
                        d="M9.74999 19.4905C11.0819 19.4905 12.3357 19.2357 13.5114 18.7261C14.6871 18.2166 15.7243 17.5128 16.6228 16.6147C17.5213 15.7166 18.2255 14.68 18.7352 13.5048C19.2451 12.3297 19.5 11.0765 19.5 9.74525C19.5 8.41403 19.2451 7.16084 18.7352 5.98568C18.2255 4.81052 17.5213 3.77389 16.6228 2.8758C15.7243 1.97771 14.6855 1.27389 13.5066 0.764333C12.3277 0.254778 11.0723 0 9.74043 0C8.40857 0 7.15477 0.254778 5.97904 0.764333C4.8033 1.27389 3.76776 1.97771 2.87242 2.8758C1.97708 3.77389 1.27451 4.81052 0.764705 5.98568C0.254902 7.16084 0 8.41403 0 9.74525C0 11.0765 0.254902 12.3297 0.764705 13.5048C1.27451 14.68 1.97867 15.7166 2.8772 16.6147C3.77573 17.5128 4.81286 18.2166 5.98859 18.7261C7.16433 19.2357 8.41813 19.4905 9.74999 19.4905Z"
                        fill="#3861FB"
                      />
                      <path
                        d="M5.08496 9.75477C5.08496 9.50637 5.16462 9.30414 5.32393 9.14809C5.48324 8.99204 5.68716 8.91401 5.93569 8.91401H8.9276V5.92356C8.9276 5.67515 9.00248 5.47133 9.15224 5.3121C9.30199 5.15286 9.49795 5.07324 9.7401 5.07324C9.98861 5.07324 10.1909 5.15286 10.3471 5.3121C10.5032 5.47133 10.5812 5.67515 10.5812 5.92356V8.91401H13.5828C13.8313 8.91401 14.0336 8.99204 14.1898 9.14809C14.3459 9.30414 14.4239 9.50637 14.4239 9.75477C14.4239 9.99682 14.3443 10.1927 14.185 10.3424C14.0256 10.4921 13.8249 10.5669 13.5828 10.5669H10.5812V13.5669C10.5812 13.8153 10.5032 14.0175 10.3471 14.1736C10.1909 14.3297 9.98861 14.4077 9.7401 14.4077C9.49795 14.4077 9.30199 14.3297 9.15224 14.1736C9.00248 14.0175 8.9276 13.8153 8.9276 13.5669V10.5669H5.93569C5.68716 10.5669 5.48324 10.4921 5.32393 10.3424C5.16462 10.1927 5.08496 9.99682 5.08496 9.75477Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_711_2888">
                        <rect width="19.5" height="19.5" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                }
              >
                {section.addButtonText}
              </Button>
            )}
          <hr className="border-slate-200" />
        </div>
      ))}
    </div>
  );
  return { Form, handleSubmit: (fn: any) => handleSubmit(fn), addField, setDefaultValue: reset };
};
