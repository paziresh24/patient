/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Svg2IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Svg2Icon(props: Svg2IconProps) {
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
        d={
          "M18.308 15.275c0 .3-.066.608-.208.908-.142.3-.325.584-.567.85-.408.45-.858.775-1.366.984-.5.208-1.042.316-1.625.316-.85 0-1.759-.2-2.717-.608a14.634 14.634 0 01-2.867-1.65 23.962 23.962 0 01-2.733-2.333A23.682 23.682 0 013.9 11.017c-.683-.95-1.233-1.9-1.633-2.842-.4-.95-.6-1.858-.6-2.725 0-.567.1-1.108.3-1.608.2-.509.516-.975.958-1.392.533-.525 1.117-.783 1.733-.783.234 0 .467.05.675.15.217.1.409.25.559.466l1.933 2.725c.15.209.258.4.333.584.075.175.117.35.117.508 0 .2-.058.4-.175.592a2.834 2.834 0 01-.467.591L7 7.942a.446.446 0 00-.133.333c0 .067.008.125.025.192.025.066.05.116.066.166.15.275.409.634.775 1.067a28.5 28.5 0 001.209 1.317c.45.441.883.85 1.325 1.225.433.366.791.616 1.075.766.041.017.091.042.15.067a.575.575 0 00.208.033c.142 0 .25-.05.342-.141l.633-.625c.208-.209.408-.367.6-.467a1.11 1.11 0 01.592-.175c.158 0 .325.033.508.108s.375.184.583.325l2.759 1.959c.216.15.366.325.458.533.083.208.133.417.133.65z"
        }
        stroke={"currentColor"}
        strokeWidth={"1.25"}
        strokeMiterlimit={"10"}
      ></path>
    </svg>
  );
}

export default Svg2Icon;
/* prettier-ignore-end */
