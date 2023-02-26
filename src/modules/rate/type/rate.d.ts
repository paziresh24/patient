import { FeedbackParams } from '../components/feedbackCard/feedbackCard';

export type information = {
  id: number;
  title: string;
  satisfaction: number;
  avg_star: number;
};

type FilterInputParams = {
  id: number;
  options: { label: string; value: string }[];
  value?: { label: string; value: string };
  onChange: (value: any) => void;
};

type SearchInputParams = {
  placeholder?: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  value?: string;
  className?: string;
};

export type DetailsProps = {
  satisfaction?: number;
  title?: string;
  count?: number;
  count_text?: string;
  information: information[];
};

type Controller = {
  text: string;
  buttons: { id: number; text: string; action: () => void }[];
};

interface RateProps {
  details: DetailsProps;
  filters: FilterInputParams[];
  search: SearchInputParams;
  feedbacks: FeedbackParams[];
  controller?: Controller;
  message?: string;
  isLoading?: boolean;
}
