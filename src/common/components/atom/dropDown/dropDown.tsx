import { useEffect, useState } from 'react';
import Text from '../text';

interface DropDownProps {
  items: Array<{
    id: number;
    name: string;
    icon?: React.ReactNode;
    action: () => void;
    testId?: string;
  }>;
  element?: React.ReactNode;
}

export const DropDown: React.FC<DropDownProps> = props => {
  const { items, element } = props;

  const [dropDown, setDropDown] = useState(false);
  useEffect(() => {
    if (dropDown) return document.body.classList.add('overflow-hidden');
    document.body.classList.remove('overflow-hidden');
  }, [dropDown]);

  return (
    <>
      {element && (
        <div onClick={() => setDropDown(true)} className="contents">
          {element}
        </div>
      )}
      {dropDown && (
        <>
          <div className="absolute left-4 top-2 bg-white shadow-lg border border-slate-100 w-40 rounded-xl rounded-tl-sm z-20">
            <div className="flex flex-col p-2">
              {items.map(({ id, action, name, icon, testId }) => (
                <div
                  key={id}
                  className="flex items-center p-2 space-s-2 cursor-pointer"
                  onClick={() => {
                    setDropDown(false);
                    action();
                  }}
                  data-testid={testId}
                >
                  {icon}
                  <Text fontSize="sm" fontWeight="medium">
                    {name}
                  </Text>
                </div>
              ))}
            </div>
          </div>
          <div
            className="fixed inset-0 opacity-30 z-10 !m-0"
            onClick={e => {
              e.stopPropagation();
              setDropDown(false);
            }}
          />
        </>
      )}
    </>
  );
};

export default DropDown;
