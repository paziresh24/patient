/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icons8TelegramSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icons8TelegramSvgIcon(props: Icons8TelegramSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 48 48"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path fill={"#29b6f6"} d={"M24 4a20 20 0 100 40 20 20 0 100-40z"}></path>

      <path
        fill={"#fff"}
        d={
          "M33.95 15l-3.746 19.126s-.161.874-1.245.874c-.576 0-.873-.274-.873-.274l-8.114-6.733-3.97-2.001-5.095-1.355S10 24.375 10 23.625c0-.625.933-.923.933-.923l21.316-8.468c-.001-.001.651-.235 1.126-.234.292 0 .625.125.625.5 0 .25-.05.5-.05.5z"
        }
      ></path>

      <path
        fill={"#b0bec5"}
        d={
          "M23 30.505l-3.426 3.374s-.149.115-.348.12a.494.494 0 01-.219-.043l.964-5.965L23 30.505z"
        }
      ></path>

      <path
        fill={"#cfd8dc"}
        d={
          "M29.897 18.196a.5.5 0 00-.701-.093L16 26s2.106 5.892 2.427 6.912c.322 1.021.58 1.045.58 1.045l.964-5.965 9.832-9.096a.499.499 0 00.094-.7z"
        }
      ></path>
    </svg>
  );
}

export default Icons8TelegramSvgIcon;
/* prettier-ignore-end */
