/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LauncherIconsChevronDownIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function LauncherIconsChevronDownIcon(
  props: LauncherIconsChevronDownIconProps
) {
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
        "lucide lucide-chevron-down-icon lucide-chevron-down"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path d={"m6 9 6 6 6-6"}></path>
    </svg>
  );
}

export default LauncherIconsChevronDownIcon;
/* prettier-ignore-end */
