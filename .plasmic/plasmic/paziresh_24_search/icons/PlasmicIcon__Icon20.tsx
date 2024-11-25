// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon20IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon20Icon(props: Icon20IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      stroke={"currentColor"}
      strokeWidth={"1.5"}
      strokeLinecap={"round"}
      strokeLinejoin={"round"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "lucide lucide-layout-grid"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <rect width={"7"} height={"7"} x={"3"} y={"3"} rx={"1"}></rect>

      <rect width={"7"} height={"7"} x={"14"} y={"3"} rx={"1"}></rect>

      <rect width={"7"} height={"7"} x={"14"} y={"14"} rx={"1"}></rect>

      <rect width={"7"} height={"7"} x={"3"} y={"14"} rx={"1"}></rect>
    </svg>
  );
}

export default Icon20Icon;
/* prettier-ignore-end */
