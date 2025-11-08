/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon6IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon6Icon(props: Icon6IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      aria-label={
        "Chevron \u00d9\u00be\u00d8\u00a7\u00db\u008c\u00db\u008c\u00d9\u0086 - SVG \u00d8\u00a7\u00d9\u0086\u00db\u008c\u00d9 \u00db\u008c\u00d8\u00b4\u00d9\u0086\u00db\u008c"
      }
      role={"img"}
      viewBox={"0 0 24 24"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g>
        <path
          fill={"none"}
          stroke={"currentColor"}
          strokeDasharray={"1"}
          strokeDashoffset={"1"}
          strokeLinecap={"round"}
          strokeLinejoin={"round"}
          strokeWidth={"2"}
          d={"m6 9 6 6 6-6"}
          pathLength={"1"}
        >
          <animate
            id={"a"}
            fill={"freeze"}
            attributeName={"stroke-dashoffset"}
            begin={"0s"}
            calcMode={"spline"}
            dur={"0.36s"}
            from={"1"}
            keySplines={"0.22 1 0.36 1"}
            to={"0"}
          ></animate>
        </path>

        <animateTransform
          attributeName={"transform"}
          begin={"a.end+0.16s"}
          calcMode={"spline"}
          dur={"1s"}
          keySplines={"0.42 0 0.58 1;0.42 0 0.58 1"}
          keyTimes={"0;0.5;1"}
          repeatCount={"indefinite"}
          type={"translate"}
          values={"0 0; 0 3; 0 0"}
        ></animateTransform>
      </g>
    </svg>
  );
}

export default Icon6Icon;
/* prettier-ignore-end */
