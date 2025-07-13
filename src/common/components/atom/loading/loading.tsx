import { SVGProps } from 'react';

interface LoadingProps extends SVGProps<SVGSVGElement> {
  color?: string;
}

export const Loading: React.FC<LoadingProps> = props => {
  const { ...rest } = props;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="34" {...rest}>
      <circle fill="currentColor" stroke="currentColor" strokeWidth="2" r="15" cx="40" cy="100">
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="2s"
          values="1;0;1"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-0.4s"
        />
      </circle>
      <circle fill="currentColor" stroke="currentColor" strokeWidth="2" r="15" cx="100" cy="100">
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="2s"
          values="1;0;1"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="-0.2s"
        />
      </circle>
      <circle fill="currentColor" stroke="currentColor" strokeWidth="2" r="15" cx="160" cy="100">
        <animate
          attributeName="opacity"
          calcMode="spline"
          dur="2s"
          values="1;0;1"
          keySplines=".5 0 .5 1;.5 0 .5 1"
          repeatCount="indefinite"
          begin="0s"
        />
      </circle>
    </svg>
  );
};

export default Loading;
