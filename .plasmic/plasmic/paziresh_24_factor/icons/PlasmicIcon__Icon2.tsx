/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon2IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon2Icon(props: Icon2IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      stroke={"currentColor"}
      viewBox={"0 0 38 38"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g
        transform={"translate(1 1)"}
        strokeWidth={"2"}
        fill={"none"}
        fillRule={"evenodd"}
      >
        <circle strokeOpacity={".5"} cx={"18"} cy={"18"} r={"18"}></circle>

        <path d={"M36 18c0-9.94-8.06-18-18-18"}>
          <animateTransform
            attributeName={"transform"}
            type={"rotate"}
            from={"0 18 18"}
            to={"360 18 18"}
            dur={"1s"}
            repeatCount={"indefinite"}
          ></animateTransform>
        </path>
      </g>
    </svg>
  );
}

export default Icon2Icon;
/* prettier-ignore-end */
