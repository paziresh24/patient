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
      viewBox={"0 0 24 24"}
      fill={"none"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M11.27 4.411c.23-.52.346-.779.508-.859a.5.5 0 01.444 0c.161.08.277.34.508.86l1.845 4.136c.068.154.102.23.155.29a.5.5 0 00.168.121c.072.032.156.041.323.059l4.505.475c.565.06.848.09.974.218a.5.5 0 01.137.423c-.026.178-.237.368-.66.75l-3.364 3.031c-.125.113-.188.17-.227.238a.5.5 0 00-.064.197c-.009.079.009.161.044.326l.94 4.43c.117.557.176.835.093.994a.5.5 0 01-.36.261c-.177.03-.423-.111-.916-.396l-3.924-2.263c-.145-.084-.218-.126-.295-.142a.502.502 0 00-.208 0c-.078.017-.15.058-.296.142l-3.923 2.263c-.493.285-.74.427-.917.396a.5.5 0 01-.36-.26c-.083-.16-.024-.438.094-.995l.94-4.43c.035-.165.052-.247.044-.326a.5.5 0 00-.064-.197c-.04-.069-.102-.125-.227-.238l-3.365-3.032c-.422-.38-.633-.57-.66-.749a.5.5 0 01.138-.423c.126-.128.409-.158.974-.218l4.504-.475c.168-.018.251-.027.323-.059a.5.5 0 00.168-.122c.053-.059.088-.135.156-.289l1.844-4.137z"
        }
        stroke={"currentColor"}
        strokeWidth={"2"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>
    </svg>
  );
}

export default Icon2Icon;
/* prettier-ignore-end */
