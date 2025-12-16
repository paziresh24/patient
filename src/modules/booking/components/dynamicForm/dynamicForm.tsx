import { useState, useEffect } from 'react';
import Button from '@/common/components/atom/button';
import TextField from '@/common/components/atom/textField';
import Text from '@/common/components/atom/text';
import Loading from '@/common/components/atom/loading';

export interface FormField {
  type: 'image' | 'text_input' | 'submit';
  src?: string;
  label?: string;
  key?: string;
  endpoint_api?: string;
  placeholder?: string;
  required?: boolean;
  image_size?: string;
  image_align?: 'left' | 'center' | 'right';
}

interface DynamicFormProps {
  formFields: FormField[];
  onSubmit: (formData: Record<string, any>) => Promise<void>;
  loading?: boolean;
}

export const DynamicForm = ({ formFields, onSubmit, loading = false }: DynamicFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({});
    setErrors({});
  }, [formFields]);

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    const submitField = formFields.find(field => field.type === 'submit');
    if (!submitField?.endpoint_api) {
      console.error('Submit endpoint not found');
      return;
    }

    const newErrors: Record<string, string> = {};
    formFields.forEach(field => {
      if (field.type === 'text_input' && field.key) {
        const isRequired = field.required !== false;
        if (isRequired && (!formData[field.key] || formData[field.key].trim() === '')) {
          newErrors[field.key] = 'این فیلد الزامی است';
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit(formData);
  };

  const getImageSize = (size?: string) => {
    if (!size) return 'w-48';
    const sizeMap: Record<string, string> = {
      small: 'w-32',
      medium: 'w-48',
      large: 'w-64',
      full: 'w-full',
    };
    return sizeMap[size] || 'w-48';
  };

  const getImageAlign = (align?: 'left' | 'center' | 'right') => {
    if (!align) return 'justify-center';
    if (align === 'left') return 'justify-start';
    if (align === 'right') return 'justify-end';
    return 'justify-center';
  };

  return (
    <div className="flex flex-col space-y-4">
      {formFields.map((field, index) => {
        if (field.type === 'image' && field.src) {
          return (
            <div key={index} className={`flex ${getImageAlign(field.image_align)}`}>
              <div
                className={`${getImageSize(
                  field.image_size,
                )} min-h-32 rounded-lg border border-slate-100 p-1 bg-gray-50 flex items-center justify-center`}
              >
                <img src={field.src} alt="Captcha" className="max-w-full max-h-64 object-contain rounded-lg" loading="eager" />
              </div>
            </div>
          );
        }

        if (field.type === 'text_input' && field.key && field.label) {
          const isRequired = field.required !== false;
          return (
            <div key={index}>
              <Text fontSize="sm" fontWeight="medium" className="mb-2">
                {field.label}
                {isRequired && <span className="text-red-500 mr-1">*</span>}
              </Text>
              <TextField
                value={formData[field.key] || ''}
                onChange={e => handleInputChange(field.key!, e.target.value)}
                placeholder={field.placeholder || ''}
                error={!!errors[field.key]}
                helperText={errors[field.key]}
              />
            </div>
          );
        }

        if (field.type === 'submit') {
          return (
            <Button key={index} block onClick={handleSubmit} loading={loading}>
              {field.label || 'ارسال'}
            </Button>
          );
        }

        return null;
      })}
    </div>
  );
};
