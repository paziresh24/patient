// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon14IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon14Icon(props: Icon14IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      viewBox={"0 0 24 24"}
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
          "M17.16 4.903a1.25 1.25 0 011.68 0c.02.017.044.042.13.127.085.086.11.11.127.13a1.25 1.25 0 010 1.68 4.649 4.649 0 01-.127.13l-.807.807a1.903 1.903 0 01-1.94-1.94l.808-.807.128-.127zm-2.208 2.205l-7.855 7.855c-.807.807-1.107 1.117-1.313 1.48-.206.365-.317.782-.594 1.889l-.16.637.638-.16c1.107-.276 1.524-.387 1.888-.593.364-.206.674-.507 1.48-1.313l7.856-7.855a3.428 3.428 0 01-1.94-1.94zm4.898-3.314a2.75 2.75 0 00-3.868.163l-.012.013-9.933 9.933-.074.073c-.708.708-1.166 1.166-1.485 1.729-.318.563-.475 1.19-.718 2.162l-.025.1-.463 1.851a.75.75 0 00.91.91l1.85-.463.101-.025c.972-.243 1.6-.4 2.162-.718.563-.32 1.02-.777 1.729-1.485l.073-.073L20.03 8.03l.013-.012c.067-.068.12-.12.163-.168a2.75 2.75 0 00-.163-3.868l-.012-.012-.013-.013a5.119 5.119 0 00-.168-.163z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon14Icon;
/* prettier-ignore-end */
