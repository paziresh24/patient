/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: wEZ_gicob_AK

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

import StarRate2 from "../../StarRate2"; // plasmic-import: XaRCJPYGaC31/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_ravi_design_system_css from "../ravi_design_system/plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from "./PlasmicNewRatingBox.module.css"; // plasmic-import: wEZ_gicob_AK/css

createPlasmicElementProxy;

export type PlasmicNewRatingBox__VariantMembers = {
  compact: "compact";
  isLikeRate: "isLikeRate";
};
export type PlasmicNewRatingBox__VariantsArgs = {
  compact?: SingleBooleanChoiceArg<"compact">;
  isLikeRate?: SingleBooleanChoiceArg<"isLikeRate">;
};
type VariantPropType = keyof PlasmicNewRatingBox__VariantsArgs;
export const PlasmicNewRatingBox__VariantProps = new Array<VariantPropType>(
  "compact",
  "isLikeRate"
);

export type PlasmicNewRatingBox__ArgsType = {
  rate?: number;
  commentCount?: number;
  logo?: string;
  name?: string;
  link?: string;
};
type ArgPropType = keyof PlasmicNewRatingBox__ArgsType;
export const PlasmicNewRatingBox__ArgProps = new Array<ArgPropType>(
  "rate",
  "commentCount",
  "logo",
  "name",
  "link"
);

export type PlasmicNewRatingBox__OverridesType = {
  root?: Flex__<"div">;
  starRate2?: Flex__<typeof StarRate2>;
  span?: Flex__<"span">;
};

export interface DefaultNewRatingBoxProps {
  rate?: number;
  commentCount?: number;
  logo?: string;
  name?: string;
  link?: string;
  compact?: SingleBooleanChoiceArg<"compact">;
  isLikeRate?: SingleBooleanChoiceArg<"isLikeRate">;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicNewRatingBox__RenderFunc(props: {
  variants: PlasmicNewRatingBox__VariantsArgs;
  args: PlasmicNewRatingBox__ArgsType;
  overrides: PlasmicNewRatingBox__OverridesType;
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
        path: "compact",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.compact
      },
      {
        path: "isLikeRate",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.isLikeRate
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
        plasmic_fragment_design_system_css.plasmic_tokens,
        plasmic_ravi_design_system_css.plasmic_tokens,
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        sty.root,
        {
          [sty.rootcompact]: hasVariant($state, "compact", "compact"),
          [sty.rootcompact_isLikeRate]:
            hasVariant($state, "isLikeRate", "isLikeRate") &&
            hasVariant($state, "compact", "compact"),
          [sty.rootisLikeRate]: hasVariant($state, "isLikeRate", "isLikeRate")
        }
      )}
    >
      <div
        className={classNames(
          projectcss.all,
          projectcss.__wab_text,
          sty.text__fM4Jq,
          {
            [sty.textcompact__fM4JqRBwm9]: hasVariant(
              $state,
              "compact",
              "compact"
            ),
            [sty.textisLikeRate__fM4JqlvHcy]: hasVariant(
              $state,
              "isLikeRate",
              "isLikeRate"
            )
          }
        )}
      >
        <React.Fragment>
          {(() => {
            try {
              return $props.rate;
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
      <div
        className={classNames(projectcss.all, sty.freeBox__dz2Z4, {
          [sty.freeBoxcompact__dz2Z4RBwm9]: hasVariant(
            $state,
            "compact",
            "compact"
          ),
          [sty.freeBoxisLikeRate__dz2Z4LvHcy]: hasVariant(
            $state,
            "isLikeRate",
            "isLikeRate"
          )
        })}
      >
        <div
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text__zkbaK,
            {
              [sty.textisLikeRate__zkbaKlvHcy]: hasVariant(
                $state,
                "isLikeRate",
                "isLikeRate"
              )
            }
          )}
        >
          {"\u067e\u0630\u06cc\u0631\u063424 : "}
        </div>
        <div
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text__t95VZ,
            {
              [sty.textisLikeRate__t95VZlvHcy]: hasVariant(
                $state,
                "isLikeRate",
                "isLikeRate"
              )
            }
          )}
        >
          <React.Fragment>
            {(() => {
              try {
                return $props.rate;
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
        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__uVqwL, {
            [sty.freeBoxcompact__uVqwLrBwm9]: hasVariant(
              $state,
              "compact",
              "compact"
            ),
            [sty.freeBoxisLikeRate__uVqwLlvHcy]: hasVariant(
              $state,
              "isLikeRate",
              "isLikeRate"
            )
          })}
          dir={(() => {
            try {
              return undefined;
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
                return [0, 1, 2, 3, 4];
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
              <StarRate2
                data-plasmic-name={"starRate2"}
                data-plasmic-override={overrides.starRate2}
                className={classNames("__wab_instance", sty.starRate2, {
                  [sty.starRate2compact]: hasVariant(
                    $state,
                    "compact",
                    "compact"
                  ),
                  [sty.starRate2isLikeRate]: hasVariant(
                    $state,
                    "isLikeRate",
                    "isLikeRate"
                  )
                })}
                key={currentIndex}
                rate={(() => {
                  try {
                    return Math.floor($props.rate) > currentItem
                      ? "_1"
                      : "_" +
                          ($props.rate - currentItem)
                            .toFixed(1)
                            .replace(".", "");
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "PlasmicUndefinedDataError"
                    ) {
                      return "_0";
                    }
                    throw e;
                  }
                })()}
              />
            );
          })}
        </Stack__>
        <div
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text__cxd8S,
            {
              [sty.textcompact__cxd8SrBwm9]: hasVariant(
                $state,
                "compact",
                "compact"
              ),
              [sty.textisLikeRate__cxd8SlvHcy]: hasVariant(
                $state,
                "isLikeRate",
                "isLikeRate"
              )
            }
          )}
        >
          {hasVariant($state, "compact", "compact") ? (
            <React.Fragment>
              <React.Fragment>{" (\u0627\u0632 "}</React.Fragment>
              {
                <span
                  data-plasmic-name={"span"}
                  data-plasmic-override={overrides.span}
                  className={classNames(
                    projectcss.all,
                    projectcss.span,
                    projectcss.__wab_text,
                    projectcss.plasmic_default__inline,
                    sty.span,
                    {
                      [sty.spancompact]: hasVariant(
                        $state,
                        "compact",
                        "compact"
                      ),
                      [sty.spanisLikeRate]: hasVariant(
                        $state,
                        "isLikeRate",
                        "isLikeRate"
                      )
                    }
                  )}
                >
                  <React.Fragment>
                    {(() => {
                      try {
                        return $props.commentCount;
                      } catch (e) {
                        if (
                          e instanceof TypeError ||
                          e?.plasmicType === "PlasmicUndefinedDataError"
                        ) {
                          return "12303";
                        }
                        throw e;
                      }
                    })()}
                  </React.Fragment>
                </span>
              }
              <React.Fragment>{" \u0646\u0638\u0631)"}</React.Fragment>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <React.Fragment>{"( \u0627\u0632 "}</React.Fragment>
              {
                <span
                  data-plasmic-name={"span"}
                  data-plasmic-override={overrides.span}
                  className={classNames(
                    projectcss.all,
                    projectcss.span,
                    projectcss.__wab_text,
                    projectcss.plasmic_default__inline,
                    sty.span,
                    {
                      [sty.spancompact]: hasVariant(
                        $state,
                        "compact",
                        "compact"
                      ),
                      [sty.spanisLikeRate]: hasVariant(
                        $state,
                        "isLikeRate",
                        "isLikeRate"
                      )
                    }
                  )}
                >
                  <React.Fragment>
                    {(() => {
                      try {
                        return $props.commentCount;
                      } catch (e) {
                        if (
                          e instanceof TypeError ||
                          e?.plasmicType === "PlasmicUndefinedDataError"
                        ) {
                          return "12303";
                        }
                        throw e;
                      }
                    })()}
                  </React.Fragment>
                </span>
              }
              <React.Fragment>{" \u0646\u0638\u0631)"}</React.Fragment>
            </React.Fragment>
          )}
        </div>
      </div>
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__jKc6I, {
          [sty.freeBoxcompact__jKc6IrBwm9]: hasVariant(
            $state,
            "compact",
            "compact"
          ),
          [sty.freeBoxisLikeRate__jKc6IlvHcy]: hasVariant(
            $state,
            "isLikeRate",
            "isLikeRate"
          )
        })}
        onClick={async event => {
          const $steps = {};

          $steps["goToPage"] = true
            ? (() => {
                const actionArgs = {
                  destination: (() => {
                    try {
                      return $props.link;
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
      >
        <div
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text___4KITv,
            {
              [sty.textcompact___4KITvRBwm9]: hasVariant(
                $state,
                "compact",
                "compact"
              )
            }
          )}
        >
          <React.Fragment>
            {(() => {
              try {
                return $props.name;
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
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "starRate2", "span"],
  starRate2: ["starRate2"],
  span: ["span"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  starRate2: typeof StarRate2;
  span: "span";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicNewRatingBox__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicNewRatingBox__VariantsArgs;
    args?: PlasmicNewRatingBox__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicNewRatingBox__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicNewRatingBox__ArgsType,
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
          internalArgPropNames: PlasmicNewRatingBox__ArgProps,
          internalVariantPropNames: PlasmicNewRatingBox__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicNewRatingBox__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicNewRatingBox";
  } else {
    func.displayName = `PlasmicNewRatingBox.${nodeName}`;
  }
  return func;
}

export const PlasmicNewRatingBox = Object.assign(
  // Top-level PlasmicNewRatingBox renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    starRate2: makeNodeComponent("starRate2"),
    span: makeNodeComponent("span"),

    // Metadata about props expected for PlasmicNewRatingBox
    internalVariantProps: PlasmicNewRatingBox__VariantProps,
    internalArgProps: PlasmicNewRatingBox__ArgProps
  }
);

export default PlasmicNewRatingBox;
/* prettier-ignore-end */
