import clsx from 'clsx';
import Checkbox from '../checkbox';
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
        <div className={clsx('w-full bg-slate-100 p-3 rounded-lg', className)}>
          <ul className="flex flex-col space-y-1 list-disc mr-5">
            {rules.map((rule, index) => (
              <li key={index} className="text-sm font-medium leading-7" dangerouslySetInnerHTML={{ __html: rule }} />
            ))}
          </ul>
        </div>
        {!!checkedText && (
          <>
            <div className="mt-4">
              <Checkbox label={checkedText} onChange={e => onChecked(e.target.checked)} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RulesBox;
