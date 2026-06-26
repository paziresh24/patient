import classNames from '@/common/utils/classNames';

type LegalSectionNavProps = {
  items: { id: string; title: string }[];
  ariaLabel?: string;
  className?: string;
};

export const LegalSectionNav = ({ items, ariaLabel = 'فهرست بخش‌ها', className }: LegalSectionNavProps) => (
  <nav
    aria-label={ariaLabel}
    className={classNames(
      'sticky top-0 z-10 -mx-4 border-b border-slate-200/80 bg-[#F2F3F5]/95 px-4 py-3 backdrop-blur-sm md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none',
      className,
    )}
  >
    <div className="flex gap-2 overflow-x-auto pb-0.5 no-scroll md:flex-wrap">
      {items.map(item => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:border-primary/40 hover:text-primary"
        >
          {item.title}
        </a>
      ))}
    </div>
  </nav>
);

export default LegalSectionNav;
