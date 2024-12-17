// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: q0EXGV78MZIZ

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
import NewRatingBox from "../../NewRatingBox"; // plasmic-import: wEZ_gicob_AK/component
import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component
import RateProgressBar from "../../RateProgressBar"; // plasmic-import: YorKPsj5-KCA/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_ravi_design_system_css from "../ravi_design_system/plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from "./PlasmicExternalRate.module.css"; // plasmic-import: q0EXGV78MZIZ/css

import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon
import ChevronDownIcon from "../fragment_icons/icons/PlasmicIcon__ChevronDown"; // plasmic-import: aC_QFogxt1Ko/icon
import ChevronUpIcon from "../fragment_icons/icons/PlasmicIcon__ChevronUp"; // plasmic-import: YXreB8gS3SjV/icon

createPlasmicElementProxy;

export type PlasmicExternalRate__VariantMembers = {};
export type PlasmicExternalRate__VariantsArgs = {};
type VariantPropType = keyof PlasmicExternalRate__VariantsArgs;
export const PlasmicExternalRate__VariantProps = new Array<VariantPropType>();

export type PlasmicExternalRate__ArgsType = {
  doctorSlug?: string;
};
type ArgPropType = keyof PlasmicExternalRate__ArgsType;
export const PlasmicExternalRate__ArgProps = new Array<ArgPropType>(
  "doctorSlug"
);

export type PlasmicExternalRate__OverridesType = {
  root?: Flex__<"div">;
  apiRequest?: Flex__<typeof ApiRequest>;
  getPaziresh24Rate?: Flex__<typeof ApiRequest>;
  button?: Flex__<typeof Button>;
  rateProgressBar?: Flex__<typeof RateProgressBar>;
};

export interface DefaultExternalRateProps {
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

function PlasmicExternalRate__RenderFunc(props: {
  variants: PlasmicExternalRate__VariantsArgs;
  args: PlasmicExternalRate__ArgsType;
  overrides: PlasmicExternalRate__OverridesType;
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
        path: "getPaziresh24Rate.data",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "getPaziresh24Rate.error",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "getPaziresh24Rate.loading",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "showMore",
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
        plasmic_ravi_design_system_css.plasmic_tokens,
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        sty.root
      )}
    >
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__iiGlz)}
      >
        <ApiRequest
          data-plasmic-name={"apiRequest"}
          data-plasmic-override={overrides.apiRequest}
          className={classNames("__wab_instance", sty.apiRequest)}
          errorDisplay={null}
          loadingDisplay={null}
          method={"GET"}
          onError={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, ["apiRequest", "error"]).apply(
              null,
              eventArgs
            );

            if (eventArgs.length > 1 && eventArgs[1]) {
              return;
            }
          }}
          onLoading={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, ["apiRequest", "loading"]).apply(
              null,
              eventArgs
            );

            if (eventArgs.length > 1 && eventArgs[1]) {
              return;
            }
          }}
          onSuccess={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, ["apiRequest", "data"]).apply(
              null,
              eventArgs
            );

            if (eventArgs.length > 1 && eventArgs[1]) {
              return;
            }
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
          <div className={classNames(projectcss.all, sty.freeBox__jub0O)}>
            {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
              (() => {
                try {
                  return $state.apiRequest.data.list[0].rates?.filter(
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
                <NewRatingBox
                  className={classNames(
                    "__wab_instance",
                    sty.newRatingBox__far8
                  )}
                  commentCount={(() => {
                    try {
                      return currentItem.rich_snippet.top.detected_extensions
                        .reviews;
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
                  compact={true}
                  key={currentIndex}
                  link={(() => {
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
                  logo={(() => {
                    try {
                      return currentItem.favicon;
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
                />
              );
            })}
          </div>
        </ApiRequest>
        <ApiRequest
          data-plasmic-name={"getPaziresh24Rate"}
          data-plasmic-override={overrides.getPaziresh24Rate}
          className={classNames("__wab_instance", sty.getPaziresh24Rate)}
          errorDisplay={null}
          loadingDisplay={null}
          method={"GET"}
          onError={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, [
              "getPaziresh24Rate",
              "error"
            ]).apply(null, eventArgs);

            if (eventArgs.length > 1 && eventArgs[1]) {
              return;
            }
          }}
          onLoading={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, [
              "getPaziresh24Rate",
              "loading"
            ]).apply(null, eventArgs);

            if (eventArgs.length > 1 && eventArgs[1]) {
              return;
            }
          }}
          onSuccess={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, [
              "getPaziresh24Rate",
              "data"
            ]).apply(null, eventArgs);

            if (eventArgs.length > 1 && eventArgs[1]) {
              return;
            }
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
          <NewRatingBox
            className={classNames("__wab_instance", sty.newRatingBox__r1Rip)}
            commentCount={(() => {
              try {
                return $state.getPaziresh24Rate.data.list[0].count_rates;
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
            isLikeRate={true}
            rate={(() => {
              try {
                return (
                  ($state.getPaziresh24Rate.data.list[0].doctor_encounter +
                    $state.getPaziresh24Rate.data.list[0].quality_of_treatment +
                    $state.getPaziresh24Rate.data.list[0]
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
        </ApiRequest>
      </Stack__>
      {(() => {
        try {
          return $state.getPaziresh24Rate?.data?.list?.length > 0;
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
                    sty.text__hAny
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
                    sty.text__cSa1G
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
                  className={classNames(projectcss.all, sty.svg__mhrgl)}
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
                  className={classNames(projectcss.all, sty.svg__rPi8G)}
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
        <RateProgressBar
          data-plasmic-name={"rateProgressBar"}
          data-plasmic-override={overrides.rateProgressBar}
          averageDoctorEncounter={(() => {
            try {
              return $state.getPaziresh24Rate.data.list[0].doctor_encounter;
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
              return $state.getPaziresh24Rate.data.list[0].explanation_of_issue;
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
              return $state.getPaziresh24Rate.data.list[0].quality_of_treatment;
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
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: [
    "root",
    "apiRequest",
    "getPaziresh24Rate",
    "button",
    "rateProgressBar"
  ],
  apiRequest: ["apiRequest"],
  getPaziresh24Rate: ["getPaziresh24Rate"],
  button: ["button"],
  rateProgressBar: ["rateProgressBar"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  apiRequest: typeof ApiRequest;
  getPaziresh24Rate: typeof ApiRequest;
  button: typeof Button;
  rateProgressBar: typeof RateProgressBar;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicExternalRate__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicExternalRate__VariantsArgs;
    args?: PlasmicExternalRate__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicExternalRate__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicExternalRate__ArgsType,
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
          internalArgPropNames: PlasmicExternalRate__ArgProps,
          internalVariantPropNames: PlasmicExternalRate__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicExternalRate__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicExternalRate";
  } else {
    func.displayName = `PlasmicExternalRate.${nodeName}`;
  }
  return func;
}

export const PlasmicExternalRate = Object.assign(
  // Top-level PlasmicExternalRate renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    apiRequest: makeNodeComponent("apiRequest"),
    getPaziresh24Rate: makeNodeComponent("getPaziresh24Rate"),
    button: makeNodeComponent("button"),
    rateProgressBar: makeNodeComponent("rateProgressBar"),

    // Metadata about props expected for PlasmicExternalRate
    internalVariantProps: PlasmicExternalRate__VariantProps,
    internalArgProps: PlasmicExternalRate__ArgProps
  }
);

export default PlasmicExternalRate;
/* prettier-ignore-end */
