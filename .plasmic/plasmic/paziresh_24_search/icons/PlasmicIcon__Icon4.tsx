/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon4IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon4Icon(props: Icon4IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 24 24"}
      data-name={"star filled"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path data-name={"Rectangle 4"} fill={"none"} d={"M0 0h24v24H0z"}></path>

      <path
        d={
          "M12 18l-5.878 3.09 1.123-6.545L2.489 9.91l6.572-.955L12 3l2.939 5.955 6.572.955-4.755 4.635 1.123 6.545z"
        }
        stroke={"currentColor"}
        strokeMiterlimit={"10"}
        strokeWidth={"1.5"}
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon4Icon;
/* prettier-ignore-end */
