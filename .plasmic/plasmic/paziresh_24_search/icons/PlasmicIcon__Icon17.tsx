/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon17IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon17Icon(props: Icon17IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 16 16"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fillRule={"evenodd"}
        clipRule={"evenodd"}
        d={
          "M4.8 2.667c.368 0 .666.298.666.667v7.19l1.662-1.662a.667.667 0 11.943.943l-2.8 2.8a.667.667 0 01-.943 0l-2.8-2.8a.667.667 0 11.943-.943l1.662 1.662v-7.19c0-.369.298-.667.667-.667zm2.266.667c0-.369.299-.667.667-.667h5.6a.667.667 0 110 1.333h-5.6a.667.667 0 01-.667-.666zm1.6 3.2c0-.369.299-.667.667-.667h4a.667.667 0 110 1.333h-4a.667.667 0 01-.667-.666zm2 2.8c0-.369.299-.667.667-.667h2a.667.667 0 110 1.333h-2a.667.667 0 01-.667-.666z"
        }
        className={"fill-slate-400"}
      ></path>
    </svg>
  );
}

export default Icon17Icon;
/* prettier-ignore-end */
