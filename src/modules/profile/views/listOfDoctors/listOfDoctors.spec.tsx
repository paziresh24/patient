import { render, screen } from '@testing-library/react';
import ListOfDoctors from './listOfDoctors';

jest.mock('next/config', () => () => ({ publicRuntimeConfig: { CDN_BASE_URL: 'https://cdn.paziresh24.com' } }));
jest.mock('next/router', () => ({ useRouter: () => ({ query: {}, push: jest.fn() }) }));
jest.mock('@growthbook/growthbook-react', () => ({
  useFeatureIsOn: () => false,
  useFeatureValue: (_key: string, fallback: any) => fallback,
}));
jest.mock('@/common/services/splunk', () => ({ splunkInstance: () => ({ sendEvent: jest.fn() }) }));
jest.mock('.plasmic/plasmic/paziresh_24_search/PlasmicSearchResults', () => ({ PlasmicSearchResults: () => null }));
jest.mock('../../../../../.plasmic/plasmic/paziresh_24_search/PlasmicGlobalContextsProvider', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));
jest.mock('@/common/fragment/fragment2', () => ({ Fragment2: () => null }));

/** Real seapi row for `?center=386&text=آنا` — every doctor field came back null. */
const emptyDoctorRow = {
  _id: 'doctor_69bb17f7-c9ce-11f0-b67f-005056a0fe3c_32',
  image: 'https://pic.paziresh24.com/api/image/21511820',
  center_id: ['386'],
  title: null,
  display_name: null,
  display_expertise: null,
  url: null,
  badges: null,
  actions: null,
  rates_count: null,
  satisfaction: null,
};

const baseProps = {
  expertises: [],
  onSearch: jest.fn(),
  searchQuery: 'آنا',
  onSelectExpertise: jest.fn(),
  onChangePage: jest.fn(),
  hasNextPage: false,
  isMainSite: false,
  center_id: '386',
};

describe('ListOfDoctors — empty search rows', () => {
  it('renders an empty card instead of crashing when every doctor field is null', () => {
    render(<ListOfDoctors {...baseProps} doctors={{ pages: [{ search: { result: [emptyDoctorRow] } }], pageParams: [] } as any} />);

    // card is rendered (avatar image survives) and the not-found state is not shown
    expect(screen.queryByText('پزشکی یافت نشد.')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
  });

  it('shows the not-found state only when there is really no row', () => {
    render(<ListOfDoctors {...baseProps} doctors={{ pages: [{ search: { result: [] } }], pageParams: [] } as any} />);

    expect(screen.getByText('پزشکی یافت نشد.')).toBeInTheDocument();
  });
});
