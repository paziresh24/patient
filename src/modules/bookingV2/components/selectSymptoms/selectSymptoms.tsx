import Chips from '@/common/components/atom/chips/chips';
import Divider from '@/common/components/atom/divider';
import Modal from '@/common/components/atom/modal/modal';
import Text from '@/common/components/atom/text/text';
import TextField from '@/common/components/atom/textField/textField';
import AddIcon from '@/common/components/icons/add';
import useModal from '@/common/hooks/useModal';
import { Symptoms } from '@/modules/booking/types/selectSymptoms';
import classNames from '@/common/utils/classNames';
import reject from 'lodash/reject';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'react-hot-toast';
import style from './section.module.css';

interface SelecSymptomsProps {
  title: string;
  placeholder: string;
  modalTitle: string;
  className?: string;
  listTitle: string;
  symptoms: Symptoms[];
  selectedSymptoms: Symptoms[];
  setSelectedSymptoms: Dispatch<SetStateAction<Symptoms[]>>;
  setSearchText: Dispatch<SetStateAction<string>>;
  searchText: string;
}

export const SelecSymptoms = (props: SelecSymptomsProps) => {
  const {
    title,
    placeholder,
    modalTitle,
    symptoms,
    setSelectedSymptoms,
    selectedSymptoms,
    setSearchText,
    searchText,
    listTitle,
    className,
  } = props;
  const { handleOpen, modalProps } = useModal();

  const handleSelectSymptoms = (symptomsInfo: Symptoms) => {
    selectedSymptoms.some(symptoms => symptoms.id === symptomsInfo.id)
      ? toast.error('آیتم مورد نظر در لیست انتخابی موجود میباشد!')
      : setSelectedSymptoms(prev => [...prev, { ...symptomsInfo }]);
  };
  const handleRemoveItems = (index: number) => {
    const symptomsContainer = reject(selectedSymptoms, symptoms => {
      return symptoms.id === index;
    });
    setSelectedSymptoms(symptomsContainer);
  };

  const SelectedSymptomsChips = () => {
    if (!selectedSymptoms.length) return null;
    return (
      <div className="flex flex-wrap gap-1 overflow-auto">
        {selectedSymptoms.map(symptoms => (
          <Chips key={symptoms.id} handleRemove={() => handleRemoveItems(symptoms.id)} className="py-2  rounded-[5px] cursor-pointer">
            <Text fontSize="xs" fontWeight="medium" className="text-black px-2 mt-[0.2rem] block line-clamp-1">
              {symptoms.title}
            </Text>
          </Chips>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-3">
      <SelectedSymptomsChips />
      <div>
        <Text fontSize="sm" fontWeight="medium" className={className} onClick={handleOpen}>
          <AddIcon />
          {title}
        </Text>
        <Modal fullScreen title={modalTitle} {...modalProps} bodyClassName="!pb-16 !px-0 !pt-0">
          <div className="flex flex-col p-4 space-y-1">
            <SelectedSymptomsChips />
            <TextField value={searchText} onChange={e => setSearchText(e.target.value)} placeholder={placeholder} />
          </div>
          <Text fontSize="sm" fontWeight="medium" className="block w-full px-4 py-2 mb-2 font-medium bg-slate-100">
            {listTitle}
          </Text>
          {symptoms.map(data => (
            <div key={data.id} onClick={() => handleSelectSymptoms(data)} className={classNames('cursor-pointer', style.wrapper)}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                className="block py-3 mx-6"
                dangerouslySetInnerHTML={{ __html: data.formatted_title }}
              />
              <Divider />
            </div>
          ))}
        </Modal>
      </div>
    </div>
  );
};

export default SelecSymptoms;
