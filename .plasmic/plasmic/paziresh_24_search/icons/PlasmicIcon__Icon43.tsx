/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon43IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon43Icon(props: Icon43IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 24 24"}
      fill={"none"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fillRule={"evenodd"}
        clipRule={"evenodd"}
        d={
          "M20.848 1.879a3 3 0 00-4.243 0L2.447 16.036a3 3 0 00-.82 1.533l-.587 2.936a2 2 0 002.353 2.353l2.936-.587a3 3 0 001.533-.82L22.019 7.293a3 3 0 000-4.243l-1.171-1.17zm-2.829 1.414a1 1 0 011.415 0l1.171 1.171a1 1 0 010 1.415L17.933 8.55l-2.585-2.586 2.671-2.671zm-4.086 4.086L3.862 17.45a1 1 0 00-.274.51l-.587 2.936 2.935-.587a1 1 0 00.511-.274L16.52 9.964 13.933 7.38z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon43Icon;
/* prettier-ignore-end */
