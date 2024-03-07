// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type RepliesIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function RepliesIcon(props: RepliesIconProps) {
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
        "lucide lucide-reply-all"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path d={"M7 17l-5-5 5-5m5 10l-5-5 5-5"}></path>

      <path d={"M22 18v-2a4 4 0 00-4-4H7"}></path>
    </svg>
  );
}

export default RepliesIcon;
/* prettier-ignore-end */
