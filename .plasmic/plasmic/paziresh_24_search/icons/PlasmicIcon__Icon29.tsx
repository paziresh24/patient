// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon29IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon29Icon(props: Icon29IconProps) {
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
        fillRule={"evenodd"}
        clipRule={"evenodd"}
        d={
          "M2 4.333C2 2.583 2.019 2 4.333 2c2.315 0 2.334.583 2.334 2.333 0 1.75.007 2.334-2.334 2.334C1.993 6.667 2 6.083 2 4.333zm7.333 0c0-1.75.019-2.333 2.334-2.333C13.98 2 14 2.583 14 4.333c0 1.75.007 2.334-2.333 2.334-2.341 0-2.334-.584-2.334-2.334zM2 11.667c0-1.75.019-2.333 2.333-2.333 2.315 0 2.334.583 2.334 2.333 0 1.75.007 2.333-2.334 2.333C1.993 14 2 13.417 2 11.667zm7.333 0c0-1.75.019-2.333 2.334-2.333 2.314 0 2.333.583 2.333 2.333 0 1.75.007 2.333-2.333 2.333-2.341 0-2.334-.583-2.334-2.333z"
        }
        stroke={"currentColor"}
        strokeWidth={"1.2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>
    </svg>
  );
}

export default Icon29Icon;
/* prettier-ignore-end */
