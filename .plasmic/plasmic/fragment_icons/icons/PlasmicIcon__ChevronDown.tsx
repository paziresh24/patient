/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ChevronDownIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ChevronDownIcon(props: ChevronDownIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 24 24"}
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
          "M12.53 15.53a.75.75 0 01-1.06 0l-6-6a.75.75 0 011.06-1.06L12 13.94l5.47-5.47a.75.75 0 111.06 1.06l-6 6z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default ChevronDownIcon;
/* prettier-ignore-end */
