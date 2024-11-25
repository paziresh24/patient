// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: GKz-Lh1X9Vdq

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

import FilterExpertiseItem from "../../FilterExpertiseItem"; // plasmic-import: Lt7HZLy_mQCZ/component
import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicFilterExpertiseList.module.css"; // plasmic-import: GKz-Lh1X9Vdq/css

import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon
import Icon20Icon from "./icons/PlasmicIcon__Icon20"; // plasmic-import: b2YDtQiXaU1z/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicFilterExpertiseList__VariantMembers = {};
export type PlasmicFilterExpertiseList__VariantsArgs = {};
type VariantPropType = keyof PlasmicFilterExpertiseList__VariantsArgs;
export const PlasmicFilterExpertiseList__VariantProps =
  new Array<VariantPropType>();

export type PlasmicFilterExpertiseList__ArgsType = {
  categories?: any;
  selectedFlters?: any;
  onClickSubCategory?: (link: string, value: string) => void;
};
type ArgPropType = keyof PlasmicFilterExpertiseList__ArgsType;
export const PlasmicFilterExpertiseList__ArgProps = new Array<ArgPropType>(
  "categories",
  "selectedFlters",
  "onClickSubCategory"
);

export type PlasmicFilterExpertiseList__OverridesType = {
  root?: Flex__<"div">;
  text?: Flex__<"div">;
  button?: Flex__<typeof Button>;
};

export interface DefaultFilterExpertiseListProps {
  categories?: any;
  selectedFlters?: any;
  onClickSubCategory?: (link: string, value: string) => void;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicFilterExpertiseList__RenderFunc(props: {
  variants: PlasmicFilterExpertiseList__VariantsArgs;
  args: PlasmicFilterExpertiseList__ArgsType;
  overrides: PlasmicFilterExpertiseList__OverridesType;
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
        path: "selectedCategory",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) =>
          (() => {
            try {
              return $props.selectedFlters?.category || "";
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
        plasmic_antd_5_hostless_css.plasmic_tokens,
        sty.root
      )}
    >
      {(() => {
        try {
          return !$state.selectedCategory;
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
        <div className={classNames(projectcss.all, sty.freeBox__rzmzq)}>
          {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
            (() => {
              try {
                return $props.categories;
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
              <FilterExpertiseItem
                className={classNames(
                  "__wab_instance",
                  sty.filterExpertiseItem__i3Zs9
                )}
                hasBorder={(() => {
                  try {
                    return $props.categories.length !== currentIndex;
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "PlasmicUndefinedDataError"
                    ) {
                      return [];
                    }
                    throw e;
                  }
                })()}
                hasIcon={true}
                isSelected={(() => {
                  try {
                    return $props.selectedFlters?.category
                      ? currentItem.value === $props.selectedFlters?.category
                      : false;
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "PlasmicUndefinedDataError"
                    ) {
                      return [];
                    }
                    throw e;
                  }
                })()}
                key={currentIndex}
                link={(() => {
                  try {
                    return currentItem.url;
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
                onClick={async (value, link) => {
                  const $steps = {};

                  $steps["updateSelectedCategory"] = true
                    ? (() => {
                        const actionArgs = {
                          variable: {
                            objRoot: $state,
                            variablePath: ["selectedCategory"]
                          },
                          operation: 0,
                          value: value
                        };
                        return (({
                          variable,
                          value,
                          startIndex,
                          deleteCount
                        }) => {
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
                    $steps["updateSelectedCategory"] != null &&
                    typeof $steps["updateSelectedCategory"] === "object" &&
                    typeof $steps["updateSelectedCategory"].then === "function"
                  ) {
                    $steps["updateSelectedCategory"] = await $steps[
                      "updateSelectedCategory"
                    ];
                  }
                }}
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
                value={(() => {
                  try {
                    return currentItem.value;
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
      ) : null}
      {(() => {
        try {
          return !!$state.selectedCategory;
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
        <div className={classNames(projectcss.all, sty.freeBox___6BI3F)}>
          <div
            className={classNames(projectcss.all, sty.freeBox___8Wzty)}
            onClick={async event => {
              const $steps = {};

              $steps["updateSelectedCategory"] = true
                ? (() => {
                    const actionArgs = {
                      variable: {
                        objRoot: $state,
                        variablePath: ["selectedCategory"]
                      },
                      operation: 1
                    };
                    return (({ variable, value, startIndex, deleteCount }) => {
                      if (!variable) {
                        return;
                      }
                      const { objRoot, variablePath } = variable;

                      $stateSet(objRoot, variablePath, undefined);
                      return undefined;
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps["updateSelectedCategory"] != null &&
                typeof $steps["updateSelectedCategory"] === "object" &&
                typeof $steps["updateSelectedCategory"].then === "function"
              ) {
                $steps["updateSelectedCategory"] = await $steps[
                  "updateSelectedCategory"
                ];
              }
            }}
          >
            <ChevronRightIcon
              className={classNames(projectcss.all, sty.svg__mlrJn)}
              role={"img"}
            />

            <div
              data-plasmic-name={"text"}
              data-plasmic-override={overrides.text}
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text
              )}
            >
              {
                "\u0628\u0627\u0632\u06af\u0634\u062a \u0628\u0647 \u062a\u062e\u0635\u0635 \u0647\u0627"
              }
            </div>
          </div>
          {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
            (() => {
              try {
                return $props.categories.find(
                  cat => cat.value === $state.selectedCategory
                ).sub_categories;
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
                className={classNames(projectcss.all, sty.freeBox__kWb1M)}
                key={currentIndex}
              >
                <FilterExpertiseItem
                  className={classNames(
                    "__wab_instance",
                    sty.filterExpertiseItem__wtvnW
                  )}
                  isSelected={(() => {
                    try {
                      return $props.selectedFlters?.sub_category
                        ? currentItem.value ===
                            $props.selectedFlters?.sub_category
                        : false;
                    } catch (e) {
                      if (
                        e instanceof TypeError ||
                        e?.plasmicType === "PlasmicUndefinedDataError"
                      ) {
                        return [];
                      }
                      throw e;
                    }
                  })()}
                  link={(() => {
                    try {
                      return currentItem.url;
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
                  onClick={async (value, link) => {
                    const $steps = {};

                    $steps["runOnClickSubCategory"] = true
                      ? (() => {
                          const actionArgs = {
                            eventRef: $props["onClickSubCategory"],
                            args: [
                              (() => {
                                try {
                                  return currentItem.url;
                                } catch (e) {
                                  if (
                                    e instanceof TypeError ||
                                    e?.plasmicType ===
                                      "PlasmicUndefinedDataError"
                                  ) {
                                    return undefined;
                                  }
                                  throw e;
                                }
                              })(),
                              (() => {
                                try {
                                  return currentItem.value;
                                } catch (e) {
                                  if (
                                    e instanceof TypeError ||
                                    e?.plasmicType ===
                                      "PlasmicUndefinedDataError"
                                  ) {
                                    return undefined;
                                  }
                                  throw e;
                                }
                              })()
                            ]
                          };
                          return (({ eventRef, args }) => {
                            return eventRef?.(...(args ?? []));
                          })?.apply(null, [actionArgs]);
                        })()
                      : undefined;
                    if (
                      $steps["runOnClickSubCategory"] != null &&
                      typeof $steps["runOnClickSubCategory"] === "object" &&
                      typeof $steps["runOnClickSubCategory"].then === "function"
                    ) {
                      $steps["runOnClickSubCategory"] = await $steps[
                        "runOnClickSubCategory"
                      ];
                    }
                  }}
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
                  value={(() => {
                    try {
                      return currentItem.value;
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
          <Button
            data-plasmic-name={"button"}
            data-plasmic-override={overrides.button}
            children2={
              <React.Fragment>
                {(() => {
                  try {
                    return `همه تخصص های ${
                      $props.categories.find(
                        cat => cat.value === $state.selectedCategory
                      ).title
                    }`;
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
            className={classNames("__wab_instance", sty.button)}
            color={"text"}
            onClick={async event => {
              const $steps = {};

              $steps["goToPage"] = true
                ? (() => {
                    const actionArgs = {
                      destination: (() => {
                        try {
                          return $props.categories.find(
                            cat => cat.value === $state.selectedCategory
                          ).url;
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
            showStartIcon={true}
            startIcon={
              <Icon20Icon
                className={classNames(projectcss.all, sty.svg__zyzOr)}
                role={"img"}
              />
            }
          />
        </div>
      ) : null}
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "text", "button"],
  text: ["text"],
  button: ["button"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  text: "div";
  button: typeof Button;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicFilterExpertiseList__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicFilterExpertiseList__VariantsArgs;
    args?: PlasmicFilterExpertiseList__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicFilterExpertiseList__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicFilterExpertiseList__ArgsType,
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
          internalArgPropNames: PlasmicFilterExpertiseList__ArgProps,
          internalVariantPropNames: PlasmicFilterExpertiseList__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicFilterExpertiseList__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicFilterExpertiseList";
  } else {
    func.displayName = `PlasmicFilterExpertiseList.${nodeName}`;
  }
  return func;
}

export const PlasmicFilterExpertiseList = Object.assign(
  // Top-level PlasmicFilterExpertiseList renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    text: makeNodeComponent("text"),
    button: makeNodeComponent("button"),

    // Metadata about props expected for PlasmicFilterExpertiseList
    internalVariantProps: PlasmicFilterExpertiseList__VariantProps,
    internalArgProps: PlasmicFilterExpertiseList__ArgProps
  }
);

export default PlasmicFilterExpertiseList;
/* prettier-ignore-end */
