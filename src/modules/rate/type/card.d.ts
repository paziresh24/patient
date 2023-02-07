export type Tags = {
  id: number;
  name: string;
  isBold?: Boolean;
};

export type Options = {
  id: number;
  name: string;
  action: () => void;
  type: 'menu' | 'controller' | 'button';
  icon?: React.ReactNode;
};

export type Card = {
  id: string | number | any;
  avatar?: any;
  name: string;
  tag?: Tags[];
  options?: Options[];
  details?: string[];
  symptoms?: {
    text: string;
    items: string[];
  };
  recommend?: {
    text: string;
    isRecommend: Boolean;
    icon?: React.ReactNode;
  };
  description: string;
  className?: string;
};

export interface CardProps extends Card {}
