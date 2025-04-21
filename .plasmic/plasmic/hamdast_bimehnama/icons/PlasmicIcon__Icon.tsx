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
      viewBox={"0 0 16 17"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g clipPath={"url(#jkzyyHmxd37La)"}>
        <path
          fillRule={"evenodd"}
          clipRule={"evenodd"}
          d={
            "M5.83 3.199c-1.097.42-1.88 1.148-2.45 1.947-.476.669-.756 1.071-.88 1.427-.099.284-.1.545.113.958.103.2.215.327.338.417.126.092.292.166.53.221.326.075.73.103 1.261.114.05-1.645.3-3.157.739-4.315.1-.265.216-.525.35-.769zM8 2.823c-.421 0-.95.392-1.397 1.57-.376.992-.612 2.353-.66 3.896h4.116c-.046-1.685-.283-3.056-.66-4.014-.432-1.1-.95-1.452-1.399-1.452zm3.259 5.46c-.046-1.78-.296-3.31-.742-4.446a5.832 5.832 0 00-.28-.612c1.062.424 1.825 1.138 2.383 1.921.476.669.756 1.071.88 1.427.098.284.1.545-.113.958a1.14 1.14 0 01-.338.417 1.412 1.412 0 01-.53.221c-.326.075-.73.103-1.26.114zm-.574 1.206c.822-.002 1.53-.019 2.102-.15.351-.081.68-.21.97-.423a2.33 2.33 0 00.697-.836c.346-.67.398-1.272.18-1.9-.188-.539-.574-1.081-.995-1.672l-.042-.058C12.523 2.94 10.768 1.623 8 1.623c-2.768 0-4.523 1.318-5.597 2.827l-.042.058c-.42.59-.807 1.133-.994 1.671-.219.629-.167 1.23.18 1.901.175.342.402.622.696.836.29.213.619.342.97.422.571.132 1.28.149 2.102.15l.018.001H7.4v4.734a.733.733 0 01-1.467 0v-.667a.6.6 0 10-1.2 0v.667a1.933 1.933 0 003.867 0V9.489h2.085z"
          }
          fill={"#525C76"}
        ></path>
      </g>

      <defs>
        <clipPath id={"jkzyyHmxd37La"}>
          <path
            fill={"#fff"}
            transform={"translate(0 .89)"}
            d={"M0 0h16v16H0z"}
          ></path>
        </clipPath>
      </defs>
    </svg>
  );
}

export default IconIcon;
/* prettier-ignore-end */
