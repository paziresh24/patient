/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon45IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon45Icon(props: Icon45IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 24 24"}
      fill={"none"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fillRule={"evenodd"}
        clipRule={"evenodd"}
        d={
          "M23 5.5a4.5 4.5 0 01-7.977 2.857l-5.15 2.575a4.511 4.511 0 01-.001 2.136l5.15 2.575a4.5 4.5 0 11-.895 1.788l-5.151-2.575a4.5 4.5 0 11.003-5.713l5.149-2.575A4.5 4.5 0 1123 5.5zm-6.997 0a2.497 2.497 0 104.994 0 2.497 2.497 0 00-4.994 0zm0 13a2.497 2.497 0 104.994 0 2.497 2.497 0 00-4.994 0zM5.5 14.494a2.497 2.497 0 110-4.994 2.497 2.497 0 010 4.994z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon45Icon;
/* prettier-ignore-end */
