// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon2IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon2Icon(props: Icon2IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 24 24"}
      fill={"currentColor"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "[&>path]:stroke-slate-800 [&>path]:text-white"
      )}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M4.331 12.047L12 20l7.669-7.953A4.804 4.804 0 0021 8.714C21 6.111 18.965 4 16.454 4a4.465 4.465 0 00-3.214 1.38L12 6.668 10.76 5.38A4.465 4.465 0 007.546 4C5.036 4 3 6.11 3 8.714c0 1.25.479 2.45 1.331 3.333z"
        }
        stroke={"currentColor"}
        strokeWidth={"1.5"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>
    </svg>
  );
}

export default Icon2Icon;
/* prettier-ignore-end */
