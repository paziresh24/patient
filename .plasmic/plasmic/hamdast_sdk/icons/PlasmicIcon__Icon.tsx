/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type IconIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function IconIcon(props: IconIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      className={classNames("plasmic-default__svg", className, "mdl-js")}
      viewBox={"0 0 38 38"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <defs>
        <linearGradient
          x1={"8.042%"}
          y1={"0%"}
          x2={"65.682%"}
          y2={"23.865%"}
          id={"VF7EtlVuE9r5a"}
        >
          <stop stopColor={"#000"} stopOpacity={"0"} offset={"0%"}></stop>

          <stop
            stopColor={"#000"}
            stopOpacity={".631"}
            offset={"63.146%"}
          ></stop>

          <stop stopColor={"#000"} offset={"100%"}></stop>
        </linearGradient>
      </defs>

      <g transform={"translate(1 1)"} fill={"none"} fillRule={"evenodd"}>
        <path
          d={"M36 18c0-9.94-8.06-18-18-18"}
          stroke={"url(#VF7EtlVuE9r5a)"}
          strokeWidth={"2"}
        >
          <animateTransform
            attributeName={"transform"}
            type={"rotate"}
            from={"0 18 18"}
            to={"360 18 18"}
            dur={"0.9s"}
            repeatCount={"indefinite"}
          ></animateTransform>
        </path>

        <circle fill={"#000"} cx={"36"} cy={"18"} r={"1"}>
          <animateTransform
            attributeName={"transform"}
            type={"rotate"}
            from={"0 18 18"}
            to={"360 18 18"}
            dur={"0.9s"}
            repeatCount={"indefinite"}
          ></animateTransform>
        </circle>
      </g>
    </svg>
  );
}

export default IconIcon;
/* prettier-ignore-end */
