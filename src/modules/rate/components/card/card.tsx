import Avatar from '@/common/components/atom/avatar/avatar';
import Chips from '@/common/components/atom/chips/chips';
import DropDown from '@/common/components/atom/dropDown/dropDown';
import Text from '@/common/components/atom/text/text';
import ThreeDotsIcon from '@/common/components/icons/threeDots';
import classNames from '@/common/utils/classNames';
import { CardProps } from '@/modules/rate/type/card';
import { useRouter } from 'next/router';

export const Card = (props: CardProps) => {
  const { id, avatar, name, tag, options, details, description, symptomes, className, recommend, userId } = props;
  const router = useRouter();

  const dropDownMenuItems = options?.items?.filter(item => item.type === 'dropdown') ?? [];

  return (
    <>
      <div id={id} className={classNames('w-full h-auto bg-white !px-4', className)}>
        <div className="flex justify-between w-full">
          <div
            className={classNames('flex items-center', {
              'cursor-pointer': !!userId,
            })}
            onClick={() => userId && router.push(`/ravi/${userId}`)}
          >
            <Avatar
              loading="lazy"
              src={avatar}
              name={name}
              alt={name}
              width={details?.length ? 55 : 40}
              height={details?.length ? 55 : 40}
            />
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
          {dropDownMenuItems.length > 0 && (
            <div className="relative flex flex-col items-end">
              <DropDown
                element={
                  <div
                    className="relative left-0 flex items-center justify-center cursor-pointer"
                    title={dropDownMenuItems.map(item => item.name).join('، ')}
                  >
                    <ThreeDotsIcon className="w-4 h-4 cursor-pointer" />
                  </div>
                }
                items={dropDownMenuItems}
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
            className="text-justify block [&>em]:text-blue-700  [&>em]:not-italic !leading-7"
            style={{ wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: description ?? '' }}
          />
        </div>
        <div
          className={classNames('mt-2 flex justify-end', {
            'justify-between flex-col space-y-3': options?.items?.some(option => option.type === 'controller'),
          })}
        >
          <div className="flex space-s-2">
            {options?.items
              ?.filter(option => option.type === 'controller')
              ?.map(option => (
                <Text key={option.id} onClick={option.action} className="flex items-center gap-1 cursor-pointer" fontSize="sm">
                  {option?.prefix && option?.prefix}
                  {option?.icon && option.icon}
                  {option.name}
                </Text>
              ))}
          </div>
          <div className="flex self-end space-s-3">
            {options?.items
              ?.filter(option => option.type === 'card')
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
