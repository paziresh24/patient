import clsx from 'clsx';
import Text from '../text';

interface RulesProp {
  title?: string;
  checkedText?: string;
  onChecked: (checked: boolean) => void;
  rules: Array<string>;
  className?: string;
  classNameWrapper?: string;
}

export const RulesBox = (props: RulesProp) => {
  const { title, rules, className, classNameWrapper, checkedText, onChecked } = props;

  return (
    <>
      <div className={clsx('w-full', classNameWrapper)}>
        {!!title && (
          <Text fontWeight="medium" fontSize="sm" className="text-black block mb-2">
            {title}
          </Text>
        )}
        <div className={clsx('w-full bg-slate-200 p-4 rounded-lg', className)}>
          <ul className="flex flex-col gap-3">
            {rules.map((rule, index) => (
              <li key={index} className="text-sm font-medium leading-8" dangerouslySetInnerHTML={{ __html: rule }} />
            ))}
          </ul>
        </div>
        {!!checkedText && (
          <>
            <div className="flex items-center mt-4">
              <input onChange={e => onChecked(e.target.checked)} type="checkbox" />
              <Text fontWeight="medium" fontSize="sm" className="text-black block mr-2">
                {checkedText}
              </Text>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RulesBox;
