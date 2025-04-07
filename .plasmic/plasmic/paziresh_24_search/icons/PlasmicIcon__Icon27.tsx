/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon27IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon27Icon(props: Icon27IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 23 21"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M7.814 6.92c.38-1.14 1.991-1.14 2.372 0l.04.117a2.75 2.75 0 001.737 1.738l.118.04c1.139.38 1.139 1.99 0 2.37l-.118.04a2.75 2.75 0 00-1.738 1.738l-.04.118c-.38 1.139-1.99 1.139-2.37 0l-.04-.118a2.75 2.75 0 00-1.738-1.738l-.118-.04c-1.139-.38-1.139-1.99 0-2.37l.118-.04a2.75 2.75 0 001.738-1.738l.04-.118z"
        }
        stroke={"currentColor"}
        strokeWidth={"1.5"}
      ></path>

      <path
        d={
          "M16.054 2.76c.309-.901 1.583-.901 1.892 0l.172.5a1 1 0 00.621.622l.501.172c.901.309.901 1.583 0 1.892l-.5.172a1 1 0 00-.622.621l-.172.501c-.309.901-1.583.901-1.892 0l-.172-.5a1 1 0 00-.621-.622l-.501-.172c-.901-.309-.901-1.583 0-1.892l.5-.172a1 1 0 00.622-.621l.172-.501zm.143 10c.309-.901 1.583-.901 1.892 0l.208.607a1 1 0 00.622.622l.607.208c.9.309.9 1.583 0 1.892l-.607.208a1 1 0 00-.622.622l-.208.607c-.309.9-1.583.9-1.892 0l-.208-.607a1 1 0 00-.622-.622l-.607-.208c-.901-.309-.901-1.583 0-1.892l.607-.208a1 1 0 00.622-.622l.208-.607z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon27Icon;
/* prettier-ignore-end */
