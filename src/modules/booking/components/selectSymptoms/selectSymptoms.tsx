import Chips from '@/common/components/atom/chips/chips';
import Divider from '@/common/components/atom/divider';
import Modal from '@/common/components/atom/modal/modal';
import Text from '@/common/components/atom/text/text';
import TextField from '@/common/components/atom/textField/textField';
import AddIcon from '@/common/components/icons/add';
import { Symptoms } from '@/modules/booking/types/selectSymptoms';
import clsx from 'clsx';
import reject from 'lodash/reject';
import { Dispatch, SetStateAction, useState } from 'react';
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
  const [isOpenSelectSickness, setIsOpenSelectSickness] = useState(false);

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
    return (
      <div className="flex flex-wrap gap-1">
        {selectedSymptoms.map(symptoms => (
          <Chips key={symptoms.id} handleRemove={() => handleRemoveItems(symptoms.id)} className="h-8 rounded-[5px] mb-4 cursor-pointer">
            <div className="flex items-center">
              <Text fontSize="sm" fontWeight="medium" className="text-black px-2 mt-[0.2rem] block">
                {symptoms.title}
              </Text>
            </div>
          </Chips>
        ))}
      </div>
    );
  };

  return (
    <>
      <SelectedSymptomsChips />
      <div>
        <Text fontSize="sm" fontWeight="medium" className={className} onClick={() => setIsOpenSelectSickness(true)}>
          <AddIcon />
          {title}
        </Text>
        <Modal
          fullScreen
          title={modalTitle}
          isOpen={isOpenSelectSickness}
          onClose={setIsOpenSelectSickness}
          bodyClassName="!pb-16 !px-0 !pt-0"
        >
          <div className="p-4">
            <SelectedSymptomsChips />
            <TextField value={searchText} onChange={e => setSearchText(e.target.value)} placeholder={placeholder} />
          </div>
          <Text fontSize="sm" fontWeight="medium" className="block w-full px-4 py-2 bg-[#F3F7FA] font-medium mb-2">
            {listTitle}
          </Text>
          {symptoms.map(data => (
            <div key={data.id} onClick={() => handleSelectSymptoms(data)} className={clsx('cursor-pointer', style.wrapper)}>
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
    </>
  );
};

export default SelecSymptoms;
