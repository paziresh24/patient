/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Icon8IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Icon8Icon(props: Icon8IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      viewBox={"0 0 24 24"}
      fill={"none"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "bg-transparent"
      )}
      xmlns={"http://www.w3.org/2000/svg"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M19 21V9c0-2.828 0-4.243-.879-5.121C17.243 3 15.828 3 13 3h-2c-2.828 0-4.243 0-5.121.879C5 4.757 5 6.172 5 9v12l5.015-2.866c.97-.554 1.454-.83 1.985-.83.531 0 1.016.276 1.985.83L19 21z"
        }
        fill={"currentColor"}
        fillOpacity={"1"}
      ></path>

      <path
        fillRule={"evenodd"}
        clipRule={"evenodd"}
        d={
          "M10.945 2.25h2.11c1.367 0 2.47 0 3.337.117.9.12 1.658.38 2.26.981.602.602.86 1.36.982 2.26.116.867.116 1.97.116 3.337V21a.75.75 0 01-1.122.651l-5.015-2.866c-.498-.284-.824-.47-1.092-.59-.252-.113-.398-.142-.521-.142s-.269.03-.521.142c-.268.12-.594.306-1.091.59l-5.016 2.866A.75.75 0 014.25 21V8.945c0-1.367 0-2.47.117-3.337.12-.9.38-1.658.981-2.26.602-.602 1.36-.86 2.26-.981.867-.117 1.97-.117 3.337-.117zM7.808 3.853c-.734.099-1.122.28-1.399.556-.277.277-.457.665-.556 1.4C5.752 6.562 5.75 7.564 5.75 9v10.708l3.893-2.225.03-.017c.46-.263.85-.486 1.192-.64.365-.163.727-.273 1.135-.273.408 0 .77.11 1.135.274.342.153.733.376 1.192.639l.03.017 3.893 2.225V9c0-1.435-.002-2.437-.103-3.192-.099-.734-.28-1.122-.556-1.399-.277-.277-.665-.457-1.4-.556-.754-.101-1.756-.103-3.191-.103h-2c-1.435 0-2.437.002-3.192.103z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default Icon8Icon;
/* prettier-ignore-end */
