import { useGetBookMarksList } from '@/common/apis/services/bookmarks/getBookmarksList';
import { useGetBooks } from '@/common/apis/services/booking/getBooks';
import { useDoctorExpertise } from '@/common/apis/services/doctor/getDoctorExpertise';
import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import { useRate } from '@/common/apis/services/reviews/rate';
import { search } from '@/common/apis/services/search/search';
import { validateDoctorSlug } from '@/common/apis/services/doctor/validateDoctorSlug';
import Avatar from '@/common/components/atom/avatar';
import Button from '@/common/components/atom/button';
import Loading from '@/common/components/atom/loading';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import Transition from '@/common/components/atom/transition';
import CloseIcon from '@/common/components/icons/close';
import EyeIcon from '@/common/components/icons/eye';
import SearchIcon from '@/common/components/icons/search';
import StarIcon from '@/common/components/icons/star';
import useModal from '@/common/hooks/useModal';
import { getImageUrl } from '@/common/utils/getImageUrl';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import getConfig from 'next/config';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDebounce } from 'react-use';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getTopVisitedDoctorIds } from '@/modules/hamdast/utils/profileViewFrequency';
import { getDoctorByDoctorId } from '../apis/getDoctorById';
import { getInvitations, inviteDoctor } from '../apis/invite';

const { publicRuntimeConfig } = getConfig();

type InviteDoctorItem = {
  uniqueKey: string;
  doctorId?: string;
  doctorUserId?: string;
  slug?: string;
  name: string;
  expertise?: string;
  avatar?: string;
  profileUrl?: string;
  reviewCount?: number;
  clinicDoctorPrice?: number;
};

const resolveAvatarPath = (item: any) => {
  const candidates = [
    item?.image,
    item?.avatar,
    item?.avatar_url,
    item?.image_url,
    item?.picture,
    item?.photo,
    item?.doctor_image,
    item?.profile_image,
    item?.profile?.image,
    item?.doctor?.image,
    item?.doctor_info?.image,
    item?.avatar?.url,
  ];

  const rawValue = candidates.find(value => typeof value === 'string' && value.trim().length > 0);
  return rawValue ? String(rawValue).trim() : '';
};

const buildDoctorAvatarUrl = (avatarPath?: string, doctorUserId?: string) => {
  if (doctorUserId) return `https://pic.paziresh24.com/api/image/${doctorUserId}`;

  if (!avatarPath) return '';
  const absolutePicUrl = avatarPath.match(/https?:\/\/pic\.paziresh24\.com\/api\/image\/[^/?#]+/)?.[0];
  if (absolutePicUrl) return absolutePicUrl;

  // Last resort: preserve previous behavior when no identifier exists.
  return getImageUrl(avatarPath, publicRuntimeConfig.CDN_BASE_URL);
};

const resolveDoctorId = (item: any) => {
  const raw =
    item?.id ??
    item?.doctor_id ??
    item?.provider_id ??
    item?.doctor?.id ??
    item?.doctor_info?.id ??
    item?.entity_id;

  if (raw === undefined || raw === null || raw === '') return undefined;
  return String(raw);
};

const resolveDoctorUserId = (item: any) => {
  const raw =
    item?.user_id ??
    item?.doctor_user_id ??
    item?.provider_user_id ??
    item?.doctor?.user_id ??
    item?.doctor_info?.user_id;

  if (raw === undefined || raw === null || raw === '') return undefined;
  return String(raw);
};

const extractSlugFromUrl = (url?: string) => {
  if (!url) return undefined;
  const cleanUrl = url.split('?')[0];
  const parts = cleanUrl.split('/').filter(Boolean);
  const drIndex = parts.findIndex(item => item === 'dr');
  if (drIndex === -1 || !parts[drIndex + 1]) return undefined;
  return parts[drIndex + 1];
};

const normalizeProfileUrl = (url?: string, slug?: string) => {
  if (url && /^https?:\/\//.test(url)) return url;
  if (url && url.startsWith('/')) return url;
  if (slug) return `/dr/${slug}`;
  return undefined;
};

const isDoctorProfileUrl = (url?: string) => Boolean(url && /\/dr\/[^/]+/.test(url));

const uniqDoctors = (items: InviteDoctorItem[]) => {
  const map = new Map<string, InviteDoctorItem>();

  items.forEach(item => {
    const key = item.doctorId || item.slug || item.profileUrl || item.uniqueKey;
    if (!map.has(key)) {
      map.set(key, item);
    }
  });

  return Array.from(map.values());
};

const takeFirst = (items: InviteDoctorItem[], count: number) => {
  if (count <= 0) return [];
  return items.slice(0, count);
};

const getDoctorUniqueKey = (item: InviteDoctorItem) => item.doctorUserId || item.doctorId || item.slug || item.profileUrl || item.uniqueKey;

const attachResolvedUserId = (items: InviteDoctorItem[], resolvedUserIdBySlug: Map<string, string>) =>
  items
    .map(item => ({
      ...item,
      doctorUserId: item.doctorUserId || (item.slug ? resolvedUserIdBySlug.get(item.slug) : undefined),
    }))
    .filter(item => Boolean(item.doctorUserId));

const isInvitedDoctor = (item: InviteDoctorItem, invitedIds: string[]) =>
  Boolean(item.doctorUserId && invitedIds.includes(item.doctorUserId));

const SEARCH_PAGE_LIMIT = 20;
const SEARCH_MAX_PAGES = 5;
const SUGGESTION_MAX_PAGES = 5;

const extractPaginationMeta = (searchResponse: any) => {
  const pagination =
    searchResponse?.search?.pagination ??
    searchResponse?.pagination ??
    searchResponse?.data?.search?.pagination ??
    searchResponse?.data?.pagination;
  const total =
    searchResponse?.search?.total ??
    searchResponse?.total ??
    searchResponse?.data?.search?.total ??
    searchResponse?.data?.total;

  if (!pagination || total === undefined || total === null) return null;

  const page = Number(pagination?.page);
  const limit = Number(pagination?.limit);
  const normalizedTotal = Number(total);

  if (!Number.isFinite(page) || !Number.isFinite(limit) || !Number.isFinite(normalizedTotal)) return null;
  if (page <= 0 || limit <= 0 || normalizedTotal < 0) return null;

  return {
    page,
    limit,
    total: normalizedTotal,
  };
};

const fetchPagedSearchResults = async ({
  route,
  query,
  maxPages = SUGGESTION_MAX_PAGES,
}: {
  route: string;
  query: Record<string, any>;
  maxPages?: number;
}) => {
  const pages: any[] = [];

  for (let requestedPage = 1; requestedPage <= maxPages; requestedPage += 1) {
    const response = await search({
      route,
      query: {
        ...query,
        page: requestedPage,
        limit: SEARCH_PAGE_LIMIT,
      },
    });

    pages.push(response);

    // Guard: if pagination metadata is missing or malformed, stop safely.
    const meta = extractPaginationMeta(response);
    if (!meta) break;

    const hasMorePages = meta.page * meta.limit < meta.total;
    if (!hasMorePages) break;
  }

  return pages;
};

const extractBooksItems = (booksResponse: any): any[] => {
  if (Array.isArray(booksResponse)) return booksResponse;
  if (Array.isArray(booksResponse?.result)) return booksResponse.result;
  if (Array.isArray(booksResponse?.data)) return booksResponse.data;
  if (Array.isArray(booksResponse?.data?.result)) return booksResponse.data.result;
  if (Array.isArray(booksResponse?.data?.data)) return booksResponse.data.data;
  if (Array.isArray(booksResponse?.data?.data?.result)) return booksResponse.data.data.result;
  return [];
};

const resolveDoctorFullName = (item: any) => {
  const firstName =
    item?.name ||
    item?.first_name ||
    item?.firstName ||
    item?.doctor_info?.name ||
    item?.doctor?.name ||
    '';
  const lastName =
    item?.family ||
    item?.last_name ||
    item?.lastName ||
    item?.doctor_info?.family ||
    item?.doctor?.family ||
    '';
  const titleBasedName = item?.title || item?.display_name || '';

  const fullName = `${firstName} ${lastName}`.trim();
  if (firstName && !lastName && titleBasedName) return titleBasedName;
  if (fullName) return fullName;
  return titleBasedName;
};

const extractSearchItems = (searchResponse: any): any[] => {
  if (Array.isArray(searchResponse)) return searchResponse;
  if (Array.isArray(searchResponse?.result)) return searchResponse.result;
  if (Array.isArray(searchResponse?.search?.result)) return searchResponse.search.result;
  if (Array.isArray(searchResponse?.data?.result)) return searchResponse.data.result;
  if (Array.isArray(searchResponse?.data?.search?.result)) return searchResponse.data.search.result;
  return [];
};

const mapSearchItemToInviteDoctor = (item: any, groupPrefix: string, index: number): InviteDoctorItem => {
  const slug = extractSlugFromUrl(item?.url) || item?.slug || item?.doctor_slug;
  const expertise =
    item?.display_expertise ||
    item?.sub_title ||
    item?.expertises?.[0]?.alias_title ||
    item?.expertises?.[0]?.expertise?.name ||
    '';

  return {
    uniqueKey: `${groupPrefix}-${item?.id || item?.doctor_id || slug || index}`,
    doctorId: resolveDoctorId(item),
    doctorUserId: resolveDoctorUserId(item),
    slug,
    name: resolveDoctorFullName(item),
    expertise,
    avatar: resolveAvatarPath(item),
    profileUrl: normalizeProfileUrl(item?.url, slug),
    reviewCount: toNumber(item?.rates_count ?? item?.comments_count ?? item?.count_of_feedbacks),
    clinicDoctorPrice: toNumber(item?.clinic_doctor_price ?? item?.doctor_price ?? item?.price),
  };
};

const toNumber = (value: any): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  const cleaned = String(value).replace(/[^0-9.-]/g, '');
  if (!cleaned) return undefined;
  const parsed = Number(cleaned);
  if (Number.isNaN(parsed)) return undefined;
  return parsed;
};

const DoctorRow = ({
  item,
  isSelected,
  onToggleSelect,
  isSubmitting,
  isInvited,
  layout = 'grid',
}: {
  item: InviteDoctorItem;
  isSelected: boolean;
  onToggleSelect: (item: InviteDoctorItem) => void;
  isSubmitting: boolean;
  isInvited: boolean;
  layout?: 'grid' | 'row';
}) => {
  const { data: rateData, isLoading: isRateLoading } = useRate(
    { slug: item.slug as string },
    { enabled: Boolean(item.slug) },
  );

  const avatarSrc = useMemo(() => buildDoctorAvatarUrl(item.avatar, item.doctorUserId), [item.avatar, item.doctorUserId]);

  const rateSummary = useMemo(() => {
    const stats = rateData?.list?.[0];
    if (!stats) return null;

    const score = (
      (Number(stats.quality_of_treatment ?? 0) +
        Number(stats.doctor_encounter ?? 0) +
        Number(stats.explanation_of_issue ?? 0)) /
      3
    ).toFixed(1);

    return {
      score,
      count: Number(stats.count_rates ?? 0),
    };
  }, [rateData]);

  if (layout === 'row') {
    return (
      <button
        type="button"
        onClick={() => onToggleSelect(item)}
        disabled={isInvited || isSubmitting}
        className={`relative w-full rounded-xl px-3 py-2.5 flex items-center gap-3 text-right transition-[background-color,border-color,transform,box-shadow,opacity] duration-200 ease-out motion-reduce:transition-none disabled:opacity-60 border ${
          isSelected ? 'bg-primary/5 border-primary/30' : 'bg-white border-slate-100 hover:bg-slate-50'
        }`}
      >
        <div className="relative">
          {item.profileUrl && (
            <span
              role="link"
              tabIndex={0}
              title="مشاهده پروفایل"
              className="absolute -left-1 -bottom-1 w-5 h-5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center cursor-pointer z-10"
              onClick={event => {
                event.stopPropagation();
                window.open(item.profileUrl, '_blank', 'noopener,noreferrer');
              }}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.stopPropagation();
                  window.open(item.profileUrl, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <EyeIcon width={12} height={12} />
            </span>
          )}
          <Avatar
            src={avatarSrc}
            alt={item.name}
            name={item.name}
            width={56}
            height={56}
            className="border border-slate-200 object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <Text fontWeight="bold" fontSize="sm" className="line-clamp-1">
            {item.name}
          </Text>
          <Text fontSize="xs" className="text-slate-500 line-clamp-1 min-h-[1rem]">
            {item.expertise || 'پزشک'}
          </Text>
        </div>

        <div className="flex flex-col items-end gap-1">
          {isRateLoading ? (
            <Loading className="w-4" />
          ) : (
            <div className="inline-flex items-center gap-0.5 rounded-full bg-green-600 border border-green-600 px-1.5 py-[1px]">
              <StarIcon width={10} height={10} className="text-white" />
              <Text fontSize="xs" className="text-white text-[10px] leading-4">
                {rateSummary?.score ?? '0'} ({rateSummary?.count ?? 0} نظر)
              </Text>
            </div>
          )}

          <div
            className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold transition-[background-color,border-color,transform,color,opacity] duration-200 ease-out motion-reduce:transition-none ${
              isSelected ? 'bg-primary border-primary text-white' : 'bg-white border-slate-300 text-transparent'
            }`}
          >
            ✓
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onToggleSelect(item)}
      disabled={isInvited || isSubmitting}
      className={`relative rounded-xl p-2.5 flex flex-col gap-1.5 items-center text-center transition-[background-color,border-color,transform,box-shadow,opacity] duration-200 ease-out motion-reduce:transition-none disabled:opacity-60 ${
        isSelected ? 'bg-primary/5' : 'hover:bg-slate-50'
      }`}
    >
      <div
        className={`absolute top-2 right-2 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold transition-[background-color,border-color,transform,color,opacity] duration-200 ease-out motion-reduce:transition-none ${isSelected
            ? 'bg-primary border-primary text-white opacity-100 scale-100'
            : 'bg-transparent border-transparent text-transparent opacity-0 scale-75'
          }`}
      >
        ✓
      </div>
      <div
        className={`relative rounded-full p-0.5 transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none ${isSelected ? 'ring-2 ring-primary scale-105' : 'ring-0 scale-100'
          }`}
      >
        {item.profileUrl && (
          <span
            role="link"
            tabIndex={0}
            title="مشاهده پروفایل"
            className="absolute -left-1 -bottom-1 w-5 h-5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center cursor-pointer z-10 shadow-sm"
            onClick={event => {
              event.stopPropagation();
              window.open(item.profileUrl, '_blank', 'noopener,noreferrer');
            }}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                window.open(item.profileUrl, '_blank', 'noopener,noreferrer');
              }
            }}
          >
            <EyeIcon width={12} height={12} />
          </span>
        )}
        <Avatar
          src={avatarSrc}
          alt={item.name}
          name={item.name}
          width={64}
          height={64}
          className="border border-slate-200 object-cover"
        />
      </div>
      <Text fontWeight="bold" fontSize="xs" className="line-clamp-2 min-h-[2rem] leading-4">
        {item.name}
      </Text>
      <div className="min-h-[1rem] flex items-center">
        {isRateLoading && <Loading className="w-4" />}
        {!isRateLoading && (
          <div className="inline-flex items-center gap-0.5 rounded-full bg-green-600 border border-green-600 px-1.5 py-[1px]">
            <StarIcon width={10} height={10} className="text-white" />
            <Text fontSize="xs" className="text-white text-[10px] leading-4">
              {rateSummary?.score ?? '0'} ({rateSummary?.count ?? 0} نظر)
            </Text>
          </div>
        )}
      </div>
      <div className="min-h-[0.9rem]" />
      {isInvited && (
        <Text fontSize="xs" className="text-green-600">
          دعوت شد
        </Text>
      )}
      {!isInvited && !item.doctorUserId && (
        <Text fontSize="xs" className="text-amber-600">
          شناسه کاربری نامعتبر
        </Text>
      )}
    </button>
  );
};

export const HamdastInvite = ({ app_key }: { app_key: string }) => {
  const { handleOpen, modalProps, handleClose } = useModal();
  const { isLogin, info } = useUserInfoStore();
  const ownDoctorSlug = info?.provider?.slug;
  const { handleOpenLoginModal } = useLoginModalContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedDoctorIds, setSelectedDoctorIds] = useState<string[]>([]);
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  const previousInvitationsQuery = useQuery(
    ['hamdastInvitations', app_key],
    () => getInvitations(app_key),
    {
      enabled: modalProps.isOpen && isLogin && Boolean(app_key),
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
    },
  );

  const bookmarks = useGetBookMarksList();
  const previousBooks = useGetBooks(
    { return_type: 'book', page: 1 },
    {
      enabled: false,
      staleTime: 0,
    },
  );

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm.trim());
    },
    350,
    [searchTerm],
  );

  const ownDoctorProfile = useGetProfileData(
    { slug: ownDoctorSlug ?? '' },
    {
      enabled: modalProps.isOpen && isLogin && Boolean(ownDoctorSlug),
      staleTime: 5 * 60 * 1000,
    },
  );
  const ownDoctorExpertises = useDoctorExpertise(ownDoctorSlug, {
    enabled: modalProps.isOpen && isLogin && Boolean(ownDoctorSlug),
  });

  const doctorCityRoute = useMemo(() => {
    const profileInformation = ownDoctorProfile.data?.information;
    const firstProfileCenter = ownDoctorProfile.data?.centers?.[0];
    const firstLocalCenter = info?.provider?.centers?.[0];
    return profileInformation?.city_en_slug || firstProfileCenter?.city_en_slug || firstLocalCenter?.city_en_slug || 'ir';
  }, [ownDoctorProfile.data, info?.provider?.centers]);
  const doctorCityId = useMemo(() => {
    const profileInformation = ownDoctorProfile.data?.information;
    const firstProfileCenter = ownDoctorProfile.data?.centers?.[0];
    const firstLocalCenter = info?.provider?.centers?.[0];
    return (
      profileInformation?.city_id ||
      firstProfileCenter?.city_id ||
      firstProfileCenter?.city?.id ||
      firstLocalCenter?.city_id ||
      firstLocalCenter?.city?.id ||
      undefined
    );
  }, [ownDoctorProfile.data, info?.provider?.centers]);
  const doctorExpertiseSlug = useMemo(() => {
    const firstProfileExpertise = ownDoctorExpertises.data?.[0];
    const firstCenter = info?.provider?.centers?.[0];
    return (
      firstProfileExpertise?.expertise?.slug ||
      firstProfileExpertise?.groups?.[0]?.en_slug ||
      firstCenter?.expertises?.[0]?.expertise?.slug ||
      firstCenter?.expertises?.[0]?.slug ||
      firstCenter?.expertise?.slug ||
      firstCenter?.group_expertises?.[0]?.en_slug ||
      undefined
    );
  }, [ownDoctorExpertises.data, info?.provider?.centers]);
  const doctorExpertise = useMemo(() => {
    const firstProfileExpertise = ownDoctorExpertises.data?.[0];
    const firstCenter = info?.provider?.centers?.[0];
    return (
      firstProfileExpertise?.expertise?.name ||
      firstProfileExpertise?.alias_title ||
      firstCenter?.expertises?.[0]?.expertise?.name ||
      firstCenter?.expertise?.name ||
      firstCenter?.expertise_title ||
      ''
    );
  }, [ownDoctorExpertises.data, info?.provider?.centers]);

  const selfDoctorId = useMemo(() => {
    const fromProfileInformation = ownDoctorProfile.data?.information?.id;
    if (fromProfileInformation !== undefined && fromProfileInformation !== null && fromProfileInformation !== '') {
      return String(fromProfileInformation);
    }
    return undefined;
  }, [ownDoctorProfile.data]);

  const excludeSelfDoctors = (items: InviteDoctorItem[]) => {
    return items.filter(item => {
      const bySlug = Boolean(ownDoctorSlug && item.slug === ownDoctorSlug);
      const byId = Boolean(selfDoctorId && item.doctorId && item.doctorId === selfDoctorId);
      return !bySlug && !byId;
    });
  };

  const sameCityExpertiseSearch = useQuery(
    ['inviteSameCityExpertisePaged', doctorCityRoute, doctorExpertise, doctorCityId],
    () =>
      fetchPagedSearchResults({
        route: doctorCityRoute,
        query: {
          text: doctorExpertise || 'پزشک',
          sortBy: 'clinic_doctor_price',
          ...(doctorCityId && { city_id: doctorCityId }),
        },
      }),
    {
      enabled: modalProps.isOpen && isLogin,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const sameExpertiseIranSearch = useQuery(
    ['inviteSameExpertiseIranPaged', doctorExpertise],
    () =>
      fetchPagedSearchResults({
        route: 'ir',
        query: {
          text: doctorExpertise || 'پزشک',
          sortBy: 'clinic_doctor_price',
        },
      }),
    {
      enabled: modalProps.isOpen && isLogin,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const sameCityExpertiseDefaultSearch = useQuery(
    ['inviteSameCityExpertiseDefaultPaged', doctorCityRoute, doctorExpertise, doctorCityId],
    () =>
      fetchPagedSearchResults({
        route: doctorCityRoute,
        query: {
          text: doctorExpertise || 'پزشک',
          ...(doctorCityId && { city_id: doctorCityId }),
        },
      }),
    {
      enabled: modalProps.isOpen && isLogin,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const sameExpertiseIranDefaultSearch = useQuery(
    ['inviteSameExpertiseIranDefaultPaged', doctorExpertise],
    () =>
      fetchPagedSearchResults({
        route: 'ir',
        query: {
          text: doctorExpertise || 'پزشک',
        },
      }),
    {
      enabled: modalProps.isOpen && isLogin,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const searchDoctorsQuery = useQuery(
    ['inviteSearchDoctorsPaged', doctorCityRoute, debouncedSearchTerm],
    async () => {
      const pages: any[] = [];
      let eligibleDoctorsCount = 0;

      for (let page = 1; page <= SEARCH_MAX_PAGES; page += 1) {
        const response = await search({
          route: doctorCityRoute,
          query: {
            text: debouncedSearchTerm,
            page,
            limit: SEARCH_PAGE_LIMIT,
          },
        });

        pages.push(response);

        const pageDoctors = extractSearchItems(response).map((item: any, index: number) =>
          mapSearchItemToInviteDoctor(item, `search-page-${page}`, index),
        );
        const pageEligibleCount = pageDoctors.filter(item => {
          const hasResolvableUserId = Boolean(item.doctorUserId || item.slug);
          const isAlreadyInvited = isInvitedDoctor(item, invitedIds);
          return hasResolvableUserId && !isAlreadyInvited;
        }).length;
        eligibleDoctorsCount += pageEligibleCount;

        const pageItems = extractSearchItems(response);
        if (pageItems.length < SEARCH_PAGE_LIMIT) {
          break;
        }
        if (eligibleDoctorsCount >= SEARCH_PAGE_LIMIT) {
          break;
        }
      }

      return pages;
    },
    {
      enabled: modalProps.isOpen && debouncedSearchTerm.length >= 2,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  useEffect(() => {
    const handleEventFunction = (messageEvent: MessageEvent) => {
      if (messageEvent.data?.hamdast?.event !== 'HAMDAST_INVITE') return;

      if (!isLogin) {
        handleOpenLoginModal({
          state: true,
          postLogin: () => handleOpen(),
        });
        return;
      }

      handleOpen();
    };

    window.addEventListener('message', handleEventFunction);

    return () => {
      window.removeEventListener('message', handleEventFunction);
    };
  }, [isLogin]);

  useEffect(() => {
    if (!modalProps.isOpen || !isLogin) return;
    bookmarks.mutate();
    previousBooks.refetch();
  }, [modalProps.isOpen, isLogin]);

  useEffect(() => {
    const invitationItems = previousInvitationsQuery.data?.items ?? [];
    if (!Array.isArray(invitationItems) || invitationItems.length === 0) return;

    const invitedUserIds = invitationItems
      .map(item => item?.invited_user)
      .filter((value): value is string | number => value !== undefined && value !== null && value !== '')
      .map(value => String(value));

    if (invitedUserIds.length === 0) return;
    setInvitedIds(Array.from(new Set(invitedUserIds)));
  }, [previousInvitationsQuery.data]);

  const bookmarkDoctors = useMemo(() => {
    const items = bookmarks.data?.data?.result ?? [];
    return items
      .map((item: any) => {
        const slug = item?.slug || extractSlugFromUrl(item?.doctor_url);
        return {
          uniqueKey: `bookmark-${item?.id || slug}`,
          doctorId: resolveDoctorId(item),
          doctorUserId: resolveDoctorUserId(item),
          slug,
          name: resolveDoctorFullName(item),
          expertise: getDisplayDoctorExpertise({
            aliasTitle: item?.expertises?.[0]?.alias_title ?? '',
            degree: item?.expertises?.[0]?.degree?.name ?? '',
            expertise: item?.expertises?.[0]?.expertise?.name ?? '',
          }),
          avatar: resolveAvatarPath(item),
          profileUrl: item?.doctor_url,
        } as InviteDoctorItem;
      })
      .filter((item: InviteDoctorItem) => Boolean(item.name && (item.doctorId || item.slug || isDoctorProfileUrl(item.profileUrl))));
  }, [bookmarks.data]);

  const visitsDoctors = useMemo(() => {
    const items = extractBooksItems(previousBooks.data);
    return items
      .map((item: any) => {
        const doctorInfo = item?.doctor_info;
        const slug = doctorInfo?.slug || extractSlugFromUrl(doctorInfo?.doctor_url);
        return {
          uniqueKey: `visit-${doctorInfo?.id || slug || item?.book_id}`,
          doctorId: resolveDoctorId(doctorInfo),
          doctorUserId: resolveDoctorUserId(doctorInfo),
          slug,
          name: resolveDoctorFullName(doctorInfo),
          expertise:
            doctorInfo?.display_expertise ??
            getDisplayDoctorExpertise({
              aliasTitle: doctorInfo?.expertises?.[0]?.alias_title ?? '',
              degree: doctorInfo?.expertises?.[0]?.degree?.name ?? '',
              expertise: doctorInfo?.expertises?.[0]?.expertise?.name ?? '',
            }),
          avatar: resolveAvatarPath(doctorInfo),
          profileUrl: slug ? `/dr/${slug}` : undefined,
        } as InviteDoctorItem;
      })
      .filter((item: InviteDoctorItem) => Boolean(item.name && (item.doctorId || item.slug || isDoctorProfileUrl(item.profileUrl))));
  }, [previousBooks.data]);

  const searchToDoctors = (searchResponse: any, groupPrefix: string) => {
    return extractSearchItems(searchResponse)
      .map((item: any, index: number) => mapSearchItemToInviteDoctor(item, groupPrefix, index))
      .filter((item: InviteDoctorItem) => Boolean(item.name && (item.doctorId || item.slug || isDoctorProfileUrl(item.profileUrl))));
  };

  const sameCityExpertiseDoctors = useMemo(() => {
    const normalized = uniqDoctors(
      (sameCityExpertiseSearch.data ?? []).flatMap((pageData: any, index: number) =>
        searchToDoctors(pageData, `same-city-expertise-${index + 1}`),
      ),
    );
    if (!doctorExpertise) return normalized;
    const normalizedExpertise = doctorExpertise.toLowerCase();
    const filteredByExpertise = normalized.filter(item => item.expertise?.toLowerCase().includes(normalizedExpertise));
    return filteredByExpertise.length > 0 ? filteredByExpertise : normalized;
  }, [sameCityExpertiseSearch.data, doctorExpertise]);

  const sameExpertiseIranDoctors = useMemo(() => {
    const normalized = uniqDoctors(
      (sameExpertiseIranSearch.data ?? []).flatMap((pageData: any, index: number) =>
        searchToDoctors(pageData, `expertise-iran-${index + 1}`),
      ),
    );
    if (!doctorExpertise) return normalized;
    const normalizedExpertise = doctorExpertise.toLowerCase();
    const filteredByExpertise = normalized.filter(item => item.expertise?.toLowerCase().includes(normalizedExpertise));
    return filteredByExpertise.length > 0 ? filteredByExpertise : normalized;
  }, [sameExpertiseIranSearch.data, doctorExpertise]);

  const sameCityExpertiseDefaultDoctors = useMemo(() => {
    const normalized = uniqDoctors(
      (sameCityExpertiseDefaultSearch.data ?? []).flatMap((pageData: any, index: number) =>
        searchToDoctors(pageData, `same-city-expertise-default-${index + 1}`),
      ),
    );
    if (!doctorExpertise) return normalized;
    const normalizedExpertise = doctorExpertise.toLowerCase();
    const filteredByExpertise = normalized.filter(item => item.expertise?.toLowerCase().includes(normalizedExpertise));
    return filteredByExpertise.length > 0 ? filteredByExpertise : normalized;
  }, [sameCityExpertiseDefaultSearch.data, doctorExpertise]);

  const sameExpertiseIranDefaultDoctors = useMemo(() => {
    const normalized = uniqDoctors(
      (sameExpertiseIranDefaultSearch.data ?? []).flatMap((pageData: any, index: number) =>
        searchToDoctors(pageData, `expertise-iran-default-${index + 1}`),
      ),
    );
    if (!doctorExpertise) return normalized;
    const normalizedExpertise = doctorExpertise.toLowerCase();
    const filteredByExpertise = normalized.filter(item => item.expertise?.toLowerCase().includes(normalizedExpertise));
    return filteredByExpertise.length > 0 ? filteredByExpertise : normalized;
  }, [sameExpertiseIranDefaultSearch.data, doctorExpertise]);

  const searchDoctors = useMemo(() => {
    return uniqDoctors(
      (searchDoctorsQuery.data ?? []).flatMap((pageData, index) => searchToDoctors(pageData, `search-page-${index + 1}`)),
    );
  }, [searchDoctorsQuery.data]);

  const visitedProfileDoctorIds = useMemo(() => {
    if (!modalProps.isOpen || !isLogin) return [];
    return getTopVisitedDoctorIds(5);
  }, [modalProps.isOpen, isLogin]);

  const visitedProfileDoctorQueries = useQueries({
    queries: visitedProfileDoctorIds.map(doctorId => ({
      queryKey: ['inviteVisitedDoctorById', doctorId],
      queryFn: () => getDoctorByDoctorId(doctorId),
      enabled: modalProps.isOpen && isLogin,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })),
  });

  const visitedProfileDoctors = useMemo(() => {
    return visitedProfileDoctorIds
      .map((doctorId, index) => {
        const resolved = visitedProfileDoctorQueries[index]?.data;
        if (!resolved) return null;
        const mappedItem = mapSearchItemToInviteDoctor(resolved, 'visited-profile', index);
        return {
          ...mappedItem,
          doctorId: mappedItem.doctorId || doctorId,
        } as InviteDoctorItem;
      })
      .filter((item): item is InviteDoctorItem => Boolean(item))
      .filter((item: InviteDoctorItem) => Boolean(item.name && (item.doctorId || item.slug || isDoctorProfileUrl(item.profileUrl))));
  }, [visitedProfileDoctorIds, visitedProfileDoctorQueries]);

  const unresolvedDoctorSlugs = useMemo(() => {
    const slugs = new Set<string>();

    uniqDoctors([
      ...bookmarkDoctors,
      ...visitsDoctors,
      ...visitedProfileDoctors,
      ...sameCityExpertiseDoctors,
      ...sameExpertiseIranDoctors,
      ...sameCityExpertiseDefaultDoctors,
      ...sameExpertiseIranDefaultDoctors,
      ...searchDoctors,
    ]).forEach(item => {
      if (!item.doctorUserId && item.slug) {
        slugs.add(item.slug);
      }
    });

    return Array.from(slugs);
  }, [
    bookmarkDoctors,
    visitsDoctors,
    visitedProfileDoctors,
    sameCityExpertiseDoctors,
    sameExpertiseIranDoctors,
    sameCityExpertiseDefaultDoctors,
    sameExpertiseIranDefaultDoctors,
    searchDoctors,
  ]);

  const slugUserIdQueries = useQueries({
    queries: unresolvedDoctorSlugs.map(slug => ({
      queryKey: ['inviteDoctorSlugUserId', slug],
      queryFn: () => validateDoctorSlug(slug),
      enabled: modalProps.isOpen,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })),
  });

  const resolvedUserIdBySlug = useMemo(() => {
    const map = new Map<string, string>();

    unresolvedDoctorSlugs.forEach((slug, index) => {
      const response = slugUserIdQueries[index]?.data;
      if (!response || 'error' in response || 'redirect' in response || response.user_id == null) return;
      map.set(slug, String(response.user_id));
    });

    return map;
  }, [slugUserIdQueries, unresolvedDoctorSlugs]);

  const bookmarkDoctorsResolved = useMemo(
    () => attachResolvedUserId(bookmarkDoctors, resolvedUserIdBySlug),
    [bookmarkDoctors, resolvedUserIdBySlug],
  );
  const visitsDoctorsResolved = useMemo(
    () => attachResolvedUserId(visitsDoctors, resolvedUserIdBySlug),
    [visitsDoctors, resolvedUserIdBySlug],
  );
  const visitedProfileDoctorsResolved = useMemo(
    () => attachResolvedUserId(visitedProfileDoctors, resolvedUserIdBySlug),
    [visitedProfileDoctors, resolvedUserIdBySlug],
  );
  const sameCityExpertiseDoctorsResolved = useMemo(
    () => attachResolvedUserId(sameCityExpertiseDoctors, resolvedUserIdBySlug),
    [sameCityExpertiseDoctors, resolvedUserIdBySlug],
  );
  const sameExpertiseIranDoctorsResolved = useMemo(
    () => attachResolvedUserId(sameExpertiseIranDoctors, resolvedUserIdBySlug),
    [sameExpertiseIranDoctors, resolvedUserIdBySlug],
  );
  const sameCityExpertiseDefaultDoctorsResolved = useMemo(
    () => attachResolvedUserId(sameCityExpertiseDefaultDoctors, resolvedUserIdBySlug),
    [sameCityExpertiseDefaultDoctors, resolvedUserIdBySlug],
  );
  const sameExpertiseIranDefaultDoctorsResolved = useMemo(
    () => attachResolvedUserId(sameExpertiseIranDefaultDoctors, resolvedUserIdBySlug),
    [sameExpertiseIranDefaultDoctors, resolvedUserIdBySlug],
  );
  const searchDoctorsResolved = useMemo(
    () => attachResolvedUserId(searchDoctors, resolvedUserIdBySlug),
    [searchDoctors, resolvedUserIdBySlug],
  );

  const recommendedCandidates = useMemo(() => {
    const combinedSortedByPrice = uniqDoctors([
      ...excludeSelfDoctors(sameCityExpertiseDoctorsResolved),
      ...excludeSelfDoctors(sameExpertiseIranDoctorsResolved),
    ]);

    return combinedSortedByPrice
      .filter(item => (item.reviewCount ?? Number.POSITIVE_INFINITY) < 10)
      .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
  }, [sameCityExpertiseDoctorsResolved, sameExpertiseIranDoctorsResolved, ownDoctorSlug, selfDoctorId]);

  const recommendedForWidget = useMemo(
    () => recommendedCandidates.filter(item => !isInvitedDoctor(item, invitedIds)).slice(0, 6),
    [recommendedCandidates, invitedIds],
  );

  const friendsAndColleaguesOrdered = useMemo(() => {
    const selected: InviteDoctorItem[] = [];
    const selectedKeys = new Set<string>(
      recommendedForWidget.map(item => getDoctorUniqueKey(item)),
    );

    const appendFromSource = (source: InviteDoctorItem[], limit: number) => {
      let count = 0;
      for (const item of excludeSelfDoctors(source)) {
        if (count >= limit) break;
        if (isInvitedDoctor(item, invitedIds)) continue;
        const key = getDoctorUniqueKey(item);
        if (selectedKeys.has(key)) continue;
        selected.push(item);
        selectedKeys.add(key);
        count += 1;
      }
    };

    // ترتیب الزامی:
    // 1) 5 بوکمارک اخیر
    // 2) 5 بازدید پرتکرار پروفایل
    // 3) 5 ویزیت‌های قبلی
    // 4) 5 هم‌شهری هم‌تخصص (sort پیش‌فرض)
    // 5) 5 هم‌تخصص کل ایران (sort پیش‌فرض)
    appendFromSource(bookmarkDoctorsResolved, 5);
    appendFromSource(visitedProfileDoctorsResolved, 5);
    appendFromSource(visitsDoctorsResolved, 5);
    appendFromSource(sameCityExpertiseDefaultDoctorsResolved, 5);
    appendFromSource(sameExpertiseIranDefaultDoctorsResolved, 5);

    return selected;
  }, [
    recommendedForWidget,
    bookmarkDoctorsResolved,
    visitedProfileDoctorsResolved,
    visitsDoctorsResolved,
    sameCityExpertiseDefaultDoctorsResolved,
    sameExpertiseIranDefaultDoctorsResolved,
    invitedIds,
    ownDoctorSlug,
    selfDoctorId,
  ]);

  const toggleDoctorSelection = (doctor: InviteDoctorItem) => {
    if (doctor.doctorUserId && invitedIds.includes(doctor.doctorUserId)) return;

    setSelectedDoctorIds(prev => {
      const selectionKey = doctor.doctorUserId || doctor.uniqueKey;
      if (prev.includes(selectionKey)) {
        return prev.filter(item => item !== selectionKey);
      }
      return [...prev, selectionKey];
    });
  };

  const handleInviteSelectedDoctors = async (list: InviteDoctorItem[]) => {
    if (selectedDoctorIds.length === 0 || isSubmittingInvite) return;

    const selectedDoctors = list.filter(item => selectedDoctorIds.includes(item.doctorUserId || item.uniqueKey));
    const doctorsWithUserId = selectedDoctors.filter(item => item.doctorUserId);
    const doctorsWithoutUserIdCount = selectedDoctors.length - doctorsWithUserId.length;

    if (doctorsWithUserId.length === 0) {
      toast.error('شناسه کاربر پزشک برای ارسال دعوت پیدا نشد.');
      return;
    }

    setIsSubmittingInvite(true);
    const results = await Promise.allSettled(
      doctorsWithUserId.map(item =>
        inviteDoctor({
          appKey: app_key,
          invitedUserId: item.doctorUserId!,
        }),
      ),
    );

    const successfulUserIds: string[] = [];
    let failedCount = 0;

    results.forEach((result, index) => {
      const userId = doctorsWithUserId[index]?.doctorUserId;
      if (!userId) return;
      if (result.status === 'fulfilled') {
        successfulUserIds.push(userId);
      } else {
        failedCount += 1;
      }
    });

    if (successfulUserIds.length > 0) {
      setInvitedIds(prev => Array.from(new Set([...prev, ...successfulUserIds])));
      toast.success(`${successfulUserIds.length} دعوت با موفقیت ارسال شد.`);
    }
    if (failedCount > 0) {
      toast.error(`${failedCount} دعوت ارسال نشد. دوباره تلاش کنید.`);
    }
    if (doctorsWithoutUserIdCount > 0) {
      toast.error(`${doctorsWithoutUserIdCount} پزشک شناسه کاربر معتبر برای دعوت نداشت.`);
    }

    setSelectedDoctorIds([]);
    setIsSubmittingInvite(false);
  };

  const isResolvingUserIds =
    modalProps.isOpen &&
    unresolvedDoctorSlugs.length > 0 &&
    slugUserIdQueries.some(query => query.isLoading);

  const isResolvingVisitedDoctors =
    modalProps.isOpen &&
    visitedProfileDoctorIds.length > 0 &&
    visitedProfileDoctorQueries.some(query => query.isLoading);

  const hasAnySuggestionPayload = Boolean(
    bookmarks.data ||
      previousBooks.data ||
      sameCityExpertiseSearch.data ||
      sameExpertiseIranSearch.data ||
      sameCityExpertiseDefaultSearch.data ||
      sameExpertiseIranDefaultSearch.data ||
      previousInvitationsQuery.data,
  );

  const isLoadingSuggestions =
    modalProps.isOpen &&
    !hasAnySuggestionPayload &&
    ((bookmarks.isLoading) ||
      (previousBooks.isLoading) ||
      (Boolean(ownDoctorSlug) && ownDoctorProfile.isLoading) ||
      (Boolean(ownDoctorSlug) && ownDoctorExpertises.isLoading) ||
      (sameCityExpertiseSearch.isLoading) ||
      (sameExpertiseIranSearch.isLoading) ||
      (sameCityExpertiseDefaultSearch.isLoading) ||
      (sameExpertiseIranDefaultSearch.isLoading) ||
      (debouncedSearchTerm.length >= 2 && searchDoctorsQuery.isLoading) ||
      previousInvitationsQuery.isLoading ||
      isResolvingVisitedDoctors ||
      isResolvingUserIds);

  const recommendedForWidgetVisible = useMemo(
    () => recommendedForWidget.filter(item => !isInvitedDoctor(item, invitedIds)),
    [recommendedForWidget, invitedIds],
  );

  const friendsAndColleaguesVisible = useMemo(
    () => friendsAndColleaguesOrdered.filter(item => !isInvitedDoctor(item, invitedIds)),
    [friendsAndColleaguesOrdered, invitedIds],
  );

  const searchDoctorsVisible = useMemo(
    () => excludeSelfDoctors(searchDoctorsResolved).filter(item => !isInvitedDoctor(item, invitedIds)),
    [searchDoctorsResolved, invitedIds, ownDoctorSlug, selfDoctorId],
  );

  const invitedDoctorsForSection = useMemo(() => {
    const source =
      debouncedSearchTerm.length >= 2
        ? uniqDoctors(excludeSelfDoctors(searchDoctorsResolved))
        : uniqDoctors([
            ...recommendedCandidates,
            ...bookmarkDoctorsResolved,
            ...visitedProfileDoctorsResolved,
            ...visitsDoctorsResolved,
            ...sameCityExpertiseDefaultDoctorsResolved,
            ...sameExpertiseIranDefaultDoctorsResolved,
          ]);

    return source.filter(item => isInvitedDoctor(item, invitedIds));
  }, [
    debouncedSearchTerm,
    searchDoctorsResolved,
    recommendedCandidates,
    bookmarkDoctorsResolved,
    visitedProfileDoctorsResolved,
    visitsDoctorsResolved,
    sameCityExpertiseDefaultDoctorsResolved,
    sameExpertiseIranDefaultDoctorsResolved,
    invitedIds,
    ownDoctorSlug,
    selfDoctorId,
  ]);

  const doctorsForRender = useMemo(() => {
    if (debouncedSearchTerm.length >= 2) return searchDoctorsVisible;
    return uniqDoctors([...recommendedForWidgetVisible, ...friendsAndColleaguesVisible]);
  }, [debouncedSearchTerm, searchDoctorsVisible, recommendedForWidgetVisible, friendsAndColleaguesVisible, ownDoctorSlug, selfDoctorId]);

  return (
    <Modal
      {...modalProps}
      noHeader
      noLine
      className="md:!w-[34rem] md:!rounded-2xl"
      bodyClassName="!px-3 !pt-3 !pb-3 flex flex-col gap-3 bg-white"
      onClose={() => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
        setSelectedDoctorIds([]);
        handleClose();
      }}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col">
          <Text fontWeight="bold" className="text-slate-800">
            دعوت پزشکان
          </Text>
          <Text fontSize="xs" className="text-slate-500">
            همکاران خود را برای استفاده از ابزارک دعوت کنید
          </Text>
        </div>
        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            setDebouncedSearchTerm('');
            setSelectedDoctorIds([]);
            handleClose();
          }}
          className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500"
          aria-label="بستن"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex items-center gap-2">
        <SearchIcon width={16} height={16} className="text-slate-400" />
        <input
          className="w-full bg-transparent outline-none text-sm placeholder:text-slate-400"
          value={searchTerm}
          placeholder="جستجوی پزشک..."
          onChange={event => setSearchTerm(event.target.value)}
        />
      </div>

      <Transition match={isLoadingSuggestions} animation="fade" duration={140}>
        <div className="py-6 flex justify-center">
          <Loading />
        </div>
      </Transition>

      <Transition
        match={!isLoadingSuggestions && doctorsForRender.length === 0 && invitedDoctorsForSection.length === 0}
        animation="bottom"
        duration={150}
      >
        <Text className="text-slate-400 text-sm py-5 text-center">
          پزشکی برای دعوت پیدا نشد.
        </Text>
      </Transition>

      <Transition
        match={!isLoadingSuggestions && (doctorsForRender.length > 0 || invitedDoctorsForSection.length > 0)}
        animation="bottom"
        duration={170}
      >
        <div className="max-h-[56vh] overflow-y-auto pb-1 space-y-3">
          <Transition match={debouncedSearchTerm.length < 2 && recommendedForWidgetVisible.length > 0} animation="bottom" duration={150}>
            <div className="space-y-2 py-1">
              <Text fontSize="xs" className="text-slate-600 font-semibold px-1 tracking-tight">
                پیشنهاد ما برای استفاده ابزارک ({recommendedForWidgetVisible.length})
              </Text>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {recommendedForWidgetVisible.map(item => (
                  <DoctorRow
                    key={item.uniqueKey}
                    item={item}
                    isSelected={Boolean(selectedDoctorIds.includes(item.doctorUserId || item.uniqueKey))}
                    onToggleSelect={toggleDoctorSelection}
                    isSubmitting={isSubmittingInvite}
                    isInvited={Boolean(item.doctorUserId && invitedIds.includes(item.doctorUserId))}
                  />
                ))}
              </div>
            </div>
          </Transition>

          <Transition match={debouncedSearchTerm.length < 2 && friendsAndColleaguesVisible.length > 0} animation="bottom" duration={160}>
            <div className="space-y-2 py-1">
              <Text fontSize="xs" className="text-slate-600 font-semibold px-1 tracking-tight">
                دوستان/همکاران شما ({friendsAndColleaguesVisible.length})
              </Text>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {friendsAndColleaguesVisible.map(item => (
                  <DoctorRow
                    key={item.uniqueKey}
                    item={item}
                    isSelected={Boolean(selectedDoctorIds.includes(item.doctorUserId || item.uniqueKey))}
                    onToggleSelect={toggleDoctorSelection}
                    isSubmitting={isSubmittingInvite}
                    isInvited={Boolean(item.doctorUserId && invitedIds.includes(item.doctorUserId))}
                  />
                ))}
              </div>
            </div>
          </Transition>

          <Transition match={debouncedSearchTerm.length >= 2} animation="bottom" duration={150}>
            <div className="flex flex-col gap-2">
              {doctorsForRender.map(item => (
                <DoctorRow
                  key={item.uniqueKey}
                  item={item}
                  layout="row"
                  isSelected={Boolean(selectedDoctorIds.includes(item.doctorUserId || item.uniqueKey))}
                  onToggleSelect={toggleDoctorSelection}
                  isSubmitting={isSubmittingInvite}
                  isInvited={Boolean(item.doctorUserId && invitedIds.includes(item.doctorUserId))}
                />
              ))}
            </div>
          </Transition>

          <Transition match={invitedDoctorsForSection.length > 0} animation="bottom" duration={170}>
            <div className="space-y-2 py-1">
              <Text fontSize="xs" className="text-slate-600 font-semibold px-1 tracking-tight">
                دعوت‌شده‌ها ({invitedDoctorsForSection.length})
              </Text>
              {debouncedSearchTerm.length >= 2 ? (
                <div className="flex flex-col gap-2">
                  {invitedDoctorsForSection.map(item => (
                    <DoctorRow
                      key={item.uniqueKey}
                      item={item}
                      layout="row"
                      isSelected={Boolean(selectedDoctorIds.includes(item.doctorUserId || item.uniqueKey))}
                      onToggleSelect={toggleDoctorSelection}
                      isSubmitting={isSubmittingInvite}
                      isInvited={Boolean(item.doctorUserId && invitedIds.includes(item.doctorUserId))}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {invitedDoctorsForSection.map(item => (
                    <DoctorRow
                      key={item.uniqueKey}
                      item={item}
                      isSelected={Boolean(selectedDoctorIds.includes(item.doctorUserId || item.uniqueKey))}
                      onToggleSelect={toggleDoctorSelection}
                      isSubmitting={isSubmittingInvite}
                      isInvited={Boolean(item.doctorUserId && invitedIds.includes(item.doctorUserId))}
                    />
                  ))}
                </div>
              )}
            </div>
          </Transition>
        </div>
      </Transition>

      <div className="pt-2 sticky bottom-0 bg-white border-t border-slate-100">
        <Button
          className="w-full rounded-xl !h-11 font-semibold"
          disabled={selectedDoctorIds.length === 0}
          loading={isSubmittingInvite}
          onClick={() => handleInviteSelectedDoctors(doctorsForRender)}
        >
          {selectedDoctorIds.length > 0 ? `ارسال دعوت (${selectedDoctorIds.length})` : 'ارسال دعوت'}
        </Button>
      </div>
    </Modal>
  );
};
