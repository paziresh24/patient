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
      fill={"none"}
      viewBox={"0 0 25 25"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M11.448 2.366c.621-.533.932-.799 1.302-.799s.68.266 1.302.799l1.636 1.403c.278.238.417.357.585.419.168.062.35.062.717.062h1.76c.943 0 1.414 0 1.707.293.293.293.293.764.293 1.707v1.76c0 .366 0 .55.062.717.062.168.181.307.42.585l1.402 1.636c.533.621.799.932.799 1.302s-.266.68-.799 1.302l-1.402 1.636c-.239.278-.358.417-.42.585-.062.168-.062.35-.062.717v1.76c0 .943 0 1.414-.293 1.707-.293.293-.764.293-1.707.293h-1.76c-.366 0-.55 0-.717.062-.168.062-.307.181-.585.42l-1.636 1.402c-.621.533-.932.799-1.302.799s-.68-.266-1.302-.799l-1.636-1.402c-.278-.239-.417-.358-.585-.42-.168-.062-.35-.062-.717-.062H6.716c-.943 0-1.414 0-1.707-.293-.293-.293-.293-.764-.293-1.707v-1.767c0-.362 0-.544-.061-.71-.061-.167-.179-.306-.413-.582l-1.396-1.648c-.524-.617-.785-.926-.785-1.293 0-.367.261-.675.785-1.293L4.242 9.31c.234-.277.352-.416.413-.582.06-.167.06-.349.06-.711V6.25c0-.943 0-1.414.294-1.707.293-.293.764-.293 1.707-.293H8.51c.366 0 .55 0 .717-.062.168-.062.307-.181.585-.42l1.636-1.402z"
        }
        fill={"#3861fb"}
      ></path>

      <path
        d={"M9.75 12.25l2 2 5-5"}
        stroke={"#fff"}
        strokeWidth={"1.5"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>
    </svg>
  );
}

export default IconIcon;
/* prettier-ignore-end */
