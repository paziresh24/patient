import classNames from '@/common/utils/classNames';
import scrollIntoViewWithOffset from '@/common/utils/scrollIntoViewWithOffset';
import { ReactNode } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface CenterMobileNavProps {
  items: NavItem[];
  className?: string;
}

export const CenterMobileNav = ({ items, className }: CenterMobileNavProps) => (
  <nav
    className={classNames(
      'sticky top-0 z-50 border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur-md md:hidden',
      className,
    )}
  >
    <ul className="flex gap-2 overflow-x-auto px-3 py-2.5">
      {items.map(item => (
        <li key={item.id} className="shrink-0">
          <a
            href={`#${item.id}`}
            onClick={e => {
              e.preventDefault();
              scrollIntoViewWithOffset(`#${item.id}`, 90);
            }}
            title={item.label}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-px hover:border-primary/35 hover:bg-primary/5 hover:text-primary hover:shadow"
          >
            <span className="text-primary/80">{item.icon}</span>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

export default CenterMobileNav;
