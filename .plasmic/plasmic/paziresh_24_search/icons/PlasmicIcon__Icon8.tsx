/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon8IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon8Icon(props: Icon8IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      viewBox={"0 0 64 64"}
      version={"1.1"}
      xmlSpace={"preserve"}
      fillRule={"evenodd"}
      clipRule={"evenodd"}
      strokeLinejoin={"round"}
      strokeMiterlimit={"2"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path fill={"none"} d={"M-896 0H384v800H-896z"}></path>

      <path
        d={
          "M36.026 20.058H14.934a2.99 2.99 0 00-2.989 2.989v25.964A2.99 2.99 0 0014.934 52h26.024a2.99 2.99 0 002.989-2.989V28.058h3.999v21.948a5.999 5.999 0 01-5.995 5.995h-28.01a5.998 5.998 0 01-5.995-5.995V22.052a5.997 5.997 0 015.995-5.995h22.085v4.001z"
        }
      ></path>

      <path
        d={
          "M55.925 25.32H51.92V14.839L24.026 42.732 21.194 39.9l27.895-27.895H38.605V8h17.318l.002.001V25.32z"
        }
      ></path>
    </svg>
  );
}

export default Icon8Icon;
/* prettier-ignore-end */
