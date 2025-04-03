/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: 7r312uiqyadpVPdnRoAggk
// Component: LIHtK_X7GpDY

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
import { Popover } from "@plasmicpkgs/radix-ui";

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: 7r312uiqyadpVPdnRoAggk/projectcss
import sty from "./PlasmicProfileActivity.module.css"; // plasmic-import: LIHtK_X7GpDY/css

import Icon9Icon from "./icons/PlasmicIcon__Icon9"; // plasmic-import: di-hDPZtFg6_/icon
import Icon10Icon from "./icons/PlasmicIcon__Icon10"; // plasmic-import: cRkyccZcWA13/icon
import Icon11Icon from "./icons/PlasmicIcon__Icon11"; // plasmic-import: zg5hj26DYh9Z/icon
import Icon13Icon from "./icons/PlasmicIcon__Icon13"; // plasmic-import: bqkboBMmLl7j/icon
import Icon15Icon from "./icons/PlasmicIcon__Icon15"; // plasmic-import: H3Ag34cCBO2J/icon

createPlasmicElementProxy;

export type PlasmicProfileActivity__VariantMembers = {};
export type PlasmicProfileActivity__VariantsArgs = {};
type VariantPropType = keyof PlasmicProfileActivity__VariantsArgs;
export const PlasmicProfileActivity__VariantProps =
  new Array<VariantPropType>();

export type PlasmicProfileActivity__ArgsType = {
  information?: any;
  history?: any;
  centers?: any;
  onlineVisit?: any;
};
type ArgPropType = keyof PlasmicProfileActivity__ArgsType;
export const PlasmicProfileActivity__ArgProps = new Array<ArgPropType>(
  "information",
  "history",
  "centers",
  "onlineVisit"
);

export type PlasmicProfileActivity__OverridesType = {
  root?: Flex__<"div">;
  h2?: Flex__<"h2">;
  removedVisitOnlineCountBook?: Flex__<typeof ApiRequest>;
  allVisitOnlineCountBook?: Flex__<typeof ApiRequest>;
  popoverCore?: Flex__<typeof Popover>;
};

export interface DefaultProfileActivityProps {
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

function PlasmicProfileActivity__RenderFunc(props: {
  variants: PlasmicProfileActivity__VariantsArgs;
  args: PlasmicProfileActivity__ArgsType;
  overrides: PlasmicProfileActivity__OverridesType;
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
        path: "popoverCore.open",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "allVisitOnlineCountBook.data",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "allVisitOnlineCountBook.error",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "allVisitOnlineCountBook.loading",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "removedVisitOnlineCountBook.data",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "removedVisitOnlineCountBook.error",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "removedVisitOnlineCountBook.loading",
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
        className={classNames(projectcss.all, sty.freeBox__fYPi)}
        dir={"rtl"}
      >
        <h2
          data-plasmic-name={"h2"}
          data-plasmic-override={overrides.h2}
          className={classNames(
            projectcss.all,
            projectcss.h2,
            projectcss.__wab_text,
            sty.h2
          )}
        >
          {"\u0641\u0639\u0627\u0644\u06cc\u062a \u0647\u0627"}
        </h2>
        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__a0EzN)}
        >
          <ApiRequest
            data-plasmic-name={"removedVisitOnlineCountBook"}
            data-plasmic-override={overrides.removedVisitOnlineCountBook}
            children={null}
            className={classNames(
              "__wab_instance",
              sty.removedVisitOnlineCountBook
            )}
            config={{
              headers: {
                Authorization: "Basic cHJvZmlsZTpwcm9maWxlMjUwMTUwMTU="
              }
            }}
            errorDisplay={null}
            loadingDisplay={null}
            method={"GET"}
            onError={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, [
                "removedVisitOnlineCountBook",
                "error"
              ]).apply(null, eventArgs);
            }}
            onLoading={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, [
                "removedVisitOnlineCountBook",
                "loading"
              ]).apply(null, eventArgs);
            }}
            onSuccess={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, [
                "removedVisitOnlineCountBook",
                "data"
              ]).apply(null, eventArgs);
            }}
            params={(() => {
              try {
                return {
                  user_center_id: $props.centers.find(
                    center => center.id === "5532"
                  ).user_center_id,
                  payment_status_in: "4",
                  from_less_than: Math.floor(
                    new Date().setHours(0, 0, 0, 0) / 1000
                  ),
                  from_greather_than: Math.floor(
                    (new Date().setHours(0, 0, 0, 0) -
                      30 * 24 * 60 * 60 * 1000) /
                      1000
                  ),
                  deleted_at_greater_than: "from"
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
            url={"https://apigw.paziresh24.com/v2/appointments/count"}
          />

          <ApiRequest
            data-plasmic-name={"allVisitOnlineCountBook"}
            data-plasmic-override={overrides.allVisitOnlineCountBook}
            children={null}
            className={classNames(
              "__wab_instance",
              sty.allVisitOnlineCountBook
            )}
            config={{
              headers: {
                Authorization: "Basic cHJvZmlsZTpwcm9maWxlMjUwMTUwMTU="
              }
            }}
            errorDisplay={null}
            loadingDisplay={null}
            method={"GET"}
            onError={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, [
                "allVisitOnlineCountBook",
                "error"
              ]).apply(null, eventArgs);
            }}
            onLoading={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, [
                "allVisitOnlineCountBook",
                "loading"
              ]).apply(null, eventArgs);
            }}
            onSuccess={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, [
                "allVisitOnlineCountBook",
                "data"
              ]).apply(null, eventArgs);
            }}
            params={(() => {
              try {
                return {
                  user_center_id: $props.centers.find(
                    center => center.id === "5532"
                  ).user_center_id,
                  payment_status_in: "3,4,5,6,7,8,9",
                  from_less_than: Math.floor(
                    new Date().setHours(0, 0, 0, 0) / 1000
                  ),
                  from_greather_than: Math.floor(
                    (new Date().setHours(0, 0, 0, 0) -
                      30 * 24 * 60 * 60 * 1000) /
                      1000
                  )
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
            url={"https://apigw.paziresh24.com/v2/appointments/count"}
          />

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
              className={classNames(projectcss.all, sty.freeBox___6Sb1M)}
            >
              <Icon9Icon
                className={classNames(projectcss.all, sty.svg__idGbo)}
                role={"img"}
              />

              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__zpTr
                )}
              >
                <div
                  className={projectcss.__wab_expr_html_text}
                  dangerouslySetInnerHTML={{
                    __html: (() => {
                      try {
                        return `<b>${$props.history.count_of_consult_books}</b> مشاوره موفق`;
                      } catch (e) {
                        if (
                          e instanceof TypeError ||
                          e?.plasmicType === "PlasmicUndefinedDataError"
                        ) {
                          return "";
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
                ($state.removedVisitOnlineCountBook?.loading ||
                  $state?.allVisitOnlineCountBook?.loading ||
                  ($state.allVisitOnlineCountBook.data?.count_book > 0 &&
                    $state.removedVisitOnlineCountBook.data?.count_book >= 0))
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
              className={classNames(projectcss.all, sty.freeBox__chLj)}
            >
              <Icon10Icon
                className={classNames(projectcss.all, sty.svg__jfAu9)}
                role={"img"}
              />

              <Stack__
                as={"div"}
                hasGap={true}
                className={classNames(projectcss.all, sty.freeBox__s7TW)}
              >
                {(() => {
                  try {
                    return (
                      $state.allVisitOnlineCountBook.loading ||
                      $state.removedVisitOnlineCountBook.loading
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
                  <Icon11Icon
                    className={classNames(
                      projectcss.all,
                      sty.svg__rFwLw,
                      "loader"
                    )}
                    role={"img"}
                  />
                ) : null}
                {(() => {
                  try {
                    return (
                      !$state.allVisitOnlineCountBook.loading &&
                      !$state.removedVisitOnlineCountBook.loading
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
                  <div
                    className={classNames(
                      projectcss.all,
                      projectcss.__wab_text,
                      sty.text__f9Ar
                    )}
                  >
                    <React.Fragment>
                      {(() => {
                        try {
                          return (() => {
                            if (
                              $state.allVisitOnlineCountBook.data.count_book <=
                                0 ||
                              $state.removedVisitOnlineCountBook.data
                                ?.count_book <= 0
                            ) {
                              return "";
                            }
                            const percent = `${Math.ceil(
                              100 -
                                (($state.removedVisitOnlineCountBook.data
                                  ?.count_book
                                  ? +$state.removedVisitOnlineCountBook.data
                                      ?.count_book
                                  : 0) /
                                  ($state.allVisitOnlineCountBook.data
                                    ?.count_book
                                    ? +$state.allVisitOnlineCountBook.data
                                        ?.count_book
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
                            return "";
                          }
                          throw e;
                        }
                      })()}
                    </React.Fragment>
                  </div>
                ) : null}
                <div
                  className={classNames(
                    projectcss.all,
                    projectcss.__wab_text,
                    sty.text__xc1Uo
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
                  onOpenChange={async (...eventArgs: any) => {
                    generateStateOnChangeProp($state, [
                      "popoverCore",
                      "open"
                    ]).apply(null, eventArgs);
                  }}
                  open={generateStateValueProp($state, ["popoverCore", "open"])}
                  overlay={
                    <div
                      className={classNames(projectcss.all, sty.freeBox__s7Ucu)}
                    >
                      <div
                        className={classNames(
                          projectcss.all,
                          projectcss.__wab_text,
                          sty.text___7YG7
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
                    plasmic_fragment_design_system_css.plasmic_tokens
                  )}
                  trigger={true}
                >
                  <div
                    className={classNames(projectcss.all, sty.freeBox___2Kt2T)}
                  >
                    <Icon13Icon
                      className={classNames(projectcss.all, sty.svg__gHr2)}
                      role={"img"}
                    />
                  </div>
                </Popover>
              </Stack__>
            </Stack__>
          ) : null}
          <Stack__
            as={"div"}
            hasGap={true}
            className={classNames(projectcss.all, sty.freeBox___7Mrs)}
          >
            <Icon15Icon
              className={classNames(projectcss.all, sty.svg___6IqcG)}
              role={"img"}
            />

            <div
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text__m2WzP
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
                      return "";
                    }
                    throw e;
                  }
                })()}
              </React.Fragment>
            </div>
          </Stack__>
        </Stack__>
      </Stack__>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: [
    "root",
    "h2",
    "removedVisitOnlineCountBook",
    "allVisitOnlineCountBook",
    "popoverCore"
  ],
  h2: ["h2"],
  removedVisitOnlineCountBook: ["removedVisitOnlineCountBook"],
  allVisitOnlineCountBook: ["allVisitOnlineCountBook"],
  popoverCore: ["popoverCore"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  h2: "h2";
  removedVisitOnlineCountBook: typeof ApiRequest;
  allVisitOnlineCountBook: typeof ApiRequest;
  popoverCore: typeof Popover;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicProfileActivity__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicProfileActivity__VariantsArgs;
    args?: PlasmicProfileActivity__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicProfileActivity__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicProfileActivity__ArgsType,
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
          internalArgPropNames: PlasmicProfileActivity__ArgProps,
          internalVariantPropNames: PlasmicProfileActivity__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicProfileActivity__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicProfileActivity";
  } else {
    func.displayName = `PlasmicProfileActivity.${nodeName}`;
  }
  return func;
}

export const PlasmicProfileActivity = Object.assign(
  // Top-level PlasmicProfileActivity renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    h2: makeNodeComponent("h2"),
    removedVisitOnlineCountBook: makeNodeComponent(
      "removedVisitOnlineCountBook"
    ),
    allVisitOnlineCountBook: makeNodeComponent("allVisitOnlineCountBook"),
    popoverCore: makeNodeComponent("popoverCore"),

    // Metadata about props expected for PlasmicProfileActivity
    internalVariantProps: PlasmicProfileActivity__VariantProps,
    internalArgProps: PlasmicProfileActivity__ArgProps
  }
);

export default PlasmicProfileActivity;
/* prettier-ignore-end */
