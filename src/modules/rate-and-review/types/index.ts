export type RaviSort = 'default_order' | 'created_at';
/** `negative` returns reviews with avg rating between 3.5 and 4 (per feedbacks API). */
export type RaviFeedbackFilter = 'default' | 'newest' | 'negative';
export type RaviFilter = 'all' | 'my_feedbacks' | 'not_recommended' | 'center_id';

export interface RaviRatingBreakdownItem {
  label: string;
  value: number;
}

export interface RaviReview {
  id: string;
  userId?: string;
  userName?: string;
  description: string;
  dateLabel: string;
  centerName?: string;
  visited: boolean;
  rate: number | null;
  likeCount?: number;
}

export interface RaviFeedbackReply {
  id: string;
  description: string;
  userId?: string;
}

export interface RaviReviewQuery {
  offset: number;
  limit: number;
  filter: RaviFeedbackFilter;
  userId?: string;
  centerId?: string;
}

export interface RaviReviewPageInfo {
  isLastPage?: boolean;
  page?: number;
  total?: number;
}

export interface RaviReviewPage {
  list: Array<Record<string, unknown> & { relativeCreatedTime?: string }>;
  hasMore: boolean;
  pageInfo?: RaviReviewPageInfo;
}

export interface RaviRateSummary {
  count: number;
  hideRates?: boolean;
  items: RaviRatingBreakdownItem[];
}

export interface RaviReviewFilterValue {
  type: RaviFilter;
  value?: string;
}

export interface RaviCenter {
  id: string;
  name: string;
}
