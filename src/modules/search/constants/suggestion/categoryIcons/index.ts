import { CategoryIcon } from './icons/category';
import { ClockIcon } from './icons/clock';
import { HistoryIcon } from './icons/history';
import { HospitalIcon } from './icons/hospital';
import { IllnessIcon } from './icons/illness';
import { ListIcon } from './icons/list';
import { MostCommonIcon } from './icons/mostCommon';
import { SearchIcon } from './icons/search';
import { ShieldIcon } from './icons/shield';
import { SmileIcon } from './icons/smile';
import { StarIcon } from './icons/star';
import { TopIcon } from './icons/top';

export const categoryIcons = {
  'hospital-icon': HospitalIcon,
  'top-icon': TopIcon,
  'list-icon': ListIcon,
  'category-icon': CategoryIcon,
  'history-icon': HistoryIcon,
  'search-icon': SearchIcon,
  'most_common': MostCommonIcon,
  'illness': IllnessIcon,
  'star-icon': StarIcon as any,
  'smile-icon': SmileIcon,
  'clock-icon': ClockIcon,
  'shield-icon': ShieldIcon,
};
