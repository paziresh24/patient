/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon26IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon26Icon(props: Icon26IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "fill-slate-600"
      )}
      viewBox={"0 0 20 17"}
      height={"1em"}
      style={{
        fill: "currentcolor",

        ...(style || {}),
      }}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g clipPath={"url(#clip0_220_745)"}>
        <path
          d={
            "M14.706 17H5.294a.594.594 0 01-.588-.59V1.378A1.39 1.39 0 015.11.406c.257-.258.605-.404.968-.406h7.843c.364.002.712.148.969.406s.402.608.404.973v15.03a.6.6 0 01-.588.591zm-8.824-1.182h8.236V1.378a.197.197 0 00-.197-.196H6.079a.196.196 0 00-.196.197v14.44z"
          }
        ></path>

        <path
          d={
            "M19.02 17h-4.314v-1.182h4.117v-6.53a.197.197 0 00-.196-.197h-3.921V7.877h3.921A1.39 1.39 0 0120 9.256v6.728a.989.989 0 01-.597.938.977.977 0 01-.383.078zM5.294 17H.98a.978.978 0 01-.98-.985V9.288a1.392 1.392 0 01.841-1.3c.168-.072.349-.11.532-.11h3.921v1.181H1.373a.196.196 0 00-.197.197v6.53h4.118V17zm6.369-.59h-1.177v-3.365h-.972v3.364H8.337V12.47a.592.592 0 01.588-.59h2.15a.587.587 0 01.588.59v3.94zm.047-9.399H8.29a.587.587 0 01-.588-.59.592.592 0 01.588-.591h3.42a.587.587 0 01.588.59.592.592 0 01-.588.591z"
          }
        ></path>

        <path
          d={
            "M10 8.728a.587.587 0 01-.588-.59V4.727A.592.592 0 0110 4.136a.587.587 0 01.588.59v3.427a.592.592 0 01-.588.575z"
          }
        ></path>
      </g>
    </svg>
  );
}

export default Icon26Icon;
/* prettier-ignore-end */
