/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LauncherIconsSupportIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function LauncherIconsSupportIcon(props: LauncherIconsSupportIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlnsXlink={"http://www.w3.org/1999/xlink"}
      fill={"none"}
      viewBox={"0 0 64 64"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g clipPath={"url(#a)"}>
        <mask
          id={"b"}
          width={"64"}
          height={"64"}
          x={"0"}
          y={"0"}
          maskUnits={"userSpaceOnUse"}
          style={{
            maskType: 'luminance"',
          }}
        >
          <path fill={"#fff"} d={"M64 0H0v64h64z"}></path>
        </mask>

        <g mask={"url(#b)"}>
          <g filter={"url(#c)"}>
            <path
              stroke={"#475569"}
              strokeLinecap={"round"}
              strokeLinejoin={"round"}
              strokeWidth={"3"}
              d={
                "M21.333 37.333a5.333 5.333 0 0 0-10.666 0v5.334a5.333 5.333 0 0 0 10.666 0z"
              }
            ></path>
          </g>

          <g filter={"url(#d)"}>
            <path
              stroke={"#475569"}
              strokeLinecap={"round"}
              strokeLinejoin={"round"}
              strokeWidth={"3"}
              d={
                "M53.334 37.333a5.333 5.333 0 0 0-10.667 0v5.334a5.333 5.333 0 0 0 10.667 0z"
              }
            ></path>
          </g>

          <g filter={"url(#e)"}>
            <path
              stroke={"#475569"}
              strokeLinecap={"round"}
              strokeLinejoin={"round"}
              strokeWidth={"3"}
              d={"M10.667 37.333v-8a21.334 21.334 0 0 1 42.667 0v8"}
            ></path>
          </g>

          <g filter={"url(#f)"}>
            <path
              stroke={"#475569"}
              strokeLinecap={"round"}
              strokeLinejoin={"round"}
              strokeWidth={"3"}
              d={"M48 48c0 2.122-1.686 4.157-4.686 5.657S36.244 56 32 56"}
            ></path>
          </g>
        </g>
      </g>

      <defs>
        <filter
          id={"c"}
          width={"21.667"}
          height={"27"}
          x={"5.167"}
          y={"30.5"}
          colorInterpolationFilters={"sRGB"}
          filterUnits={"userSpaceOnUse"}
        >
          <feFlood floodOpacity={"0"} result={"BackgroundImageFix"}></feFlood>

          <feColorMatrix
            in={"SourceAlpha"}
            result={"hardAlpha"}
            type={"matrix"}
            values={"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"}
          ></feColorMatrix>

          <feOffset dy={"4"}></feOffset>

          <feGaussianBlur stdDeviation={"2"}></feGaussianBlur>

          <feComposite in2={"hardAlpha"} operator={"out"}></feComposite>

          <feColorMatrix
            type={"matrix"}
            values={"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"}
          ></feColorMatrix>

          <feBlend
            in2={"BackgroundImageFix"}
            mode={"normal"}
            result={"effect1_dropShadow_111_6002"}
          ></feBlend>

          <feBlend
            in={"SourceGraphic"}
            in2={"effect1_dropShadow_111_6002"}
            mode={"normal"}
            result={"shape"}
          ></feBlend>
        </filter>

        <filter
          id={"d"}
          width={"21.667"}
          height={"27"}
          x={"37.167"}
          y={"30.5"}
          colorInterpolationFilters={"sRGB"}
          filterUnits={"userSpaceOnUse"}
        >
          <feFlood floodOpacity={"0"} result={"BackgroundImageFix"}></feFlood>

          <feColorMatrix
            in={"SourceAlpha"}
            result={"hardAlpha"}
            type={"matrix"}
            values={"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"}
          ></feColorMatrix>

          <feOffset dy={"4"}></feOffset>

          <feGaussianBlur stdDeviation={"2"}></feGaussianBlur>

          <feComposite in2={"hardAlpha"} operator={"out"}></feComposite>

          <feColorMatrix
            type={"matrix"}
            values={"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"}
          ></feColorMatrix>

          <feBlend
            in2={"BackgroundImageFix"}
            mode={"normal"}
            result={"effect1_dropShadow_111_6002"}
          ></feBlend>

          <feBlend
            in={"SourceGraphic"}
            in2={"effect1_dropShadow_111_6002"}
            mode={"normal"}
            result={"shape"}
          ></feBlend>
        </filter>

        <filter
          id={"e"}
          width={"53.667"}
          height={"40.333"}
          x={"5.167"}
          y={"6.5"}
          colorInterpolationFilters={"sRGB"}
          filterUnits={"userSpaceOnUse"}
        >
          <feFlood floodOpacity={"0"} result={"BackgroundImageFix"}></feFlood>

          <feColorMatrix
            in={"SourceAlpha"}
            result={"hardAlpha"}
            type={"matrix"}
            values={"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"}
          ></feColorMatrix>

          <feOffset dy={"4"}></feOffset>

          <feGaussianBlur stdDeviation={"2"}></feGaussianBlur>

          <feComposite in2={"hardAlpha"} operator={"out"}></feComposite>

          <feColorMatrix
            type={"matrix"}
            values={"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"}
          ></feColorMatrix>

          <feBlend
            in2={"BackgroundImageFix"}
            mode={"normal"}
            result={"effect1_dropShadow_111_6002"}
          ></feBlend>

          <feBlend
            in={"SourceGraphic"}
            in2={"effect1_dropShadow_111_6002"}
            mode={"normal"}
            result={"shape"}
          ></feBlend>
        </filter>

        <filter
          id={"f"}
          width={"27"}
          height={"19"}
          x={"26.5"}
          y={"46.5"}
          colorInterpolationFilters={"sRGB"}
          filterUnits={"userSpaceOnUse"}
        >
          <feFlood floodOpacity={"0"} result={"BackgroundImageFix"}></feFlood>

          <feColorMatrix
            in={"SourceAlpha"}
            result={"hardAlpha"}
            type={"matrix"}
            values={"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"}
          ></feColorMatrix>

          <feOffset dy={"4"}></feOffset>

          <feGaussianBlur stdDeviation={"2"}></feGaussianBlur>

          <feComposite in2={"hardAlpha"} operator={"out"}></feComposite>

          <feColorMatrix
            type={"matrix"}
            values={"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.16 0"}
          ></feColorMatrix>

          <feBlend
            in2={"BackgroundImageFix"}
            mode={"normal"}
            result={"effect1_dropShadow_111_6002"}
          ></feBlend>

          <feBlend
            in={"SourceGraphic"}
            in2={"effect1_dropShadow_111_6002"}
            mode={"normal"}
            result={"shape"}
          ></feBlend>
        </filter>

        <clipPath id={"a"}>
          <path fill={"#fff"} d={"M0 0h64v64H0z"}></path>
        </clipPath>
      </defs>
    </svg>
  );
}

export default LauncherIconsSupportIcon;
/* prettier-ignore-end */
