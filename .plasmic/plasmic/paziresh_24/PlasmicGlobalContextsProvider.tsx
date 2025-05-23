/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: iDYgiKJB9Yi7CUB81stQBK

import * as React from "react";
import { hasVariant, ensureGlobalVariants } from "@plasmicapp/react-web";
import { AuthGlobalContext } from "@/common/fragment/authGlobalContext"; // plasmic-import: M65oXRA032VP/codeComponent
import { Fragment } from "@/common/fragment/designSystemGlobalContext"; // plasmic-import: uqFwzM_jGhaf/codeComponent
import { GrowthbookGlobalContext } from "@/common/fragment/growthbookGlobalContext"; // plasmic-import: PExaD6WE-TOc/codeComponent
import { Splunk } from "@/common/fragment/splunk"; // plasmic-import: 4nkGdrqDgqHB/codeComponent
import { PWA } from "@/common/fragment/pwa"; // plasmic-import: C45nyjhdGN4U/codeComponent

export interface GlobalContextsProviderProps {
  children?: React.ReactElement;
  authGlobalContextProps?: Partial<
    Omit<React.ComponentProps<typeof AuthGlobalContext>, "children">
  >;

  fragmentProps?: Partial<
    Omit<React.ComponentProps<typeof Fragment>, "children">
  >;

  growthbookGlobalContextProps?: Partial<
    Omit<React.ComponentProps<typeof GrowthbookGlobalContext>, "children">
  >;

  splunkProps?: Partial<Omit<React.ComponentProps<typeof Splunk>, "children">>;
  pwaProps?: Partial<Omit<React.ComponentProps<typeof PWA>, "children">>;
}

export default function GlobalContextsProvider(
  props: GlobalContextsProviderProps
) {
  const {
    children,
    authGlobalContextProps,
    fragmentProps,
    growthbookGlobalContextProps,
    splunkProps,
    pwaProps
  } = props;

  return (
    <AuthGlobalContext
      {...authGlobalContextProps}
      previewToken={
        authGlobalContextProps && "previewToken" in authGlobalContextProps
          ? authGlobalContextProps.previewToken!
          : undefined
      }
    >
      <Fragment
        {...fragmentProps}
        apiConfig={
          fragmentProps && "apiConfig" in fragmentProps
            ? fragmentProps.apiConfig!
            : undefined
        }
        previewApiConfig={
          fragmentProps && "previewApiConfig" in fragmentProps
            ? fragmentProps.previewApiConfig!
            : undefined
        }
      >
        <GrowthbookGlobalContext
          {...growthbookGlobalContextProps}
          apiHost={
            growthbookGlobalContextProps &&
            "apiHost" in growthbookGlobalContextProps
              ? growthbookGlobalContextProps.apiHost!
              : undefined
          }
          clientKey={
            growthbookGlobalContextProps &&
            "clientKey" in growthbookGlobalContextProps
              ? growthbookGlobalContextProps.clientKey!
              : undefined
          }
          previewAttributes={
            growthbookGlobalContextProps &&
            "previewAttributes" in growthbookGlobalContextProps
              ? growthbookGlobalContextProps.previewAttributes!
              : undefined
          }
        >
          <Splunk
            {...splunkProps}
            defaultApiHost={
              splunkProps && "defaultApiHost" in splunkProps
                ? splunkProps.defaultApiHost!
                : undefined
            }
            defaultApiKey={
              splunkProps && "defaultApiKey" in splunkProps
                ? splunkProps.defaultApiKey!
                : undefined
            }
          >
            <PWA {...pwaProps}>{children}</PWA>
          </Splunk>
        </GrowthbookGlobalContext>
      </Fragment>
    </AuthGlobalContext>
  );
}
