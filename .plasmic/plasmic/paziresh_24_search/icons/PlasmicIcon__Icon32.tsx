/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon32IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon32Icon(props: Icon32IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 28 28"}
      fill={"#000"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <rect
        x={".055"}
        y={".502"}
        width={"27"}
        height={"27"}
        rx={"10"}
        fill={"transparent"}
      ></rect>

      <path
        d={
          "M24.478 23.328l-4.174-4.14a10.125 10.125 0 10-1.563 1.564l4.14 4.14a1.125 1.125 0 001.597 0 1.125 1.125 0 000-1.564zm-12.049-2.576a7.875 7.875 0 110-15.75 7.875 7.875 0 010 15.75z"
        }
        fill={"#000"}
        fillOpacity={"1"}
      ></path>
    </svg>
  );
}

export default Icon32Icon;
/* prettier-ignore-end */
