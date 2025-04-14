/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: 4XueZ64JE9vm

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

import { ApiRequest } from "@/common/fragment/components/api-request"; // plasmic-import: vW4UBuHCFshJ/codeComponent
import Alert from "../../Alert"; // plasmic-import: ob3Y6-WV9T3i/component
import ProductCard from "../../ProductCard"; // plasmic-import: ZuA2HO8MLBhh/component
import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSuggestedDoctor.module.css"; // plasmic-import: 4XueZ64JE9vm/css

import Icon14Icon from "./icons/PlasmicIcon__Icon14"; // plasmic-import: eKLBqU_Fr5SV/icon
import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

import { random as __lib_lodash__random } from "lodash";

createPlasmicElementProxy;

export type PlasmicSuggestedDoctor__VariantMembers = {};
export type PlasmicSuggestedDoctor__VariantsArgs = {};
type VariantPropType = keyof PlasmicSuggestedDoctor__VariantsArgs;
export const PlasmicSuggestedDoctor__VariantProps =
  new Array<VariantPropType>();

export type PlasmicSuggestedDoctor__ArgsType = {
  categoryTitle?: string;
  categoryValue?: string;
};
type ArgPropType = keyof PlasmicSuggestedDoctor__ArgsType;
export const PlasmicSuggestedDoctor__ArgProps = new Array<ArgPropType>(
  "categoryTitle",
  "categoryValue"
);

export type PlasmicSuggestedDoctor__OverridesType = {
  apiRequest?: Flex__<typeof ApiRequest>;
  svg?: Flex__<"svg">;
  productCard?: Flex__<typeof ProductCard>;
  text?: Flex__<"div">;
};

export interface DefaultSuggestedDoctorProps {
  categoryTitle?: string;
  categoryValue?: string;
}

const $$ = {
  lodash: {
    random: __lib_lodash__random
  }
};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSuggestedDoctor__RenderFunc(props: {
  variants: PlasmicSuggestedDoctor__VariantsArgs;
  args: PlasmicSuggestedDoctor__ArgsType;
  overrides: PlasmicSuggestedDoctor__OverridesType;
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
    <ApiRequest
      data-plasmic-name={"apiRequest"}
      data-plasmic-override={overrides.apiRequest}
      data-plasmic-root={true}
      data-plasmic-for-node={forNode}
      className={classNames(
        "__wab_instance",
        projectcss.root_reset,
        projectcss.plasmic_default_styles,
        projectcss.plasmic_mixins,
        projectcss.plasmic_tokens,
        plasmic_fragment_design_system_css.plasmic_tokens,
        sty.apiRequest
      )}
      errorDisplay={null}
      loadingDisplay={
        <div className={classNames(projectcss.all, sty.freeBox__yb4Co)}>
          <Icon14Icon
            data-plasmic-name={"svg"}
            data-plasmic-override={overrides.svg}
            className={classNames(projectcss.all, sty.svg)}
            role={"img"}
          />
        </div>
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
      url={` ${(() => {
        const category = !!$props.categoryValue
          ? $props.categoryValue
          : "general-practitioner";
        return `https://apigw.paziresh24.com/seapi/v1/search/ir/${category}?turn_type=consult`;
      })()}`}
    >
      <div className={classNames(projectcss.all, sty.freeBox__azUh)}>
        <Alert
          className={classNames("__wab_instance", sty.alert__lLPky)}
          hasIcon={true}
          success={true}
          text={
            "\u0628\u062f\u0648\u0646 \u062e\u0631\u0648\u062c \u0627\u0632 \u0645\u0646\u0632\u0644\u060c \u0622\u0646\u0644\u0627\u06cc\u0646 \u0648\u06cc\u0632\u06cc\u062a \u0634\u0648\u06cc\u062f."
          }
        />

        {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
          (() => {
            try {
              return (() => {
                const random = $$.lodash.random(0, 2);
                return [
                  $state.apiRequest.data.search.result.slice(0, 3)?.[random]
                ];
              })();
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
              className={classNames(projectcss.all, sty.freeBox__qrbDp)}
              key={currentIndex}
            >
              <ProductCard
                data-plasmic-name={"productCard"}
                data-plasmic-override={overrides.productCard}
                avatarAltText={(() => {
                  try {
                    return currentItem.title;
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
                avatarRingColor={"green"}
                avatarSrc={(() => {
                  try {
                    return `https://cdn.paziresh24.com${currentItem.image}`;
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
                avatarVerifiedTick={true}
                className={classNames("__wab_instance", sty.productCard)}
                eventTrigger={async (elementName, elementContent) => {
                  const $steps = {};

                  $steps["goToPage"] = true
                    ? (() => {
                        const actionArgs = {
                          destination: (() => {
                            try {
                              return `/booking/${currentItem.slug}/?centerId=5532&skipTimeSelectStep=true`;
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
                rateCount={(() => {
                  try {
                    return currentItem.rates_count;
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
                satisfactionPercent={(() => {
                  try {
                    return currentItem.satisfaction;
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
                slug={(() => {
                  try {
                    return currentItem.name;
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
                subTitle={(() => {
                  try {
                    return currentItem.display_expertise;
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
                title={(() => {
                  try {
                    return currentItem.title;
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

              <Alert
                className={classNames("__wab_instance", sty.alert__jZgfP)}
                error={true}
                hasIcon={true}
                text={
                  "\u062a\u0636\u0645\u06cc\u0646 \u0628\u0627\u0632\u067e\u0631\u062f\u0627\u062e\u062a \u0645\u0628\u0644\u063a \u0648\u06cc\u0632\u06cc\u062a \u062f\u0631 \u0635\u0648\u0631\u062a \u0646\u0627\u0631\u0636\u0627\u06cc\u062a\u06cc"
                }
              />

              <Button
                children2={
                  <React.Fragment>
                    {(() => {
                      try {
                        return `گفتگو با ${currentItem.display_name}`;
                      } catch (e) {
                        if (
                          e instanceof TypeError ||
                          e?.plasmicType === "PlasmicUndefinedDataError"
                        ) {
                          return "Button";
                        }
                        throw e;
                      }
                    })()}
                  </React.Fragment>
                }
                className={classNames("__wab_instance", sty.button__vzDuk)}
                onClick={async event => {
                  const $steps = {};

                  $steps["goToPage"] = true
                    ? (() => {
                        const actionArgs = {
                          destination: (() => {
                            try {
                              return `/booking/${currentItem.slug}/?centerId=5532&skipTimeSelectStep=true`;
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
              />
            </div>
          );
        })}
        <Button
          children2={
            <div
              data-plasmic-name={"text"}
              data-plasmic-override={overrides.text}
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text
              )}
            >
              <React.Fragment>
                {(() => {
                  try {
                    return `مشاهده سایر پزشکان آنلاین ${
                      $props?.categoryTitle || ""
                    }`;
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "PlasmicUndefinedDataError"
                    ) {
                      return "\u0645\u0634\u0627\u0647\u062f\u0647 \u0633\u0627\u06cc\u0631 \u067e\u0632\u0634\u06a9\u0627\u0646 \u0622\u0646\u0644\u0627\u06cc\u0646";
                    }
                    throw e;
                  }
                })()}
              </React.Fragment>
            </div>
          }
          className={classNames("__wab_instance", sty.button__xa6At)}
          color={"text"}
          onClick={async event => {
            const $steps = {};

            $steps["goToHttpsWwwPaziresh24ComConsultFromRecommendSection1"] =
              !$props.categoryValue
                ? (() => {
                    const actionArgs = {
                      destination:
                        "https://www.paziresh24.com/consult?from_recommend_section=1"
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
              $steps["goToHttpsWwwPaziresh24ComConsultFromRecommendSection1"] !=
                null &&
              typeof $steps[
                "goToHttpsWwwPaziresh24ComConsultFromRecommendSection1"
              ] === "object" &&
              typeof $steps[
                "goToHttpsWwwPaziresh24ComConsultFromRecommendSection1"
              ].then === "function"
            ) {
              $steps["goToHttpsWwwPaziresh24ComConsultFromRecommendSection1"] =
                await $steps[
                  "goToHttpsWwwPaziresh24ComConsultFromRecommendSection1"
                ];
            }

            $steps["goToPage"] = !!$props.categoryValue
              ? (() => {
                  const actionArgs = {
                    destination: (() => {
                      try {
                        return `/s/ir/${$props.categoryValue}?turn_type=consult`;
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
        />
      </div>
    </ApiRequest>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  apiRequest: ["apiRequest", "svg", "productCard", "text"],
  svg: ["svg"],
  productCard: ["productCard"],
  text: ["text"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  apiRequest: typeof ApiRequest;
  svg: "svg";
  productCard: typeof ProductCard;
  text: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSuggestedDoctor__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSuggestedDoctor__VariantsArgs;
    args?: PlasmicSuggestedDoctor__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSuggestedDoctor__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicSuggestedDoctor__ArgsType,
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
          internalArgPropNames: PlasmicSuggestedDoctor__ArgProps,
          internalVariantPropNames: PlasmicSuggestedDoctor__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSuggestedDoctor__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "apiRequest") {
    func.displayName = "PlasmicSuggestedDoctor";
  } else {
    func.displayName = `PlasmicSuggestedDoctor.${nodeName}`;
  }
  return func;
}

export const PlasmicSuggestedDoctor = Object.assign(
  // Top-level PlasmicSuggestedDoctor renders the root element
  makeNodeComponent("apiRequest"),
  {
    // Helper components rendering sub-elements
    svg: makeNodeComponent("svg"),
    productCard: makeNodeComponent("productCard"),
    text: makeNodeComponent("text"),

    // Metadata about props expected for PlasmicSuggestedDoctor
    internalVariantProps: PlasmicSuggestedDoctor__VariantProps,
    internalArgProps: PlasmicSuggestedDoctor__ArgProps
  }
);

export default PlasmicSuggestedDoctor;
/* prettier-ignore-end */
