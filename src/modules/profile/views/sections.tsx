import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import AddIcon from '@/common/components/icons/add';
import config from 'next/config';
import dynamic from 'next/dynamic';

const { publicRuntimeConfig } = config();

const AwardIcon = dynamic(() => import('@/common/components/icons/award'));
const ChatIcon = dynamic(() => import('@/common/components/icons/chat'));
const EditButton = dynamic(() => import('../components/viewAs/editButton'));
const Activity = dynamic(() => import('./activity'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="8rem" rounded="lg" />;
  },
});
const Biography = dynamic(() => import('./biography'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="16rem" rounded="lg" />;
  },
});
const OwnPage = dynamic(() => import('./ownPage'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="8rem" rounded="lg" />;
  },
});
const Gallery = dynamic(() => import('./gallery'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="8rem" rounded="lg" />;
  },
});
const RateReview = dynamic(() => import('./rateReview'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="30rem" rounded="lg" />;
  },
});
const ProfileSeoBox = dynamic(() => import('./seoBox'));

export const sections = ({
  information,
  centers,
  expertises,
  feedbacks,
  media,
  history,
  symptomes,
  similarLinks,
  isBulk,
  customize,
  editable,
  handleViewAs,
  seo,
}: any) =>
  [
    // Own Page
    {
      isShow: isBulk,
      function: () => {
        return {
          fullname: information.display_name,
        };
      },
      children: (props: any) => <OwnPage {...props} />,
    },
    // About
    {
      title: 'درباره پزشک',
      id: 'about_section',
      ActionButton: editable && information.biography && <EditButton onClick={() => handleViewAs('biography')} />,
      isShow: information.biography || information.awards || information.scientific,
      isShowFallback: !information.biography && !information.awards && !information.scientific && editable,
      function: () => {
        const { biography, awards, scientific } = information;
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
      isShow: media.aparat && media.aparat !== '0',
      children: (props: any) => <div className="overflow-hidden md:rounded-lg" dangerouslySetInnerHTML={{ __html: media.aparat }} />,
    },
    // Gallery
    {
      title: 'گالری',
      ActionButton: editable && information.biography && <EditButton onClick={() => handleViewAs('gallery')} />,
      isShow: customize.showGalleryProfile && media.gallery.length > 0,
      isShowFallback: editable,
      function: () => {
        const items = media.gallery;
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
      title: `فعالیت ها ${information.display_name}`,
      isShow: customize.showActivityProfile,
      function: () => {
        return {
          items: [
            history.count_of_consult_books && {
              icon: <ChatIcon className="min-w-fit w-max" />,
              text: `<b>${history.count_of_consult_books}</b> مشاوره فعال`,
            },
            {
              icon: <AwardIcon className="min-w-fit w-max" />,
              text: `پذیرش24 بیش از ${history.insert_at_age} افتخار میزبانی از صفحه اختصاصی ${information.display_name} را داشته است.`,
            },
          ].filter(Boolean),
        };
      },
      children: (props: any) => <Activity className="bg-white md:rounded-lg" {...props} />,
    },
    // Reviews
    {
      id: 'reviews_section',
      title: `نظرات در مورد ${information.display_name}`,
      isShow: customize.showRateAndReviews,
      function: () => {
        const doctorInfo = {
          center: centers
            .filter((center: any) => center.id !== '5532')
            .map((center: any) => center && { id: center.id, name: center.name }),
          id: information.id,
          name: information.display_name,
          image: information.image,
          group_expertises: expertises.group_expertises[0].name ?? 'سایر',
          group_expertises_slug: expertises.group_expertises[0].en_slug ?? 'other',
          expertise: expertises?.expertises?.[0]?.expertise?.name,
          slug: seo.slug,
          city: centers.map((center: any) => center.city),
          server_id: information.server_id,
        };

        const rateDetails = {
          satisfaction: feedbacks.details?.satisfaction,
          count: feedbacks.details.number_of_feedbacks,
          information: [
            {
              id: 1,
              title: 'برخورد مناسب پزشک',
              satisfaction: feedbacks.details.doctor_encounter * 20,
              avg_star: feedbacks.details.doctor_encounter,
            },
            {
              id: 2,
              title: 'توضیح پزشک در هنگام ویزیت',
              satisfaction: feedbacks.details.explanation_of_issue * 20,
              avg_star: feedbacks.details.explanation_of_issue,
            },
            {
              id: 3,
              title: 'مهارت و تخصص پزشک',
              satisfaction: feedbacks.details.quality_of_treatment * 20,
              avg_star: feedbacks.details.quality_of_treatment,
            },
          ],
        };
        return {
          doctor: doctorInfo,
          rateDetails,
          feedbacks: feedbacks.feedbacks,
          serverId: information.server_id,
          symptomes: symptomes?.slice?.(0, 5) ?? [],
        };
      },
      children: (props: any) => <RateReview {...props} />,
    },
    // Seo Box
    {
      isShow: customize.showSeoBoxs,
      function: () => {
        const about = `این صفحه به عنوان وب سایت نوبت دهی اینترنتی ${
          information.display_name
        } جهت مشاهده خدمات و دریافت نوبت آنلاین مطب شخصی، کلینیک، درمانگاه و بیمارستان هایی که ایشان در حال ارائه خدمات درمانی هستند از طریق پذیرش24 طراحی و ارائه شده است. البته ممکن است در حال حاضر امکان رزرو نوبت از همه مراکز فوق ممکن نباشد که این موضوع وابسته به تصمیم ${
          information.gender === 0 ? '' : information.gender == 1 ? 'آقای' : 'خانم'
        } دکتر در ارائه نوبت گیری از درگاه های فوق بوده است.`;

        return {
          similarLinks: similarLinks?.map((item: any) => ({ name: item.caption, url: item.link })),
          about,
          breadcrumbs: seo.breadcrumbs,
        };
      },
      children: (props: any) => <ProfileSeoBox {...props} />,
    },
  ] as const;
