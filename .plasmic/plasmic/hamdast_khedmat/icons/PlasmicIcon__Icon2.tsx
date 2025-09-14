/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon2IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon2Icon(props: Icon2IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      style={{
        width: "150px",
        height: '40px"',

        ...(style || {}),
      }}
      viewBox={"0 0 150 40"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"none"}
        stroke={"currentColor"}
        strokeLinecap={"round"}
        strokeWidth={"4"}
        d={"M10 20q20-20 40 0t40 0 40 0 20 0"}
      ></path>
    </svg>
  );
}

export default Icon2Icon;
/* prettier-ignore-end */
