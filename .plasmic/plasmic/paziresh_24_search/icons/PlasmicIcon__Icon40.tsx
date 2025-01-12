// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon40IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon40Icon(props: Icon40IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 16 16"}
      fill={"none"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M2.707 7.293L8 12.586l5.293-5.293 1.414 1.414L8 15.414 1.293 8.707l1.414-1.414z"
        }
        fill={"currentColor"}
      ></path>

      <path
        d={
          "M2.707.793L8 6.086 13.293.793l1.414 1.414L8 8.914 1.293 2.207 2.707.793z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon40Icon;
/* prettier-ignore-end */
