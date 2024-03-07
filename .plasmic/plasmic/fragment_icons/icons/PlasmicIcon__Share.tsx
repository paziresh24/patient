// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ShareIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ShareIcon(props: ShareIconProps) {
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
          "M17.164 4.142a1.832 1.832 0 100 3.665 1.832 1.832 0 000-3.665zm-2.427 4.116a3.332 3.332 0 10-.756-1.295L9.26 9.717a3.332 3.332 0 100 4.566l4.721 2.75a3.332 3.332 0 10.758-1.294l-4.722-2.751a3.332 3.332 0 000-1.976l4.72-2.754zM8.396 11.04a.768.768 0 00.043.075 1.824 1.824 0 01-.043 1.844A1.831 1.831 0 015.002 12a1.832 1.832 0 013.394-.96zm7.138 6.15a.773.773 0 00.102-.176 1.833 1.833 0 11-.103.175z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default ShareIcon;
/* prettier-ignore-end */
