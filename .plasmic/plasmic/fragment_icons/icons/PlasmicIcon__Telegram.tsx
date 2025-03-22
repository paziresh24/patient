// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type TelegramIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function TelegramIcon(props: TelegramIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "bi bi-telegram"
      )}
      viewBox={"0 0 16 16"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M16 8A8 8 0 110 8a8 8 0 0116 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 01-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 00-.013-.315.34.34 0 00-.114-.217.53.53 0 00-.31-.093c-.3.005-.763.166-2.984 1.09"
        }
      ></path>
    </svg>
  );
}

export default TelegramIcon;
/* prettier-ignore-end */
