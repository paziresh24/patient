// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: pkMLinFwM9pzwv5S5KpiAu
// Component: lZJoIJWYs8o9

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

import RaviRateStar from "../../RaviRateStar"; // plasmic-import: e1uyHZLgwx11/component
import Paziresh24Button from "../../Paziresh24Button"; // plasmic-import: YOhw5fIQJQgB/component
import RaviTabs from "../../RaviTabs"; // plasmic-import: eIcAmCTlZ2yT/component
import Paziresh24Dialog from "../../Paziresh24Dialog"; // plasmic-import: ZGdhyEBPJSmH/component
import { AntdTextArea } from "@plasmicpkgs/antd5/skinny/registerInput";
import { inputHelpers as AntdTextArea_Helpers } from "@plasmicpkgs/antd5/skinny/registerInput";

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import sty from "./PlasmicRaviReviewFeedback.module.css"; // plasmic-import: lZJoIJWYs8o9/css

import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon
import IconIcon from "./icons/PlasmicIcon__Icon"; // plasmic-import: 2uzLLHig1Vpp/icon

createPlasmicElementProxy;

export type PlasmicRaviReviewFeedback__VariantMembers = {};
export type PlasmicRaviReviewFeedback__VariantsArgs = {};
type VariantPropType = keyof PlasmicRaviReviewFeedback__VariantsArgs;
export const PlasmicRaviReviewFeedback__VariantProps =
  new Array<VariantPropType>();

export type PlasmicRaviReviewFeedback__ArgsType = {
  positiveList?: any;
  negativeList?: any;
  onSubmit?: (rate: string, comments: string, commentText: string) => void;
};
type ArgPropType = keyof PlasmicRaviReviewFeedback__ArgsType;
export const PlasmicRaviReviewFeedback__ArgProps = new Array<ArgPropType>(
  "positiveList",
  "negativeList",
  "onSubmit"
);

export type PlasmicRaviReviewFeedback__OverridesType = {
  root?: Flex__<"div">;
  raviRateStar?: Flex__<typeof RaviRateStar>;
  raviTabs?: Flex__<typeof RaviTabs>;
  svg?: Flex__<"svg">;
  commentDialog?: Flex__<typeof Paziresh24Dialog>;
  textArea?: Flex__<typeof AntdTextArea>;
};

export interface DefaultRaviReviewFeedbackProps {
  positiveList?: any;
  negativeList?: any;
  onSubmit?: (rate: string, comments: string, commentText: string) => void;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicRaviReviewFeedback__RenderFunc(props: {
  variants: PlasmicRaviReviewFeedback__VariantsArgs;
  args: PlasmicRaviReviewFeedback__ArgsType;
  overrides: PlasmicRaviReviewFeedback__OverridesType;
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
        path: "isPositiveTab",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => true
      },
      {
        path: "selected",
        type: "private",
        variableType: "array",
        initFunc: ({ $props, $state, $queries, $ctx }) => []
      },
      {
        path: "rate",
        type: "private",
        variableType: "number",
        initFunc: ({ $props, $state, $queries, $ctx }) => 0
      },
      {
        path: "commentDialog.open",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "textArea.value",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined,

        onMutate: generateOnMutateForSpec("value", AntdTextArea_Helpers)
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
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        plasmic_antd_5_hostless_css.plasmic_tokens,
        sty.root
      )}
    >
      <div
        className={classNames(projectcss.all, sty.freeBox__pmfY1)}
        dir={"rtl"}
      >
        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__fTTq)}
        >
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text__ha5P0
            )}
          >
            {
              "\u062b\u0628\u062a \u062a\u062c\u0631\u0628\u0647 \u0648\u06cc\u0632\u06cc\u062a"
            }
          </div>
          <Stack__
            as={"div"}
            hasGap={true}
            className={classNames(projectcss.all, sty.freeBox__giY)}
            dir={"ltr"}
          >
            {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
              (() => {
                try {
                  return [1, 2, 3, 4, 5];
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
                  className={classNames(projectcss.all, sty.freeBox__z3P7)}
                  key={currentIndex}
                  onClick={async event => {
                    const $steps = {};

                    $steps["updateRate"] = true
                      ? (() => {
                          const actionArgs = {
                            variable: {
                              objRoot: $state,
                              variablePath: ["rate"]
                            },
                            operation: 0,
                            value: currentItem
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
                      $steps["updateRate"] != null &&
                      typeof $steps["updateRate"] === "object" &&
                      typeof $steps["updateRate"].then === "function"
                    ) {
                      $steps["updateRate"] = await $steps["updateRate"];
                    }
                  }}
                >
                  <RaviRateStar
                    data-plasmic-name={"raviRateStar"}
                    data-plasmic-override={overrides.raviRateStar}
                    className={classNames("__wab_instance", sty.raviRateStar)}
                    isLarge={true}
                    isSelected={(() => {
                      try {
                        return currentItem <= $state.rate;
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
                  />
                </div>
              );
            })}
          </Stack__>
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text__gwuGh
            )}
          >
            <React.Fragment>
              {(() => {
                try {
                  return (() => {
                    if ($state.rate == 1) {
                      return "خیلی بد";
                    } else if ($state.rate == 2) {
                      return "بد";
                    } else if ($state.rate == 3) {
                      return "متوسط";
                    } else if ($state.rate == 4) {
                      return "خوب";
                    } else if ($state.rate == 5) {
                      return "خیلی خوب";
                    }
                  })();
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return "\u062b\u0628\u062a \u062a\u062c\u0631\u0628\u0647 \u0648\u06cc\u0632\u06cc\u062a";
                  }
                  throw e;
                }
              })()}
            </React.Fragment>
          </div>
          <Stack__
            as={"div"}
            hasGap={true}
            className={classNames(projectcss.all, sty.freeBox__p5Ee)}
          >
            <Stack__
              as={"div"}
              hasGap={true}
              className={classNames(projectcss.all, sty.freeBox__cvqo5)}
            >
              <Paziresh24Button
                children2={
                  "\u0628\u0627\u0632\u062e\u0648\u0631\u062f \u0645\u062b\u0628\u062a"
                }
                className={classNames(
                  "__wab_instance",
                  sty.paziresh24Button__rtUjF
                )}
                color={"softBlue"}
                onClick={async event => {
                  const $steps = {};

                  $steps["updateIsPositiveTab"] = true
                    ? (() => {
                        const actionArgs = {
                          variable: {
                            objRoot: $state,
                            variablePath: ["isPositiveTab"]
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
                    $steps["updateIsPositiveTab"] != null &&
                    typeof $steps["updateIsPositiveTab"] === "object" &&
                    typeof $steps["updateIsPositiveTab"].then === "function"
                  ) {
                    $steps["updateIsPositiveTab"] = await $steps[
                      "updateIsPositiveTab"
                    ];
                  }
                }}
              />

              <Paziresh24Button
                children2={
                  "\u0628\u0627\u0632\u062e\u0648\u0631\u062f \u0645\u0646\u0641\u06cc"
                }
                className={classNames(
                  "__wab_instance",
                  sty.paziresh24Button__dvDL
                )}
                color={"softRed"}
                onClick={async event => {
                  const $steps = {};

                  $steps["updateIsPositiveTab"] = true
                    ? (() => {
                        const actionArgs = {
                          variable: {
                            objRoot: $state,
                            variablePath: ["isPositiveTab"]
                          },
                          operation: 0,
                          value: false
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
                    $steps["updateIsPositiveTab"] != null &&
                    typeof $steps["updateIsPositiveTab"] === "object" &&
                    typeof $steps["updateIsPositiveTab"].then === "function"
                  ) {
                    $steps["updateIsPositiveTab"] = await $steps[
                      "updateIsPositiveTab"
                    ];
                  }
                }}
              />
            </Stack__>
            <div className={classNames(projectcss.all, sty.freeBox__zM4De)}>
              <RaviTabs
                data-plasmic-name={"raviTabs"}
                data-plasmic-override={overrides.raviTabs}
                className={classNames("__wab_instance", sty.raviTabs)}
                isNegative={(() => {
                  try {
                    return !$state.isPositiveTab;
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
                onClickTab={async value => {
                  const $steps = {};

                  $steps["updateIsPositiveTab"] = true
                    ? (() => {
                        const actionArgs = {
                          variable: {
                            objRoot: $state,
                            variablePath: ["isPositiveTab"]
                          },
                          operation: 0,
                          value: value == "positive" ? true : false
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
                    $steps["updateIsPositiveTab"] != null &&
                    typeof $steps["updateIsPositiveTab"] === "object" &&
                    typeof $steps["updateIsPositiveTab"].then === "function"
                  ) {
                    $steps["updateIsPositiveTab"] = await $steps[
                      "updateIsPositiveTab"
                    ];
                  }
                }}
              />
            </div>
            <div className={classNames(projectcss.all, sty.freeBox___1Bslz)}>
              <div className={classNames(projectcss.all, sty.freeBox__rbnhc)} />

              <div className={classNames(projectcss.all, sty.freeBox__h8Ig4)} />

              <Stack__
                as={"div"}
                hasGap={true}
                className={classNames(projectcss.all, sty.freeBox__vOlxk)}
              >
                {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
                  (() => {
                    try {
                      return $state.isPositiveTab
                        ? $props.positiveList
                        : $props.negativeList;
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
                    <Paziresh24Button
                      children2={
                        <div
                          className={classNames(
                            projectcss.all,
                            projectcss.__wab_text,
                            sty.text__wo6DO
                          )}
                        >
                          <React.Fragment>
                            {(() => {
                              try {
                                return currentItem.label;
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
                        </div>
                      }
                      className={classNames(
                        "__wab_instance",
                        sty.paziresh24Button__bHSuU
                      )}
                      color={(() => {
                        try {
                          return (() => {
                            const exist = $state.selected.some(
                              item => item == currentItem.value
                            );
                            if (exist && $state.isPositiveTab) {
                              return "softBlue";
                            } else if (exist && !$state.isPositiveTab) {
                              return "softRed";
                            } else {
                              return "sand";
                            }
                          })();
                        } catch (e) {
                          if (
                            e instanceof TypeError ||
                            e?.plasmicType === "PlasmicUndefinedDataError"
                          ) {
                            return "softBlue";
                          }
                          throw e;
                        }
                      })()}
                      key={currentIndex}
                      onClick={async event => {
                        const $steps = {};

                        $steps["updateSelected"] = true
                          ? (() => {
                              const actionArgs = {
                                variable: {
                                  objRoot: $state,
                                  variablePath: ["selected"]
                                },
                                operation: 0,
                                value: (() => {
                                  const exist = $state.selected.some(
                                    item => item == currentItem.value
                                  );
                                  if (exist) {
                                    return $state.selected.filter(
                                      item => item != currentItem.value
                                    );
                                  } else {
                                    return [
                                      ...$state.selected,
                                      currentItem.value
                                    ];
                                  }
                                })()
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
                      }}
                      outline={(() => {
                        try {
                          return (() => {
                            const exist = $state.selected.some(
                              item => item == currentItem.value
                            );
                            if (exist && !$state.isPositiveTab) {
                              return false;
                            } else {
                              return "outline";
                            }
                          })();
                        } catch (e) {
                          if (
                            e instanceof TypeError ||
                            e?.plasmicType === "PlasmicUndefinedDataError"
                          ) {
                            return "outline";
                          }
                          throw e;
                        }
                      })()}
                      shape={"rounded"}
                      size={"compact"}
                    />
                  );
                })}
              </Stack__>
            </div>
          </Stack__>
          <Stack__
            as={"div"}
            hasGap={true}
            className={classNames(projectcss.all, sty.freeBox__xuCq)}
          >
            <Paziresh24Button
              children2={
                <Stack__
                  as={"div"}
                  hasGap={true}
                  className={classNames(projectcss.all, sty.freeBox__qoOy)}
                >
                  <div
                    className={classNames(
                      projectcss.all,
                      projectcss.__wab_text,
                      sty.text__ziSgz
                    )}
                  >
                    {
                      "\u0646\u0648\u0634\u062a\u0646 \u06a9\u0627\u0645\u0646\u062a"
                    }
                  </div>
                  <IconIcon
                    data-plasmic-name={"svg"}
                    data-plasmic-override={overrides.svg}
                    className={classNames(projectcss.all, sty.svg)}
                    role={"img"}
                  />
                </Stack__>
              }
              className={classNames(
                "__wab_instance",
                sty.paziresh24Button__gIf2F
              )}
              color={"softSand"}
              endIcon={null}
              onClick={async event => {
                const $steps = {};

                $steps["updateCommentDialogOpen"] = true
                  ? (() => {
                      const actionArgs = {
                        variable: {
                          objRoot: $state,
                          variablePath: ["commentDialog", "open"]
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

                        const oldValue = $stateGet(objRoot, variablePath);
                        $stateSet(objRoot, variablePath, !oldValue);
                        return !oldValue;
                      })?.apply(null, [actionArgs]);
                    })()
                  : undefined;
                if (
                  $steps["updateCommentDialogOpen"] != null &&
                  typeof $steps["updateCommentDialogOpen"] === "object" &&
                  typeof $steps["updateCommentDialogOpen"].then === "function"
                ) {
                  $steps["updateCommentDialogOpen"] = await $steps[
                    "updateCommentDialogOpen"
                  ];
                }
              }}
              size={"compact"}
            />

            <Paziresh24Button
              children2={"\u062b\u0628\u062a \u0646\u0638\u0631"}
              className={classNames(
                "__wab_instance",
                sty.paziresh24Button__q1Rv7
              )}
              isDisabled={(() => {
                try {
                  return $state.rate == 0;
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
              onClick={async event => {
                const $steps = {};

                $steps["runOnSubmit"] = true
                  ? (() => {
                      const actionArgs = {
                        eventRef: $props["onSubmit"],
                        args: [
                          (() => {
                            try {
                              return $state.rate;
                            } catch (e) {
                              if (
                                e instanceof TypeError ||
                                e?.plasmicType === "PlasmicUndefinedDataError"
                              ) {
                                return undefined;
                              }
                              throw e;
                            }
                          })(),
                          (() => {
                            try {
                              return $state.selected;
                            } catch (e) {
                              if (
                                e instanceof TypeError ||
                                e?.plasmicType === "PlasmicUndefinedDataError"
                              ) {
                                return undefined;
                              }
                              throw e;
                            }
                          })(),
                          (() => {
                            try {
                              return $state.textArea.value;
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
                  $steps["runOnSubmit"] != null &&
                  typeof $steps["runOnSubmit"] === "object" &&
                  typeof $steps["runOnSubmit"].then === "function"
                ) {
                  $steps["runOnSubmit"] = await $steps["runOnSubmit"];
                }
              }}
            />
          </Stack__>
        </Stack__>
      </div>
      <Paziresh24Dialog
        data-plasmic-name={"commentDialog"}
        data-plasmic-override={overrides.commentDialog}
        body={
          <Stack__
            as={"div"}
            hasGap={true}
            className={classNames(projectcss.all, sty.freeBox___4HpLt)}
          >
            {(() => {
              const child$Props = {
                className: classNames("__wab_instance", sty.textArea),
                onChange: async (...eventArgs: any) => {
                  generateStateOnChangePropForCodeComponents(
                    $state,
                    "value",
                    ["textArea", "value"],
                    AntdTextArea_Helpers
                  ).apply(null, eventArgs);
                },
                placeholder: "\u0646\u0638\u0631 \u0634\u0645\u0627...",
                value: generateStateValueProp($state, ["textArea", "value"])
              };
              initializeCodeComponentStates(
                $state,
                [
                  {
                    name: "value",
                    plasmicStateName: "textArea.value"
                  }
                ],
                [],
                AntdTextArea_Helpers ?? {},
                child$Props
              );

              return (
                <AntdTextArea
                  data-plasmic-name={"textArea"}
                  data-plasmic-override={overrides.textArea}
                  {...child$Props}
                />
              );
            })()}
            <Paziresh24Button
              children2={"\u062b\u0628\u062a"}
              className={classNames(
                "__wab_instance",
                sty.paziresh24Button___56OIw
              )}
              onClick={async event => {
                const $steps = {};

                $steps["updateCommentDialogOpen"] = true
                  ? (() => {
                      const actionArgs = {
                        variable: {
                          objRoot: $state,
                          variablePath: ["commentDialog", "open"]
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

                        const oldValue = $stateGet(objRoot, variablePath);
                        $stateSet(objRoot, variablePath, !oldValue);
                        return !oldValue;
                      })?.apply(null, [actionArgs]);
                    })()
                  : undefined;
                if (
                  $steps["updateCommentDialogOpen"] != null &&
                  typeof $steps["updateCommentDialogOpen"] === "object" &&
                  typeof $steps["updateCommentDialogOpen"].then === "function"
                ) {
                  $steps["updateCommentDialogOpen"] = await $steps[
                    "updateCommentDialogOpen"
                  ];
                }
              }}
            />
          </Stack__>
        }
        className={classNames("__wab_instance", sty.commentDialog)}
        noTrigger={true}
        onOpenChange={async (...eventArgs: any) => {
          generateStateOnChangeProp($state, ["commentDialog", "open"]).apply(
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
        open={generateStateValueProp($state, ["commentDialog", "open"])}
        title={
          "\u0646\u0638\u0631 \u062e\u0648\u062f \u0631\u0627 \u0628\u0646\u0648\u06cc\u0633\u06cc\u062f"
        }
        trigger={null}
      />
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: [
    "root",
    "raviRateStar",
    "raviTabs",
    "svg",
    "commentDialog",
    "textArea"
  ],
  raviRateStar: ["raviRateStar"],
  raviTabs: ["raviTabs"],
  svg: ["svg"],
  commentDialog: ["commentDialog", "textArea"],
  textArea: ["textArea"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  raviRateStar: typeof RaviRateStar;
  raviTabs: typeof RaviTabs;
  svg: "svg";
  commentDialog: typeof Paziresh24Dialog;
  textArea: typeof AntdTextArea;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicRaviReviewFeedback__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicRaviReviewFeedback__VariantsArgs;
    args?: PlasmicRaviReviewFeedback__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicRaviReviewFeedback__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicRaviReviewFeedback__ArgsType,
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
          internalArgPropNames: PlasmicRaviReviewFeedback__ArgProps,
          internalVariantPropNames: PlasmicRaviReviewFeedback__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicRaviReviewFeedback__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicRaviReviewFeedback";
  } else {
    func.displayName = `PlasmicRaviReviewFeedback.${nodeName}`;
  }
  return func;
}

export const PlasmicRaviReviewFeedback = Object.assign(
  // Top-level PlasmicRaviReviewFeedback renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    raviRateStar: makeNodeComponent("raviRateStar"),
    raviTabs: makeNodeComponent("raviTabs"),
    svg: makeNodeComponent("svg"),
    commentDialog: makeNodeComponent("commentDialog"),
    textArea: makeNodeComponent("textArea"),

    // Metadata about props expected for PlasmicRaviReviewFeedback
    internalVariantProps: PlasmicRaviReviewFeedback__VariantProps,
    internalArgProps: PlasmicRaviReviewFeedback__ArgProps
  }
);

export default PlasmicRaviReviewFeedback;
/* prettier-ignore-end */
