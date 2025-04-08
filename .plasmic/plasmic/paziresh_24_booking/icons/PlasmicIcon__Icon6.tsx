/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon6IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon6Icon(props: Icon6IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      fill={"none"}
      xmlns={"http://www.w3.org/2000/svg"}
      viewBox={"0 0 12 20"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M5.654 3.98c1.114 0 2.016-.86 2.016-1.92S6.768.14 5.654.14C4.54.14 3.638 1 3.638 2.06s.902 1.92 2.016 1.92z"
        }
        fill={"currentColor"}
      ></path>

      <path
        d={
          "M11.202 8.296c-1.66-.916-3.023-2.152-4.17-3.607-.72-.965-2.625-.915-3.4-.03C2.456 5.75 1.457 6.875.664 8a.975.975 0 00.289 1.393c.18.116.383.17.585.17.34 0 .674-.155.877-.445.348-.493.743-.988 1.18-1.481-.017 1.043.038 2.925.066 3.771.009.282-.059.557-.196.807-1.087 1.977-1.782 3.848-2.488 6.136-.173.559.163 1.145.75 1.309.132.037.266.05.396.04.446-.032.845-.322.978-.754.652-2.11 1.28-3.819 2.262-5.628.05.002.1.002.15 0l1.882 5.343c.456 1.298 2.57.624 2.113-.674a6270.48 6270.48 0 01-2.054-5.84 5.189 5.189 0 01-.15-.691 34.474 34.474 0 01-.141-3.592 16.73 16.73 0 003.214 2.293c1.182.653 1.992-1.218.826-1.861z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon6Icon;
/* prettier-ignore-end */
