import Modal from '@/common/components/atom/modal';
import { DynamicForm } from '../dynamicForm';

interface BookingAddonModalProps {
  isOpen: boolean;
  onClose: () => void;
  formFields: any[];
  onSubmit: (formData: Record<string, any>) => Promise<void>;
  loading?: boolean;
  title?: string;
  formKey?: number;
}

export const BookingAddonModal = ({
  isOpen,
  onClose,
  formFields,
  onSubmit,
  loading = false,
  title = '',
  formKey = 0,
}: BookingAddonModalProps) => {
  if (formFields.length === 0) return null;

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose} bodyClassName="flex flex-col space-y-4">
      <DynamicForm key={formKey} formFields={formFields} onSubmit={onSubmit} loading={loading} />
    </Modal>
  );
};
