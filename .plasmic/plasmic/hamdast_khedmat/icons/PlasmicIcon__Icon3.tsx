/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon3IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon3Icon(props: Icon3IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center"',

        ...(style || {}),
      }}
      viewBox={"0 0 300 60"}
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
        d={"M10 30c65-20 215 20 280 0"}
      ></path>
    </svg>
  );
}

export default Icon3Icon;
/* prettier-ignore-end */
