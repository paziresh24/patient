/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: zLShj09Q9POm

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

import FilterRowItem from "../../FilterRowItem"; // plasmic-import: gbTY0L-vUhOv/component
import Dialog from "../../Dialog"; // plasmic-import: FJiI2-N1is_F/component
import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component
import FilterItemToggle from "../../FilterItemToggle"; // plasmic-import: mTGIwE12clXg/component
import FilterItemSingleSelect from "../../FilterItemSingleSelect"; // plasmic-import: AK8GMS7oZ_Fh/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSearchFilters.module.css"; // plasmic-import: zLShj09Q9POm/css

import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicSearchFilters__VariantMembers = {};
export type PlasmicSearchFilters__VariantsArgs = {};
type VariantPropType = keyof PlasmicSearchFilters__VariantsArgs;
export const PlasmicSearchFilters__VariantProps = new Array<VariantPropType>();

export type PlasmicSearchFilters__ArgsType = {
  filters?: any;
  selected?: any;
  onSelectedChange?: (val: string) => void;
};
type ArgPropType = keyof PlasmicSearchFilters__ArgsType;
export const PlasmicSearchFilters__ArgProps = new Array<ArgPropType>(
  "filters",
  "selected",
  "onSelectedChange"
);

export type PlasmicSearchFilters__OverridesType = {
  root?: Flex__<"div">;
  dialog?: Flex__<typeof Dialog>;
  filterItemToggle?: Flex__<typeof FilterItemToggle>;
  filterItemSingleSelect?: Flex__<typeof FilterItemSingleSelect>;
};

export interface DefaultSearchFiltersProps {
  filters?: any;
  selected?: any;
  onSelectedChange?: (val: string) => void;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSearchFilters__RenderFunc(props: {
  variants: PlasmicSearchFilters__VariantsArgs;
  args: PlasmicSearchFilters__ArgsType;
  overrides: PlasmicSearchFilters__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          filters: []
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
        path: "dialog.open",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "selected",
        type: "writable",
        variableType: "object",

        valueProp: "selected",
        onChangeProp: "onSelectedChange"
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
        sty.root
      )}
    >
      {(() => {
        try {
          return $props.filters?.length > 0;
        } catch (e) {
          if (
            e instanceof TypeError ||
            e?.plasmicType === "PlasmicUndefinedDataError"
          ) {
            return false;
          }
          throw e;
        }
      })() ? (
        <FilterRowItem
          className={classNames("__wab_instance", sty.filterRowItem__y0CiX)}
          icon={"sliders-horizontal"}
          onSelect={async key => {
            const $steps = {};

            $steps["updateDialogOpen"] = true
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["dialog", "open"]
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
              $steps["updateDialogOpen"] != null &&
              typeof $steps["updateDialogOpen"] === "object" &&
              typeof $steps["updateDialogOpen"].then === "function"
            ) {
              $steps["updateDialogOpen"] = await $steps["updateDialogOpen"];
            }
          }}
        />
      ) : null}
      {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
        (() => {
          try {
            return (() => {
              const filters = JSON.parse(JSON.stringify($props.filters));
              return filters.sort((a, b) =>
                !!$state.selected[a.facetName] ? -1 : 1
              );
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
          <FilterRowItem
            active={(() => {
              try {
                return $state.selected?.[currentItem.facetName]?.length > 0;
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
            className={classNames("__wab_instance", sty.filterRowItem__q1JtC)}
            filterKey={(() => {
              try {
                return currentItem.facetName;
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
            key={currentIndex}
            label={(() => {
              try {
                return (() => {
                  if ($state.selected?.[currentItem.facetName]?.length > 0) {
                    const selectedRecords = currentItem.facetRecords.filter(
                      item =>
                        $state.selected[currentItem.facetName].includes(
                          item.name
                        )
                    );
                    if (selectedRecords.length > 0) {
                      return `${selectedRecords[0].label}${
                        selectedRecords.length > 1
                          ? ` + ${selectedRecords.length - 1}`
                          : ""
                      }`;
                    }
                  }
                  return currentItem.facetLabel;
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
            })()}
            onRemove={async key => {
              const $steps = {};

              $steps["updateSelected"] = true
                ? (() => {
                    const actionArgs = {
                      variable: {
                        objRoot: $state,
                        variablePath: ["selected"]
                      },
                      operation: 0,
                      value: {
                        ...$state.selected,
                        [currentItem.facetName]: []
                      }
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
                $steps["updateSelected"] != null &&
                typeof $steps["updateSelected"] === "object" &&
                typeof $steps["updateSelected"].then === "function"
              ) {
                $steps["updateSelected"] = await $steps["updateSelected"];
              }
            }}
            onSelect={async key => {
              const $steps = {};

              $steps["updateDialogOpen"] =
                currentItem.fieldType !== "boolean"
                  ? (() => {
                      const actionArgs = {
                        variable: {
                          objRoot: $state,
                          variablePath: ["dialog", "open"]
                        },
                        operation: 0,
                        value: true
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
                $steps["updateDialogOpen"] != null &&
                typeof $steps["updateDialogOpen"] === "object" &&
                typeof $steps["updateDialogOpen"].then === "function"
              ) {
                $steps["updateDialogOpen"] = await $steps["updateDialogOpen"];
              }

              $steps["updateDialogOpen3"] =
                currentItem.fieldType !== "boolean"
                  ? (() => {
                      const actionArgs = { args: [500] };
                      return $globalActions["Fragment.wait"]?.apply(null, [
                        ...actionArgs.args
                      ]);
                    })()
                  : undefined;
              if (
                $steps["updateDialogOpen3"] != null &&
                typeof $steps["updateDialogOpen3"] === "object" &&
                typeof $steps["updateDialogOpen3"].then === "function"
              ) {
                $steps["updateDialogOpen3"] = await $steps["updateDialogOpen3"];
              }

              $steps["updateDialogOpen2"] =
                currentItem.fieldType !== "boolean"
                  ? (() => {
                      const actionArgs = {
                        customFunction: async () => {
                          return (() => {
                            const filterContainer =
                              window.document.getElementById(
                                "filters-containter"
                              );
                            const filterItem = window.document.getElementById(
                              `filters-item-${currentItem.facetName}`
                            );
                            if (!filterContainer && !filterItem) {
                              return;
                            }
                            filterContainer.scrollTo({
                              top: filterItem.offsetTop,
                              behavior: "smooth"
                            });
                            return (filterItem.style.backgroundColor =
                              "#ffc50024");
                          })();
                        }
                      };
                      return (({ customFunction }) => {
                        return customFunction();
                      })?.apply(null, [actionArgs]);
                    })()
                  : undefined;
              if (
                $steps["updateDialogOpen2"] != null &&
                typeof $steps["updateDialogOpen2"] === "object" &&
                typeof $steps["updateDialogOpen2"].then === "function"
              ) {
                $steps["updateDialogOpen2"] = await $steps["updateDialogOpen2"];
              }

              $steps["updateDialogOpen4"] =
                currentItem.fieldType !== "boolean"
                  ? (() => {
                      const actionArgs = { args: [1500] };
                      return $globalActions["Fragment.wait"]?.apply(null, [
                        ...actionArgs.args
                      ]);
                    })()
                  : undefined;
              if (
                $steps["updateDialogOpen4"] != null &&
                typeof $steps["updateDialogOpen4"] === "object" &&
                typeof $steps["updateDialogOpen4"].then === "function"
              ) {
                $steps["updateDialogOpen4"] = await $steps["updateDialogOpen4"];
              }

              $steps["updateDialogOpen5"] =
                currentItem.fieldType !== "boolean"
                  ? (() => {
                      const actionArgs = {
                        customFunction: async () => {
                          return (() => {
                            const filterItem = window.document.getElementById(
                              `filters-item-${currentItem.facetName}`
                            );
                            if (filterItem) {
                              return (filterItem.style.backgroundColor =
                                "transparent");
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
                $steps["updateDialogOpen5"] != null &&
                typeof $steps["updateDialogOpen5"] === "object" &&
                typeof $steps["updateDialogOpen5"].then === "function"
              ) {
                $steps["updateDialogOpen5"] = await $steps["updateDialogOpen5"];
              }

              $steps["updateDialogOpen6"] =
                currentItem.fieldType === "boolean"
                  ? (() => {
                      const actionArgs = {
                        variable: {
                          objRoot: $state,
                          variablePath: ["selected"]
                        },
                        operation: 0,
                        value: {
                          ...$state.selected,
                          [currentItem.facetName]: [true]
                        }
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
                $steps["updateDialogOpen6"] != null &&
                typeof $steps["updateDialogOpen6"] === "object" &&
                typeof $steps["updateDialogOpen6"].then === "function"
              ) {
                $steps["updateDialogOpen6"] = await $steps["updateDialogOpen6"];
              }
            }}
          />
        );
      })}
      <Dialog
        data-plasmic-name={"dialog"}
        data-plasmic-override={overrides.dialog}
        body={
          <div
            className={classNames(projectcss.all, sty.freeBox___9Z8Y0)}
            id={"filters-containter"}
          >
            {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
              (() => {
                try {
                  return $props.filters;
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
                  className={classNames(projectcss.all, sty.freeBox___0AFrI)}
                  id={(() => {
                    try {
                      return `filters-item-${currentItem.facetName}`;
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
                  key={currentIndex}
                >
                  {(() => {
                    try {
                      return currentItem.fieldType === "boolean";
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
                    <FilterItemToggle
                      data-plasmic-name={"filterItemToggle"}
                      data-plasmic-override={overrides.filterItemToggle}
                      className={classNames(
                        "__wab_instance",
                        sty.filterItemToggle
                      )}
                      defaultSelected={(() => {
                        try {
                          return $state.selected?.[currentItem.facetName]?.[0];
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
                      label={(() => {
                        try {
                          return currentItem.facetLabel;
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
                      onSelect={async itemSelect => {
                        const $steps = {};

                        $steps["updateSelected"] = true
                          ? (() => {
                              const actionArgs = {
                                variable: {
                                  objRoot: $state,
                                  variablePath: ["selected"]
                                },
                                operation: 0,
                                value: {
                                  ...$state.selected,
                                  [currentItem.facetName]: itemSelect
                                    ? [itemSelect]
                                    : []
                                }
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
                          $steps["updateSelected"] != null &&
                          typeof $steps["updateSelected"] === "object" &&
                          typeof $steps["updateSelected"].then === "function"
                        ) {
                          $steps["updateSelected"] = await $steps[
                            "updateSelected"
                          ];
                        }

                        $steps["updateDialogOpen2"] = true
                          ? (() => {
                              const actionArgs = {
                                variable: {
                                  objRoot: $state,
                                  variablePath: ["dialog", "open"]
                                },
                                operation: 4
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

                                const oldValue = $stateGet(
                                  objRoot,
                                  variablePath
                                );
                                $stateSet(objRoot, variablePath, !oldValue);
                                return !oldValue;
                              })?.apply(null, [actionArgs]);
                            })()
                          : undefined;
                        if (
                          $steps["updateDialogOpen2"] != null &&
                          typeof $steps["updateDialogOpen2"] === "object" &&
                          typeof $steps["updateDialogOpen2"].then === "function"
                        ) {
                          $steps["updateDialogOpen2"] = await $steps[
                            "updateDialogOpen2"
                          ];
                        }
                      }}
                    />
                  ) : null}
                  {(() => {
                    try {
                      return ["text", "long", "double"].includes(
                        currentItem.fieldType
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
                    <FilterItemSingleSelect
                      data-plasmic-name={"filterItemSingleSelect"}
                      data-plasmic-override={overrides.filterItemSingleSelect}
                      className={classNames(
                        "__wab_instance",
                        sty.filterItemSingleSelect
                      )}
                      defaultSelected={(() => {
                        try {
                          return $state.selected[currentItem.facetName];
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
                      label={(() => {
                        try {
                          return currentItem.facetLabel;
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
                      onSelect={async itemsSelected => {
                        const $steps = {};

                        $steps["updateSelected"] = true
                          ? (() => {
                              const actionArgs = {
                                variable: {
                                  objRoot: $state,
                                  variablePath: ["selected"]
                                },
                                operation: 0,
                                value: {
                                  ...$state.selected,
                                  [currentItem.facetName]: itemsSelected
                                }
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
                          $steps["updateSelected"] != null &&
                          typeof $steps["updateSelected"] === "object" &&
                          typeof $steps["updateSelected"].then === "function"
                        ) {
                          $steps["updateSelected"] = await $steps[
                            "updateSelected"
                          ];
                        }

                        $steps["updateDialogOpen"] = true
                          ? (() => {
                              const actionArgs = {
                                variable: {
                                  objRoot: $state,
                                  variablePath: ["dialog", "open"]
                                },
                                operation: 4
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

                                const oldValue = $stateGet(
                                  objRoot,
                                  variablePath
                                );
                                $stateSet(objRoot, variablePath, !oldValue);
                                return !oldValue;
                              })?.apply(null, [actionArgs]);
                            })()
                          : undefined;
                        if (
                          $steps["updateDialogOpen"] != null &&
                          typeof $steps["updateDialogOpen"] === "object" &&
                          typeof $steps["updateDialogOpen"].then === "function"
                        ) {
                          $steps["updateDialogOpen"] = await $steps[
                            "updateDialogOpen"
                          ];
                        }
                      }}
                      options={(() => {
                        try {
                          return currentItem.facetRecords;
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
                </div>
              );
            })}
          </div>
        }
        className={classNames("__wab_instance", sty.dialog)}
        noTrigger={true}
        onOpenChange={async (...eventArgs: any) => {
          generateStateOnChangeProp($state, ["dialog", "open"]).apply(
            null,
            eventArgs
          );

          if (
            eventArgs.length > 1 &&
            eventArgs[1] &&
            eventArgs[1]._plasmic_state_init_
          ) {
            return;
          }
        }}
        open={generateStateValueProp($state, ["dialog", "open"])}
        title={"\u0641\u06cc\u0644\u062a\u0631\u0647\u0627"}
      />
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "dialog", "filterItemToggle", "filterItemSingleSelect"],
  dialog: ["dialog", "filterItemToggle", "filterItemSingleSelect"],
  filterItemToggle: ["filterItemToggle"],
  filterItemSingleSelect: ["filterItemSingleSelect"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  dialog: typeof Dialog;
  filterItemToggle: typeof FilterItemToggle;
  filterItemSingleSelect: typeof FilterItemSingleSelect;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSearchFilters__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSearchFilters__VariantsArgs;
    args?: PlasmicSearchFilters__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSearchFilters__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicSearchFilters__ArgsType,
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
          internalArgPropNames: PlasmicSearchFilters__ArgProps,
          internalVariantPropNames: PlasmicSearchFilters__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSearchFilters__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicSearchFilters";
  } else {
    func.displayName = `PlasmicSearchFilters.${nodeName}`;
  }
  return func;
}

export const PlasmicSearchFilters = Object.assign(
  // Top-level PlasmicSearchFilters renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    dialog: makeNodeComponent("dialog"),
    filterItemToggle: makeNodeComponent("filterItemToggle"),
    filterItemSingleSelect: makeNodeComponent("filterItemSingleSelect"),

    // Metadata about props expected for PlasmicSearchFilters
    internalVariantProps: PlasmicSearchFilters__VariantProps,
    internalArgProps: PlasmicSearchFilters__ArgProps
  }
);

export default PlasmicSearchFilters;
/* prettier-ignore-end */
