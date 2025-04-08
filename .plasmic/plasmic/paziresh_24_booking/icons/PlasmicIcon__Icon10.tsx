/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon10IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon10Icon(props: Icon10IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      fill={"none"}
      xmlns={"http://www.w3.org/2000/svg"}
      className={classNames("plasmic-default__svg", className, "w-10 h-6")}
      viewBox={"0 0 24 24"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={"M2 6a4 4 0 014-4h12a4 4 0 014 4v12a4 4 0 01-4 4H6a4 4 0 01-4-4V6z"}
        stroke={"currentColor"}
        strokeWidth={"1.5"}
      ></path>

      <path
        d={"M16 8v8m0-4H8m0-4v8"}
        stroke={"currentColor"}
        strokeWidth={"1.5"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>
    </svg>
  );
}

export default Icon10Icon;
/* prettier-ignore-end */
