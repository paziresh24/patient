/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon30IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon30Icon(props: Icon30IconProps) {
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
          "M9.333 4.333c0-1.75.019-2.333 2.334-2.333C13.98 2 14 2.583 14 4.333c0 1.75.007 2.334-2.333 2.334-2.341 0-2.334-.584-2.334-2.334zM2 11.667c0-1.75.019-2.333 2.333-2.333 2.315 0 2.334.583 2.334 2.333 0 1.75.007 2.333-2.334 2.333C1.993 14 2 13.417 2 11.667z"
        }
        stroke={"currentColor"}
        strokeWidth={"1.2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>

      <path
        d={
          "M3.338 1.932c.216-.63 1.108-.63 1.324 0l.248.723a.7.7 0 00.435.435l.723.248c.63.216.63 1.108 0 1.324l-.723.248a.7.7 0 00-.435.435l-.248.723c-.216.63-1.108.63-1.324 0l-.248-.723a.7.7 0 00-.435-.435l-.723-.248c-.63-.216-.63-1.108 0-1.324l.723-.248a.7.7 0 00.435-.435l.248-.723zm8 8c.216-.63 1.108-.63 1.324 0l.248.723a.7.7 0 00.435.435l.723.248c.63.216.63 1.108 0 1.324l-.723.248a.7.7 0 00-.435.435l-.248.723c-.216.63-1.108.63-1.324 0l-.248-.723a.7.7 0 00-.435-.435l-.723-.248c-.63-.216-.63-1.108 0-1.324l.723-.248a.7.7 0 00.435-.435l.248-.723z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon30Icon;
/* prettier-ignore-end */
