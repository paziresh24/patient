// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon6IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon6Icon(props: Icon6IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlSpace={"preserve"}
      viewBox={"0 0 9.318 18.703"}
      x={"0"}
      y={"0"}
      fillRule={"evenodd"}
      clipRule={"evenodd"}
      shapeRendering={"geometricPrecision"}
      textRendering={"geometricPrecision"}
      imageRendering={"optimizeQuality"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        fillRule={"nonzero"}
        d={"M9.318 14.963H0L.02 0z"}
      ></path>

      <text
        x={"0"}
        y={"29.963"}
        fill={"currentColor"}
        fontSize={"5"}
        fontWeight={"bold"}
        fontFamily={
          "'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
        }
      >
        Created by FELIX FX
      </text>

      <text
        x={"0"}
        y={"34.963"}
        fill={"currentColor"}
        fontSize={"5"}
        fontWeight={"bold"}
        fontFamily={
          "'Helvetica Neue', Helvetica, Arial-Unicode, Arial, Sans-serif"
        }
      >
        from the Noun Project
      </text>
    </svg>
  );
}

export default Icon6Icon;
/* prettier-ignore-end */
