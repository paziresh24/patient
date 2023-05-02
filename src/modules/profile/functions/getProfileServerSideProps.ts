import { getFeedbacks } from '@/apis/services/rate/getFeedbacks';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { getProfileData } from '@/common/apis/services/profile/getFullProfile';
import { internalLinks } from '@/common/apis/services/profile/internalLinks';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import { useFeedbackDataStore } from '@/modules/profile/store/feedbackData';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import axios from 'axios';
import { GetServerSidePropsContext } from 'next';

const getSearchLinks = ({ centers, group_expertises }: any) => {
  const center = centers.find((center: any) => center.city && center.id !== '5532');
  const gexp = group_expertises[0];
  return ['/s/', ...(center?.city ? [`/s/${center.city_en_slug}/`, `/s/${center.city_en_slug}/${gexp.en_slug}/`] : [])];
};

const createBreadcrumb = (links: { orginalLink: string; title: string }[], displayName: string, currentPathName: string) => {
  const reformmatedBreadcrumb = links?.map(link => ({ href: link.orginalLink, text: link.title })) ?? [];

  reformmatedBreadcrumb.unshift({
    href: '/',
    text: 'پذیرش۲۴',
  });

  reformmatedBreadcrumb.push({
    href: currentPathName,
    text: displayName,
  });

  return reformmatedBreadcrumb;
};

export const getProfileServerSideProps = async (context: GetServerSidePropsContext) => {
  context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
  const isCSR = context.req.url?.startsWith?.('/_next');

  const { slug, ...query } = context.query;
  const university = query.university as string;

  const slugFormmated = decodeURIComponent(slug as string);
  const pageSlug = `/dr/${slugFormmated}`;
  try {
    const queryClient = new QueryClient();
    const { data, redirect } = await queryClient.fetchQuery(
      [
        ServerStateKeysEnum.DoctorFullProfile,
        {
          slug: slugFormmated,
          ...(university && { university }),
        },
      ],
      () =>
        getProfileData({
          slug: slugFormmated,
          ...(university && { university }),
        }),
    );

    if (redirect) {
      return {
        redirect: {
          statusCode: redirect.statusCode,
          destination: encodeURI(redirect.route),
        },
      };
    }

    const links = getSearchLinks({ centers: data.centers, group_expertises: data.group_expertises });

    const internalLinksData = await queryClient
      .fetchQuery(
        [
          ServerStateKeysEnum.InternalLinks,
          {
            links,
          },
        ],
        () =>
          internalLinks({
            links,
          }),
      )
      .catch(error => console.log('error'));

    let feedbackDataWithoutPagination;

    try {
      const feedbackData = await queryClient.fetchQuery(
        [
          ServerStateKeysEnum.Feedbacks,
          {
            doctor_id: data.id,
            server_id: data.server_id,
          },
        ],
        () =>
          getFeedbacks({
            doctor_id: data.id,
            server_id: data.server_id,
          }),
      );
      if (!isCSR)
        feedbackDataWithoutPagination = await queryClient.fetchQuery(
          [
            ServerStateKeysEnum.Feedbacks,
            {
              doctor_id: data.id,
              server_id: data.server_id,
              no_page_limit: true,
            },
          ],
          () =>
            getFeedbacks({
              doctor_id: data.id,
              server_id: data.server_id,
              no_page_limit: true,
            }),
        );
      useFeedbackDataStore.getState().setData(feedbackData?.result ?? []);
    } catch (error) {
      console.log(error);
    }

    const doctorCity = data?.centers?.find((center: any) => center.id !== '5532')?.city;
    const doctorExpertise = getDisplayDoctorExpertise({
      aliasTitle: data?.expertises?.[0]?.alias_title,
      degree: data?.expertises?.[0]?.degree?.name,
      expertise: data?.expertises?.[0]?.expertise?.name,
    });
    const title = `${data?.display_name}، ${doctorExpertise} ${doctorCity ? `${doctorCity}،` : ''} نوبت دهی آنلاین و شماره تلفن`;
    const description = `نوبت دهی اینترنتی ${data?.display_name}، آدرس مطب، شماره تلفن و اطلاعات تماس با امکان رزرو وقت و نوبت دهی آنلاین در اپلیکیشن و سایت پذیرش۲۴`;

    return {
      props: {
        title: university ? data?.display_name : title,
        description: university ? '' : description,
        dehydratedState: dehydrate(queryClient),
        query,
        slug: slugFormmated,
        initialFeedbackDate: useFeedbackDataStore.getState().data,
        feedbackDataWithoutPagination: feedbackDataWithoutPagination?.result ?? [],
        breadcrumbs: createBreadcrumb(internalLinksData, data?.display_name, pageSlug),
      },
    };
  } catch (error) {
    console.dir(error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404)
        return {
          notFound: true,
        };
    }
    throw new TypeError(JSON.stringify(error));
  }
};
