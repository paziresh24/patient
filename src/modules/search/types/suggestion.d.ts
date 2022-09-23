export type Item = {
  id?: number;
  title?: string;
  name?: string;
  url?: string | null;
  formatted_title?: string | null;
  type?: 'most_common' | 'illness';
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
  absolute_url?: boolean;
};

export type ComponentSection = 'text' | 'slider' | 'tree' | 'card' | 'search';

export interface Section {
  caption?: string;
  additional_info?: string;
  type: string;
  icon: 'hospital-icon' | 'top-icon' | 'list-icon' | 'category-icon' | 'history-icon' | 'search-icon';
  component: ComponentSection;
  items: Item[];
}
