import { HTMLAttributes, ReactNode } from 'react';
import { animated, useTransition } from 'react-spring';

interface TranstionProps extends HTMLAttributes<HTMLDivElement> {
  match: boolean;
  children: ReactNode;
  as?: 'div' | 'li' | 'ul' | 'span';
  animation?: 'bottom' | 'left' | 'fade';
  duration?: number;
}

export const Transition = (props: TranstionProps) => {
  const { match, children, as = 'div', animation = 'fade', duration = 200, ...rest } = props;
  const animationConfig = {
    bottom: {
      leave: { opacity: 0, y: 10 },
      enter: { opacity: 1, y: 0 },
      from: { opacity: 0, y: 10 },
    },
    left: {
      leave: { opacity: 0, x: 10 },
      enter: { opacity: 1, x: 0 },
      from: { opacity: 0, x: 10 },
    },
    fade: {
      leave: { opacity: 0 },
      enter: { opacity: 1 },
      from: { opacity: 0 },
    },
  };

  const transition = useTransition(match, {
    ...animationConfig[animation],
    config: {
      duration: duration,
    },
  });

  const Component = animated[as] as any;

  return transition(
    (style, isShow) =>
      isShow && (
        <Component style={style} {...rest}>
          {children}
        </Component>
      ),
  );
};

export default Transition;
