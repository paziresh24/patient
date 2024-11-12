// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m

import * as React from "react";
import { hasVariant, ensureGlobalVariants } from "@plasmicapp/react-web";
import { AuthGlobalContext } from "@/common/fragment/authGlobalContext"; // plasmic-import: qyJQby9Pzcoc/codeComponent
import { Fragment } from "@/common/fragment/designSystemGlobalContext"; // plasmic-import: 3GeFj3s3tzRm/codeComponent
import { GrowthbookGlobalContext } from "@/common/fragment/growthbookGlobalContext"; // plasmic-import: p_3q3KAjUnHO/codeComponent
import { AntdConfigProvider } from "@plasmicpkgs/antd5/skinny/registerConfigProvider";
import { Splunk } from "@/common/fragment/splunk"; // plasmic-import: wuGBHXYibkGk/codeComponent
import { PWA } from "@/common/fragment/pwa"; // plasmic-import: -ndasJXDpxzQ/codeComponent

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

  antdConfigProviderProps?: Partial<
    Omit<React.ComponentProps<typeof AntdConfigProvider>, "children">
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
    antdConfigProviderProps,
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
              : "https://growthbook-api.paziresh24.com"
          }
          clientKey={
            growthbookGlobalContextProps &&
            "clientKey" in growthbookGlobalContextProps
              ? growthbookGlobalContextProps.clientKey!
              : "sdk-St1dBftdp07geqtD"
          }
          previewAttributes={
            growthbookGlobalContextProps &&
            "previewAttributes" in growthbookGlobalContextProps
              ? growthbookGlobalContextProps.previewAttributes!
              : undefined
          }
        >
          <AntdConfigProvider
            {...antdConfigProviderProps}
            borderRadius={
              antdConfigProviderProps &&
              "borderRadius" in antdConfigProviderProps
                ? antdConfigProviderProps.borderRadius!
                : 6
            }
            colorBgBase={
              antdConfigProviderProps &&
              "colorBgBase" in antdConfigProviderProps
                ? antdConfigProviderProps.colorBgBase!
                : "#ffffff"
            }
            colorError={
              antdConfigProviderProps && "colorError" in antdConfigProviderProps
                ? antdConfigProviderProps.colorError!
                : "#ff4d4f"
            }
            colorInfo={
              antdConfigProviderProps && "colorInfo" in antdConfigProviderProps
                ? antdConfigProviderProps.colorInfo!
                : "#1677ff"
            }
            colorPrimary={
              antdConfigProviderProps &&
              "colorPrimary" in antdConfigProviderProps
                ? antdConfigProviderProps.colorPrimary!
                : "#1677ff"
            }
            colorSuccess={
              antdConfigProviderProps &&
              "colorSuccess" in antdConfigProviderProps
                ? antdConfigProviderProps.colorSuccess!
                : "#52c41a"
            }
            colorWarning={
              antdConfigProviderProps &&
              "colorWarning" in antdConfigProviderProps
                ? antdConfigProviderProps.colorWarning!
                : "#faad14"
            }
            controlHeight={
              antdConfigProviderProps &&
              "controlHeight" in antdConfigProviderProps
                ? antdConfigProviderProps.controlHeight!
                : 32
            }
            defaultDark={
              antdConfigProviderProps &&
              "defaultDark" in antdConfigProviderProps
                ? antdConfigProviderProps.defaultDark!
                : false
            }
            lineWidth={
              antdConfigProviderProps && "lineWidth" in antdConfigProviderProps
                ? antdConfigProviderProps.lineWidth!
                : 1
            }
            loadingText={
              antdConfigProviderProps &&
              "loadingText" in antdConfigProviderProps
                ? antdConfigProviderProps.loadingText!
                : undefined
            }
            removeLoading={
              antdConfigProviderProps &&
              "removeLoading" in antdConfigProviderProps
                ? antdConfigProviderProps.removeLoading!
                : true
            }
            sizeStep={
              antdConfigProviderProps && "sizeStep" in antdConfigProviderProps
                ? antdConfigProviderProps.sizeStep!
                : 4
            }
            sizeUnit={
              antdConfigProviderProps && "sizeUnit" in antdConfigProviderProps
                ? antdConfigProviderProps.sizeUnit!
                : 4
            }
            themeStyles={
              antdConfigProviderProps &&
              "themeStyles" in antdConfigProviderProps
                ? antdConfigProviderProps.themeStyles!
                : true
                ? {
                    fontFamily: "initial",
                    fontSize: "1rem",
                    fontWeight: "400",
                    lineHeight: "1.5",
                    color: "#2B2F33",
                    letterSpacing: "normal"
                  }
                : undefined
            }
            wireframe={
              antdConfigProviderProps && "wireframe" in antdConfigProviderProps
                ? antdConfigProviderProps.wireframe!
                : false
            }
          >
            <Splunk
              {...splunkProps}
              defaultApiHost={
                splunkProps && "defaultApiHost" in splunkProps
                  ? splunkProps.defaultApiHost!
                  : "https://rokhdad-splunk-hec.paziresh24.com"
              }
              defaultApiKey={
                splunkProps && "defaultApiKey" in splunkProps
                  ? splunkProps.defaultApiKey!
                  : "1e490c2c-d98b-4777-816d-cf7f09b21888"
              }
            >
              <PWA {...pwaProps}>{children}</PWA>
            </Splunk>
          </AntdConfigProvider>
        </GrowthbookGlobalContext>
      </Fragment>
    </AuthGlobalContext>
  );
}
