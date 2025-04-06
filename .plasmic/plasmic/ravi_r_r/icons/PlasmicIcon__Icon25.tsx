/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon25IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon25Icon(props: Icon25IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 22 22"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M10.527 1.295a.53.53 0 01.95 0l2.31 4.679a2.123 2.123 0 001.595 1.16l5.166.756a.53.53 0 01.294.904l-3.736 3.638a2.124 2.124 0 00-.611 1.878l.882 5.14a.53.53 0 01-.771.56l-4.618-2.428a2.122 2.122 0 00-1.973 0L5.398 20.01a.53.53 0 01-.77-.56l.88-5.14a2.122 2.122 0 00-.61-1.878L1.162 8.795a.53.53 0 01.294-.906l5.165-.755a2.122 2.122 0 001.597-1.16l2.309-4.68z"
        }
        fill={"url(#U0Y9Gr_8B8MDa)"}
        stroke={"#F9C001"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>

      <defs>
        <linearGradient
          id={"U0Y9Gr_8B8MDa"}
          x1={"11"}
          y1={"12.501"}
          x2={"-.5"}
          y2={"12.501"}
          gradientUnits={"userSpaceOnUse"}
        >
          <stop offset={".148"} stopColor={"#fff"} stopOpacity={"0"}></stop>

          <stop offset={".148"} stopColor={"#F9C001"}></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default Icon25Icon;
/* prettier-ignore-end */
