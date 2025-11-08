/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon5IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon5Icon(props: Icon5IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      aria-label={
        "Chevron \u00d9\u00be\u00d8\u00a7\u00db\u008c\u00db\u008c\u00d9\u0086"
      }
      className={classNames("plasmic-default__svg", className, "chev-animated")}
      role={"img"}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g
        style={{
          animation: 'bounce 1s ease-in-out .5s infinite"',
        }}
      >
        <path
          fill={"none"}
          stroke={"currentColor"}
          strokeDasharray={"40"}
          strokeDashoffset={"40"}
          strokeLinecap={"round"}
          strokeLinejoin={"round"}
          strokeWidth={"2"}
          d={"m6 9 6 6 6-6"}
          style={{
            transformBox: "fill-box",
            animation: 'draw .36s ease-out forwards"',
          }}
          transformOrigin={"50% 50%"}
        ></path>
      </g>
    </svg>
  );
}

export default Icon5Icon;
/* prettier-ignore-end */
