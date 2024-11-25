// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon33IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon33Icon(props: Icon33IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 17 11"}
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
          "M16.25.63a.623.623 0 00-.635-.63h-3.99a.625.625 0 100 1.25h2.491L9.125 6.241 6.92 4.037a1.125 1.125 0 00-1.59 0L.183 9.183a.625.625 0 10.884.884l5.058-5.058 2.204 2.204c.44.44 1.152.44 1.591 0L15 2.133v2.492a.625.625 0 101.25 0V.63z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon33Icon;
/* prettier-ignore-end */
