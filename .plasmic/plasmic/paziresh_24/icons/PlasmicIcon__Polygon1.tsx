// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Polygon1IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Polygon1Icon(props: Polygon1IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 40 21"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={"M20.139 0l19.173 20.687H.966L20.139 0z"}
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Polygon1Icon;
/* prettier-ignore-end */
