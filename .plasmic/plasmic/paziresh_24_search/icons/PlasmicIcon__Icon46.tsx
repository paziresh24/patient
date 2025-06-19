/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon46IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon46Icon(props: Icon46IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      stroke={"currentColor"}
      strokeLinecap={"round"}
      strokeLinejoin={"round"}
      strokeWidth={"2"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "lucide lucide-search-icon lucide-search"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path d={"m21 21-4.34-4.34"}></path>

      <circle cx={"11"} cy={"11"} r={"8"}></circle>
    </svg>
  );
}

export default Icon46Icon;
/* prettier-ignore-end */
