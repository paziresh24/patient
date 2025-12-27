import { ComponentType } from 'react';
import ErrorBoundary from '../components/layouts/errorBoundary';
import { growthbook } from 'src/pages/_app';
import { getFeatures } from './features';

type ComponentMeta = {
  id: string;
  projectId?: string;
};

const componentMetaByName: Record<string, ComponentMeta> = {
  Claim: { id: '5jjwlzFYfMqI', projectId: 'iDYgiKJB9Yi7CUB81stQBK' },
  ReviewList2: { id: 'Kz2u6VAJ02yE', projectId: 'qQzsBf58SqzNJX45iggq96' },
  RateAndCommentCount2: { id: 'etOCIhcu_Yx5', projectId: 'qQzsBf58SqzNJX45iggq96' },
  RateProgressList: { id: 'xpGRRNKB86D2', projectId: 'qQzsBf58SqzNJX45iggq96' },
  RateAndReviews: { id: 'qb59XTke1gWO', projectId: 'qQzsBf58SqzNJX45iggq96' },
  ReviewList: { id: 'Bx6gxTOoja9k', projectId: 'qQzsBf58SqzNJX45iggq96' },
  RateAndCommentCount: { id: 'u3Jgb_UfiULc', projectId: 'qQzsBf58SqzNJX45iggq96' },
  RateProgressBar: { id: 'YorKPsj5-KCA', projectId: 'qQzsBf58SqzNJX45iggq96' },
  ReceiptActionButtons: { id: 'EifS7TB9I3zC', projectId: 'iDYgiKJB9Yi7CUB81stQBK' },
  Services: { id: 'q3FGMz6XNu9L', projectId: 'iDYgiKJB9Yi7CUB81stQBK' },
  Activity: { id: 'pggD1apWa_wW', projectId: 'iDYgiKJB9Yi7CUB81stQBK' },
  About: { id: '6mjf324FkOZF', projectId: 'iDYgiKJB9Yi7CUB81stQBK' },
  LocationSelectionScript: { id: '5bzKtjF_q24p', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  ProductCard: { id: 'NhMGML-3Q4Pu', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  SearchResults: { id: 'XhSI4pxMLR3L', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  Schedules: { id: 'Mt_WMP6AHSGv', projectId: '8NbkXymcLwvMUC2yXeRrWk' },
  SearchRequest: { id: '35vwUOYdUX87', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  AddressesWrapper: { id: 'Z7E4nvI5-Dtv', projectId: '8NbkXymcLwvMUC2yXeRrWk' },
  AddressesCard: { id: 'z1k0-vbkFtby', projectId: '8NbkXymcLwvMUC2yXeRrWk' },
  BookingServiceList: { id: 'fpdRSzutXHoq', projectId: '8NbkXymcLwvMUC2yXeRrWk' },
  ProfileHead: { id: 'fKBGdItR62E2', projectId: '7r312uiqyadpVPdnRoAggk' },
  ProfileAbout: { id: 'VlJvd0AHTT9_', projectId: '7r312uiqyadpVPdnRoAggk' },
  ProfileActivity: { id: 'LIHtK_X7GpDY', projectId: '7r312uiqyadpVPdnRoAggk' },
  ProfileSeo: { id: 'AyZkzO0Ld0SI', projectId: '7r312uiqyadpVPdnRoAggk' },
  ProfileGallery: { id: '-M0f8W0T-8eT', projectId: '7r312uiqyadpVPdnRoAggk' },
  FilterListView: { id: 'Z5K_XiJUvXFD', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  FilterExpertiseView: { id: 'N8MUho5TZvBe', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  FilterSelectedView: { id: 'hzanYC1FO-Wr', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  FilterRow: { id: 'OC23iWRW1Dia', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  HomePageShortcuts: { id: 'pfHDjmK7Jo_j', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  OnlineVisit: { id: 'kiuZ6fZVjKcZ', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  SearchInput: { id: 'd_qMEJ14UZf0', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  RecentSearch: { id: 'ARWFU9130hug', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  SeoBox: { id: 'LCOgDdMa8kxO', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  Sort: { id: 's-wlX7BnSeTl', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  ConsultBanner: { id: 'KmDr0VPQLI2_', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  ResultView: { id: 'NYqLbXm7Qk5C', projectId: 'sMdpLWyxbzDCruwMRffW2m' },
  Risman: { id: 'KinPlL1Jj1j3', projectId: 'bN5uNsAhTefwW3S14VjvMG' },
};

interface DynamicPlasmicProps {
  name: string;
  Component: ComponentType<any>;
  variants?: Record<string, any>;
  args?: Record<string, any>;
}

export const Fragment2 = ({ name, Component, variants, args }: DynamicPlasmicProps) => {
  if (!Component || !name) return null;

  const meta = componentMetaByName[name];
  const features = getFeatures({ provider: growthbook });

  return (
    <ErrorBoundary>
      <Component
        data-fragment-component-id={meta?.id ?? ''}
        data-fragment-project-id={meta?.projectId ?? ''}
        data-fragment-component={name}
        {...args}
        {...features}
        {...variants}
      />
    </ErrorBoundary>
  );
};
