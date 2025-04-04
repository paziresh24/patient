/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon28IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon28Icon(props: Icon28IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 16 14"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M.131 7.017c-.126.188-.161.353-.105.497.057.145.203.217.439.217h.902a7.126 7.126 0 002.172 4.444 6.75 6.75 0 002.042 1.338 6.16 6.16 0 002.42.48 6.11 6.11 0 002.803-.662 6.946 6.946 0 002.228-1.773.633.633 0 00.163-.466.52.52 0 00-.209-.391.494.494 0 00-.405-.103.626.626 0 00-.373.233 5.566 5.566 0 01-1.848 1.458 5.248 5.248 0 01-2.36.538c-.71 0-1.381-.128-2.012-.384a5.4 5.4 0 01-1.684-1.08A5.91 5.91 0 013.09 9.74a5.826 5.826 0 01-.598-2.01h.974c.232 0 .377-.07.435-.212.06-.142.026-.306-.1-.494L2.335 4.836c-.105-.156-.227-.234-.367-.237-.14-.002-.264.077-.373.237L.131 7.017zm2.846-4.582a.618.618 0 00-.17.463.51.51 0 00.216.388.504.504 0 00.405.106.61.61 0 00.373-.23 5.633 5.633 0 011.855-1.457A5.22 5.22 0 018 1.166c.711 0 1.382.13 2.012.388.63.258 1.192.62 1.684 1.083a5.856 5.856 0 011.21 1.623c.315.617.515 1.287.602 2.01h-.974c-.231 0-.376.07-.435.212-.06.142-.025.307.101.494l1.465 2.188c.105.156.227.235.367.237.14.002.264-.077.373-.237l1.459-2.181c.13-.192.167-.36.108-.5-.06-.143-.207-.214-.442-.214h-.896a7.122 7.122 0 00-2.172-4.444A6.794 6.794 0 0010.418.484 6.133 6.133 0 008.001 0a6.09 6.09 0 00-2.797.662 6.945 6.945 0 00-2.227 1.773z"
        }
        fill={"currentColor"}
        fillOpacity={".6"}
      ></path>
    </svg>
  );
}

export default Icon28Icon;
/* prettier-ignore-end */
