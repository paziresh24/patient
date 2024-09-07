// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon9IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon9Icon(props: Icon9IconProps) {
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
          "M14 5a1 1 0 110-2h6a1 1 0 011 1v6a1 1 0 11-2 0V6.414l-7.293 7.293a1 1 0 01-1.414-1.414L17.586 5H14zM5 7a1 1 0 00-1 1v11a1 1 0 001 1h11a1 1 0 001-1v-4.563a1 1 0 112 0V19a3 3 0 01-3 3H5a3 3 0 01-3-3V8a3 3 0 013-3h4.563a1 1 0 110 2H5z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon9Icon;
/* prettier-ignore-end */
