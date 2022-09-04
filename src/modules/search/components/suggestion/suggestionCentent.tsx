import useResponsive from '@/common/hooks/useResponsive';
import clsx from 'clsx';
import { createElement, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import CategoryBar from './suggestionAtoms/categoryBar';
import CardSection from './suggestionSection/card';
import SearchSection from './suggestionSection/search';
import SliderSection from './suggestionSection/slider';
import TextSection from './suggestionSection/text';
import TreeSection from './suggestionSection/tree';

interface SuggestionCententProps extends HTMLAttributes<HTMLDivElement> {
  items: Section[];
  searchInput?: ReactElement;
}

type ComponentSection = 'text' | 'slider' | 'tree' | 'card' | 'search';

export interface Section {
  caption?: string;
  additional_info?: string;
  type: string;
  icon: 'hospital-icon' | 'top-icon' | 'list-icon' | 'category-icon' | 'history-icon' | 'search-icon';
  component: ComponentSection;
  items: Item[];
}

export type Item = {
  id?: number;
  title?: string;
  name?: string;
  url?: string | null;
  formatted_title?: string | null;
  type?: string;
  use_suggestion?: boolean;
  position?: number;
  section_position?: number;
  image?: string | null;
  sub_title?: string;
  cities?: string[];
  is_online?: boolean;
  activity?: string[];
  count?: number;
  no_icon?: boolean;
  sub_items?: Item[];
};

export const SuggestionCentent = (props: SuggestionCententProps) => {
  const { className, items, searchInput } = props;
  const { isMobile } = useResponsive();

  const wrapper = (children: ReactNode, container: Element) => {
    return isMobile ? createPortal(children, container) : children;
  };

  const Sections = {
    text: TextSection,
    slider: SliderSection,
    tree: TreeSection,
    card: CardSection,
  };

  const Component = ({ type, items }: { type: Exclude<ComponentSection, 'search'>; items: Item[] }) => {
    return createElement(Sections[type], {
      items,
    });
  };

  return wrapper(
    <div
      className={clsx(
        'fixed right-0 overflow-hidden top-0 h-full z-infinity md:absolute md:h-96 md:top-16 w-full flex flex-col bg-white rounded-bl-xl rounded-br-xl',
        className,
      )}
    >
      {searchInput && <div className="p-2 bg-white shadow-sm z-20 stiky top-0">{searchInput}</div>}
      <div className="flex flex-col overflow-auto">
        {items?.map(({ items, component, ...section }, index) => (
          <div key={index}>
            {component !== 'search' && (
              <>
                <CategoryBar {...section} />
                <Component type={component} items={items} />
              </>
            )}
            {component === 'search' && (
              <SearchSection formatted_title={items[0]?.formatted_title ?? ''} icon={section.icon} url={items[0]?.url ?? ''} />
            )}
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
};

export default SuggestionCentent;
