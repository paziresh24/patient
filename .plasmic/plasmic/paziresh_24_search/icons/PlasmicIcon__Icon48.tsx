/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon48IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon48Icon(props: Icon48IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      aria-labelledby={"title"}
      role={"img"}
      viewBox={"0 0 64 64"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <circle
        cx={"28"}
        cy={"28"}
        r={"20"}
        fill={"none"}
        stroke={"currentColor"}
        strokeWidth={"4"}
      ></circle>

      <path
        stroke={"currentColor"}
        strokeLinecap={"round"}
        strokeWidth={"4"}
        d={"m41 41 15 15"}
      ></path>

      <text
        x={"28"}
        y={"32"}
        fill={"currentColor"}
        fontFamily={"Arial, sans-serif"}
        fontSize={"16"}
        fontWeight={"bold"}
        textAnchor={"middle"}
      >
        AI
      </text>
    </svg>
  );
}

export default Icon48Icon;
/* prettier-ignore-end */
