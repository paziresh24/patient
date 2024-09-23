// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: YHypsyWp2tOf

import * as React from "react";

import Head from "next/head";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";

import {
  Flex as Flex__,
  MultiChoiceArg,
  PlasmicDataSourceContextProvider as PlasmicDataSourceContextProvider__,
  PlasmicIcon as PlasmicIcon__,
  PlasmicImg as PlasmicImg__,
  PlasmicLink as PlasmicLink__,
  PlasmicPageGuard as PlasmicPageGuard__,
  SingleBooleanChoiceArg,
  SingleChoiceArg,
  Stack as Stack__,
  StrictProps,
  Trans as Trans__,
  classNames,
  createPlasmicElementProxy,
  deriveRenderOpts,
  ensureGlobalVariants,
  generateOnMutateForSpec,
  generateStateOnChangeProp,
  generateStateOnChangePropForCodeComponents,
  generateStateValueProp,
  get as $stateGet,
  hasVariant,
  initializeCodeComponentStates,
  initializePlasmicStates,
  makeFragment,
  omit,
  pick,
  renderPlasmicSlot,
  set as $stateSet,
  useCurrentUser,
  useDollarState,
  usePlasmicTranslator,
  useTrigger,
  wrapWithClassName
} from "@plasmicapp/react-web";
import {
  DataCtxReader as DataCtxReader__,
  useDataEnv,
  useGlobalActions
} from "@plasmicapp/react-web/lib/host";

import { SideEffect } from "@plasmicpkgs/plasmic-basic-components";

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import plasmic_plasmic_rich_components_css from "../plasmic_rich_components/plasmic.module.css"; // plasmic-import: jkU633o1Cz7HrJdwdxhVHk/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicExternalBookSurveyPopup.module.css"; // plasmic-import: YHypsyWp2tOf/css

createPlasmicElementProxy;

export type PlasmicExternalBookSurveyPopup__VariantMembers = {};
export type PlasmicExternalBookSurveyPopup__VariantsArgs = {};
type VariantPropType = keyof PlasmicExternalBookSurveyPopup__VariantsArgs;
export const PlasmicExternalBookSurveyPopup__VariantProps =
  new Array<VariantPropType>();

export type PlasmicExternalBookSurveyPopup__ArgsType = {};
type ArgPropType = keyof PlasmicExternalBookSurveyPopup__ArgsType;
export const PlasmicExternalBookSurveyPopup__ArgProps =
  new Array<ArgPropType>();

export type PlasmicExternalBookSurveyPopup__OverridesType = {
  root?: Flex__<"div">;
  showSurveyPopupRemoveCookie?: Flex__<typeof SideEffect>;
};

export interface DefaultExternalBookSurveyPopupProps {
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicExternalBookSurveyPopup__RenderFunc(props: {
  variants: PlasmicExternalBookSurveyPopup__VariantsArgs;
  args: PlasmicExternalBookSurveyPopup__ArgsType;
  overrides: PlasmicExternalBookSurveyPopup__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {},
        Object.fromEntries(
          Object.entries(props.args).filter(([_, v]) => v !== undefined)
        )
      ),
    [props.args]
  );

  const $props = {
    ...args,
    ...variants
  };

  const __nextRouter = useNextRouter();
  const $ctx = useDataEnv?.() || {};
  const refsRef = React.useRef({});
  const $refs = refsRef.current;

  const $globalActions = useGlobalActions?.();

  return (
    <div
      data-plasmic-name={"root"}
      data-plasmic-override={overrides.root}
      data-plasmic-root={true}
      data-plasmic-for-node={forNode}
      className={classNames(
        projectcss.all,
        projectcss.root_reset,
        projectcss.plasmic_default_styles,
        projectcss.plasmic_mixins,
        projectcss.plasmic_tokens,
        plasmic_fragment_design_system_css.plasmic_tokens,
        plasmic_antd_5_hostless_css.plasmic_tokens,
        plasmic_plasmic_rich_components_css.plasmic_tokens,
        sty.root
      )}
    >
      <SideEffect
        data-plasmic-name={"showSurveyPopupRemoveCookie"}
        data-plasmic-override={overrides.showSurveyPopupRemoveCookie}
        className={classNames(
          "__wab_instance",
          sty.showSurveyPopupRemoveCookie
        )}
        onMount={async () => {
          const $steps = {};

          $steps["showSurveyPopup"] = document.cookie.includes("transitionData")
            ? (() => {
                const actionArgs = {
                  customFunction: async () => {
                    return (() => {
                      return (function () {
                        var createFullScreenPopup = function (url) {
                          var overlay = document.createElement("div");
                          overlay.id = "fullscreen-overlay";
                          overlay.style.position = "fixed";
                          overlay.style.top = "0";
                          overlay.style.left = "0";
                          overlay.style.width = "100%";
                          overlay.style.height = "100%";
                          overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
                          overlay.style.zIndex = "9999";
                          overlay.style.display = "flex";
                          overlay.style.justifyContent = "center";
                          overlay.style.alignItems = "center";
                          var iframe = document.createElement("iframe");
                          iframe.src = url;
                          iframe.style.width = "95%";
                          iframe.style.height = "95%";
                          iframe.style.border = "none";
                          iframe.style.borderRadius = "5px";
                          iframe.style.boxShadow =
                            "0 0 10px rgba(0, 0, 0, 0.5)";
                          iframe.style.zIndex = "10000";
                          var closeButton = document.createElement("div");
                          closeButton.textContent = "[X]";
                          closeButton.style.position = "fixed";
                          closeButton.style.top = "20px";
                          closeButton.style.right = "30px";
                          closeButton.style.fontSize = "24px";
                          closeButton.style.color = "#333";
                          closeButton.style.cursor = "pointer";
                          closeButton.style.zIndex = "10001";
                          closeButton.onclick = function () {
                            document.body.removeChild(overlay);
                          };
                          var closeTextButton =
                            document.createElement("button");
                          closeTextButton.textContent = "بستن";
                          closeTextButton.style.position = "fixed";
                          closeTextButton.style.bottom = "20px";
                          closeTextButton.style.left = "30px";
                          closeTextButton.style.fontSize = "14px";
                          closeTextButton.style.padding = "10px 20px";
                          closeTextButton.style.backgroundColor = "#ddd";
                          closeTextButton.style.color = "#000";
                          closeTextButton.style.border = "none";
                          closeTextButton.style.borderRadius = "5px";
                          closeTextButton.style.cursor = "pointer";
                          closeTextButton.style.zIndex = "10001";
                          closeTextButton.onclick = function () {
                            document.body.removeChild(overlay);
                          };
                          overlay.appendChild(iframe);
                          overlay.appendChild(closeButton);
                          overlay.appendChild(closeTextButton);
                          document.body.appendChild(overlay);
                        };
                        var getTransitionData = function () {
                          var name = "transitionData=";
                          var decodedCookie = decodeURIComponent(
                            document.cookie
                          );
                          var ca = decodedCookie.split(";");
                          for (var i = 0; i < ca.length; i++) {
                            var c = ca[i];
                            while (c.charAt(0) == " ") {
                              c = c.substring(1);
                            }
                            if (c.indexOf(name) == 0) {
                              return JSON.parse(
                                c.substring(name.length, c.length)
                              );
                            }
                          }
                          return null;
                        };
                        var transitionData = getTransitionData();
                        if (transitionData) {
                          var terminalId = encodeURIComponent(
                            transitionData.terminalId || ""
                          );
                          var siteTitle = encodeURIComponent(
                            transitionData.destinationHost || ""
                          );
                          var drName = encodeURIComponent(
                            transitionData.destinationDoctorName || ""
                          );
                          var surveyURL = `https://survey.porsline.ir/s/CA0z9O8?ac=0&ns=1&terminal-id=${terminalId}&site-title=${siteTitle}&dr-name=${drName}`;
                          createFullScreenPopup(surveyURL);
                        } else {
                          console.error("transitionData cookie not found.");
                        }
                      })();
                    })();
                  }
                };
                return (({ customFunction }) => {
                  return customFunction();
                })?.apply(null, [actionArgs]);
              })()
            : undefined;
          if (
            $steps["showSurveyPopup"] != null &&
            typeof $steps["showSurveyPopup"] === "object" &&
            typeof $steps["showSurveyPopup"].then === "function"
          ) {
            $steps["showSurveyPopup"] = await $steps["showSurveyPopup"];
          }

          $steps["removeTheTransitionDataCookie"] = true
            ? (() => {
                const actionArgs = {
                  customFunction: async () => {
                    return (() => {
                      return (document.cookie =
                        "transitionData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.paziresh24.com; path=/");
                    })();
                  }
                };
                return (({ customFunction }) => {
                  return customFunction();
                })?.apply(null, [actionArgs]);
              })()
            : undefined;
          if (
            $steps["removeTheTransitionDataCookie"] != null &&
            typeof $steps["removeTheTransitionDataCookie"] === "object" &&
            typeof $steps["removeTheTransitionDataCookie"].then === "function"
          ) {
            $steps["removeTheTransitionDataCookie"] = await $steps[
              "removeTheTransitionDataCookie"
            ];
          }

          $steps["sendSplunkEvent"] = true
            ? (() => {
                const actionArgs = {
                  args: [
                    "POST",
                    "https://rokhdad-splunk-hec.paziresh24.com/services/collector",
                    undefined,
                    (() => {
                      try {
                        return {
                          sourcetype: "_json",
                          event: {
                            event_group: "search_metrics",
                            event_type: "external_book_survey",
                            current_url: window.location.href,
                            terminal_id: window.document.cookie
                              ?.split("; ")
                              ?.find?.(row => row.startsWith("terminal_id="))
                              ?.split?.("=")?.[1]
                          }
                        };
                      } catch (e) {
                        if (
                          e instanceof TypeError ||
                          e?.plasmicType === "PlasmicUndefinedDataError"
                        ) {
                          return {
                            sourcetype: "_json",
                            event: {
                              event_group: "search_metrics",
                              event_type: "external_book_survey"
                            }
                          };
                        }
                        throw e;
                      }
                    })(),
                    {
                      headers: {
                        Authorization:
                          "Splunk 9da1ff03-1642-4f63-aba2-2ea5e033f06d"
                      }
                    }
                  ]
                };
                return $globalActions["Fragment.apiRequest"]?.apply(null, [
                  ...actionArgs.args
                ]);
              })()
            : undefined;
          if (
            $steps["sendSplunkEvent"] != null &&
            typeof $steps["sendSplunkEvent"] === "object" &&
            typeof $steps["sendSplunkEvent"].then === "function"
          ) {
            $steps["sendSplunkEvent"] = await $steps["sendSplunkEvent"];
          }
        }}
      />
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "showSurveyPopupRemoveCookie"],
  showSurveyPopupRemoveCookie: ["showSurveyPopupRemoveCookie"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  showSurveyPopupRemoveCookie: typeof SideEffect;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicExternalBookSurveyPopup__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicExternalBookSurveyPopup__VariantsArgs;
    args?: PlasmicExternalBookSurveyPopup__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicExternalBookSurveyPopup__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicExternalBookSurveyPopup__ArgsType,
      ReservedPropsType
    > &
    /* Specify overrides for each element directly as props*/ Omit<
      NodeOverridesType<T>,
      ReservedPropsType | VariantPropType | ArgPropType
    > &
    /* Specify props for the root element*/ Omit<
      Partial<React.ComponentProps<NodeDefaultElementType[T]>>,
      ReservedPropsType | VariantPropType | ArgPropType | DescendantsType<T>
    >;

function makeNodeComponent<NodeName extends NodeNameType>(nodeName: NodeName) {
  type PropsType = NodeComponentProps<NodeName> & { key?: React.Key };
  const func = function <T extends PropsType>(
    props: T & StrictProps<T, PropsType>
  ) {
    const { variants, args, overrides } = React.useMemo(
      () =>
        deriveRenderOpts(props, {
          name: nodeName,
          descendantNames: PlasmicDescendants[nodeName],
          internalArgPropNames: PlasmicExternalBookSurveyPopup__ArgProps,
          internalVariantPropNames: PlasmicExternalBookSurveyPopup__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicExternalBookSurveyPopup__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicExternalBookSurveyPopup";
  } else {
    func.displayName = `PlasmicExternalBookSurveyPopup.${nodeName}`;
  }
  return func;
}

export const PlasmicExternalBookSurveyPopup = Object.assign(
  // Top-level PlasmicExternalBookSurveyPopup renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    showSurveyPopupRemoveCookie: makeNodeComponent(
      "showSurveyPopupRemoveCookie"
    ),

    // Metadata about props expected for PlasmicExternalBookSurveyPopup
    internalVariantProps: PlasmicExternalBookSurveyPopup__VariantProps,
    internalArgProps: PlasmicExternalBookSurveyPopup__ArgProps
  }
);

export default PlasmicExternalBookSurveyPopup;
/* prettier-ignore-end */
