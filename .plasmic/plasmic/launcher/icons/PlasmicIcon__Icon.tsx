/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type IconIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function IconIcon(props: IconIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 24 24"}
      fill={"none"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M19 10.75h-2c-2.42 0-3.75-1.33-3.75-3.75V5c0-2.42 1.33-3.75 3.75-3.75h2c2.42 0 3.75 1.33 3.75 3.75v2c0 2.42-1.33 3.75-3.75 3.75zm-2-8c-1.58 0-2.25.67-2.25 2.25v2c0 1.58.67 2.25 2.25 2.25h2c1.58 0 2.25-.67 2.25-2.25V5c0-1.58-.67-2.25-2.25-2.25h-2zm-10 20H5c-2.42 0-3.75-1.33-3.75-3.75v-2c0-2.42 1.33-3.75 3.75-3.75h2c2.42 0 3.75 1.33 3.75 3.75v2c0 2.42-1.33 3.75-3.75 3.75zm-2-8c-1.58 0-2.25.67-2.25 2.25v2c0 1.58.67 2.25 2.25 2.25h2c1.58 0 2.25-.67 2.25-2.25v-2c0-1.58-.67-2.25-2.25-2.25H5zm1-4c-2.62 0-4.75-2.13-4.75-4.75S3.38 1.25 6 1.25 10.75 3.38 10.75 6 8.62 10.75 6 10.75zm0-8C4.21 2.75 2.75 4.21 2.75 6S4.21 9.25 6 9.25 9.25 7.79 9.25 6 7.79 2.75 6 2.75zm12 20c-2.62 0-4.75-2.13-4.75-4.75s2.13-4.75 4.75-4.75 4.75 2.13 4.75 4.75-2.13 4.75-4.75 4.75zm0-8c-1.79 0-3.25 1.46-3.25 3.25s1.46 3.25 3.25 3.25 3.25-1.46 3.25-3.25-1.46-3.25-3.25-3.25z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default IconIcon;
/* prettier-ignore-end */
