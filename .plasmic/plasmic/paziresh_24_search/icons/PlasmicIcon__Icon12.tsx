// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon12IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon12Icon(props: Icon12IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 28 28"}
      fill={"#000"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "w-6 h-6 cursor-pointer min-w-[1.5rem]"
      )}
      height={"1em"}
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
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon12Icon;
/* prettier-ignore-end */
