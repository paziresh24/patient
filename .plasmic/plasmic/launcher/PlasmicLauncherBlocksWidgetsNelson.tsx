// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: grxNYctbMek6PL66cujx3u
// Component: kPpI69i3raKy

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
import { Switch } from "@/common/fragment/components/switch"; // plasmic-import: pCEFX6I6UzMW/codeComponent

import "@plasmicapp/react-web/lib/plasmic.css";

import projectcss from "./plasmic.module.css"; // plasmic-import: grxNYctbMek6PL66cujx3u/projectcss
import sty from "./PlasmicLauncherBlocksWidgetsNelson.module.css"; // plasmic-import: kPpI69i3raKy/css

import LauncherIconsLoaderIcon from "./icons/PlasmicIcon__LauncherIconsLoader"; // plasmic-import: 4lP5I8e4Rz71/icon
import LauncherIconsChevronLeftIcon from "./icons/PlasmicIcon__LauncherIconsChevronLeft"; // plasmic-import: bpf8GR68xA_B/icon

createPlasmicElementProxy;

export type PlasmicLauncherBlocksWidgetsNelson__VariantMembers = {};
export type PlasmicLauncherBlocksWidgetsNelson__VariantsArgs = {};
type VariantPropType = keyof PlasmicLauncherBlocksWidgetsNelson__VariantsArgs;
export const PlasmicLauncherBlocksWidgetsNelson__VariantProps =
  new Array<VariantPropType>();

export type PlasmicLauncherBlocksWidgetsNelson__ArgsType = {};
type ArgPropType = keyof PlasmicLauncherBlocksWidgetsNelson__ArgsType;
export const PlasmicLauncherBlocksWidgetsNelson__ArgProps =
  new Array<ArgPropType>();

export type PlasmicLauncherBlocksWidgetsNelson__OverridesType = {
  root?: Flex__<"div">;
  apiRequest?: Flex__<typeof ApiRequest>;
  apiRequest2?: Flex__<typeof ApiRequest>;
  span?: Flex__<"span">;
  _switch?: Flex__<typeof Switch>;
};

export interface DefaultLauncherBlocksWidgetsNelsonProps {
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicLauncherBlocksWidgetsNelson__RenderFunc(props: {
  variants: PlasmicLauncherBlocksWidgetsNelson__VariantsArgs;
  args: PlasmicLauncherBlocksWidgetsNelson__ArgsType;
  overrides: PlasmicLauncherBlocksWidgetsNelson__OverridesType;
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

  const stateSpecs: Parameters<typeof useDollarState>[0] = React.useMemo(
    () => [
      {
        path: "_switch.checked",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) =>
          (() => {
            try {
              return $state.apiRequest2.data.data?.some(
                item => item?.active_booking
              );
            } catch (e) {
              if (
                e instanceof TypeError ||
                e?.plasmicType === "PlasmicUndefinedDataError"
              ) {
                return undefined;
              }
              throw e;
            }
          })()
      },
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
      },
      {
        path: "apiRequest2.data",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "apiRequest2.error",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "apiRequest2.loading",
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
    >
      <ApiRequest
        data-plasmic-name={"apiRequest"}
        data-plasmic-override={overrides.apiRequest}
        className={classNames("__wab_instance", sty.apiRequest)}
        errorDisplay={
          <LauncherIconsLoaderIcon
            className={classNames(projectcss.all, sty.svg__y4P0L)}
            role={"img"}
          />
        }
        loadingDisplay={
          <LauncherIconsLoaderIcon
            className={classNames(projectcss.all, sty.svg__nBwz4)}
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
        url={"https://apigw.paziresh24.com/v1/n8n-nelson/webhook/allcenters"}
      >
        <ApiRequest
          data-plasmic-name={"apiRequest2"}
          data-plasmic-override={overrides.apiRequest2}
          className={classNames("__wab_instance", sty.apiRequest2)}
          errorDisplay={
            <React.Fragment>
              {(() => {
                try {
                  return $state.apiRequest.data.data?.some(
                    item => item.id == "5532"
                  );
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
                  className={classNames(projectcss.all, sty.svg__psTe)}
                  role={"img"}
                />
              ) : null}
              {(() => {
                try {
                  return $state.apiRequest.data.data?.some(
                    item => item.id != "5532"
                  );
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return false;
                  }
                  throw e;
                }
              })() ? (
                <Stack__
                  as={"div"}
                  hasGap={true}
                  className={classNames(projectcss.all, sty.freeBox__xh81H)}
                  onClick={async event => {
                    const $steps = {};

                    $steps["goToHttpsDrPaziresh24ComActivationConsultRules"] =
                      true
                        ? (() => {
                            const actionArgs = {
                              destination:
                                "https://dr.paziresh24.com/activation/consult/rules"
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
                      $steps[
                        "goToHttpsDrPaziresh24ComActivationConsultRules"
                      ] != null &&
                      typeof $steps[
                        "goToHttpsDrPaziresh24ComActivationConsultRules"
                      ] === "object" &&
                      typeof $steps[
                        "goToHttpsDrPaziresh24ComActivationConsultRules"
                      ].then === "function"
                    ) {
                      $steps["goToHttpsDrPaziresh24ComActivationConsultRules"] =
                        await $steps[
                          "goToHttpsDrPaziresh24ComActivationConsultRules"
                        ];
                    }
                  }}
                >
                  <Stack__
                    as={"div"}
                    hasGap={true}
                    className={classNames(projectcss.all, sty.freeBox__g495E)}
                  >
                    <div
                      className={classNames(
                        projectcss.all,
                        projectcss.__wab_text,
                        sty.text__i1Zr2
                      )}
                    >
                      {
                        "\u0641\u0639\u0627\u0644\u200c\u0633\u0627\u0632\u06cc \u0648\u06cc\u0632\u06cc\u062a \u0622\u0646\u0644\u0627\u06cc\u0646"
                      }
                    </div>
                  </Stack__>
                  <div
                    className={classNames(
                      projectcss.all,
                      projectcss.__wab_text,
                      sty.text__psjuT
                    )}
                  >
                    {
                      "\u0628\u0647 \u0635\u0648\u0631\u062a \u063a\u06cc\u0631\u062d\u0636\u0648\u0631\u06cc \u0648\u06cc\u0632\u06cc\u062a \u06a9\u0646\u06cc\u062f."
                    }
                  </div>
                  <Stack__
                    as={"div"}
                    hasGap={true}
                    className={classNames(projectcss.all, sty.freeBox__wM0Lm)}
                  >
                    <div
                      className={classNames(
                        projectcss.all,
                        projectcss.__wab_text,
                        sty.text__jTlDl
                      )}
                    >
                      {"\u0641\u0639\u0627\u0644\u200c\u0633\u0627\u0632\u06cc"}
                    </div>
                    <LauncherIconsChevronLeftIcon
                      className={classNames(projectcss.all, sty.svg__gmwpb)}
                      role={"img"}
                    />
                  </Stack__>
                </Stack__>
              ) : null}
            </React.Fragment>
          }
          loadingDisplay={
            <LauncherIconsLoaderIcon
              className={classNames(projectcss.all, sty.svg__daNwg)}
              role={"img"}
            />
          }
          method={"GET"}
          onError={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, ["apiRequest2", "error"]).apply(
              null,
              eventArgs
            );
          }}
          onLoading={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, ["apiRequest2", "loading"]).apply(
              null,
              eventArgs
            );
          }}
          onSuccess={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, ["apiRequest2", "data"]).apply(
              null,
              eventArgs
            );
          }}
          params={(() => {
            try {
              return {
                user_center_id: $state.apiRequest.data?.data?.find(
                  item => item.id === "5532"
                ).user_center_id,
                server_id: 1
              };
            } catch (e) {
              if (
                e instanceof TypeError ||
                e?.plasmicType === "PlasmicUndefinedDataError"
              ) {
                return undefined;
              }
              throw e;
            }
          })()}
          url={"https://apigw.paziresh24.com/v1/user-center-services"}
        >
          <Stack__
            as={"div"}
            hasGap={true}
            className={classNames(projectcss.all, sty.freeBox__wxcz5)}
          >
            {(() => {
              try {
                return $state._switch.checked;
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
                className={classNames(projectcss.all, sty.freeBox__vnEpp)}
              >
                <div
                  className={classNames(projectcss.all, sty.freeBox__dyTj)}
                />

                <div
                  className={classNames(
                    projectcss.all,
                    projectcss.__wab_text,
                    sty.text___8VQOi
                  )}
                >
                  {"\u0641\u0639\u0627\u0644"}
                </div>
              </Stack__>
            ) : null}
            {(() => {
              try {
                return !$state._switch.checked;
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
                className={classNames(projectcss.all, sty.freeBox__bvg8K)}
              >
                <div
                  className={classNames(projectcss.all, sty.freeBox__fd0Vr)}
                />

                <div
                  className={classNames(
                    projectcss.all,
                    projectcss.__wab_text,
                    sty.text__thjMx
                  )}
                >
                  {"\u063a\u06cc\u0631\u0641\u0639\u0627\u0644"}
                </div>
              </Stack__>
            ) : null}
            <div
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text__ru0Jt
              )}
            >
              <React.Fragment>
                <React.Fragment>
                  {
                    "\u0648\u06cc\u0632\u06cc\u062a \u0622\u0646\u0644\u0627\u06cc\u0646 "
                  }
                </React.Fragment>
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
                          return $state._switch.checked ? "فعال" : "غیرفعال";
                        } catch (e) {
                          if (
                            e instanceof TypeError ||
                            e?.plasmicType === "PlasmicUndefinedDataError"
                          ) {
                            return "\u0641\u0639\u0627\u0644";
                          }
                          throw e;
                        }
                      })()}
                    </React.Fragment>
                  </span>
                }
                <React.Fragment>{" \u0627\u0633\u062a"}</React.Fragment>
              </React.Fragment>
            </div>
          </Stack__>
          <Switch
            data-plasmic-name={"_switch"}
            data-plasmic-override={overrides._switch}
            checked={generateStateValueProp($state, ["_switch", "checked"])}
            className={classNames("__wab_instance", sty._switch)}
            onCheckedChange={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, ["_switch", "checked"]).apply(
                null,
                eventArgs
              );

              (async checked => {
                const $steps = {};

                $steps["invokeGlobalAction"] = true
                  ? (() => {
                      const actionArgs = {
                        args: [
                          "PATCH",
                          "https://apigw.paziresh24.com/v1/canbookingon&off",
                          undefined,
                          (() => {
                            try {
                              return {
                                user_center_id:
                                  $state.apiRequest2.data.data[0]
                                    .user_center_id,
                                can_booking: "0"
                              };
                            } catch (e) {
                              if (
                                e instanceof TypeError ||
                                e?.plasmicType === "PlasmicUndefinedDataError"
                              ) {
                                return undefined;
                              }
                              throw e;
                            }
                          })()
                        ]
                      };
                      return $globalActions["Fragment.apiRequest"]?.apply(
                        null,
                        [...actionArgs.args]
                      );
                    })()
                  : undefined;
                if (
                  $steps["invokeGlobalAction"] != null &&
                  typeof $steps["invokeGlobalAction"] === "object" &&
                  typeof $steps["invokeGlobalAction"].then === "function"
                ) {
                  $steps["invokeGlobalAction"] = await $steps[
                    "invokeGlobalAction"
                  ];
                }
              }).apply(null, eventArgs);
            }}
          />
        </ApiRequest>
      </ApiRequest>
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "apiRequest", "apiRequest2", "span", "_switch"],
  apiRequest: ["apiRequest", "apiRequest2", "span", "_switch"],
  apiRequest2: ["apiRequest2", "span", "_switch"],
  span: ["span"],
  _switch: ["_switch"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  apiRequest: typeof ApiRequest;
  apiRequest2: typeof ApiRequest;
  span: "span";
  _switch: typeof Switch;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicLauncherBlocksWidgetsNelson__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicLauncherBlocksWidgetsNelson__VariantsArgs;
    args?: PlasmicLauncherBlocksWidgetsNelson__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit< // Specify variants directly as props
    PlasmicLauncherBlocksWidgetsNelson__VariantsArgs,
    ReservedPropsType
  > &
    /* Specify args directly as props*/ Omit<
      PlasmicLauncherBlocksWidgetsNelson__ArgsType,
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
          internalArgPropNames: PlasmicLauncherBlocksWidgetsNelson__ArgProps,
          internalVariantPropNames:
            PlasmicLauncherBlocksWidgetsNelson__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicLauncherBlocksWidgetsNelson__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicLauncherBlocksWidgetsNelson";
  } else {
    func.displayName = `PlasmicLauncherBlocksWidgetsNelson.${nodeName}`;
  }
  return func;
}

export const PlasmicLauncherBlocksWidgetsNelson = Object.assign(
  // Top-level PlasmicLauncherBlocksWidgetsNelson renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    apiRequest: makeNodeComponent("apiRequest"),
    apiRequest2: makeNodeComponent("apiRequest2"),
    span: makeNodeComponent("span"),
    _switch: makeNodeComponent("_switch"),

    // Metadata about props expected for PlasmicLauncherBlocksWidgetsNelson
    internalVariantProps: PlasmicLauncherBlocksWidgetsNelson__VariantProps,
    internalArgProps: PlasmicLauncherBlocksWidgetsNelson__ArgProps
  }
);

export default PlasmicLauncherBlocksWidgetsNelson;
/* prettier-ignore-end */
