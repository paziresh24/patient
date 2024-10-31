// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon7IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon7Icon(props: Icon7IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      fill={"none"}
      xmlns={"http://www.w3.org/2000/svg"}
      className={classNames("plasmic-default__svg", className, "w-10 h-6")}
      viewBox={"0 0 20 22"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g
        clipPath={"url(#h1BDdKikRYhSa)"}
        stroke={"currentColor"}
        strokeWidth={"1.5"}
      >
        <path
          d={"M1 21h18"}
          strokeMiterlimit={"10"}
          strokeLinecap={"round"}
          strokeLinejoin={"round"}
        ></path>

        <path
          d={
            "M.95 21L1 8.97c0-.61.29-1.19.77-1.57l7-5.45c.72-.56 1.73-.56 2.46 0l7 5.44c.49.38.77.96.77 1.58V21"
          }
          strokeMiterlimit={"10"}
          strokeLinejoin={"round"}
        ></path>

        <path d={"M10 10v6m3-3H7"} strokeLinecap={"round"}></path>
      </g>

      <defs>
        <clipPath id={"h1BDdKikRYhSa"}>
          <path fill={"#fff"} d={"M0 0h20v22H0z"}></path>
        </clipPath>
      </defs>
    </svg>
  );
}

export default Icon7Icon;
/* prettier-ignore-end */
