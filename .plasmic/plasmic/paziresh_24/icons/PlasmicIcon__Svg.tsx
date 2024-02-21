// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type SvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function SvgIcon(props: SvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 17 17"}
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
          "M12.155 3.473a.885.885 0 011.19 0c.014.012.031.03.092.09l.09.091a.886.886 0 010 1.192l-.09.09-.572.572a1.348 1.348 0 01-1.373-1.373l.571-.572.091-.09zM10.59 5.035L5.027 10.6c-.571.572-.784.79-.93 1.049-.146.258-.225.553-.42 1.337l-.114.452.452-.113c.784-.196 1.08-.275 1.337-.42.258-.147.477-.36 1.049-.931l5.564-5.564a2.429 2.429 0 01-1.374-1.374zm3.47-2.348a1.948 1.948 0 00-2.74.116l-.01.009-7.035 7.036-.052.052c-.502.502-.826.825-1.052 1.224-.226.399-.337.843-.509 1.532l-.017.071-.328 1.31a.531.531 0 00.644.645l1.31-.328.072-.018c.689-.171 1.133-.283 1.532-.508.399-.226.723-.55 1.224-1.052l.052-.052 7.036-7.036.01-.009c.047-.048.084-.084.115-.119a1.948 1.948 0 00-.116-2.74l-.009-.008-.009-.009a3.521 3.521 0 00-.119-.116z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default SvgIcon;
/* prettier-ignore-end */
