// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LauncherIconsWalletIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function LauncherIconsWalletIcon(props: LauncherIconsWalletIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 25 25"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M13.249 11.927h-6c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6c.41 0 .75.34.75.75s-.34.75-.75.75zm-11 0c-.41 0-.75-.34-.75-.75v-4.62c0-2.45 1.99-4.44 4.44-4.44h5.62c2.57 0 4.44 1.71 4.44 4.06 0 .41-.34.75-.75.75s-.75-.34-.75-.75c0-1.76-1.53-2.56-2.94-2.56h-5.62c-1.62 0-2.94 1.32-2.94 2.94v4.62c0 .42-.34.75-.75.75z"
        }
        fill={"currentColor"}
      ></path>

      <path
        d={
          "M16.249 21.927h-10c-2.62 0-4.75-2.13-4.75-4.75v-7c0-2.62 2.13-4.75 4.75-4.75h10c2.62 0 4.75 2.13 4.75 4.75v1.45c0 .41-.34.75-.75.75h-1.08c-.35 0-.67.13-.9.37l-.01.01c-.33.33-.46.79-.34 1.24.15.56.74.97 1.4.97h.93c.41 0 .75.34.75.75v1.45c0 2.63-2.13 4.76-4.75 4.76zm-10-15c-1.79 0-3.25 1.46-3.25 3.25v7c0 1.79 1.46 3.25 3.25 3.25h10c1.79 0 3.25-1.46 3.25-3.25v-.7h-.18c-1.35 0-2.52-.85-2.85-2.08-.26-.97.02-2 .73-2.7.52-.53 1.22-.82 1.97-.82h.33v-.7c0-1.79-1.46-3.25-3.25-3.25h-10z"
        }
        fill={"currentColor"}
      ></path>

      <path
        d={
          "M21.219 16.477h-1.93c-1.51 0-2.79-1.12-2.91-2.56-.08-.83.22-1.64.82-2.23.5-.52 1.21-.81 1.96-.81h2.05c.98 0 1.78.79 1.78 1.77v2.06c.01.98-.79 1.77-1.77 1.77zm-2.05-4.1c-.35 0-.67.13-.9.37-.29.28-.43.66-.39 1.04.05.66.69 1.19 1.41 1.19h1.93c.15 0 .28-.12.28-.27v-2.06c0-.15-.13-.27-.28-.27h-2.05z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default LauncherIconsWalletIcon;
/* prettier-ignore-end */
