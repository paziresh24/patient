import Avatar from '@/common/components/atom/avatar/avatar';
import Chips from '@/common/components/atom/chips/chips';
import DropDown from '@/common/components/atom/dropDown/dropDown';
import Text from '@/common/components/atom/text/text';
import ThreeDotsIcon from '@/common/components/icons/threeDots';
import classNames from '@/common/utils/classNames';
import { CardProps } from '@/modules/rate/type/card';

export const Card = (props: CardProps) => {
  const { id, avatar, name, tag, options, details, description, symptomes, className, recommend } = props;
  return (
    <>
      <div id={id} className={classNames('w-full h-auto bg-white !px-4', className)}>
        <div className="flex justify-between w-full">
          <div className="flex items-center">
            <Avatar src={avatar} name={name} width={details?.length ? 55 : 40} height={details?.length ? 55 : 40} />
            <div className="mr-2 space-y-2">
              <div className="flex items-center space-s-1">
                <Text fontWeight="bold" fontSize="sm">
                  {name}
                </Text>
                {tag && tag.map(item => <Chips key={item.id}>{item.name}</Chips>)}
              </div>
              {!!details?.length && (
                <Text className="w-full line-clamp-1" fontSize="xs" fontWeight="medium">
                  {details.join(' | ')}
                </Text>
              )}
            </div>
          </div>
          {options?.some(item => item.type === 'menu') && (
            <div className="relative flex flex-col items-end">
              <DropDown
                element={
                  <div className="relative left-0 flex items-center justify-center cursor-pointer">
                    <ThreeDotsIcon className="w-4 h-4 cursor-pointer" />
                  </div>
                }
                items={options.filter(item => item.type === 'menu')}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 mt-5">
          {!!recommend && (
            <Text
              fontSize="sm"
              fontWeight="bold"
              className={classNames('text-red-500 flex gap-1 items-center', { '!text-green-700': recommend?.isRecommend })}
            >
              {recommend?.text}
              {recommend?.icon && recommend?.icon}
            </Text>
          )}
          {!!symptomes && (
            <div>
              <Text fontSize="sm" fontWeight="medium">
                {symptomes.text}:{' '}
              </Text>
              <Text fontSize="sm">{symptomes.items.join('، ')}</Text>
            </div>
          )}
          <Text
            fontSize="sm"
            fontWeight="medium"
            className="text-justify block [&>em]:text-blue-700  [&>em]:not-italic break-all !leading-7"
            dangerouslySetInnerHTML={{ __html: description ?? '' }}
          />
        </div>
        <div className={classNames('mt-2 flex justify-end', { 'justify-between': options?.some(option => option.type === 'controller') })}>
          {options
            ?.filter(option => option.type === 'controller')
            ?.map(option => (
              <Text key={option.id} onClick={option.action} className="flex items-center gap-1 cursor-pointer" fontSize="sm">
                {option?.prefix && option?.prefix}
                {option?.icon && option.icon}
                {option.name}
              </Text>
            ))}
          <div className="flex space-s-3">
            {options
              ?.filter(option => option.type === 'button')
              ?.map(option => (
                <Text key={option.id} onClick={option.action} className="flex items-center gap-1 cursor-pointer" fontSize="sm">
                  {option?.prefix && option?.prefix}
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
