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
    if (dropDown) {
      document.body.classList.add('md:pr-[0.3rem]');
      return document.body.classList.add('overflow-hidden');
    }
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
          <div className="absolute z-20 w-40 mx-1 bg-white border shadow-lg top-2 border-slate-100 rounded-xl">
            <div className="flex flex-col p-2">
              {items.map(({ id, action, name, icon, testId }) => (
                <div
                  key={id}
                  className="flex items-center p-2 cursor-pointer space-s-2"
                  onClick={() => {
                    setDropDown(false);
                    document.body.classList.remove('overflow-hidden');
                    document.body.classList.remove('md:pr-[0.3rem]');
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
              document.body.classList.remove('overflow-hidden');
              document.body.classList.remove('md:pr-[0.3rem]');
            }}
          />
        </>
      )}
    </>
  );
};

export default DropDown;
