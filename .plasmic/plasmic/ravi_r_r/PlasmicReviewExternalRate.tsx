/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: iUNfhq3ES5BC

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

import { ApiRequest } from "@/common/fragment/components/api-request"; // plasmic-import: rQxw_Usvf1CS/codeComponent
import RaviExternalRate from "../../RaviExternalRate"; // plasmic-import: 1RWEAe1WAk7-/component
import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component
import RateProgressBar from "../../RateProgressBar"; // plasmic-import: YorKPsj5-KCA/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_ravi_design_system_css from "../ravi_design_system/plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from "./PlasmicReviewExternalRate.module.css"; // plasmic-import: iUNfhq3ES5BC/css

import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon
import ChevronDownIcon from "../fragment_icons/icons/PlasmicIcon__ChevronDown"; // plasmic-import: aC_QFogxt1Ko/icon
import ChevronUpIcon from "../fragment_icons/icons/PlasmicIcon__ChevronUp"; // plasmic-import: YXreB8gS3SjV/icon

createPlasmicElementProxy;

export type PlasmicReviewExternalRate__VariantMembers = {};
export type PlasmicReviewExternalRate__VariantsArgs = {};
type VariantPropType = keyof PlasmicReviewExternalRate__VariantsArgs;
export const PlasmicReviewExternalRate__VariantProps =
  new Array<VariantPropType>();

export type PlasmicReviewExternalRate__ArgsType = { doctorSlug?: string };
type ArgPropType = keyof PlasmicReviewExternalRate__ArgsType;
export const PlasmicReviewExternalRate__ArgProps = new Array<ArgPropType>(
  "doctorSlug"
);

export type PlasmicReviewExternalRate__OverridesType = {
  root?: Flex__<"div">;
  externalApi?: Flex__<typeof ApiRequest>;
  paziresh24Api?: Flex__<typeof ApiRequest>;
  button?: Flex__<typeof Button>;
  rateProgressBar?: Flex__<typeof RateProgressBar>;
};

export interface DefaultReviewExternalRateProps {
  doctorSlug?: string;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicReviewExternalRate__RenderFunc(props: {
  variants: PlasmicReviewExternalRate__VariantsArgs;
  args: PlasmicReviewExternalRate__ArgsType;
  overrides: PlasmicReviewExternalRate__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          doctorSlug:
            "\u062f\u06a9\u062a\u0631-\u0645\u0647\u062f\u06cc-\u0637\u06cc\u0628\u06cc"
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

  const stateSpecs: Parameters<typeof useDollarState>[0] = React.useMemo(
    () => [
      {
        path: "showMore",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => false
      },
      {
        path: "externalApi.data",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "externalApi.error",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "externalApi.loading",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "paziresh24Api.data",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "paziresh24Api.error",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "paziresh24Api.loading",
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
        plasmic_ravi_design_system_css.plasmic_tokens,
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        sty.root
      )}
    >
      <div
        className={classNames(projectcss.all, sty.freeBox__yPs0)}
        dir={"rtl"}
      >
        <ApiRequest
          data-plasmic-name={"externalApi"}
          data-plasmic-override={overrides.externalApi}
          className={classNames("__wab_instance", sty.externalApi)}
          errorDisplay={
            <div
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text__fcSeQ
              )}
            >
              {"Error fetching data"}
            </div>
          }
          loadingDisplay={
            <div
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text__ac4A6
              )}
            >
              {"Loading..."}
            </div>
          }
          method={"GET"}
          onError={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, ["externalApi", "error"]).apply(
              null,
              eventArgs
            );
          }}
          onLoading={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, ["externalApi", "loading"]).apply(
              null,
              eventArgs
            );
          }}
          onSuccess={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, ["externalApi", "data"]).apply(
              null,
              eventArgs
            );
          }}
          url={(() => {
            try {
              return `https://apigw.paziresh24.com/ravi/v3/external_rate?where=(doctor_slug,eq,${$props.doctorSlug})`;
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
        >
          {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
            (() => {
              try {
                return $state.externalApi.data.list[0].rates?.filter(
                  item => !item.link.includes("paziresh24")
                );
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return [];
                }
                throw e;
              }
            })()
          ).map((__plasmic_item_0, __plasmic_idx_0) => {
            const currentItem = __plasmic_item_0;
            const currentIndex = __plasmic_idx_0;
            return (
              <div
                className={classNames(projectcss.all, sty.freeBox__npnbn)}
                key={currentIndex}
              >
                <RaviExternalRate
                  className={classNames(
                    "__wab_instance",
                    sty.raviExternalRate__tXuSq
                  )}
                  commentCount={(() => {
                    try {
                      return (
                        currentItem.rich_snippet.top.detected_extensions
                          .reviews || 0
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
                  })()}
                  name={(() => {
                    try {
                      return currentItem.source;
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
                  rate={(() => {
                    try {
                      return currentItem.rich_snippet.top.detected_extensions
                        .rating;
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
                  url={(() => {
                    try {
                      return currentItem.link;
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
              </div>
            );
          })}
          <ApiRequest
            data-plasmic-name={"paziresh24Api"}
            data-plasmic-override={overrides.paziresh24Api}
            className={classNames("__wab_instance", sty.paziresh24Api)}
            errorDisplay={null}
            loadingDisplay={
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__tHz9Q
                )}
              >
                {"Loading..."}
              </div>
            }
            method={"GET"}
            onError={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, [
                "paziresh24Api",
                "error"
              ]).apply(null, eventArgs);
            }}
            onLoading={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, [
                "paziresh24Api",
                "loading"
              ]).apply(null, eventArgs);
            }}
            onSuccess={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, [
                "paziresh24Api",
                "data"
              ]).apply(null, eventArgs);
            }}
            url={(() => {
              try {
                return `https://apigw.paziresh24.com/ravi/v1/rate?where=(doctor_slug,eq,${$props.doctorSlug})`;
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
          >
            <div className={classNames(projectcss.all, sty.freeBox__gC1A)}>
              <RaviExternalRate
                className={classNames(
                  "__wab_instance",
                  sty.raviExternalRate___6H0Bq
                )}
                commentCount={(() => {
                  try {
                    return $state.paziresh24Api.data.list[0].count_rates;
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
                name={"\u067e\u0630\u06cc\u0631\u0634 \u06f2\u06f4"}
                rate={(() => {
                  try {
                    return (
                      ($state.paziresh24Api.data.list[0].doctor_encounter +
                        $state.paziresh24Api.data.list[0].quality_of_treatment +
                        $state.paziresh24Api.data.list[0]
                          .explanation_of_issue) /
                      3
                    ).toFixed(1);
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
            </div>
          </ApiRequest>
        </ApiRequest>
      </div>
      <div className={classNames(projectcss.all, sty.freeBox__owTrf)}>
        <div className={classNames(projectcss.all, sty.freeBox___7Q9CH)}>
          <Button
            data-plasmic-name={"button"}
            data-plasmic-override={overrides.button}
            children2={
              <React.Fragment>
                {(() => {
                  try {
                    return $state.showMore;
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
                      sty.text__mwiTn
                    )}
                  >
                    {"\u06a9\u0645\u062a\u0631"}
                  </div>
                ) : null}
                {(() => {
                  try {
                    return !$state.showMore;
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
                      sty.text___2JoCl
                    )}
                  >
                    {"\u0628\u06cc\u0634\u062a\u0631"}
                  </div>
                ) : null}
              </React.Fragment>
            }
            className={classNames("__wab_instance", sty.button)}
            color={"text"}
            endIcon={
              <React.Fragment>
                {(() => {
                  try {
                    return !$state.showMore;
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
                  <ChevronDownIcon
                    className={classNames(projectcss.all, sty.svg__yeGel)}
                    role={"img"}
                  />
                ) : null}
                {(() => {
                  try {
                    return $state.showMore;
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
                  <ChevronUpIcon
                    className={classNames(projectcss.all, sty.svg__rtVB)}
                    role={"img"}
                  />
                ) : null}
              </React.Fragment>
            }
            onClick={async event => {
              const $steps = {};

              $steps["updateShowMore"] = true
                ? (() => {
                    const actionArgs = {
                      variable: {
                        objRoot: $state,
                        variablePath: ["showMore"]
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
                $steps["updateShowMore"] != null &&
                typeof $steps["updateShowMore"] === "object" &&
                typeof $steps["updateShowMore"].then === "function"
              ) {
                $steps["updateShowMore"] = await $steps["updateShowMore"];
              }
            }}
            showEndIcon={true}
            size={"compact"}
          />
        </div>
        {(() => {
          try {
            return $state.showMore;
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
          <RateProgressBar
            data-plasmic-name={"rateProgressBar"}
            data-plasmic-override={overrides.rateProgressBar}
            averageDoctorEncounter={(() => {
              try {
                return $state.paziresh24Api.data.list[0].doctor_encounter;
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
            averageExplanationOfIssue={(() => {
              try {
                return $state.paziresh24Api.data.list[0].explanation_of_issue;
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
            averageQualityOfTreatment={(() => {
              try {
                return $state.paziresh24Api.data.list[0].quality_of_treatment;
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
            className={classNames("__wab_instance", sty.rateProgressBar)}
          />
        ) : null}
      </div>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "externalApi", "paziresh24Api", "button", "rateProgressBar"],
  externalApi: ["externalApi", "paziresh24Api"],
  paziresh24Api: ["paziresh24Api"],
  button: ["button"],
  rateProgressBar: ["rateProgressBar"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  externalApi: typeof ApiRequest;
  paziresh24Api: typeof ApiRequest;
  button: typeof Button;
  rateProgressBar: typeof RateProgressBar;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicReviewExternalRate__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicReviewExternalRate__VariantsArgs;
    args?: PlasmicReviewExternalRate__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicReviewExternalRate__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicReviewExternalRate__ArgsType,
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
          internalArgPropNames: PlasmicReviewExternalRate__ArgProps,
          internalVariantPropNames: PlasmicReviewExternalRate__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicReviewExternalRate__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicReviewExternalRate";
  } else {
    func.displayName = `PlasmicReviewExternalRate.${nodeName}`;
  }
  return func;
}

export const PlasmicReviewExternalRate = Object.assign(
  // Top-level PlasmicReviewExternalRate renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    externalApi: makeNodeComponent("externalApi"),
    paziresh24Api: makeNodeComponent("paziresh24Api"),
    button: makeNodeComponent("button"),
    rateProgressBar: makeNodeComponent("rateProgressBar"),

    // Metadata about props expected for PlasmicReviewExternalRate
    internalVariantProps: PlasmicReviewExternalRate__VariantProps,
    internalArgProps: PlasmicReviewExternalRate__ArgProps
  }
);

export default PlasmicReviewExternalRate;
/* prettier-ignore-end */
