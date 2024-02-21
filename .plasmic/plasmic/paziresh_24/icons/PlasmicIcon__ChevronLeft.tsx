// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ChevronLeftIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ChevronLeftIcon(props: ChevronLeftIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 10 10"}
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
          "M6.187 2.146a.5.5 0 010 .708L4.04 5l2.147 2.146a.5.5 0 11-.707.708l-2.5-2.5a.5.5 0 010-.708l2.5-2.5a.5.5 0 01.707 0z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default ChevronLeftIcon;
/* prettier-ignore-end */
