import { getFeedbacks } from '@/apis/services/rate/getFeedbacks';
import { apiGatewayClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { internalLinks } from '@/common/apis/services/profile/internalLinks';
import { getServerSideGrowthBookContext } from '@/common/helper/getServerSideGrowthBookContext';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import { useFeedbackDataStore } from '@/modules/profile/store/feedbackData';
import { GrowthBook } from '@growthbook/growthbook-react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { GetServerSidePropsContext, NextApiRequest } from 'next';
import { getProfile } from './getProfileData';

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

export const getProfileServerSideProps = withServerUtils(async (context: GetServerSidePropsContext) => {
  context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
  const isCSR = context.req.url?.startsWith?.('/_next');

  const { slug, ...query } = context.query;
  const university = query.university as string;

  const slugFormmated = decodeURIComponent(slug as string);
  const pageSlug = `/dr/${slugFormmated}`;

  let shouldApiGateway = false;
  try {
    const gbContext = getServerSideGrowthBookContext(context.req as NextApiRequest);
    const gb = new GrowthBook(gbContext);
    await gb.loadFeatures({ timeout: 1000 });
    const apiGatewayFeature = gb.getFeatureValue('profile.api-gateway', ['*']);
    shouldApiGateway = apiGatewayFeature.includes(slugFormmated) || apiGatewayFeature.includes('*');
  } catch (error) {
    console.log(error);
  }

  try {
    const queryClient = new QueryClient();
    const { redirect, fullProfileData } = await getProfile(queryClient, { slug: slugFormmated, university });
    if (redirect) {
      return {
        redirect: {
          statusCode: redirect.statusCode,
          destination: encodeURI(redirect.route),
        },
      };
    }
    const { centers, id, server_id } = fullProfileData;
    const overwriteData: { biography: string; centers: any[] } = { biography: fullProfileData.biography, centers: [] };

    if (shouldApiGateway) {
      const requests = [
        await apiGatewayClient.get(`/v2/doctors/${server_id}/${id}`),
        ...centers.map(
          async (center: { id: string; server_id: string }) => await apiGatewayClient.get(`/v2/centers/${center.server_id}/${center.id}`),
        ),
      ];
      const [
        {
          data: { Biography },
        },
        ...centersData
      ] = await Promise.all(requests);
      overwriteData.biography = Biography;

      overwriteData.centers = centersData.map(({ data: { Id: id, Addr: address, Tell: tell, TypeId: type_id, Name: name } }) => ({
        id,
        address,
        // display_number_array: tell.split('|'),
        center_type: type_id,
        name,
      }));
    }

    const links = getSearchLinks({ centers, group_expertises: fullProfileData.group_expertises });

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
            doctor_id: id,
            server_id: server_id,
          },
        ],
        () =>
          getFeedbacks({
            doctor_id: id,
            server_id: server_id,
          }),
      );
      if (!isCSR)
        feedbackDataWithoutPagination = await queryClient.fetchQuery(
          [
            ServerStateKeysEnum.Feedbacks,
            {
              doctor_id: id,
              server_id: server_id,
              no_page_limit: true,
            },
          ],
          () =>
            getFeedbacks({
              doctor_id: id,
              server_id: server_id,
              no_page_limit: true,
            }),
        );
      useFeedbackDataStore.getState().setData(feedbackData?.result ?? []);
    } catch (error) {
      console.log(error);
    }

    const doctorCity = centers?.find((center: any) => center.id !== '5532')?.city;
    const doctorExpertise = getDisplayDoctorExpertise({
      aliasTitle: fullProfileData?.expertises?.[0]?.alias_title,
      degree: fullProfileData?.expertises?.[0]?.degree?.name,
      expertise: fullProfileData?.expertises?.[0]?.expertise?.name,
    });
    const title = `${fullProfileData?.display_name}، ${doctorExpertise} ${doctorCity ? `${doctorCity}،` : ''} نوبت دهی آنلاین و شماره تلفن`;
    const description = `نوبت دهی اینترنتی ${fullProfileData?.display_name}، آدرس مطب، شماره تلفن و اطلاعات تماس با امکان رزرو وقت و نوبت دهی آنلاین در اپلیکیشن و سایت پذیرش۲۴`;

    return {
      props: {
        title: university ? fullProfileData?.display_name : title,
        description: university ? '' : description,
        overwriteData,
        dehydratedState: dehydrate(queryClient),
        slug: slugFormmated,
        initialFeedbackDate: useFeedbackDataStore.getState().data,
        feedbackDataWithoutPagination: feedbackDataWithoutPagination?.result ?? [],
        breadcrumbs: createBreadcrumb(internalLinksData, fullProfileData?.display_name, pageSlug),
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
});
