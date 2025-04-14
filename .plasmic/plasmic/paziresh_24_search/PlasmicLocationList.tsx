/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: WC4zcEVYQzEC

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

import ListItem from "../../ListItem"; // plasmic-import: SNiC1tNNivYG/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicLocationList.module.css"; // plasmic-import: WC4zcEVYQzEC/css

import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon

createPlasmicElementProxy;

export type PlasmicLocationList__VariantMembers = {};
export type PlasmicLocationList__VariantsArgs = {};
type VariantPropType = keyof PlasmicLocationList__VariantsArgs;
export const PlasmicLocationList__VariantProps = new Array<VariantPropType>();

export type PlasmicLocationList__ArgsType = {
  locations?: any;
  selectedProvinceId?: string;
  searchTerm?: string;
  onClick?: (value: any) => void;
};
type ArgPropType = keyof PlasmicLocationList__ArgsType;
export const PlasmicLocationList__ArgProps = new Array<ArgPropType>(
  "locations",
  "selectedProvinceId",
  "searchTerm",
  "onClick"
);

export type PlasmicLocationList__OverridesType = {
  root?: Flex__<"div">;
  svg?: Flex__<"svg">;
  text?: Flex__<"div">;
};

export interface DefaultLocationListProps {
  locations?: any;
  selectedProvinceId?: string;
  searchTerm?: string;
  onClick?: (value: any) => void;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicLocationList__RenderFunc(props: {
  variants: PlasmicLocationList__VariantsArgs;
  args: PlasmicLocationList__ArgsType;
  overrides: PlasmicLocationList__OverridesType;
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
        path: "selectedId",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => ""
      },
      {
        path: "searchCity",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) =>
          (() => {
            try {
              return $props.searchTerm;
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
        sty.root
      )}
    >
      {(() => {
        try {
          return !$state.selectedId && !$state.searchCity;
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
        <div className={classNames(projectcss.all, sty.freeBox__mbin)}>
          {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
            (() => {
              try {
                return $props.locations.province;
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
              <ListItem
                className={classNames("__wab_instance", sty.listItem__wPEw3)}
                hasIcon={true}
                isSelected={(() => {
                  try {
                    return currentItem.id == $props.selectedProvinceId;
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
                onClick={async value => {
                  const $steps = {};

                  $steps["updateSelectedId"] = true
                    ? (() => {
                        const actionArgs = {
                          variable: {
                            objRoot: $state,
                            variablePath: ["selectedId"]
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
                    $steps["updateSelectedId"] != null &&
                    typeof $steps["updateSelectedId"] === "object" &&
                    typeof $steps["updateSelectedId"].then === "function"
                  ) {
                    $steps["updateSelectedId"] = await $steps[
                      "updateSelectedId"
                    ];
                  }
                }}
                title={(() => {
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
                value={(() => {
                  try {
                    return currentItem.id;
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
          return !!$state.selectedId && !$state.searchCity;
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
        <div className={classNames(projectcss.all, sty.freeBox__mnUkq)}>
          <div
            className={classNames(projectcss.all, sty.freeBox__vAodt)}
            onClick={async event => {
              const $steps = {};

              $steps["updateSelectedId"] = true
                ? (() => {
                    const actionArgs = {
                      variable: {
                        objRoot: $state,
                        variablePath: ["selectedId"]
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
                $steps["updateSelectedId"] != null &&
                typeof $steps["updateSelectedId"] === "object" &&
                typeof $steps["updateSelectedId"].then === "function"
              ) {
                $steps["updateSelectedId"] = await $steps["updateSelectedId"];
              }
            }}
          >
            <ChevronRightIcon
              data-plasmic-name={"svg"}
              data-plasmic-override={overrides.svg}
              className={classNames(projectcss.all, sty.svg)}
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
                "\u0628\u0631\u06af\u0634\u062a \u0628\u0647 \u0644\u06cc\u0633\u062a \u0627\u0633\u062a\u0627\u0646 \u0647\u0627"
              }
            </div>
          </div>
          {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
            (() => {
              try {
                return $props.locations.city.filter(
                  city => city.province_id == $state.selectedId
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
              <ListItem
                className={classNames("__wab_instance", sty.listItem__ekTkz)}
                hasIcon={true}
                isBold={(() => {
                  try {
                    return currentItem.is_capital == "1";
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
                isSelected={(() => {
                  try {
                    return currentItem.id == $props.selectedProvinceId;
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
                onClick={async value => {
                  const $steps = {};

                  $steps["runOnClick"] = true
                    ? (() => {
                        const actionArgs = {
                          eventRef: $props["onClick"],
                          args: [
                            (() => {
                              try {
                                return currentItem;
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
                        return (({ eventRef, args }) => {
                          return eventRef?.(...(args ?? []));
                        })?.apply(null, [actionArgs]);
                      })()
                    : undefined;
                  if (
                    $steps["runOnClick"] != null &&
                    typeof $steps["runOnClick"] === "object" &&
                    typeof $steps["runOnClick"].then === "function"
                  ) {
                    $steps["runOnClick"] = await $steps["runOnClick"];
                  }
                }}
                title={(() => {
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
                value={(() => {
                  try {
                    return currentItem.id;
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
          return !!$state.searchCity;
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
        <div className={classNames(projectcss.all, sty.freeBox__i4YPb)}>
          {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
            (() => {
              try {
                return $props.locations.city.filter(city =>
                  city.name.includes($state.searchCity)
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
              <ListItem
                className={classNames("__wab_instance", sty.listItem__ua9D6)}
                hasIcon={true}
                key={currentIndex}
                onClick={async value => {
                  const $steps = {};

                  $steps["runOnClick"] = true
                    ? (() => {
                        const actionArgs = {
                          eventRef: $props["onClick"],
                          args: [
                            (() => {
                              try {
                                return currentItem;
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
                        return (({ eventRef, args }) => {
                          return eventRef?.(...(args ?? []));
                        })?.apply(null, [actionArgs]);
                      })()
                    : undefined;
                  if (
                    $steps["runOnClick"] != null &&
                    typeof $steps["runOnClick"] === "object" &&
                    typeof $steps["runOnClick"].then === "function"
                  ) {
                    $steps["runOnClick"] = await $steps["runOnClick"];
                  }
                }}
                subtitle={(() => {
                  try {
                    return $props.locations.province.find(
                      item => item.id == currentItem.province_id
                    ).name;
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
                value={(() => {
                  try {
                    return currentItem.id;
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
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "svg", "text"],
  svg: ["svg"],
  text: ["text"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  svg: "svg";
  text: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicLocationList__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicLocationList__VariantsArgs;
    args?: PlasmicLocationList__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicLocationList__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicLocationList__ArgsType,
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
          internalArgPropNames: PlasmicLocationList__ArgProps,
          internalVariantPropNames: PlasmicLocationList__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicLocationList__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicLocationList";
  } else {
    func.displayName = `PlasmicLocationList.${nodeName}`;
  }
  return func;
}

export const PlasmicLocationList = Object.assign(
  // Top-level PlasmicLocationList renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    svg: makeNodeComponent("svg"),
    text: makeNodeComponent("text"),

    // Metadata about props expected for PlasmicLocationList
    internalVariantProps: PlasmicLocationList__VariantProps,
    internalArgProps: PlasmicLocationList__ArgProps
  }
);

export default PlasmicLocationList;
/* prettier-ignore-end */
