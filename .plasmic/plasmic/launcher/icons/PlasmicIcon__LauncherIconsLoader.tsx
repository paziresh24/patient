// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LauncherIconsLoaderIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function LauncherIconsLoaderIcon(props: LauncherIconsLoaderIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 200 200"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <circle
        fill={"currentColor"}
        stroke={"currentColor"}
        strokeWidth={"2"}
        r={"15"}
        cx={"40"}
        cy={"100"}
      >
        <animate
          attributeName={"opacity"}
          calcMode={"spline"}
          dur={"2"}
          values={"1;0;1;"}
          keySplines={".5 0 .5 1;.5 0 .5 1"}
          repeatCount={"indefinite"}
          begin={"-.4"}
        ></animate>
      </circle>

      <circle
        fill={"currentColor"}
        stroke={"currentColor"}
        strokeWidth={"2"}
        r={"15"}
        cx={"100"}
        cy={"100"}
      >
        <animate
          attributeName={"opacity"}
          calcMode={"spline"}
          dur={"2"}
          values={"1;0;1;"}
          keySplines={".5 0 .5 1;.5 0 .5 1"}
          repeatCount={"indefinite"}
          begin={"-.2"}
        ></animate>
      </circle>

      <circle
        fill={"currentColor"}
        stroke={"currentColor"}
        strokeWidth={"2"}
        r={"15"}
        cx={"160"}
        cy={"100"}
      >
        <animate
          attributeName={"opacity"}
          calcMode={"spline"}
          dur={"2"}
          values={"1;0;1;"}
          keySplines={".5 0 .5 1;.5 0 .5 1"}
          repeatCount={"indefinite"}
          begin={"0"}
        ></animate>
      </circle>
    </svg>
  );
}

export default LauncherIconsLoaderIcon;
/* prettier-ignore-end */
