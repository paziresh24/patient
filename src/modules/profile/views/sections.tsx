import Text from '@/common/components/atom/text/text';
import AddIcon from '@/common/components/icons/add';
import config from 'next/config';
import dynamic from 'next/dynamic';

const { publicRuntimeConfig } = config();

const AwardIcon = dynamic(() => import('@/common/components/icons/award'));
const ChatIcon = dynamic(() => import('@/common/components/icons/chat'));
const EditButton = dynamic(() => import('../components/viewAs/editButton'));
const Activity = dynamic(() => import('./activity'));
const Biography = dynamic(() => import('./biography'));
const OwnPage = dynamic(() => import('./ownPage'));
const Gallery = dynamic(() => import('./gallery'));
const RateReview = dynamic(() => import('./rateReview'));
const ProfileSeoBox = dynamic(() => import('./seoBox'));

export const sections = ({ info, centers, isBulk, customize, editable, handleViewAs, seo }: any) =>
  [
    // Own Page
    {
      isShow: isBulk,
      children: () => <OwnPage />,
    },
    // About
    {
      title: 'درباره پزشک',
      id: 'about_section',
      ActionButton: editable && info.biography && <EditButton onClick={() => handleViewAs('biography')} />,
      isShow: info.biography || info.awards || info.scientific,
      isShowFallback: !info.biography && !info.awards && !info.scientific && editable,
      function: () => {
        const { biography, awards, scientific } = info;
        return {
          biography,
          awards,
          scientific,
        };
      },
      children: (props: any) => <Biography className="bg-white md:rounded-lg" {...props} />,
      fallback: (props: any) => (
        <div
          onClick={() => handleViewAs('biography')}
          className="flex items-center justify-center p-5 mx-4 transition-all border-2 border-dashed rounded-lg cursor-pointer md:mx-0 hover:bg-slate-200/30 space-s-2 text-slate-400 border-slate-200"
        >
          <AddIcon className="w-5 h-5" />
          <Text fontWeight="medium">نوشتن بیوگرافی</Text>
        </div>
      ),
    },
    // Video
    {
      isShow: info.aparat_video_code && info.aparat_video_code !== '0',
      children: (props: any) => (
        <div className="overflow-hidden md:rounded-lg" dangerouslySetInnerHTML={{ __html: info.aparat_video_code }} />
      ),
    },
    // Gallery
    {
      title: 'گالری',
      ActionButton: editable && info.biography && <EditButton onClick={() => handleViewAs('gallery')} />,
      isShow: customize.showGalleryProfile && centers.some((center: any) => center.center_type === 1 && !!center.gallery.length),
      isShowFallback: editable,
      function: () => {
        const items = centers.find((center: any) => center.center_type === 1)?.gallery ?? [];
        const reformattedItems = items?.map((item: any) => publicRuntimeConfig.CLINIC_BASE_URL + item.image) ?? [];
        return {
          items: reformattedItems,
        };
      },
      children: (props: any) => <Gallery className="bg-white md:rounded-lg" {...props} />,
      fallback: (props: any) => (
        <div
          onClick={() => handleViewAs('gallery')}
          className="flex items-center justify-center p-5 mx-4 transition-all border-2 border-dashed rounded-lg cursor-pointer md:mx-0 hover:bg-slate-200/30 space-s-2 text-slate-400 border-slate-200"
        >
          <AddIcon className="w-5 h-5" />
          <Text fontWeight="medium">افزودن تصویر</Text>
        </div>
      ),
    },
    // Activity
    {
      title: `فعالیت ها ${info.display_name}`,
      isShow: customize.showActivityProfile,
      function: () => {
        return {
          items: [
            info.followConsultBoosk && {
              icon: <ChatIcon className="min-w-fit w-max" />,
              text: `<b>${info.followConsultBoosk}</b> مشاوره فعال`,
            },
            {
              icon: <AwardIcon className="min-w-fit w-max" />,
              text: `پذیرش24 بیش از ${info.insert_at_age} افتخار میزبانی از صفحه اختصاصی ${info.display_name} را داشته است.`,
            },
          ].filter(Boolean),
        };
      },
      children: (props: any) => <Activity className="bg-white md:rounded-lg" {...props} />,
    },
    // Reviews
    {
      id: 'reviews_section',
      title: `نظرات در مورد ${info.display_name}`,
      isShow: customize.showRateAndReviews,
      function: () => {
        const doctorInfo = {
          center: centers
            .filter((center: any) => center.id !== '5532')
            .map((center: any) => center && { id: center.id, name: center.name }),
          id: info.id,
          name: info.display_name,
          image: info.image,
          group_expertises: info.group_expertises[0].name ?? 'سایر',
          group_expertises_slug: info.group_expertises[0].en_slug ?? 'other',
          expertise: info?.expertises?.[0]?.expertise?.name,
          slug: info.slug,
          city: centers.map((center: any) => center.city),
        };

        const rateDetails = {
          satisfaction: info.feedbacks.details?.satisfaction,
          count: info.feedbacks.details.number_of_feedbacks,
          information: [
            {
              id: 1,
              title: 'برخورد مناسب پزشک',
              satisfaction: info.feedbacks.details.doctor_encounter * 20,
              avg_star: info.feedbacks.details.doctor_encounter,
            },
            {
              id: 2,
              title: 'توضیح پزشک در هنگام ویزیت',
              satisfaction: info.feedbacks.details.explanation_of_issue * 20,
              avg_star: info.feedbacks.details.explanation_of_issue,
            },
            {
              id: 3,
              title: 'مهارت و تخصص پزشک',
              satisfaction: info.feedbacks.details.quality_of_treatment * 20,
              avg_star: info.feedbacks.details.quality_of_treatment,
            },
          ],
        };
        return {
          doctor: doctorInfo,
          rateDetails,
          serverId: info.server_id,
        };
      },
      children: (props: any) => <RateReview className="md:rounded-lg" {...props} />,
    },
    // Seo Box
    {
      isShow: customize.showSeoBoxs,
      function: () => {
        const about = `این صفحه به عنوان وب سایت نوبت دهی اینترنتی ${
          info.display_name
        } جهت مشاهده خدمات و دریافت نوبت آنلاین مطب شخصی، کلینیک، درمانگاه و بیمارستان هایی که ایشان در حال ارائه خدمات درمانی هستند از طریق پذیرش24 طراحی و ارائه شده است. البته ممکن است در حال حاضر امکان رزرو نوبت از همه مراکز فوق ممکن نباشد که این موضوع وابسته به تصمیم ${
          info.gender === 0 ? '' : info.gender == 1 ? 'آقای' : 'خانم'
        } دکتر در ارائه نوبت گیری از درگاه های فوق بوده است.`;

        return {
          similarLinks: info.similar_links?.map((item: any) => ({ name: item.caption, url: item.link })),
          about,
          breadcrumbs: seo.breadcrumbs,
        };
      },
      children: (props: any) => <ProfileSeoBox {...props} />,
    },
  ] as const;
