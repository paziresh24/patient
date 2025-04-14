/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: NYqLbXm7Qk5C

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

import ConsultBanner from "../../ConsultBanner"; // plasmic-import: KmDr0VPQLI2_/component
import Sort from "../../Sort"; // plasmic-import: s-wlX7BnSeTl/component
import SearchResults from "../../SearchResults"; // plasmic-import: XhSI4pxMLR3L/component
import { SideEffect } from "@plasmicpkgs/plasmic-basic-components";

import { useScreenVariants as useScreenVariantsbr2UhI7UlpvR } from "../fragment_icons/PlasmicGlobalVariant__Screen"; // plasmic-import: BR2UhI7ulpvR/globalVariant

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicResultView.module.css"; // plasmic-import: NYqLbXm7Qk5C/css

createPlasmicElementProxy;

export type PlasmicResultView__VariantMembers = {};
export type PlasmicResultView__VariantsArgs = {};
type VariantPropType = keyof PlasmicResultView__VariantsArgs;
export const PlasmicResultView__VariantProps = new Array<VariantPropType>();

export type PlasmicResultView__ArgsType = {
  searchResultResponse?: any;
  imageSrcPrefix?: string;
  nextPageTrigger?: () => void;
  paginationLoadingStatus?: boolean;
  location?: any;
  searchFooterSecondaryTasksObject?: any;
  searchFooterQuerySuggestionResponseObject?: any;
  showMyPerformanceMetricsBox?: any;
  topSuggestedCardFeature?: any;
  onlineVisitButtonsCustomDestination?: any;
  orderItems?: any;
  selectedSort?: string;
  selectedTurn?: string;
  totalResult?: string;
  isLoadingResult?: boolean;
  onChangeFreeTurn?: (value: string) => void;
  onChangeSort?: (value: string) => void;
  categoryValue?: string;
  categoryTitle?: string;
  isHideConsultBanner?: boolean;
  isLanding?: string;
};
type ArgPropType = keyof PlasmicResultView__ArgsType;
export const PlasmicResultView__ArgProps = new Array<ArgPropType>(
  "searchResultResponse",
  "imageSrcPrefix",
  "nextPageTrigger",
  "paginationLoadingStatus",
  "location",
  "searchFooterSecondaryTasksObject",
  "searchFooterQuerySuggestionResponseObject",
  "showMyPerformanceMetricsBox",
  "topSuggestedCardFeature",
  "onlineVisitButtonsCustomDestination",
  "orderItems",
  "selectedSort",
  "selectedTurn",
  "totalResult",
  "isLoadingResult",
  "onChangeFreeTurn",
  "onChangeSort",
  "categoryValue",
  "categoryTitle",
  "isHideConsultBanner",
  "isLanding"
);

export type PlasmicResultView__OverridesType = {
  root?: Flex__<"div">;
  freeBox?: Flex__<"div">;
  consultBanner?: Flex__<typeof ConsultBanner>;
  sort?: Flex__<typeof Sort>;
  searchResults?: Flex__<typeof SearchResults>;
  sideEffect?: Flex__<typeof SideEffect>;
};

export interface DefaultResultViewProps {
  searchResultResponse?: any;
  imageSrcPrefix?: string;
  nextPageTrigger?: () => void;
  paginationLoadingStatus?: boolean;
  location?: any;
  searchFooterSecondaryTasksObject?: any;
  searchFooterQuerySuggestionResponseObject?: any;
  showMyPerformanceMetricsBox?: any;
  topSuggestedCardFeature?: any;
  onlineVisitButtonsCustomDestination?: any;
  orderItems?: any;
  selectedSort?: string;
  selectedTurn?: string;
  totalResult?: string;
  isLoadingResult?: boolean;
  onChangeFreeTurn?: (value: string) => void;
  onChangeSort?: (value: string) => void;
  categoryValue?: string;
  categoryTitle?: string;
  isHideConsultBanner?: boolean;
  isLanding?: string;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicResultView__RenderFunc(props: {
  variants: PlasmicResultView__VariantsArgs;
  args: PlasmicResultView__ArgsType;
  overrides: PlasmicResultView__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          imageSrcPrefix: "https://cdn.paziresh24.com",
          paginationLoadingStatus: false,
          selectedSort: ``,
          selectedTurn: ``,
          isLoadingResult: false,
          categoryValue: ``,
          categoryTitle: ``,
          isHideConsultBanner: false
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

  const globalVariants = ensureGlobalVariants({
    screen: useScreenVariantsbr2UhI7UlpvR()
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
        data-plasmic-name={"freeBox"}
        data-plasmic-override={overrides.freeBox}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox)}
      >
        {(hasVariant(globalVariants, "screen", "mobileOnly") ? true : false) ? (
          <ConsultBanner
            data-plasmic-name={"consultBanner"}
            data-plasmic-override={overrides.consultBanner}
            categoryTitle={args.categoryTitle}
            categoryValue={args.categoryValue}
            className={classNames("__wab_instance", sty.consultBanner)}
            isHide={args.isHideConsultBanner}
          />
        ) : null}
        {(
          hasVariant(globalVariants, "screen", "mobileOnly")
            ? false
            : (() => {
                try {
                  return !$props.isLanding;
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return true;
                  }
                  throw e;
                }
              })()
        ) ? (
          <Sort
            data-plasmic-name={"sort"}
            data-plasmic-override={overrides.sort}
            className={classNames("__wab_instance", sty.sort)}
            isLoading={args.isLoadingResult}
            onChangeFreeTurn={args.onChangeFreeTurn}
            onChangeSort={args.onChangeSort}
            orderItems={args.orderItems}
            selectedSort={args.selectedSort}
            selectedTurn={args.selectedTurn}
            total={(() => {
              try {
                return $props.totalResult;
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
          />
        ) : null}
        <SearchResults
          data-plasmic-name={"searchResults"}
          data-plasmic-override={overrides.searchResults}
          className={classNames("__wab_instance", sty.searchResults)}
          imageSrcPrefix={(() => {
            try {
              return $props.imageSrcPrefix;
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
          location={(() => {
            try {
              return $props.location;
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
          nextPageTrigger={async () => {
            const $steps = {};

            $steps["runNextPageTrigger"] = true
              ? (() => {
                  const actionArgs = { eventRef: $props["nextPageTrigger"] };
                  return (({ eventRef, args }) => {
                    return eventRef?.(...(args ?? []));
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["runNextPageTrigger"] != null &&
              typeof $steps["runNextPageTrigger"] === "object" &&
              typeof $steps["runNextPageTrigger"].then === "function"
            ) {
              $steps["runNextPageTrigger"] = await $steps["runNextPageTrigger"];
            }
          }}
          onlineVisitButtonsCustomDestination={(() => {
            try {
              return $props.onlineVisitButtonsCustomDestination;
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
          paginationLoadingStatus={(() => {
            try {
              return $props.paginationLoadingStatus;
            } catch (e) {
              if (
                e instanceof TypeError ||
                e?.plasmicType === "PlasmicUndefinedDataError"
              ) {
                return false;
              }
              throw e;
            }
          })()}
          searchFooterQuerySuggestionResponseObject={(() => {
            try {
              return $props.searchFooterQuerySuggestionResponseObject;
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
          searchFooterSecondaryTasksObject={(() => {
            try {
              return $props.searchFooterSecondaryTasksObject;
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
          searchResultResponse={(() => {
            try {
              return $props.searchResultResponse;
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
          showMyPerformanceMetricsBox={(() => {
            try {
              return $props.showMyPerformanceMetricsBox;
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
          topSuggestedCardFeature={(() => {
            try {
              return $props.topSuggestedCardFeature;
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
        />

        <SideEffect
          data-plasmic-name={"sideEffect"}
          data-plasmic-override={overrides.sideEffect}
          className={classNames("__wab_instance", sty.sideEffect)}
          deps={(() => {
            try {
              return [$props.searchResultResponse.selected_filters];
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
          onMount={async () => {
            const $steps = {};

            $steps["splunk"] =
              !!$props.searchResultResponse.search &&
              typeof window != "undefined"
                ? (() => {
                    const actionArgs = {
                      args: [
                        (() => {
                          try {
                            return (() => {
                              const params = new globalThis.URLSearchParams(
                                globalThis.window.location.search
                              );
                              return {
                                group: "search_metrics",
                                type: "search_view",
                                event: {
                                  filters:
                                    $props.searchResultResponse
                                      ?.selected_filters ?? {},
                                  result_count:
                                    $props.searchResultResponse.search.total ??
                                    "",
                                  location: $props.location.city_name ?? "",
                                  city_id: $props.location.city_id ?? "",
                                  query_id:
                                    $props.searchResultResponse.search
                                      .query_id ?? "",
                                  user_id: $ctx.auth.info?.id ?? null,
                                  user_type:
                                    $ctx.auth.info?.provider?.job_title ??
                                    "normal-user",
                                  url: {
                                    href: window.location.href,
                                    qurey: params?.toString(),
                                    pathname: window.location.pathname,
                                    host: window.location.host
                                  }
                                }
                              };
                            })();
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
                    return $globalActions["Splunk.sendLog"]?.apply(null, [
                      ...actionArgs.args
                    ]);
                  })()
                : undefined;
            if (
              $steps["splunk"] != null &&
              typeof $steps["splunk"] === "object" &&
              typeof $steps["splunk"].then === "function"
            ) {
              $steps["splunk"] = await $steps["splunk"];
            }
          }}
        />
      </Stack__>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: [
    "root",
    "freeBox",
    "consultBanner",
    "sort",
    "searchResults",
    "sideEffect"
  ],
  freeBox: ["freeBox", "consultBanner", "sort", "searchResults", "sideEffect"],
  consultBanner: ["consultBanner"],
  sort: ["sort"],
  searchResults: ["searchResults"],
  sideEffect: ["sideEffect"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  freeBox: "div";
  consultBanner: typeof ConsultBanner;
  sort: typeof Sort;
  searchResults: typeof SearchResults;
  sideEffect: typeof SideEffect;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicResultView__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicResultView__VariantsArgs;
    args?: PlasmicResultView__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicResultView__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicResultView__ArgsType,
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
          internalArgPropNames: PlasmicResultView__ArgProps,
          internalVariantPropNames: PlasmicResultView__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicResultView__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicResultView";
  } else {
    func.displayName = `PlasmicResultView.${nodeName}`;
  }
  return func;
}

export const PlasmicResultView = Object.assign(
  // Top-level PlasmicResultView renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    freeBox: makeNodeComponent("freeBox"),
    consultBanner: makeNodeComponent("consultBanner"),
    sort: makeNodeComponent("sort"),
    searchResults: makeNodeComponent("searchResults"),
    sideEffect: makeNodeComponent("sideEffect"),

    // Metadata about props expected for PlasmicResultView
    internalVariantProps: PlasmicResultView__VariantProps,
    internalArgProps: PlasmicResultView__ArgProps
  }
);

export default PlasmicResultView;
/* prettier-ignore-end */
