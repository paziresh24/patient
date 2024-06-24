// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon14IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon14Icon(props: Icon14IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      stroke={"currentColor"}
      strokeWidth={"2"}
      strokeLinecap={"round"}
      strokeLinejoin={"round"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "lucide lucide-share-2"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <circle cx={"18"} cy={"5"} r={"3"}></circle>

      <circle cx={"6"} cy={"12"} r={"3"}></circle>

      <circle cx={"18"} cy={"19"} r={"3"}></circle>

      <path d={"M8.59 13.51l6.83 3.98m-.01-10.98l-6.82 3.98"}></path>
    </svg>
  );
}

export default Icon14Icon;
/* prettier-ignore-end */
