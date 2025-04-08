/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon12IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon12Icon(props: Icon12IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      viewBox={"0 0 19 19"}
      fill={"none"}
      xmlns={"http://www.w3.org/2000/svg"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fillRule={"evenodd"}
        clipRule={"evenodd"}
        d={
          "M3.756 7.712c0-1.838.67-3.16 1.628-4.027.971-.88 2.285-1.334 3.622-1.334 1.336 0 2.65.455 3.621 1.334.959.868 1.629 2.19 1.629 4.027 0 2.306-1.342 4.349-2.793 5.872a16.918 16.918 0 01-2.457 2.115 16.914 16.914 0 01-2.457-2.115c-1.452-1.523-2.793-3.566-2.793-5.872zm4.856 9.527l.394-.638-.394.639.394.243.394-.244-.394-.638.394.638h.001l.002-.001.004-.003.017-.01a6.911 6.911 0 00.261-.173 18.414 18.414 0 002.864-2.434c1.549-1.624 3.207-4.026 3.207-6.906 0-2.235-.83-3.97-2.122-5.139C12.355 1.415 10.67.851 9.006.851c-1.664 0-3.35.564-4.629 1.722-1.291 1.17-2.121 2.904-2.121 5.14 0 2.88 1.658 5.28 3.207 6.906a18.42 18.42 0 002.864 2.433 10.663 10.663 0 00.261.173l.017.01.004.003h.002v.001zM7.506 7.601a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm1.5-3a3 3 0 100 6 3 3 0 000-6z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon12Icon;
/* prettier-ignore-end */
