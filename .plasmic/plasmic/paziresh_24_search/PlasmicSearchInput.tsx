/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: qe20xTbxVmkB

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

import SearchTextInput from "../../SearchTextInput"; // plasmic-import: wpkArHt5O9Fa/component
import { SideEffect } from "@plasmicpkgs/plasmic-basic-components";

import { useScreenVariants as useScreenVariantsbr2UhI7UlpvR } from "../fragment_icons/PlasmicGlobalVariant__Screen"; // plasmic-import: BR2UhI7ulpvR/globalVariant

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSearchInput.module.css"; // plasmic-import: qe20xTbxVmkB/css

import Icon46Icon from "./icons/PlasmicIcon__Icon46"; // plasmic-import: JPz3a5sl3Q1Z/icon
import IconIcon from "./icons/PlasmicIcon__Icon"; // plasmic-import: Cfw-VAdl-_5E/icon
import SearchSvgIcon from "./icons/PlasmicIcon__SearchSvg"; // plasmic-import: QrVR5pllCw55/icon
import Icon13Icon from "./icons/PlasmicIcon__Icon13"; // plasmic-import: E9NGWfCxi3aB/icon
import Icon21Icon from "./icons/PlasmicIcon__Icon21"; // plasmic-import: GcSkUNamgvSO/icon
import Icon44Icon from "./icons/PlasmicIcon__Icon44"; // plasmic-import: mnMqeXnQZuQo/icon

import { uniq as __lib_lodash__uniq } from "lodash";

createPlasmicElementProxy;

export type PlasmicSearchInput__VariantMembers = {
  isFocused: "isFocused";
};
export type PlasmicSearchInput__VariantsArgs = {
  isFocused?: SingleBooleanChoiceArg<"isFocused">;
};
type VariantPropType = keyof PlasmicSearchInput__VariantsArgs;
export const PlasmicSearchInput__VariantProps = new Array<VariantPropType>(
  "isFocused"
);

export type PlasmicSearchInput__ArgsType = {
  onClickCities?: () => void;
  inputId?: string;
  inputValue?: string;
  onChangeInput?: (value: string) => void;
  onClickSearchIcon?: () => void;
  onFocuse?: (value: boolean) => void;
  cityName?: string;
  isAroundMe?: boolean;
  citySlug?: string;
};
type ArgPropType = keyof PlasmicSearchInput__ArgsType;
export const PlasmicSearchInput__ArgProps = new Array<ArgPropType>(
  "onClickCities",
  "inputId",
  "inputValue",
  "onChangeInput",
  "onClickSearchIcon",
  "onFocuse",
  "cityName",
  "isAroundMe",
  "citySlug"
);

export type PlasmicSearchInput__OverridesType = {
  root?: Flex__<"div">;
  textInput?: Flex__<typeof SearchTextInput>;
  sideEffect?: Flex__<typeof SideEffect>;
};

export interface DefaultSearchInputProps {
  onClickCities?: () => void;
  inputId?: string;
  inputValue?: string;
  onChangeInput?: (value: string) => void;
  onClickSearchIcon?: () => void;
  onFocuse?: (value: boolean) => void;
  cityName?: string;
  isAroundMe?: boolean;
  citySlug?: string;
  isFocused?: SingleBooleanChoiceArg<"isFocused">;
  className?: string;
}

const $$ = {
  lodash: {
    uniq: __lib_lodash__uniq
  }
};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSearchInput__RenderFunc(props: {
  variants: PlasmicSearchInput__VariantsArgs;
  args: PlasmicSearchInput__ArgsType;
  overrides: PlasmicSearchInput__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          cityName: "\u0647\u0645\u0647 \u0634\u0647\u0631\u0647\u0627",
          isAroundMe: false
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
        path: "textInput.value",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) =>
          (() => {
            try {
              return $props.inputValue;
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
      },
      {
        path: "isFocused",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.isFocused
      },
      {
        path: "enterPress",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => ""
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
        sty.root,
        { [sty.rootisFocused]: hasVariant($state, "isFocused", "isFocused") }
      )}
    >
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__xcgrP, {
          [sty.freeBoxisFocused__xcgrPo9DZj]: hasVariant(
            $state,
            "isFocused",
            "isFocused"
          )
        })}
      >
        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__jzSpg, {
            [sty.freeBoxisFocused__jzSpgo9DZj]: hasVariant(
              $state,
              "isFocused",
              "isFocused"
            )
          })}
        >
          <Icon46Icon
            className={classNames(projectcss.all, sty.svg__l3Jw2, {
              [sty.svgisFocused__l3Jw2O9DZj]: hasVariant(
                $state,
                "isFocused",
                "isFocused"
              )
            })}
            onClick={async event => {
              const $steps = {};

              $steps["runOnClickSearchIcon"] = true
                ? (() => {
                    const actionArgs = {
                      eventRef: $props["onClickSearchIcon"]
                    };
                    return (({ eventRef, args }) => {
                      return eventRef?.(...(args ?? []));
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps["runOnClickSearchIcon"] != null &&
                typeof $steps["runOnClickSearchIcon"] === "object" &&
                typeof $steps["runOnClickSearchIcon"].then === "function"
              ) {
                $steps["runOnClickSearchIcon"] = await $steps[
                  "runOnClickSearchIcon"
                ];
              }
            }}
            role={"img"}
          />

          <IconIcon
            className={classNames(projectcss.all, sty.svg__wUsh, {
              [sty.svgisFocused__wUsHo9DZj]: hasVariant(
                $state,
                "isFocused",
                "isFocused"
              )
            })}
            onClick={async event => {
              const $steps = {};

              $steps["runOnFocuse"] = true
                ? (() => {
                    const actionArgs = { eventRef: $props["onFocuse"] };
                    return (({ eventRef, args }) => {
                      return eventRef?.(...(args ?? []));
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps["runOnFocuse"] != null &&
                typeof $steps["runOnFocuse"] === "object" &&
                typeof $steps["runOnFocuse"].then === "function"
              ) {
                $steps["runOnFocuse"] = await $steps["runOnFocuse"];
              }

              $steps["runOnChangeInput"] = true
                ? (() => {
                    const actionArgs = {
                      eventRef: $props["onChangeInput"],
                      args: [
                        (() => {
                          try {
                            return "";
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
                $steps["runOnChangeInput"] != null &&
                typeof $steps["runOnChangeInput"] === "object" &&
                typeof $steps["runOnChangeInput"].then === "function"
              ) {
                $steps["runOnChangeInput"] = await $steps["runOnChangeInput"];
              }
            }}
            role={"img"}
          />

          <div
            className={classNames(projectcss.all, sty.freeBox__mYtRl, {
              [sty.freeBoxisFocused__mYtRlo9DZj]: hasVariant(
                $state,
                "isFocused",
                "isFocused"
              )
            })}
            onClick={async event => {
              const $steps = {};

              $steps["runOnFocuse"] = true
                ? (() => {
                    const actionArgs = {
                      eventRef: $props["onFocuse"],
                      args: [true]
                    };
                    return (({ eventRef, args }) => {
                      return eventRef?.(...(args ?? []));
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps["runOnFocuse"] != null &&
                typeof $steps["runOnFocuse"] === "object" &&
                typeof $steps["runOnFocuse"].then === "function"
              ) {
                $steps["runOnFocuse"] = await $steps["runOnFocuse"];
              }
            }}
          >
            <SearchTextInput
              data-plasmic-name={"textInput"}
              data-plasmic-override={overrides.textInput}
              autoComplete={"off"}
              autoFocus={
                hasVariant(globalVariants, "screen", "mobileOnly")
                  ? (() => {
                      try {
                        return !!$state.isFocused;
                      } catch (e) {
                        if (
                          e instanceof TypeError ||
                          e?.plasmicType === "PlasmicUndefinedDataError"
                        ) {
                          return false;
                        }
                        throw e;
                      }
                    })()
                  : (() => {
                      try {
                        return !!$state.isFocused;
                      } catch (e) {
                        if (
                          e instanceof TypeError ||
                          e?.plasmicType === "PlasmicUndefinedDataError"
                        ) {
                          return false;
                        }
                        throw e;
                      }
                    })()
              }
              className={classNames("__wab_instance", sty.textInput, {
                [sty.textInputisFocused]: hasVariant(
                  $state,
                  "isFocused",
                  "isFocused"
                )
              })}
              endIcon={
                (() => {
                  try {
                    return !!$state.textInput.value;
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
                  <Icon13Icon
                    className={classNames(projectcss.all, sty.svg__iia8L)}
                    onClick={async event => {
                      const $steps = {};

                      $steps["updateTextInputValue"] = true
                        ? (() => {
                            const actionArgs = {
                              variable: {
                                objRoot: $state,
                                variablePath: ["textInput", "value"]
                              },
                              operation: 0,
                              value: ""
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
                        $steps["updateTextInputValue"] != null &&
                        typeof $steps["updateTextInputValue"] === "object" &&
                        typeof $steps["updateTextInputValue"].then ===
                          "function"
                      ) {
                        $steps["updateTextInputValue"] = await $steps[
                          "updateTextInputValue"
                        ];
                      }

                      $steps["updateTextInputValue2"] = true
                        ? (() => {
                            const actionArgs = {
                              eventRef: $props["onChangeInput"],
                              args: [
                                (() => {
                                  try {
                                    return "";
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
                        $steps["updateTextInputValue2"] != null &&
                        typeof $steps["updateTextInputValue2"] === "object" &&
                        typeof $steps["updateTextInputValue2"].then ===
                          "function"
                      ) {
                        $steps["updateTextInputValue2"] = await $steps[
                          "updateTextInputValue2"
                        ];
                      }
                    }}
                    role={"img"}
                  />
                ) : null
              }
              id={(() => {
                try {
                  return $props.inputId;
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
              name={"searchInput"}
              onChange={async (...eventArgs: any) => {
                ((...eventArgs) => {
                  generateStateOnChangeProp($state, ["textInput", "value"])(
                    (e => e.target?.value).apply(null, eventArgs)
                  );
                }).apply(null, eventArgs);

                if (
                  eventArgs.length > 1 &&
                  eventArgs[1] &&
                  eventArgs[1]._plasmic_state_init_
                ) {
                  return;
                }

                (async event => {
                  const $steps = {};

                  $steps["runOnChangeInput"] = true
                    ? (() => {
                        const actionArgs = {
                          eventRef: $props["onChangeInput"],
                          args: [
                            (() => {
                              try {
                                return $state.textInput.value;
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
                    $steps["runOnChangeInput"] != null &&
                    typeof $steps["runOnChangeInput"] === "object" &&
                    typeof $steps["runOnChangeInput"].then === "function"
                  ) {
                    $steps["runOnChangeInput"] = await $steps[
                      "runOnChangeInput"
                    ];
                  }
                }).apply(null, eventArgs);
              }}
              placeholder={
                hasVariant(globalVariants, "screen", "mobileOnly")
                  ? "\u0628\u06cc\u0645\u0627\u0631\u06cc\u060c \u062a\u062e\u0635\u0635\u060c \u067e\u0632\u0634\u06a9\u060c \u0628\u06cc\u0645\u0627\u0631\u0633\u062a\u0627\u0646 \u0648 ..."
                  : "\u0646\u0627\u0645 \u0628\u06cc\u0645\u0627\u0631\u06cc\u060c \u062a\u062e\u0635\u0635\u060c \u067e\u0632\u0634\u06a9\u060c \u0628\u06cc\u0645\u0627\u0631\u0633\u062a\u0627\u0646 \u0648 ..."
              }
              showEndIcon={(() => {
                try {
                  return !!$state.textInput.value;
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return "showEndIcon";
                  }
                  throw e;
                }
              })()}
              value={
                generateStateValueProp($state, ["textInput", "value"]) ?? ""
              }
            />
          </div>
        </Stack__>
        <div className={classNames(projectcss.all, sty.freeBox___4GS1M)} />

        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(
            projectcss.all,
            sty.freeBox__gfDby,
            "min-w-fit max-w-fit"
          )}
          onClick={async event => {
            const $steps = {};

            $steps["runOnClickCities"] = true
              ? (() => {
                  const actionArgs = { eventRef: $props["onClickCities"] };
                  return (({ eventRef, args }) => {
                    return eventRef?.(...(args ?? []));
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["runOnClickCities"] != null &&
              typeof $steps["runOnClickCities"] === "object" &&
              typeof $steps["runOnClickCities"].then === "function"
            ) {
              $steps["runOnClickCities"] = await $steps["runOnClickCities"];
            }
          }}
        >
          {(() => {
            try {
              return !$props.isAroundMe;
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
                sty.text__msn1F
              )}
            >
              <React.Fragment>
                {(() => {
                  try {
                    return $props.cityName;
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "PlasmicUndefinedDataError"
                    ) {
                      return "-";
                    }
                    throw e;
                  }
                })()}
              </React.Fragment>
            </div>
          ) : null}
          {(() => {
            try {
              return $props.isAroundMe;
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
                sty.text__mKZue
              )}
            >
              {"\u0627\u0637\u0631\u0627\u0641 \u0645\u0646"}
            </div>
          ) : null}
          {(
            hasVariant(globalVariants, "screen", "mobileOnly")
              ? (() => {
                  try {
                    return !$props.isAroundMe;
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
              : (() => {
                  try {
                    return !$props.isAroundMe;
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
            <Icon21Icon
              className={classNames(projectcss.all, sty.svg__qSzR)}
              role={"img"}
            />
          ) : null}
          {(() => {
            try {
              return $props.isAroundMe;
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
            <Icon44Icon
              className={classNames(projectcss.all, sty.svg__v0974)}
              role={"img"}
            />
          ) : null}
        </Stack__>
      </Stack__>
      <SideEffect
        data-plasmic-name={"sideEffect"}
        data-plasmic-override={overrides.sideEffect}
        className={classNames("__wab_instance", sty.sideEffect, {
          [sty.sideEffectisFocused]: hasVariant(
            $state,
            "isFocused",
            "isFocused"
          )
        })}
        deps={(() => {
          try {
            return [$state.enterPress];
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

          $steps["runCode"] = true
            ? (() => {
                const actionArgs = {
                  customFunction: async () => {
                    return (() => {
                      const input = globalThis.window.document.getElementById(
                        $props.inputId
                      );
                      const params = new globalThis.URLSearchParams(
                        globalThis.window.location.search
                      );
                      if (typeof window != "undefined" && input) {
                        return input.addEventListener("keypress", event => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            params.delete("text");
                            const existingParams = params?.toString() || "";
                            params.append("text", $state.textInput.value);
                            params.delete("ref");
                            params.append("ref", "search_suggestion_box");
                            const semanticSearchParam =
                              $ctx.Growthbook &&
                              $ctx.Growthbook.isReady &&
                              $ctx.Growthbook.features["search-semantic-search"]
                                ? "true"
                                : "false";
                            params.delete("semantic_search");
                            params.append(
                              "semantic_search",
                              semanticSearchParam
                            );
                            return ($state.enterPress = `/s/${
                              $props.citySlug ? $props.citySlug + "/" : ""
                            }?${params.toString()}`);
                          }
                        });
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
            $steps["runCode"] != null &&
            typeof $steps["runCode"] === "object" &&
            typeof $steps["runCode"].then === "function"
          ) {
            $steps["runCode"] = await $steps["runCode"];
          }

          $steps["saveToHistoryKeywords"] = !!$state.enterPress
            ? (() => {
                const actionArgs = {
                  customFunction: async () => {
                    return (() => {
                      const history = $$.lodash.uniq(
                        JSON.parse(localStorage.getItem("history") ?? "[]")
                      );
                      const newHistory = history.filter(
                        historyItem => historyItem !== $state.textInput.value
                      );
                      return localStorage.setItem(
                        "history",
                        JSON.stringify([...newHistory, $state.textInput.value])
                      );
                    })();
                  }
                };
                return (({ customFunction }) => {
                  return customFunction();
                })?.apply(null, [actionArgs]);
              })()
            : undefined;
          if (
            $steps["saveToHistoryKeywords"] != null &&
            typeof $steps["saveToHistoryKeywords"] === "object" &&
            typeof $steps["saveToHistoryKeywords"].then === "function"
          ) {
            $steps["saveToHistoryKeywords"] = await $steps[
              "saveToHistoryKeywords"
            ];
          }

          $steps["goTo"] = !!$state.enterPress
            ? (() => {
                const actionArgs = {
                  destination: (() => {
                    try {
                      return $state.enterPress;
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
            $steps["goTo"] != null &&
            typeof $steps["goTo"] === "object" &&
            typeof $steps["goTo"].then === "function"
          ) {
            $steps["goTo"] = await $steps["goTo"];
          }
        }}
        onUnmount={async () => {
          const $steps = {};
        }}
      />
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "textInput", "sideEffect"],
  textInput: ["textInput"],
  sideEffect: ["sideEffect"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  textInput: typeof SearchTextInput;
  sideEffect: typeof SideEffect;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSearchInput__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSearchInput__VariantsArgs;
    args?: PlasmicSearchInput__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSearchInput__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    // Specify args directly as props
    Omit<PlasmicSearchInput__ArgsType, ReservedPropsType> &
    // Specify overrides for each element directly as props
    Omit<
      NodeOverridesType<T>,
      ReservedPropsType | VariantPropType | ArgPropType
    > &
    // Specify props for the root element
    Omit<
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
          internalArgPropNames: PlasmicSearchInput__ArgProps,
          internalVariantPropNames: PlasmicSearchInput__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSearchInput__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicSearchInput";
  } else {
    func.displayName = `PlasmicSearchInput.${nodeName}`;
  }
  return func;
}

export const PlasmicSearchInput = Object.assign(
  // Top-level PlasmicSearchInput renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    textInput: makeNodeComponent("textInput"),
    sideEffect: makeNodeComponent("sideEffect"),

    // Metadata about props expected for PlasmicSearchInput
    internalVariantProps: PlasmicSearchInput__VariantProps,
    internalArgProps: PlasmicSearchInput__ArgProps
  }
);

export default PlasmicSearchInput;
/* prettier-ignore-end */
