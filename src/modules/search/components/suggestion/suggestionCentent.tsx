import clsx from 'clsx';
import { HTMLAttributes } from 'react';
import CategoryBar from './suggestionAtoms/categoryBar';
import CardSection from './suggestionSection/card';
import SearchSection from './suggestionSection/search';
import SliderSection from './suggestionSection/slider';
import TextSection from './suggestionSection/text';
import TreeSection from './suggestionSection/tree';

interface SuggestionCententProps extends HTMLAttributes<HTMLDivElement> {
  items: Idata[];
}

export interface Idata {
  caption?: string;
  additional_info?: string;
  type: string;
  icon: 'hospital-icon' | 'top-icon' | 'list-icon' | 'category-icon' | 'history-icon' | 'search-icon';
  component: string;
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
  const { className, items } = props;
  return (
    <div
      className={clsx('absolute h-96 space-y-3 overflow-auto top-16 w-full flex flex-col bg-white rounded-bl-xl rounded-br-xl', className)}
    >
      {items?.map(({ items, component, ...section }) => (
        <div key={section.caption}>
          {component !== 'search' && (
            <>
              <CategoryBar {...section} />
              {component === 'text' && <TextSection items={items} />}
              {component === 'slider' && <SliderSection items={items} />}
              {component === 'tree' && <TreeSection items={items} />}
              {component === 'card' && <CardSection items={items} />}
            </>
          )}
          {component === 'search' && (
            <SearchSection formatted_title={items[0]?.formatted_title ?? ''} icon={section.icon} url={items[0]?.url ?? ''} />
          )}
        </div>
      ))}
    </div>
  );
};

export default SuggestionCentent;
