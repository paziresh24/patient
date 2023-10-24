import Text from '@/common/components/atom/text';
import AlertIcon from '@/common/components/icons/alert';
import LikeIcon from '@/common/components/icons/like';

interface CloseRateProps {
  message?: string;
}

export const CloseRate = ({ message }: CloseRateProps) => {
  return (
    <div className="h-auto w-full relative flex flex-col items-center">
      <div className="h-full m-4 blur-[0.32rem]">
        <p className="text-green-700 text-sm font-bold flex gap-1 items-center">
          این پزشک را پیشنهاد داده اند
          <LikeIcon style={{ transform: 'rotateY(180deg)' }} className="mb-1" />
        </p>
        <p className="text-sm font-medium text-justify !leading-7 mt-5">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در
          ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای
          زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان
          رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در
          ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود
          طراحی اساسا مورد استفاده قرار گیرد.
        </p>
      </div>
      <div className=" text-center flex flex-col justify-center items-center h-full w-full absolute bottom-0 gap-3 bg-[#FFAD0D]/[0.25]">
        <AlertIcon className="[&>path]:fill-[#FFAD0D] w-10 h-10" />
        <Text fontWeight="medium" className="text-[#0F1D40] leading-8">
          {message ?? ''}
        </Text>
      </div>
    </div>
  );
};

export default CloseRate;
