/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon4IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon4Icon(props: Icon4IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      viewBox={"0 0 24 24"}
      fill={"none"}
      xmlns={"http://www.w3.org/2000/svg"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fillRule={"evenodd"}
        clipRule={"evenodd"}
        d={
          "M2.75 12c0-.338.136-.905.493-1.591a7.858 7.858 0 011.64-2.108C6.374 6.926 8.694 5.75 12 5.75c3.308 0 5.627 1.176 7.116 2.551a7.86 7.86 0 011.64 2.108c.358.686.494 1.253.494 1.591 0 .338-.136.905-.493 1.591a7.86 7.86 0 01-1.64 2.108c-1.49 1.375-3.81 2.551-7.117 2.551-3.308 0-5.627-1.176-7.116-2.551a7.858 7.858 0 01-1.64-2.108c-.358-.686-.494-1.253-.494-1.591zM12 4.25c-3.692 0-6.373 1.324-8.134 2.949a9.356 9.356 0 00-1.953 2.517c-.424.814-.663 1.622-.663 2.284 0 .662.24 1.47.663 2.284a9.356 9.356 0 001.953 2.517C5.627 18.426 8.308 19.75 12 19.75s6.373-1.324 8.134-2.949a9.356 9.356 0 001.953-2.517c.424-.814.663-1.622.663-2.284 0-.662-.24-1.47-.663-2.284a9.355 9.355 0 00-1.953-2.517C18.373 5.574 15.692 4.25 12 4.25zM9.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon4Icon;
/* prettier-ignore-end */
