// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Svg3IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Svg3Icon(props: Svg3IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 20 20"}
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
          "M3.954 8.118c0-1.935.705-3.326 1.714-4.239C6.69 2.953 8.073 2.475 9.48 2.475s2.79.478 3.812 1.404c1.01.913 1.714 2.304 1.714 4.24 0 2.426-1.412 4.577-2.94 6.18a17.805 17.805 0 01-2.586 2.226 17.797 17.797 0 01-2.586-2.226c-1.528-1.603-2.94-3.754-2.94-6.18zm5.11 10.028l.416-.67-.415.67.415.257.415-.256-.415-.672.415.672.003-.002.005-.003.017-.01a10.127 10.127 0 00.275-.182 19.382 19.382 0 003.014-2.562c1.63-1.71 3.376-4.238 3.376-7.27 0-2.353-.874-4.179-2.233-5.41C13.006 1.49 11.23.896 9.48.896s-3.526.594-4.872 1.812c-1.36 1.231-2.233 3.057-2.233 5.41 0 3.032 1.745 5.56 3.376 7.27a19.383 19.383 0 003.014 2.562 11.594 11.594 0 00.276.181l.016.01.006.004.002.002zM7.902 8.002a1.579 1.579 0 113.158 0 1.579 1.579 0 01-3.158 0zM9.48 4.843a3.158 3.158 0 100 6.316 3.158 3.158 0 000-6.316z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Svg3Icon;
/* prettier-ignore-end */
