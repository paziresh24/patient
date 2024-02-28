// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: iDYgiKJB9Yi7CUB81stQBK
// Component: pggD1apWa_wW

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

import { usePlasmicDataSourceContext } from "@plasmicapp/data-sources-context";
import {
  executePlasmicDataOp,
  usePlasmicDataOp,
  usePlasmicInvalidate
} from "@plasmicapp/react-web/lib/data-sources";

import { Popover } from "@plasmicpkgs/radix-ui";
import Button from "../../Button"; // plasmic-import: wRtWBmTexyYF/component
import { SideEffect } from "@plasmicpkgs/plasmic-basic-components";

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: iDYgiKJB9Yi7CUB81stQBK/projectcss
import sty from "./PlasmicActivity.module.css"; // plasmic-import: pggD1apWa_wW/css

import Icon20Icon from "./icons/PlasmicIcon__Icon20"; // plasmic-import: uUHYUjZLzaVg/icon
import Icon21Icon from "./icons/PlasmicIcon__Icon21"; // plasmic-import: szEV5ojPpvII/icon
import Icon17Icon from "./icons/PlasmicIcon__Icon17"; // plasmic-import: egi8lj9xHHo3/icon
import ChecksvgIcon from "./icons/PlasmicIcon__Checksvg"; // plasmic-import: Zop7nqClMso8/icon
import Icon4Icon from "./icons/PlasmicIcon__Icon4"; // plasmic-import: zsOosa-1VDPP/icon
import Icon6Icon from "./icons/PlasmicIcon__Icon6"; // plasmic-import: UYWDQf69XzlE/icon
import Icon19Icon from "./icons/PlasmicIcon__Icon19"; // plasmic-import: 4RsTY71YqzEZ/icon

createPlasmicElementProxy;

export type PlasmicActivity__VariantMembers = {};
export type PlasmicActivity__VariantsArgs = {};
type VariantPropType = keyof PlasmicActivity__VariantsArgs;
export const PlasmicActivity__VariantProps = new Array<VariantPropType>();

export type PlasmicActivity__ArgsType = {
  information?: any;
  history?: any;
  centers?: any;
  onlineVisit?: any;
};
type ArgPropType = keyof PlasmicActivity__ArgsType;
export const PlasmicActivity__ArgProps = new Array<ArgPropType>(
  "information",
  "history",
  "centers",
  "onlineVisit"
);

export type PlasmicActivity__OverridesType = {
  root?: Flex__<"div">;
  popoverCore?: Flex__<typeof Popover>;
  button?: Flex__<typeof Button>;
  sideEffect?: Flex__<typeof SideEffect>;
};

export interface DefaultActivityProps {
  information?: any;
  history?: any;
  centers?: any;
  onlineVisit?: any;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicActivity__RenderFunc(props: {
  variants: PlasmicActivity__VariantsArgs;
  args: PlasmicActivity__ArgsType;
  overrides: PlasmicActivity__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(() => Object.assign({}, props.args), [props.args]);

  const $props = {
    ...args,
    ...variants
  };

  const __nextRouter = useNextRouter();
  const $ctx = useDataEnv?.() || {};
  const refsRef = React.useRef({});
  const $refs = refsRef.current;

  const currentUser = useCurrentUser?.() || {};

  const stateSpecs: Parameters<typeof useDollarState>[0] = React.useMemo(
    () => [
      {
        path: "allVisitOnlineCountBook",
        type: "private",
        variableType: "number",
        initFunc: ({ $props, $state, $queries, $ctx }) => 0
      },
      {
        path: "removedVisitOnlineCountBook",
        type: "private",
        variableType: "number",
        initFunc: ({ $props, $state, $queries, $ctx }) => 0
      },
      {
        path: "deletedBookRateLoading",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => true
      },
      {
        path: "popoverCore.open",
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
  const dataSourcesCtx = usePlasmicDataSourceContext();
  const plasmicInvalidate = usePlasmicInvalidate();

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
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        sty.root
      )}
      dir={"rtl"}
    >
      <div
        className={classNames(
          projectcss.all,
          projectcss.__wab_text,
          sty.text__tpL
        )}
      >
        {"\u0641\u0639\u0627\u0644\u06cc\u062a \u0647\u0627"}
      </div>
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__njTt0)}
      >
        {(() => {
          try {
            return $props.onlineVisit.enabled;
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
            className={classNames(projectcss.all, sty.freeBox___1VxTv)}
          >
            <Icon20Icon
              className={classNames(projectcss.all, sty.svg__fSiU)}
              role={"img"}
            />

            <div
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text__aBxMc
              )}
            >
              <div
                className={projectcss.__wab_expr_html_text}
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    try {
                      return `<b>${$props.history.count_of_consult_books}</b> مشاوره فعال`;
                    } catch (e) {
                      if (
                        e instanceof TypeError ||
                        e?.plasmicType === "PlasmicUndefinedDataError"
                      ) {
                        return "\u067e\u0630\u06cc\u0631\u063424 \u0628\u06cc\u0634 \u0627\u0632 ";
                      }
                      throw e;
                    }
                  })()
                }}
              />
            </div>
          </Stack__>
        ) : null}
        {(() => {
          try {
            return (
              $props.onlineVisit.enabled &&
              ($state.deletedBookRateLoading ||
                ($state.allVisitOnlineCountBook >= 0 &&
                  $state.removedVisitOnlineCountBook >= 0))
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
          <Stack__
            as={"div"}
            hasGap={true}
            className={classNames(projectcss.all, sty.freeBox__npHib)}
          >
            <Icon21Icon
              className={classNames(projectcss.all, sty.svg__s35Ry)}
              role={"img"}
            />

            <Stack__
              as={"div"}
              hasGap={true}
              className={classNames(projectcss.all, sty.freeBox__pCmV)}
            >
              {(() => {
                try {
                  return !$state.deletedBookRateLoading;
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
                <div
                  className={classNames(
                    projectcss.all,
                    projectcss.__wab_text,
                    sty.text__y5Ldh
                  )}
                >
                  <React.Fragment>
                    {(() => {
                      try {
                        return (() => {
                          if (
                            $state.allVisitOnlineCountBook < 0 ||
                            !$state.removedVisitOnlineCountBook < 0
                          ) {
                            return "";
                          }
                          const percent = `${Math.ceil(
                            100 -
                              (($state.removedVisitOnlineCountBook
                                ? $state.removedVisitOnlineCountBook
                                : 0) /
                                ($state.allVisitOnlineCountBook
                                  ? $state.allVisitOnlineCountBook
                                  : 1)) *
                                100
                          )}%`;
                          return percent;
                        })();
                      } catch (e) {
                        if (
                          e instanceof TypeError ||
                          e?.plasmicType === "PlasmicUndefinedDataError"
                        ) {
                          return "\u067e\u0630\u06cc\u0631\u063424 \u0628\u06cc\u0634 \u0627\u0632 ";
                        }
                        throw e;
                      }
                    })()}
                  </React.Fragment>
                </div>
              ) : null}
              {(() => {
                try {
                  return $state.deletedBookRateLoading;
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
                <Icon17Icon
                  className={classNames(
                    projectcss.all,
                    sty.svg___3CMaB,
                    "loader"
                  )}
                  role={"img"}
                />
              ) : null}
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__b2LaP
                )}
              >
                {
                  "\u0648\u06cc\u0632\u06cc\u062a \u0622\u0646\u0644\u0627\u06cc\u0646 \u0645\u0648\u0641\u0642"
                }
              </div>
              <Popover
                data-plasmic-name={"popoverCore"}
                data-plasmic-override={overrides.popoverCore}
                className={classNames("__wab_instance", sty.popoverCore)}
                onOpenChange={generateStateOnChangeProp($state, [
                  "popoverCore",
                  "open"
                ])}
                open={generateStateValueProp($state, ["popoverCore", "open"])}
                overlay={
                  <div
                    className={classNames(projectcss.all, sty.freeBox___3JExA)}
                  >
                    <div
                      className={classNames(
                        projectcss.all,
                        projectcss.__wab_text,
                        sty.text__wKeem
                      )}
                    >
                      {
                        "\u0627\u06cc\u0646 \u0634\u0627\u062e\u0635 \u0628\u0631\u0627\u0633\u0627\u0633 \u062a\u0639\u062f\u0627\u062f \u0648\u06cc\u0632\u06cc\u062a \u0622\u0646\u0644\u0627\u06cc\u0646\u06cc \u06a9\u0647 \u067e\u0633 \u0627\u0632 \u0632\u0645\u0627\u0646 \u0646\u0648\u0628\u062a \u0628\u0627 \u0645\u0648\u0641\u0642\u06cc\u062a \u0627\u0646\u062c\u0627\u0645 \u0634\u062f\u0647\u200c\u0627\u0646\u062f \u0648 \u062d\u0630\u0641 \u0646\u0634\u062f\u0647\u200c\u0627\u0646\u062f \u0645\u062d\u0627\u0633\u0628\u0647 \u0645\u06cc\u200c\u0634\u0648\u062f."
                      }
                    </div>
                  </div>
                }
                themeResetClass={classNames(
                  projectcss.root_reset,
                  projectcss.plasmic_default_styles,
                  projectcss.plasmic_mixins,
                  projectcss.plasmic_tokens,
                  plasmic_paziresh_24_design_system_css.plasmic_tokens
                )}
                trigger={true}
              >
                <Button
                  data-plasmic-name={"button"}
                  data-plasmic-override={overrides.button}
                  children2={
                    <Icon4Icon
                      className={classNames(projectcss.all, sty.svg__pnGkU)}
                      role={"img"}
                    />
                  }
                  className={classNames("__wab_instance", sty.button)}
                  color={"clear"}
                />
              </Popover>
            </Stack__>
          </Stack__>
        ) : null}
        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__tcVrm)}
        >
          <Icon19Icon
            className={classNames(projectcss.all, sty.svg___6A1Z5)}
            role={"img"}
          />

          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text__dpKhj
            )}
          >
            <React.Fragment>
              {(() => {
                try {
                  return `پذیرش24 بیش از ${$props.history.insert_at_age} افتخار میزبانی از صفحه اختصاصی ${$props.information.display_name} را داشته است.`;
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return "\u067e\u0630\u06cc\u0631\u063424 \u0628\u06cc\u0634 \u0627\u0632 ";
                  }
                  throw e;
                }
              })()}
            </React.Fragment>
          </div>
        </Stack__>
        {(() => {
          try {
            return $props.centers.some(center => center.id === "5532");
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
          <SideEffect
            data-plasmic-name={"sideEffect"}
            data-plasmic-override={overrides.sideEffect}
            className={classNames("__wab_instance", sty.sideEffect)}
            onMount={async () => {
              const $steps = {};

              $steps["startLoading"] = true
                ? (() => {
                    const actionArgs = {
                      variable: {
                        objRoot: $state,
                        variablePath: ["deletedBookRateLoading"]
                      },
                      operation: 0,
                      value: true
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
                $steps["startLoading"] != null &&
                typeof $steps["startLoading"] === "object" &&
                typeof $steps["startLoading"].then === "function"
              ) {
                $steps["startLoading"] = await $steps["startLoading"];
              }

              $steps["allVisitOnlineBooks"] = true
                ? (() => {
                    const actionArgs = {
                      dataOp: {
                        sourceId: "x4aryr2mRXV9jgXmh3My7a",
                        opId: "a0077099-6811-47a6-aca7-d56d8053a2af",
                        userArgs: {
                          params: [
                            $props.centers.find(center => center.id === "5532")
                              .user_center_id,
                            Math.floor(new Date().setHours(0, 0, 0, 0) / 1000),
                            Math.floor(
                              (new Date().setHours(0, 0, 0, 0) -
                                30 * 24 * 60 * 60 * 1000) /
                                1000
                            )
                          ]
                        },
                        cacheKey: null,
                        invalidatedKeys: null,
                        roleId: null
                      }
                    };
                    return (async ({ dataOp, continueOnError }) => {
                      try {
                        const response = await executePlasmicDataOp(dataOp, {
                          userAuthToken: dataSourcesCtx?.userAuthToken,
                          user: dataSourcesCtx?.user
                        });
                        await plasmicInvalidate(dataOp.invalidatedKeys);
                        return response;
                      } catch (e) {
                        if (!continueOnError) {
                          throw e;
                        }
                        return e;
                      }
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps["allVisitOnlineBooks"] != null &&
                typeof $steps["allVisitOnlineBooks"] === "object" &&
                typeof $steps["allVisitOnlineBooks"].then === "function"
              ) {
                $steps["allVisitOnlineBooks"] = await $steps[
                  "allVisitOnlineBooks"
                ];
              }

              $steps["removedVisitOnlineBooks"] = true
                ? (() => {
                    const actionArgs = {
                      dataOp: {
                        sourceId: "x4aryr2mRXV9jgXmh3My7a",
                        opId: "a363a9a4-c014-47d7-a210-3f4e3c318c36",
                        userArgs: {
                          params: [
                            $props.centers.find(center => center.id === "5532")
                              .user_center_id,
                            Math.floor(new Date().setHours(0, 0, 0, 0) / 1000),
                            Math.floor(
                              (new Date().setHours(0, 0, 0, 0) -
                                30 * 24 * 60 * 60 * 1000) /
                                1000
                            )
                          ]
                        },
                        cacheKey: null,
                        invalidatedKeys: null,
                        roleId: null
                      }
                    };
                    return (async ({ dataOp, continueOnError }) => {
                      try {
                        const response = await executePlasmicDataOp(dataOp, {
                          userAuthToken: dataSourcesCtx?.userAuthToken,
                          user: dataSourcesCtx?.user
                        });
                        await plasmicInvalidate(dataOp.invalidatedKeys);
                        return response;
                      } catch (e) {
                        if (!continueOnError) {
                          throw e;
                        }
                        return e;
                      }
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps["removedVisitOnlineBooks"] != null &&
                typeof $steps["removedVisitOnlineBooks"] === "object" &&
                typeof $steps["removedVisitOnlineBooks"].then === "function"
              ) {
                $steps["removedVisitOnlineBooks"] = await $steps[
                  "removedVisitOnlineBooks"
                ];
              }

              $steps["updateAllVisitOnlineCountBook"] = true
                ? (() => {
                    const actionArgs = {
                      variable: {
                        objRoot: $state,
                        variablePath: ["allVisitOnlineCountBook"]
                      },
                      operation: 0,
                      value:
                        +$steps.allVisitOnlineBooks.data.response.count_book
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
                $steps["updateAllVisitOnlineCountBook"] != null &&
                typeof $steps["updateAllVisitOnlineCountBook"] === "object" &&
                typeof $steps["updateAllVisitOnlineCountBook"].then ===
                  "function"
              ) {
                $steps["updateAllVisitOnlineCountBook"] = await $steps[
                  "updateAllVisitOnlineCountBook"
                ];
              }

              $steps["updateRemovedVisitOnlineCountBook"] = true
                ? (() => {
                    const actionArgs = {
                      variable: {
                        objRoot: $state,
                        variablePath: ["removedVisitOnlineCountBook"]
                      },
                      operation: 0,
                      value:
                        +$steps.removedVisitOnlineBooks.data.response.count_book
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
                $steps["updateRemovedVisitOnlineCountBook"] != null &&
                typeof $steps["updateRemovedVisitOnlineCountBook"] ===
                  "object" &&
                typeof $steps["updateRemovedVisitOnlineCountBook"].then ===
                  "function"
              ) {
                $steps["updateRemovedVisitOnlineCountBook"] = await $steps[
                  "updateRemovedVisitOnlineCountBook"
                ];
              }

              $steps["endLoading"] = true
                ? (() => {
                    const actionArgs = {
                      variable: {
                        objRoot: $state,
                        variablePath: ["deletedBookRateLoading"]
                      },
                      operation: 0,
                      value: false
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
                $steps["endLoading"] != null &&
                typeof $steps["endLoading"] === "object" &&
                typeof $steps["endLoading"].then === "function"
              ) {
                $steps["endLoading"] = await $steps["endLoading"];
              }
            }}
          />
        ) : null}
      </Stack__>
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "popoverCore", "button", "sideEffect"],
  popoverCore: ["popoverCore", "button"],
  button: ["button"],
  sideEffect: ["sideEffect"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  popoverCore: typeof Popover;
  button: typeof Button;
  sideEffect: typeof SideEffect;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicActivity__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicActivity__VariantsArgs;
    args?: PlasmicActivity__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicActivity__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicActivity__ArgsType,
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
          internalArgPropNames: PlasmicActivity__ArgProps,
          internalVariantPropNames: PlasmicActivity__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicActivity__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicActivity";
  } else {
    func.displayName = `PlasmicActivity.${nodeName}`;
  }
  return func;
}

export const PlasmicActivity = Object.assign(
  // Top-level PlasmicActivity renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    popoverCore: makeNodeComponent("popoverCore"),
    button: makeNodeComponent("button"),
    sideEffect: makeNodeComponent("sideEffect"),

    // Metadata about props expected for PlasmicActivity
    internalVariantProps: PlasmicActivity__VariantProps,
    internalArgProps: PlasmicActivity__ArgProps
  }
);

export default PlasmicActivity;
/* prettier-ignore-end */
