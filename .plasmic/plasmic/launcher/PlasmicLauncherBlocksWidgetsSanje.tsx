/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: grxNYctbMek6PL66cujx3u
// Component: p_ncR6UWroPY

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

import { ApiRequest } from "@/common/fragment/components/api-request"; // plasmic-import: IpxudV5ARc89/codeComponent

import "@plasmicapp/react-web/lib/plasmic.css";

import projectcss from "./plasmic.module.css"; // plasmic-import: grxNYctbMek6PL66cujx3u/projectcss
import sty from "./PlasmicLauncherBlocksWidgetsSanje.module.css"; // plasmic-import: p_ncR6UWroPY/css

import LauncherIconsLoaderIcon from "./icons/PlasmicIcon__LauncherIconsLoader"; // plasmic-import: 4lP5I8e4Rz71/icon
import launcherImagePerformanceOkCsAiGiEdj from "./images/launcherImagePerformance.png"; // plasmic-import: ok_csAiGiEdj/picture

createPlasmicElementProxy;

export type PlasmicLauncherBlocksWidgetsSanje__VariantMembers = {};
export type PlasmicLauncherBlocksWidgetsSanje__VariantsArgs = {};
type VariantPropType = keyof PlasmicLauncherBlocksWidgetsSanje__VariantsArgs;
export const PlasmicLauncherBlocksWidgetsSanje__VariantProps =
  new Array<VariantPropType>();

export type PlasmicLauncherBlocksWidgetsSanje__ArgsType = {};
type ArgPropType = keyof PlasmicLauncherBlocksWidgetsSanje__ArgsType;
export const PlasmicLauncherBlocksWidgetsSanje__ArgProps =
  new Array<ArgPropType>();

export type PlasmicLauncherBlocksWidgetsSanje__OverridesType = {
  root?: Flex__<"div">;
  apiRequest?: Flex__<typeof ApiRequest>;
  span?: Flex__<"span">;
  img?: Flex__<typeof PlasmicImg__>;
};

export interface DefaultLauncherBlocksWidgetsSanjeProps {
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicLauncherBlocksWidgetsSanje__RenderFunc(props: {
  variants: PlasmicLauncherBlocksWidgetsSanje__VariantsArgs;
  args: PlasmicLauncherBlocksWidgetsSanje__ArgsType;
  overrides: PlasmicLauncherBlocksWidgetsSanje__OverridesType;
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

  const stateSpecs: Parameters<typeof useDollarState>[0] = React.useMemo(
    () => [
      {
        path: "apiRequest.data",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "apiRequest.error",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "apiRequest.loading",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      }
    ],
    [$props, $ctx, $refs]
  );
  const $state = useDollarState(stateSpecs, {
    $props,
    $ctx,
    $queries: {},
    $refs
  });

  return (
    <Stack__
      as={"div"}
      data-plasmic-name={"root"}
      data-plasmic-override={overrides.root}
      data-plasmic-root={true}
      data-plasmic-for-node={forNode}
      hasGap={true}
      className={classNames(
        projectcss.all,
        projectcss.root_reset,
        projectcss.plasmic_default_styles,
        projectcss.plasmic_mixins,
        projectcss.plasmic_tokens,
        sty.root
      )}
      onClick={async event => {
        const $steps = {};

        $steps["goToDashboardAppsSanjeMyPerformance"] = true
          ? (() => {
              const actionArgs = {
                destination: "/dashboard/apps/sanje/my-performance/"
              };
              return (({ destination }) => {
                if (
                  typeof destination === "string" &&
                  destination.startsWith("#")
                ) {
                  document
                    .getElementById(destination.substr(1))
                    .scrollIntoView({ behavior: "smooth" });
                } else {
                  __nextRouter?.push(destination);
                }
              })?.apply(null, [actionArgs]);
            })()
          : undefined;
        if (
          $steps["goToDashboardAppsSanjeMyPerformance"] != null &&
          typeof $steps["goToDashboardAppsSanjeMyPerformance"] === "object" &&
          typeof $steps["goToDashboardAppsSanjeMyPerformance"].then ===
            "function"
        ) {
          $steps["goToDashboardAppsSanjeMyPerformance"] = await $steps[
            "goToDashboardAppsSanjeMyPerformance"
          ];
        }
      }}
    >
      <ApiRequest
        data-plasmic-name={"apiRequest"}
        data-plasmic-override={overrides.apiRequest}
        className={classNames("__wab_instance", sty.apiRequest)}
        errorDisplay={
          <LauncherIconsLoaderIcon
            className={classNames(projectcss.all, sty.svg___5Xek1)}
            role={"img"}
          />
        }
        loadingDisplay={
          <LauncherIconsLoaderIcon
            className={classNames(projectcss.all, sty.svg__suKw8)}
            role={"img"}
          />
        }
        method={"GET"}
        onError={async (...eventArgs: any) => {
          generateStateOnChangeProp($state, ["apiRequest", "error"]).apply(
            null,
            eventArgs
          );
        }}
        onLoading={async (...eventArgs: any) => {
          generateStateOnChangeProp($state, ["apiRequest", "loading"]).apply(
            null,
            eventArgs
          );
        }}
        onSuccess={async (...eventArgs: any) => {
          generateStateOnChangeProp($state, ["apiRequest", "data"]).apply(
            null,
            eventArgs
          );
        }}
        url={
          "https://apigw.paziresh24.com/v1/n8n-search/webhook/growth-opportunities"
        }
      >
        {(() => {
          try {
            return !!$state.apiRequest.data?.final_score;
          } catch (e) {
            if (
              e instanceof TypeError ||
              e?.plasmicType === "PlasmicUndefinedDataError"
            ) {
              return true;
            }
            throw e;
          }
        })() ? (
          <Stack__
            as={"div"}
            hasGap={true}
            className={classNames(projectcss.all, sty.freeBox__hIhKh)}
          >
            <div className={classNames(projectcss.all, sty.freeBox__sgOar)}>
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__vnxRa
                )}
              >
                <React.Fragment>
                  <React.Fragment>{""}</React.Fragment>
                  {
                    <span
                      data-plasmic-name={"span"}
                      data-plasmic-override={overrides.span}
                      className={classNames(
                        projectcss.all,
                        projectcss.span,
                        projectcss.__wab_text,
                        projectcss.plasmic_default__inline,
                        sty.span
                      )}
                    >
                      <React.Fragment>
                        {(() => {
                          try {
                            return $state.apiRequest.data?.final_score ?? 0;
                          } catch (e) {
                            if (
                              e instanceof TypeError ||
                              e?.plasmicType === "PlasmicUndefinedDataError"
                            ) {
                              return "0";
                            }
                            throw e;
                          }
                        })()}
                      </React.Fragment>
                    </span>
                  }
                  <React.Fragment>
                    {" \u0627\u0632 \u06f1\u06f0\u06f0"}
                  </React.Fragment>
                </React.Fragment>
              </div>
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text___31Mxf
                )}
              >
                {
                  "\u0627\u0645\u062a\u06cc\u0627\u0632 \u0639\u0645\u0644\u06a9\u0631\u062f \u0634\u0645\u0627"
                }
              </div>
            </div>
            <div
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text__vy3Zp
              )}
            >
              {
                "\u0628\u0631\u0627\u06cc \u0631\u0634\u062f \u0631\u062a\u0628\u0647 \u0648 \u0627\u0641\u0632\u0627\u06cc\u0634 \u0645\u0631\u0627\u062c\u0639\u06cc\u0646 \u06a9\u0644\u06cc\u06a9 \u06a9\u0646\u06cc\u062f."
              }
            </div>
            <PlasmicImg__
              data-plasmic-name={"img"}
              data-plasmic-override={overrides.img}
              alt={""}
              className={classNames(sty.img)}
              displayHeight={"auto"}
              displayMaxHeight={"none"}
              displayMaxWidth={"100%"}
              displayMinHeight={"0"}
              displayMinWidth={"0"}
              displayWidth={"46px"}
              loading={"lazy"}
              src={{
                src: launcherImagePerformanceOkCsAiGiEdj,
                fullWidth: 73,
                fullHeight: 73,
                aspectRatio: undefined
              }}
            />
          </Stack__>
        ) : null}
        {(() => {
          try {
            return !$state.apiRequest.data?.final_score;
          } catch (e) {
            if (
              e instanceof TypeError ||
              e?.plasmicType === "PlasmicUndefinedDataError"
            ) {
              return true;
            }
            throw e;
          }
        })() ? (
          <LauncherIconsLoaderIcon
            className={classNames(projectcss.all, sty.svg__zYtC3)}
            role={"img"}
          />
        ) : null}
      </ApiRequest>
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "apiRequest", "span", "img"],
  apiRequest: ["apiRequest", "span", "img"],
  span: ["span"],
  img: ["img"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  apiRequest: typeof ApiRequest;
  span: "span";
  img: typeof PlasmicImg__;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicLauncherBlocksWidgetsSanje__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicLauncherBlocksWidgetsSanje__VariantsArgs;
    args?: PlasmicLauncherBlocksWidgetsSanje__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicLauncherBlocksWidgetsSanje__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicLauncherBlocksWidgetsSanje__ArgsType,
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
          internalArgPropNames: PlasmicLauncherBlocksWidgetsSanje__ArgProps,
          internalVariantPropNames:
            PlasmicLauncherBlocksWidgetsSanje__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicLauncherBlocksWidgetsSanje__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicLauncherBlocksWidgetsSanje";
  } else {
    func.displayName = `PlasmicLauncherBlocksWidgetsSanje.${nodeName}`;
  }
  return func;
}

export const PlasmicLauncherBlocksWidgetsSanje = Object.assign(
  // Top-level PlasmicLauncherBlocksWidgetsSanje renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    apiRequest: makeNodeComponent("apiRequest"),
    span: makeNodeComponent("span"),
    img: makeNodeComponent("img"),

    // Metadata about props expected for PlasmicLauncherBlocksWidgetsSanje
    internalVariantProps: PlasmicLauncherBlocksWidgetsSanje__VariantProps,
    internalArgProps: PlasmicLauncherBlocksWidgetsSanje__ArgProps
  }
);

export default PlasmicLauncherBlocksWidgetsSanje;
/* prettier-ignore-end */
