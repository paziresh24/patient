import classNames from '@/common/utils/classNames';
import {
  Bell,
  Briefcase,
  Calendar,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  Clock,
  createLucideIcon,
  Eye,
  EyeOff,
  MessageCircle,
  RotateCcw,
  Settings,
  ShoppingBag,
  Star,
  Wallet,
} from 'lucide-react';
import { DsIcon, type DsIconProps } from '../designSystem/DsIcon';

type DoctorHomeIconProps = Omit<DsIconProps, 'icon'>;

const ToolCase = createLucideIcon('ToolCase', [
  ['path', { d: 'M10 15h4' }],
  [
    'path',
    {
      d: 'm14.817 10.995-.971-1.45 1.034-1.232a2 2 0 0 0-2.025-3.238l-1.82.364L9.91 3.885a2 2 0 0 0-3.625.748L6.141 6.55l-1.725.426a2 2 0 0 0-.19 3.756l.657.27',
    },
  ],
  [
    'path',
    {
      d: 'm18.822 10.995 2.26-5.38a1 1 0 0 0-.557-1.318L16.954 2.9a1 1 0 0 0-1.281.533l-.924 2.122',
    },
  ],
  ['path', { d: 'M4 12.006A1 1 0 0 1 4.994 11H19a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z' }],
]);

const Hospital = createLucideIcon('Hospital', [
  ['path', { d: 'M12 6v4' }],
  ['path', { d: 'M14 14h-4' }],
  ['path', { d: 'M14 18h-4' }],
  ['path', { d: 'M14 8h-4' }],
  ['path', { d: 'M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2' }],
  ['path', { d: 'M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18' }],
]);

const withInheritedColor = ({ className, ...props }: DoctorHomeIconProps, icon: DsIconProps['icon']) => (
  <DsIcon icon={icon} className={classNames('text-current', className)} {...props} />
);

export const ReviewsIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, Star);
export const WalletIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, Wallet);
export const PageViewIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, Eye);
export const EyeVisibleIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, Eye);
export const EyeHiddenIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, EyeOff);
export const ClockIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, Clock);
export const VacationIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, CalendarDays);
export const TariffIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, ShoppingBag);
export const BookingSettingsIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, Settings);
export const ClinicIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, Hospital);
export const ChatIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, MessageCircle);
export const CalendarIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, Calendar);
export const BellIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, Bell);
export const ToolsIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, Briefcase);
export const ToolboxIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, ToolCase);
export const RowChevronIcon = ({ className, ...props }: DoctorHomeIconProps) => (
  <DsIcon icon={ChevronLeft} className={classNames('text-slate-300', className)} {...props} />
);
export const ExpandChevronIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, ChevronDown);
export const TodayIcon = (props: DoctorHomeIconProps) => withInheritedColor(props, RotateCcw);
export const TimelineDoneIcon = ({ className, ...props }: DoctorHomeIconProps) => (
  <DsIcon icon={Check} size="xs" className={classNames('text-current', className)} {...props} />
);
