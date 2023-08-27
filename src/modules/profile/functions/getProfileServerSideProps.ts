import { getFeedbacks } from '@/apis/services/rate/getFeedbacks';
import { apiGatewayClient, paziresh24AppClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { internalLinks } from '@/common/apis/services/profile/internalLinks';
import { getServerSideGrowthBookContext } from '@/common/helper/getServerSideGrowthBookContext';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import { GrowthBook } from '@growthbook/growthbook-react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
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
    const { redirect, fullProfileData } = await getProfile({ slug: slugFormmated, university });
    if (redirect) {
      return {
        redirect: {
          statusCode: redirect.statusCode,
          destination: encodeURI(redirect.route),
        },
      };
    }
    const { centers: fullCenters, id, server_id } = fullProfileData;
    const overwriteData: { information: Record<string, string>; centers: any[]; expertise: any[] } = {
      information: {},
      centers: [],
      expertise: [],
    };

    if (shouldApiGateway) {
      try {
        const requests = [
          await apiGatewayClient.get(`/v2/doctors/${server_id}/${id}`),
          await paziresh24AppClient.get(`/doctor/v1/expertise`, {
            params: {
              doctor_id: id,
              server_id,
            },
          }),
          ...fullCenters.map(
            async (center: { id: string; server_id: string }) => await apiGatewayClient.get(`/v2/centers/${center.server_id}/${center.id}`),
          ),
        ];

        const [doctorData, expertiseData, ...centersData] = await Promise.allSettled(requests);

        if (doctorData.status === 'fulfilled')
          overwriteData.information = {
            biography: doctorData.value.data.Biography,
            awards: doctorData.value.data.Awards,
            scientific: doctorData.value.data.Scientific,
            display_name: doctorData.value.data.FullName,
            medical_code: doctorData.value.data.MedicalCode,
            image: `/api/getImage/p24/search-${doctorData.value.data.Gender === 'man' ? 'men' : 'women'}/${
              doctorData.value.data.Image ?? 'noimage.png'
            }`,
          };

        if (expertiseData.status === 'fulfilled')
          overwriteData.expertise =
            expertiseData.value.data?.data?.map(({ alias_title, expertise_id, degree_id }: any) => ({
              alias_title,
              expertise_id,
              degree_id,
            })) ?? [];

        overwriteData.centers = centersData.map(centerData => {
          if (centerData.status === 'fulfilled') {
            const {
              Id: id,
              Address: address,
              Slug: slug,
              CityName: city,
              Tell: tell,
              Lat: lat,
              Lon: lon,
              TypeId: type_id,
              Name: name,
              Status: status,
              Description: description,
            } = centerData.value.data;

            return {
              id,
              address,
              city,
              map: { lat, lon },
              display_number_array: tell.split('|'),
              center_type: type_id,
              name,
              slug,
              status,
              description,
            };
          }
        });
      } catch (error) {
        console.log(error);
      }
    }

    const information = {
      id,
      server_id,
      biography: fullProfileData.biography,
      awards: fullProfileData.awards,
      scientific: fullProfileData.scientific,
      display_name: fullProfileData.display_name,
      medical_code: fullProfileData.medical_code,
      experience: fullProfileData.experience,
      gender: fullProfileData.gender,
      image: fullProfileData.image,
      city_en_slug: fullProfileData.city_en_slug,
      should_recommend_other_doctors: fullProfileData.should_recommend_other_doctors,
      ...overwriteData.information,
    };
    const centers = fullCenters.map((center: any) => ({ ...center, ...overwriteData.centers.find(c => c.id === center.id) }));
    const expertises = {
      group_expertises: fullProfileData.group_expertises,
      expertises:
        overwriteData.expertise.length > 0
          ? overwriteData.expertise
          : fullProfileData.expertises.map((item: any) => ({
              alias_title: getDisplayDoctorExpertise({
                aliasTitle: item.alias_title,
                degree: item.degree?.name,
                expertise: item.expertise?.name,
              }),
              expertise_id: item.expertise.id,
              degree_id: item.degree.id,
            })),
    };

    const feedbacks = { ...fullProfileData.feedbacks };
    const media = {
      aparat: fullProfileData.aparat_video_code,
      gallery: fullProfileData.centers?.find((center: any) => center?.center_type === 1)?.gallery ?? [],
    };
    const symptomes = fullProfileData.symptomes;
    const history = {
      insert_at_age: fullProfileData.insert_at_age,
      count_of_consult_books: fullProfileData.followConsultBoosk,
      count_of_page_view: fullProfileData.number_of_visits,
    };
    const similarLinks = fullProfileData.similar_links;
    const onlineVisit = {
      enabled: fullProfileData.consult_active_booking,
      channels: fullProfileData.online_visit_channel_types,
    };

    const links = getSearchLinks({ centers, group_expertises: expertises.group_expertises });

    const internalLinksData = await internalLinks({
      links,
    }).catch(error => console.log('error'));

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
      feedbacks.feedbacks = feedbackData?.result ?? [];
    } catch (error) {
      console.log(error);
    }

    const doctorCity = centers?.find((center: any) => center.id !== '5532')?.city;

    const title = `${information?.display_name}، ${expertises.expertises[0].alias_title} ${
      doctorCity ? `${doctorCity}،` : ''
    } نوبت دهی آنلاین و شماره تلفن`;
    const description = `نوبت دهی اینترنتی ${information?.display_name}، آدرس مطب، شماره تلفن و اطلاعات تماس با امکان رزرو وقت و نوبت دهی آنلاین در اپلیکیشن و سایت پذیرش۲۴`;

    return {
      props: {
        title: university ? information?.display_name : title,
        description: university ? '' : description,
        overwriteData,
        information,
        centers,
        expertises,
        feedbacks,
        dehydratedState: dehydrate(queryClient),
        media,
        symptomes,
        history,
        onlineVisit,
        similarLinks,
        isBulk:
          centers.every((center: any) => center.status === 2) ||
          centers.every((center: any) => center.services.every((service: any) => !service.hours_of_work)),
        breadcrumbs: createBreadcrumb(internalLinksData, information?.display_name, pageSlug),
        slug: slugFormmated,
        feedbackDataWithoutPagination: feedbackDataWithoutPagination?.result ?? [],
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
