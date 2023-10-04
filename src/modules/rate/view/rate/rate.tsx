import Autocomplete from '@/common/components/atom/autocomplete/autocomplete';
import Button from '@/common/components/atom/button/button';
import Divider from '@/common/components/atom/divider/divider';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import TextField from '@/common/components/atom/textField/textField';
import AlertIcon from '@/common/components/icons/alert';
import classNames from '@/common/utils/classNames';
import FeedbackCard from '../../components/feedbackCard/feedbackCard';
import { RateProps } from '../../type/rate';

export const Rate = (props: RateProps) => {
  const { details, filters, search, feedbacks, isLoading, controller, message } = props;

  return (
    <>
      <div className="w-full h-auto">
        {!!controller && (
          <div className="flex items-center justify-between w-full px-4 my-4">
            <Text fontSize="sm" fontWeight="medium">
              {controller.text}
            </Text>
            {controller.buttons.map(button => (
              <div key={button.id} className="flex gap-2">
                <Button onClick={() => button.action()} variant="secondary" className="px-12">
                  {button.text}
                </Button>
              </div>
            ))}
          </div>
        )}
        {!!details.count && (
          <>
            <Divider className={classNames('mb-5', { '!mb-0': !!message })} />
            {!message && (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between w-full gap-3 px-4">
                  {filters.length &&
                    filters.map(option => (
                      <div key={option.id} className="w-3/6">
                        <Autocomplete onChange={e => option.onChange(e.target.value)} options={option.options} value={option.value} />
                      </div>
                    ))}
                </div>
                {search && (
                  <div className="relative mx-4 bg-white border rounded-lg border-slate-300 outline-primary">
                    {search.icon && <span>{search.icon}</span>}
                    <TextField
                      placeholder={search.placeholder}
                      onChange={(e: any) => search.onChange(e)}
                      value={search.value}
                      className={search.className}
                    />
                  </div>
                )}
                <div className={classNames('mt-2', { '!mt-0': !feedbacks.length })}>
                  {!!feedbacks?.length &&
                    !isLoading &&
                    feedbacks.map((feedback, index) => <FeedbackCard className="border-b-0" key={index + 1} feedback={feedback} />)}
                  {isLoading && <RateLoading />}
                  {!feedbacks?.length && !isLoading && (
                    <div className="p-4 pt-0">
                      <NotFound />
                    </div>
                  )}
                </div>
              </div>
            )}
            {message && (
              <div className=" text-center flex flex-col justify-center items-center h-[12rem] gap-3 bg-[#FFAD0D]/[0.2]">
                <AlertIcon className="[&>path]:fill-[#FFAD0D] w-10 h-10" />
                <Text fontWeight="medium">{message}</Text>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

const NotFound = () => {
  return (
    <div className="h-[5rem] w-full rounded-xl flex justify-center items-center bg-slate-100">
      <Text fontSize="sm" fontWeight="extraBold">
        موردی یافت نشد !
      </Text>
    </div>
  );
};

export const RateLoading = () => {
  return (
    <>
      <div className="p-3 bg-white rounded-lg ">
        <div className="flex w-full gap-3">
          <div>
            <Skeleton w="4rem" h="4rem" rounded="full" />
          </div>
          <div className="flex flex-col justify-around w-full">
            <Skeleton w="20%" h="1rem" rounded="md" />
            <Skeleton w="49%" h="1rem" rounded="md" />
          </div>
        </div>
        <Skeleton w="20%" h="1rem" rounded="md" className="mt-4" />
        <Skeleton w="100%" h="10rem" rounded="md" className="mt-4" />
        <Skeleton w="100%" h="3rem" rounded="md" className="mt-4" />
      </div>
    </>
  );
};

export default Rate;
