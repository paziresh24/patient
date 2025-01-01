// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: PfB5nhEPkWQb

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

import SearchContentItem from "../../SearchContentItem"; // plasmic-import: NqExHRSculUA/component
import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component
import SearchContentIcon from "../../SearchContentIcon"; // plasmic-import: TJ3HSI2L1TNq/component
import SearchContentSlider from "../../SearchContentSlider"; // plasmic-import: d6rjYjjJdnoM/component
import SearchRequest from "../../SearchRequest"; // plasmic-import: 35vwUOYdUX87/component
import SearchContentTree from "../../SearchContentTree"; // plasmic-import: _bc7j5YswB_4/component
import { SideEffect } from "@plasmicpkgs/plasmic-basic-components";

import { useScreenVariants as useScreenVariantsbr2UhI7UlpvR } from "../fragment_icons/PlasmicGlobalVariant__Screen"; // plasmic-import: BR2UhI7ulpvR/globalVariant

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSearchContent.module.css"; // plasmic-import: PfB5nhEPkWQb/css

import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicSearchContent__VariantMembers = {};
export type PlasmicSearchContent__VariantsArgs = {};
type VariantPropType = keyof PlasmicSearchContent__VariantsArgs;
export const PlasmicSearchContent__VariantProps = new Array<VariantPropType>();

export type PlasmicSearchContent__ArgsType = {
  suggestion?: any;
  searchQuery?: string;
  onClick?: (value: any) => void;
  cityName?: string;
  resultCount?: number;
};
type ArgPropType = keyof PlasmicSearchContent__ArgsType;
export const PlasmicSearchContent__ArgProps = new Array<ArgPropType>(
  "suggestion",
  "searchQuery",
  "onClick",
  "cityName",
  "resultCount"
);

export type PlasmicSearchContent__OverridesType = {
  root?: Flex__<"div">;
  searchContentItem?: Flex__<typeof SearchContentItem>;
  text?: Flex__<"div">;
  button?: Flex__<typeof Button>;
  slider?: Flex__<"div">;
  searchContentSlider?: Flex__<typeof SearchContentSlider>;
  card?: Flex__<"div">;
  searchRequest?: Flex__<typeof SearchRequest>;
  tree?: Flex__<"div">;
  searchContentTree?: Flex__<typeof SearchContentTree>;
  search?: Flex__<"div">;
  sideEffect?: Flex__<typeof SideEffect>;
};

export interface DefaultSearchContentProps {
  suggestion?: any;
  searchQuery?: string;
  onClick?: (value: any) => void;
  cityName?: string;
  resultCount?: number;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSearchContent__RenderFunc(props: {
  variants: PlasmicSearchContent__VariantsArgs;
  args: PlasmicSearchContent__ArgsType;
  overrides: PlasmicSearchContent__OverridesType;
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
        plasmic_antd_5_hostless_css.plasmic_tokens,
        sty.root,
        (() => {
          try {
            return "suggestion_content no-scroll";
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
      )}
    >
      {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
        (() => {
          try {
            return $props.suggestion.filter(
              item => item.component !== "search"
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
          <SearchContentItem
            data-plasmic-name={"searchContentItem"}
            data-plasmic-override={overrides.searchContentItem}
            className={classNames("__wab_instance", sty.searchContentItem)}
            component={(() => {
              try {
                return currentItem.component;
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
            iconType={(() => {
              try {
                return currentItem.icon;
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
            title={(() => {
              try {
                return currentItem.caption;
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
            {(() => {
              try {
                return currentItem.component == "text";
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
              <div
                data-plasmic-name={"text"}
                data-plasmic-override={overrides.text}
                className={classNames(
                  projectcss.all,
                  sty.text,
                  hasVariant(globalVariants, "screen", "mobileOnly")
                    ? "default-styles"
                    : undefined
                )}
              >
                {(() => {
                  try {
                    return true;
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
                  ? (_par =>
                      !_par ? [] : Array.isArray(_par) ? _par : [_par])(
                      (() => {
                        try {
                          return currentItem.items;
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
                    ).map((__plasmic_item_1, __plasmic_idx_1) => {
                      const currentItem = __plasmic_item_1;
                      const currentIndex = __plasmic_idx_1;
                      return (
                        <Button
                          data-plasmic-name={"button"}
                          data-plasmic-override={overrides.button}
                          children2={
                            <Stack__
                              as={"div"}
                              hasGap={true}
                              className={classNames(
                                projectcss.all,
                                sty.freeBox__uxToj
                              )}
                            >
                              {(() => {
                                try {
                                  return currentItem.type !== "center";
                                } catch (e) {
                                  if (
                                    e instanceof TypeError ||
                                    e?.plasmicType ===
                                      "PlasmicUndefinedDataError"
                                  ) {
                                    return true;
                                  }
                                  throw e;
                                }
                              })() ? (
                                <SearchContentIcon
                                  className={classNames(
                                    "__wab_instance",
                                    sty.searchContentIcon__wv4Na
                                  )}
                                  iconType={(() => {
                                    try {
                                      return currentItem.type;
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
                                  })()}
                                />
                              ) : null}
                              <div
                                className={classNames(
                                  projectcss.all,
                                  projectcss.__wab_text,
                                  sty.text__cOaz
                                )}
                              >
                                <div
                                  className={projectcss.__wab_expr_html_text}
                                  dangerouslySetInnerHTML={{
                                    __html: (() => {
                                      try {
                                        return currentItem.formatted_title;
                                      } catch (e) {
                                        if (
                                          e instanceof TypeError ||
                                          e?.plasmicType ===
                                            "PlasmicUndefinedDataError"
                                        ) {
                                          return "Button";
                                        }
                                        throw e;
                                      }
                                    })()
                                  }}
                                />
                              </div>
                            </Stack__>
                          }
                          className={classNames("__wab_instance", sty.button)}
                          color={"link"}
                          key={currentIndex}
                          onClick={async event => {
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
                              $steps["runOnClick"] != null &&
                              typeof $steps["runOnClick"] === "object" &&
                              typeof $steps["runOnClick"].then === "function"
                            ) {
                              $steps["runOnClick"] = await $steps["runOnClick"];
                            }
                          }}
                          size={"compact"}
                          space={true}
                          startIcon={null}
                        />
                      );
                    })
                  : null}
              </div>
            ) : null}
            {(() => {
              try {
                return currentItem.component == "slider";
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
                data-plasmic-name={"slider"}
                data-plasmic-override={overrides.slider}
                hasGap={true}
                className={classNames(projectcss.all, sty.slider, "no-scroll")}
              >
                {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
                  (() => {
                    try {
                      return currentItem.items;
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
                ).map((__plasmic_item_1, __plasmic_idx_1) => {
                  const currentItem = __plasmic_item_1;
                  const currentIndex = __plasmic_idx_1;
                  return (
                    <div
                      className={classNames(projectcss.all, sty.freeBox__jznMk)}
                      key={currentIndex}
                      onClick={async event => {
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
                          $steps["runOnClick"] != null &&
                          typeof $steps["runOnClick"] === "object" &&
                          typeof $steps["runOnClick"].then === "function"
                        ) {
                          $steps["runOnClick"] = await $steps["runOnClick"];
                        }
                      }}
                    >
                      <SearchContentSlider
                        data-plasmic-name={"searchContentSlider"}
                        data-plasmic-override={overrides.searchContentSlider}
                        className={classNames(
                          "__wab_instance",
                          sty.searchContentSlider
                        )}
                        data={(() => {
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
                        })()}
                      />
                    </div>
                  );
                })}
              </Stack__>
            ) : null}
            {(() => {
              try {
                return currentItem.component == "card";
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
                data-plasmic-name={"card"}
                data-plasmic-override={overrides.card}
                className={classNames(projectcss.all, sty.card)}
              >
                {(() => {
                  try {
                    return currentItem.component;
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
                  <SearchRequest
                    data-plasmic-name={"searchRequest"}
                    data-plasmic-override={overrides.searchRequest}
                    className={classNames("__wab_instance", sty.searchRequest)}
                    searchQuery={(() => {
                      try {
                        return $props.searchQuery;
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
                    suggestionExecutionSource={true}
                  />
                ) : null}
              </div>
            ) : null}
            {(() => {
              try {
                return currentItem.component === "tree";
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
                data-plasmic-name={"tree"}
                data-plasmic-override={overrides.tree}
                className={classNames(projectcss.all, sty.tree)}
              >
                {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
                  (() => {
                    try {
                      return currentItem.items;
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
                ).map((__plasmic_item_1, __plasmic_idx_1) => {
                  const currentItem = __plasmic_item_1;
                  const currentIndex = __plasmic_idx_1;
                  return (
                    <SearchContentTree
                      data-plasmic-name={"searchContentTree"}
                      data-plasmic-override={overrides.searchContentTree}
                      className={classNames(
                        "__wab_instance",
                        sty.searchContentTree
                      )}
                      data={(() => {
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
                                      return value;
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
                          $steps["runOnClick"] != null &&
                          typeof $steps["runOnClick"] === "object" &&
                          typeof $steps["runOnClick"].then === "function"
                        ) {
                          $steps["runOnClick"] = await $steps["runOnClick"];
                        }
                      }}
                    />
                  );
                })}
              </div>
            ) : null}
          </SearchContentItem>
        );
      })}
      {(() => {
        try {
          return $props.suggestion.find(sug => sug.component == "search");
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
          data-plasmic-name={"search"}
          data-plasmic-override={overrides.search}
          className={classNames(projectcss.all, sty.search)}
        >
          {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
            (() => {
              try {
                return $props.suggestion.find(sug => sug.component == "search")
                  .items;
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
              <Stack__
                as={"div"}
                hasGap={true}
                className={classNames(projectcss.all, sty.freeBox__cxH7V)}
                key={currentIndex}
                onClick={async event => {
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
              >
                <SearchContentIcon
                  className={classNames(
                    "__wab_instance",
                    sty.searchContentIcon__bvolt
                  )}
                  iconType={"search-icon"}
                />

                <div
                  className={classNames(
                    projectcss.all,
                    projectcss.__wab_text,
                    sty.text__gwwHy
                  )}
                >
                  <div
                    className={projectcss.__wab_expr_html_text}
                    dangerouslySetInnerHTML={{
                      __html: (() => {
                        try {
                          return currentItem.formatted_title;
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
            );
          })}
        </div>
      ) : null}
      <SideEffect
        data-plasmic-name={"sideEffect"}
        data-plasmic-override={overrides.sideEffect}
        className={classNames("__wab_instance", sty.sideEffect)}
        onMount={async () => {
          const $steps = {};

          $steps["splunk"] = !!$props.searchQuery
            ? (() => {
                const actionArgs = {
                  args: [
                    (() => {
                      try {
                        return {
                          event_group: "suggestion_events",
                          event_type: "suggestion_view",
                          current_url: globalThis.window.location.href,
                          terminal_id: (function () {
                            try {
                              return document.cookie.replace(
                                /(?:(?:^|.*;\s*)terminal_id\s*\=\s*([^;]*).*$)|^.*$/,
                                "$1"
                              );
                            } catch (e) {
                              return null;
                            }
                          })(),
                          is_application: false,
                          data: {
                            result_count: $props.resultCount,
                            city: $props.cityName,
                            searched_text: $props.searchQuery,
                            current_url: globalThis.window.location.href,
                            terminal_id: (function () {
                              try {
                                return document.cookie.replace(
                                  /(?:(?:^|.*;\s*)terminal_id\s*\=\s*([^;]*).*$)|^.*$/,
                                  "$1"
                                );
                              } catch (e) {
                                return null;
                              }
                            })()
                          }
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
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: [
    "root",
    "searchContentItem",
    "text",
    "button",
    "slider",
    "searchContentSlider",
    "card",
    "searchRequest",
    "tree",
    "searchContentTree",
    "search",
    "sideEffect"
  ],
  searchContentItem: [
    "searchContentItem",
    "text",
    "button",
    "slider",
    "searchContentSlider",
    "card",
    "searchRequest",
    "tree",
    "searchContentTree"
  ],
  text: ["text", "button"],
  button: ["button"],
  slider: ["slider", "searchContentSlider"],
  searchContentSlider: ["searchContentSlider"],
  card: ["card", "searchRequest"],
  searchRequest: ["searchRequest"],
  tree: ["tree", "searchContentTree"],
  searchContentTree: ["searchContentTree"],
  search: ["search"],
  sideEffect: ["sideEffect"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  searchContentItem: typeof SearchContentItem;
  text: "div";
  button: typeof Button;
  slider: "div";
  searchContentSlider: typeof SearchContentSlider;
  card: "div";
  searchRequest: typeof SearchRequest;
  tree: "div";
  searchContentTree: typeof SearchContentTree;
  search: "div";
  sideEffect: typeof SideEffect;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSearchContent__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSearchContent__VariantsArgs;
    args?: PlasmicSearchContent__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSearchContent__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicSearchContent__ArgsType,
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
          internalArgPropNames: PlasmicSearchContent__ArgProps,
          internalVariantPropNames: PlasmicSearchContent__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSearchContent__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicSearchContent";
  } else {
    func.displayName = `PlasmicSearchContent.${nodeName}`;
  }
  return func;
}

export const PlasmicSearchContent = Object.assign(
  // Top-level PlasmicSearchContent renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    searchContentItem: makeNodeComponent("searchContentItem"),
    text: makeNodeComponent("text"),
    button: makeNodeComponent("button"),
    slider: makeNodeComponent("slider"),
    searchContentSlider: makeNodeComponent("searchContentSlider"),
    card: makeNodeComponent("card"),
    searchRequest: makeNodeComponent("searchRequest"),
    tree: makeNodeComponent("tree"),
    searchContentTree: makeNodeComponent("searchContentTree"),
    search: makeNodeComponent("search"),
    sideEffect: makeNodeComponent("sideEffect"),

    // Metadata about props expected for PlasmicSearchContent
    internalVariantProps: PlasmicSearchContent__VariantProps,
    internalArgProps: PlasmicSearchContent__ArgProps
  }
);

export default PlasmicSearchContent;
/* prettier-ignore-end */
