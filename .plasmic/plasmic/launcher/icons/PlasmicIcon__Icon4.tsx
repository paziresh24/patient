/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon4IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon4Icon(props: Icon4IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlSpace={"preserve"}
      x={"0"}
      y={"0"}
      display={"block"}
      preserveAspectRatio={"xMidYMid"}
      shapeRendering={"auto"}
      style={{
        background: '#fff"',

        ...(style || {}),
      }}
      version={"1.1"}
      viewBox={"0 0 100 100"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g className={"ldl-scale"}>
        <g className={"ldl-ani"}>
          <g className={"ldl-layer"}>
            <path
              fill={"#3861fb"}
              d={
                "M50 74.07c-.53 0-1.061-.213-1.451-.638L15.388 47.59H9.472c-1.713 0-2.608 2.036-1.451 3.298l40.528 33.877c.39.425.92.638 1.451.638.53 0 1.061-.213 1.451-.638l40.528-33.877c1.157-1.262.262-3.298-1.451-3.298h-5.916L51.451 73.432c-.39.425-.921.638-1.451.638"
              }
              className={"ldl-ani"}
              opacity={"1"}
              style={{
                animation:
                  "1s linear -.75s infinite normal forwards running animate",
                transformBox: 'view-box"',
              }}
              transform={"scale(.8)"}
            ></path>
          </g>

          <g className={"ldl-layer"}>
            <path
              fill={"#97adff"}
              d={
                "M50 41.077c-.53 0-1.061-.213-1.451-.638L15.388 14.597H9.472c-1.713 0-2.608 2.036-1.451 3.298l40.528 33.877c.39.425.92.638 1.451.638.53 0 1.061-.213 1.451-.638l40.528-33.877c1.157-1.262.262-3.298-1.451-3.298h-5.916L51.451 40.439c-.39.425-.921.638-1.451.638"
              }
              className={"ldl-ani"}
              opacity={"1"}
              style={{
                animation:
                  "1s linear -1s infinite normal forwards running animate",
                transformBox: 'view-box"',
              }}
              transform={"scale(.8)"}
            ></path>
          </g>
        </g>
      </g>
    </svg>
  );
}

export default Icon4Icon;
/* prettier-ignore-end */
