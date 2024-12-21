// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: h9Dbk9ygddw7UVEq1NNhKi

import * as React from "react";
import { hasVariant, ensureGlobalVariants } from "@plasmicapp/react-web";
import { EmbedCss } from "@plasmicpkgs/plasmic-embed-css";

export interface GlobalContextsProviderProps {
  children?: React.ReactElement;
  embedCssProps?: Partial<
    Omit<React.ComponentProps<typeof EmbedCss>, "children">
  >;
}

export default function GlobalContextsProvider(
  props: GlobalContextsProviderProps
) {
  const { children, embedCssProps } = props;

  return (
    <EmbedCss
      {...embedCssProps}
      css={
        embedCssProps && "css" in embedCssProps
          ? embedCssProps.css!
          : ".pl__z-50{\r\n  z-index: 9999 !important;\r\n}"
      }
    >
      {children}
    </EmbedCss>
  );
}
