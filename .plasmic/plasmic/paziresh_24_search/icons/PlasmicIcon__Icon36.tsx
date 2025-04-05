/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon36IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon36Icon(props: Icon36IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 24 24"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M4 9.616c0-1.774 0-2.661.32-3.413a4 4 0 01.919-1.325c.591-.564 1.422-.876 3.083-1.499l.869-.326c1.39-.52 2.084-.781 2.809-.781.725 0 1.42.26 2.809.781l.869.326c1.661.623 2.492.935 3.083 1.499a4 4 0 01.918 1.325C20 6.955 20 7.842 20 9.616v1.351c0 1.554 0 2.33-.133 3.05a8 8 0 01-2.466 4.451c-.54.494-1.2.906-2.517 1.73-.738.46-1.107.691-1.485.832a4 4 0 01-2.798 0c-.378-.14-.747-.372-1.485-.833-1.318-.823-1.977-1.235-2.517-1.729a8 8 0 01-2.466-4.45C4 13.298 4 12.52 4 10.968V9.615z"
        }
        fill={"currentColor"}
        fillOpacity={".16"}
      ></path>

      <path
        fillRule={"evenodd"}
        clipRule={"evenodd"}
        d={
          "M9.454 3.756c1.441-.54 1.988-.734 2.546-.734.558 0 1.105.193 2.546.734l.869.325c1.725.647 2.375.907 2.829 1.34.319.304.573.67.745 1.076.247.577.261 1.276.261 3.12v1.35c0 1.583-.003 2.278-.12 2.915a7.25 7.25 0 01-2.236 4.033c-.477.436-1.065.808-2.407 1.646-.766.479-1.06.658-1.35.767a3.25 3.25 0 01-2.273 0c-.291-.109-.585-.288-1.35-.767-1.343-.838-1.93-1.21-2.408-1.646a7.25 7.25 0 01-2.236-4.033c-.117-.637-.12-1.332-.12-2.915v-1.35c0-1.844.015-2.543.26-3.12a3.25 3.25 0 01.747-1.076c.453-.433 1.103-.693 2.829-1.34l.868-.325zM9.06 2.3l-.132.05-.869.326-.164.061c-1.503.563-2.47.926-3.174 1.597a4.75 4.75 0 00-1.09 1.573c-.382.895-.381 1.928-.381 3.533v1.614c0 1.47 0 2.311.145 3.099a8.75 8.75 0 002.698 4.867c.591.541 1.304.986 2.551 1.766l.074.046.072.045c.67.419 1.099.687 1.55.855 1.07.4 2.25.4 3.32 0 .451-.168.88-.436 1.55-.855l.072-.045.074-.046c1.247-.78 1.96-1.225 2.551-1.766a8.75 8.75 0 002.698-4.867c.145-.788.145-1.629.145-3.1V9.442c0-1.605 0-2.638-.38-3.533a4.75 4.75 0 00-1.09-1.573c-.705-.671-1.672-1.034-3.175-1.597l-.164-.061-.869-.326-.132-.05c-1.261-.473-2.077-.779-2.94-.779s-1.678.306-2.94.78zm6.97 7.73a.75.75 0 10-1.06-1.061L11 12.94l-1.47-1.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon36Icon;
/* prettier-ignore-end */
