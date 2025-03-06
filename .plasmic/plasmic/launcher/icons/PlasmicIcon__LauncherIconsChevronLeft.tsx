// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LauncherIconsChevronLeftIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function LauncherIconsChevronLeftIcon(
  props: LauncherIconsChevronLeftIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 16 16"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M10.363 13.445a.464.464 0 01-.332-.137L5.956 9.233a1.713 1.713 0 010-2.413l4.075-4.075a.472.472 0 01.663 0 .471.471 0 010 .663L6.619 7.483c-.3.3-.3.787 0 1.087l4.075 4.075a.471.471 0 010 .663.49.49 0 01-.331.137z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default LauncherIconsChevronLeftIcon;
/* prettier-ignore-end */
