/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon42IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon42Icon(props: Icon42IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      viewBox={"0 0 35 35"}
      data-name={"Layer 2"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <circle cx={"17.5"} cy={"3.373"} r={"1.873"}></circle>

      <circle cx={"17.5"} cy={"17.5"} r={"1.873"}></circle>

      <circle cx={"17.5"} cy={"31.627"} r={"1.873"}></circle>
    </svg>
  );
}

export default Icon42Icon;
/* prettier-ignore-end */
