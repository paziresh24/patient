// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: 7r312uiqyadpVPdnRoAggk
// Component: VtINgkEb27Pn

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

import { ApiRequest } from "@/common/fragment/components/api-request"; // plasmic-import: KYyoqoJ8cPoi/codeComponent
import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: 7r312uiqyadpVPdnRoAggk/projectcss
import sty from "./PlasmicProfileActions.module.css"; // plasmic-import: VtINgkEb27Pn/css

import IconIcon from "./icons/PlasmicIcon__Icon"; // plasmic-import: SeX7ttg98ylS/icon
import Icon8Icon from "./icons/PlasmicIcon__Icon8"; // plasmic-import: W5EXYp30CPhG/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon
import Icon2Icon from "./icons/PlasmicIcon__Icon2"; // plasmic-import: MoYSGvL5CZhO/icon
import Icon3Icon from "./icons/PlasmicIcon__Icon3"; // plasmic-import: K8fKsJPldTZe/icon

createPlasmicElementProxy;

export type PlasmicProfileActions__VariantMembers = {};
export type PlasmicProfileActions__VariantsArgs = {};
type VariantPropType = keyof PlasmicProfileActions__VariantsArgs;
export const PlasmicProfileActions__VariantProps = new Array<VariantPropType>();

export type PlasmicProfileActions__ArgsType = {
  slug?: string;
  hideSave?: boolean;
  hideShare?: boolean;
  hideReport?: boolean;
};
type ArgPropType = keyof PlasmicProfileActions__ArgsType;
export const PlasmicProfileActions__ArgProps = new Array<ArgPropType>(
  "slug",
  "hideSave",
  "hideShare",
  "hideReport"
);

export type PlasmicProfileActions__OverridesType = {
  root?: Flex__<"div">;
  getIsBookedMark?: Flex__<typeof ApiRequest>;
};

export interface DefaultProfileActionsProps {
  slug?: string;
  hideSave?: boolean;
  hideShare?: boolean;
  hideReport?: boolean;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicProfileActions__RenderFunc(props: {
  variants: PlasmicProfileActions__VariantsArgs;
  args: PlasmicProfileActions__ArgsType;
  overrides: PlasmicProfileActions__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          hideSave: false,
          hideShare: false,
          hideReport: false
        },
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
        path: "getIsBookedMark.data",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "getIsBookedMark.error",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "getIsBookedMark.loading",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "isBookMarked",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => false
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
        sty.root
      )}
    >
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__jYihM)}
      >
        <ApiRequest
          data-plasmic-name={"getIsBookedMark"}
          data-plasmic-override={overrides.getIsBookedMark}
          body={(() => {
            try {
              return { slug: $props.slug };
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
          className={classNames("__wab_instance", sty.getIsBookedMark)}
          errorDisplay={null}
          loadingDisplay={
            <Button
              children2={
                <Stack__
                  as={"div"}
                  hasGap={true}
                  className={classNames(projectcss.all, sty.freeBox___9AqJn)}
                >
                  {(() => {
                    try {
                      return !$state.isBookMarked;
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
                    <IconIcon
                      className={classNames(projectcss.all, sty.svg__oOJz)}
                      role={"img"}
                    />
                  ) : null}
                  {(() => {
                    try {
                      return $state.isBookMarked;
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
                    <Icon8Icon
                      className={classNames(projectcss.all, sty.svg__xvZLk)}
                      role={"img"}
                    />
                  ) : null}
                  <div
                    className={classNames(
                      projectcss.all,
                      projectcss.__wab_text,
                      sty.text__pNu88
                    )}
                  >
                    {"\u0630\u062e\u06cc\u0631\u0647"}
                  </div>
                </Stack__>
              }
              className={classNames("__wab_instance", sty.button__gj1H3)}
              color={"clear"}
              startIcon={null}
            />
          }
          method={"POST"}
          onError={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, [
              "getIsBookedMark",
              "error"
            ]).apply(null, eventArgs);
          }}
          onLoading={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, [
              "getIsBookedMark",
              "loading"
            ]).apply(null, eventArgs);
          }}
          onSuccess={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, [
              "getIsBookedMark",
              "data"
            ]).apply(null, eventArgs);

            (async data => {
              const $steps = {};

              $steps["updateIsBookMarked"] = true
                ? (() => {
                    const actionArgs = {
                      variable: {
                        objRoot: $state,
                        variablePath: ["isBookMarked"]
                      },
                      operation: 0,
                      value: data?.status == 121 ? true : false
                    };
                    return (({ variable, value, startIndex, deleteCount }) => {
                      if (!variable) {
                        return;
                      }
                      const { objRoot, variablePath } = variable;

                      $stateSet(objRoot, variablePath, value);
                      return value;
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps["updateIsBookMarked"] != null &&
                typeof $steps["updateIsBookMarked"] === "object" &&
                typeof $steps["updateIsBookMarked"].then === "function"
              ) {
                $steps["updateIsBookMarked"] = await $steps[
                  "updateIsBookMarked"
                ];
              }
            }).apply(null, eventArgs);
          }}
          params={undefined}
          url={"https://www.paziresh24.com/api/isBookmark"}
        >
          <Button
            children2={
              <Stack__
                as={"div"}
                hasGap={true}
                className={classNames(projectcss.all, sty.freeBox___51XSf)}
              >
                {(() => {
                  try {
                    return !$state.isBookMarked;
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
                  <IconIcon
                    className={classNames(projectcss.all, sty.svg___3MpXu)}
                    role={"img"}
                  />
                ) : null}
                {(() => {
                  try {
                    return $state.isBookMarked;
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
                  <Icon8Icon
                    className={classNames(projectcss.all, sty.svg__v4B9N)}
                    role={"img"}
                  />
                ) : null}
                <div
                  className={classNames(
                    projectcss.all,
                    projectcss.__wab_text,
                    sty.text__lH8UP
                  )}
                >
                  {"\u0630\u062e\u06cc\u0631\u0647"}
                </div>
              </Stack__>
            }
            className={classNames("__wab_instance", sty.button___0Gl8R)}
            color={"clear"}
            onClick={async event => {
              const $steps = {};

              $steps["invokeGlobalAction"] = !$ctx["auth"].isLogin
                ? (() => {
                    const actionArgs = { args: [] };
                    return $globalActions["AuthGlobalContext.login"]?.apply(
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

              $steps["updateIsBookMarked"] = $ctx["auth"].isLogin
                ? (() => {
                    const actionArgs = {
                      variable: {
                        objRoot: $state,
                        variablePath: ["isBookMarked"]
                      },
                      operation: 4
                    };
                    return (({ variable, value, startIndex, deleteCount }) => {
                      if (!variable) {
                        return;
                      }
                      const { objRoot, variablePath } = variable;

                      const oldValue = $stateGet(objRoot, variablePath);
                      $stateSet(objRoot, variablePath, !oldValue);
                      return !oldValue;
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps["updateIsBookMarked"] != null &&
                typeof $steps["updateIsBookMarked"] === "object" &&
                typeof $steps["updateIsBookMarked"].then === "function"
              ) {
                $steps["updateIsBookMarked"] = await $steps[
                  "updateIsBookMarked"
                ];
              }

              $steps["invokeGlobalAction2"] =
                $state.isBookMarked && $ctx.auth.isLogin
                  ? (() => {
                      const actionArgs = {
                        args: [
                          "POST",
                          "https://www.paziresh24.com/api/bookmark",
                          undefined,
                          (() => {
                            try {
                              return {
                                slug: $props.slug
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
                $steps["invokeGlobalAction2"] != null &&
                typeof $steps["invokeGlobalAction2"] === "object" &&
                typeof $steps["invokeGlobalAction2"].then === "function"
              ) {
                $steps["invokeGlobalAction2"] = await $steps[
                  "invokeGlobalAction2"
                ];
              }

              $steps["invokeGlobalAction3"] =
                !$state.isBookMarked && $ctx.auth.isLogin
                  ? (() => {
                      const actionArgs = {
                        args: [
                          "POST",
                          "https://www.paziresh24.com/api/deleteBookmark",
                          undefined,
                          (() => {
                            try {
                              return { slug: $props.slug };
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
                $steps["invokeGlobalAction3"] != null &&
                typeof $steps["invokeGlobalAction3"] === "object" &&
                typeof $steps["invokeGlobalAction3"].then === "function"
              ) {
                $steps["invokeGlobalAction3"] = await $steps[
                  "invokeGlobalAction3"
                ];
              }
            }}
            startIcon={null}
          />
        </ApiRequest>
        <Button
          children2={
            <Stack__
              as={"div"}
              hasGap={true}
              className={classNames(projectcss.all, sty.freeBox__uYlGw)}
            >
              <Icon2Icon
                className={classNames(projectcss.all, sty.svg__jnLwj)}
                role={"img"}
              />

              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__kOpCb
                )}
              >
                {
                  "\u0627\u0634\u062a\u0631\u0627\u06a9 \u06af\u0630\u0627\u0631\u06cc"
                }
              </div>
            </Stack__>
          }
          className={classNames("__wab_instance", sty.button__dta93)}
          color={"clear"}
          onClick={async event => {
            const $steps = {};

            $steps["runCode"] = true
              ? (() => {
                  const actionArgs = {
                    customFunction: async () => {
                      return (() => {
                        const url = `${window.location.origin}/dr/${$props.slug}?utm_source=doctorprofile-share-button&utm_medium=doctorprofile&utm_campaign=doctorprofile`;
                        if (window.navigator && !!window.navigator.share) {
                          return navigator.share({
                            title: $props.title,
                            text: `${$props.displayName} در پذیرش۲۴`,
                            url
                          });
                        }
                      })();
                    }
                  };
                  return (({ customFunction }) => {
                    return customFunction();
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["runCode"] != null &&
              typeof $steps["runCode"] === "object" &&
              typeof $steps["runCode"].then === "function"
            ) {
              $steps["runCode"] = await $steps["runCode"];
            }
          }}
          startIcon={null}
        />

        <Button
          children2={
            <Stack__
              as={"div"}
              hasGap={true}
              className={classNames(projectcss.all, sty.freeBox__ccKef)}
            >
              <Icon3Icon
                className={classNames(projectcss.all, sty.svg__mdGYz)}
                role={"img"}
              />

              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__dgMxy
                )}
              >
                {"\u06af\u0632\u0627\u0631\u0634"}
              </div>
            </Stack__>
          }
          className={classNames("__wab_instance", sty.button__rWXt)}
          color={"clear"}
          onClick={async event => {
            const $steps = {};

            $steps["goToPage"] = true
              ? (() => {
                  const actionArgs = {
                    destination: (() => {
                      try {
                        return `/patient/contribute?slug=${$props.slug}`;
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
              $steps["goToPage"] != null &&
              typeof $steps["goToPage"] === "object" &&
              typeof $steps["goToPage"].then === "function"
            ) {
              $steps["goToPage"] = await $steps["goToPage"];
            }
          }}
          startIcon={null}
        />
      </Stack__>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "getIsBookedMark"],
  getIsBookedMark: ["getIsBookedMark"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  getIsBookedMark: typeof ApiRequest;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicProfileActions__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicProfileActions__VariantsArgs;
    args?: PlasmicProfileActions__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicProfileActions__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicProfileActions__ArgsType,
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
          internalArgPropNames: PlasmicProfileActions__ArgProps,
          internalVariantPropNames: PlasmicProfileActions__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicProfileActions__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicProfileActions";
  } else {
    func.displayName = `PlasmicProfileActions.${nodeName}`;
  }
  return func;
}

export const PlasmicProfileActions = Object.assign(
  // Top-level PlasmicProfileActions renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    getIsBookedMark: makeNodeComponent("getIsBookedMark"),

    // Metadata about props expected for PlasmicProfileActions
    internalVariantProps: PlasmicProfileActions__VariantProps,
    internalArgProps: PlasmicProfileActions__ArgProps
  }
);

export default PlasmicProfileActions;
/* prettier-ignore-end */
