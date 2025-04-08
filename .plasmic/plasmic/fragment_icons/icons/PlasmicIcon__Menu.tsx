/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type MenuIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function MenuIcon(props: MenuIconProps) {
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
        "lucide lucide-more-vertical"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <circle cx={"12"} cy={"12"} r={"1"}></circle>

      <circle cx={"12"} cy={"5"} r={"1"}></circle>

      <circle cx={"12"} cy={"19"} r={"1"}></circle>
    </svg>
  );
}

export default MenuIcon;
/* prettier-ignore-end */
