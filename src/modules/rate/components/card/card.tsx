import Avatar from '@/common/components/atom/avatar/avatar';
import Badge from '@/common/components/atom/badge/badge';
import DropDown from '@/common/components/atom/dropDown/dropDown';
import Text from '@/common/components/atom/text/text';
import ThreeDotsIcon from '@/common/components/icons/threeDots';
import { CardProps } from '@/modules/rate/type/card';
import clsx from 'clsx';

export const Card = (props: CardProps) => {
  const { id, avatar, name, tag, options, details, description, symptoms, className, recommend } = props;
  return (
    <>
      <div id={id} className={clsx('w-full h-auto bg-white p-4', className)}>
        <div className="flex justify-between w-full">
          <div className={clsx('flex', { 'items-center': !details?.length })}>
            <Avatar src={avatar} name={name} width={60} height={60} />
            <div className="mr-4">
              <div className="flex items-center gap-1">
                <Text fontWeight="bold">{name}</Text>
                {tag &&
                  tag.map(item => (
                    <Badge
                      key={item.id}
                      text={item.name}
                      parentClassName={clsx('bg-[#ececec] text-[#5b5b5b] !py-1 scale-90')}
                      fontSize="sm"
                      fontWeight={item.isBold ? 'bold' : 'normal'}
                    />
                  ))}
              </div>
              {!!details?.length && (
                <Text className="block mt-3 whitespace-nowrap overflow-hidden text-ellipsis w-full" fontSize="sm" fontWeight="normal">
                  {details.join(' | ')}
                </Text>
              )}
            </div>
          </div>
          {options?.some(item => item.type === 'menu') && (
            <div className="relative flex flex-col items-end">
              <DropDown
                element={
                  <div className="relative flex items-center justify-center cursor-pointer left-0" data-testid="turn-drop-down-button">
                    <ThreeDotsIcon className="cursor-pointer w-3 h-3" />
                  </div>
                }
                items={options.filter(item => item.type === 'menu')}
              />
            </div>
          )}
        </div>
        <div className="mt-6 flex flex-col gap-3">
          {!!symptoms && (
            <Text className="block" fontSize="sm" fontWeight="extraBold">{`${symptoms.text} :  ${symptoms.items.join('، ')}`}</Text>
          )}
          {!!recommend && (
            <Text
              fontSize="sm"
              fontWeight="bold"
              className={clsx('text-red-500 flex gap-1 items-center', { '!text-green-700': recommend?.isRecommend })}
            >
              {recommend?.text}
              {recommend?.icon && recommend?.icon}
            </Text>
          )}
          <Text
            fontSize="sm"
            fontWeight="medium"
            className="text-justify block leading-7"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
        <div className={clsx('mt-8 flex justify-end', { 'justify-between': options?.some(option => option.type === 'controller') })}>
          {options
            ?.filter(option => option.type === 'controller')
            ?.map(option => (
              <Text key={option.id} onClick={option.action} className="flex gap-1 cursor-pointer items-center" fontSize="sm">
                {option?.icon && <span>{option.icon}</span>}
                {option.name}
              </Text>
            ))}
          <div className="flex gap-2">
            {options
              ?.filter(option => option.type === 'button')
              ?.map(option => (
                <Text key={option.id} onClick={option.action} className="flex gap-1 cursor-pointer items-center" fontSize="sm">
                  {option.icon && <span>{option.icon}</span>}
                  {option.name}
                </Text>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
