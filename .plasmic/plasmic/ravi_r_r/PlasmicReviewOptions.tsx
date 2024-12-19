// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: NKhK0RyiR4qB

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

import RaviReviewOptions from "../../RaviReviewOptions"; // plasmic-import: WPpw5PhLSljG/component
import { Fetcher } from "@plasmicapp/react-web/lib/data-sources";

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_ravi_design_system_css from "../ravi_design_system/plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from "./PlasmicReviewOptions.module.css"; // plasmic-import: NKhK0RyiR4qB/css

createPlasmicElementProxy;

export type PlasmicReviewOptions__VariantMembers = {};
export type PlasmicReviewOptions__VariantsArgs = {};
type VariantPropType = keyof PlasmicReviewOptions__VariantsArgs;
export const PlasmicReviewOptions__VariantProps = new Array<VariantPropType>();

export type PlasmicReviewOptions__ArgsType = {
  doctorSlug?: string;
  commentText?: string;
  doctorUserId?: string;
  feedbackId?: string;
  isUserComment?: boolean;
};
type ArgPropType = keyof PlasmicReviewOptions__ArgsType;
export const PlasmicReviewOptions__ArgProps = new Array<ArgPropType>(
  "doctorSlug",
  "commentText",
  "doctorUserId",
  "feedbackId",
  "isUserComment"
);

export type PlasmicReviewOptions__OverridesType = {
  root?: Flex__<"div">;
  raviReviewOptions?: Flex__<typeof RaviReviewOptions>;
};

export interface DefaultReviewOptionsProps {
  doctorSlug?: string;
  commentText?: string;
  doctorUserId?: string;
  feedbackId?: string;
  isUserComment?: boolean;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicReviewOptions__RenderFunc(props: {
  variants: PlasmicReviewOptions__VariantsArgs;
  args: PlasmicReviewOptions__ArgsType;
  overrides: PlasmicReviewOptions__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          isUserComment: false
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
        path: "raviReviewOptions.isOther",
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
        plasmic_antd_5_hostless_css.plasmic_tokens,
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        sty.root
      )}
      dir={"rtl"}
    >
      <RaviReviewOptions
        data-plasmic-name={"raviReviewOptions"}
        data-plasmic-override={overrides.raviReviewOptions}
        className={classNames("__wab_instance", sty.raviReviewOptions)}
        commentText={(() => {
          try {
            return $props.commentText;
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
        isOther={generateStateValueProp($state, [
          "raviReviewOptions",
          "isOther"
        ])}
        isUserComment={args.isUserComment}
        onClickDelete={async () => {
          const $steps = {};

          $steps["request"] = true
            ? (() => {
                const actionArgs = {
                  args: [
                    "DELETE",
                    (() => {
                      try {
                        return "https://apigw.paziresh24.com/ravi/v1/feedbacks/delete/";
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
                    undefined,
                    (() => {
                      try {
                        return { Id: $props.feedbackId };
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
                return $globalActions["Fragment.apiRequest"]?.apply(null, [
                  ...actionArgs.args
                ]);
              })()
            : undefined;
          if (
            $steps["request"] != null &&
            typeof $steps["request"] === "object" &&
            typeof $steps["request"].then === "function"
          ) {
            $steps["request"] = await $steps["request"];
          }

          $steps["toast"] = true
            ? (() => {
                const actionArgs = {
                  args: [
                    undefined,
                    "\u0646\u0638\u0631 \u0634\u0645\u0627 \u0628\u0627 \u0645\u0648\u0641\u0642\u06cc\u062a \u062d\u0630\u0641 \u0634\u062f."
                  ]
                };
                return $globalActions["Fragment.showToast"]?.apply(null, [
                  ...actionArgs.args
                ]);
              })()
            : undefined;
          if (
            $steps["toast"] != null &&
            typeof $steps["toast"] === "object" &&
            typeof $steps["toast"].then === "function"
          ) {
            $steps["toast"] = await $steps["toast"];
          }

          $steps["splunk"] = true
            ? (() => {
                const actionArgs = {
                  args: [
                    (() => {
                      try {
                        return {
                          group: "feedback",
                          data: {
                            doctor_id: $props.doctorUserId,
                            comment_id: $props.feedbackId
                          },
                          type: "delete_comment"
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
        onClickEdit={async value => {
          const $steps = {};

          $steps["request"] = true
            ? (() => {
                const actionArgs = {
                  args: [
                    "PATCH",
                    (() => {
                      try {
                        return (
                          "https://apigw.paziresh24.com/ravi/v2/feedbacks?id=" +
                          $props.feedbackId
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
                    })(),
                    undefined,
                    (() => {
                      try {
                        return { description: value };
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
                return $globalActions["Fragment.apiRequest"]?.apply(null, [
                  ...actionArgs.args
                ]);
              })()
            : undefined;
          if (
            $steps["request"] != null &&
            typeof $steps["request"] === "object" &&
            typeof $steps["request"].then === "function"
          ) {
            $steps["request"] = await $steps["request"];
          }

          $steps["invokeGlobalAction"] =
            $steps.request.status == 200
              ? (() => {
                  const actionArgs = {
                    args: [
                      undefined,
                      "\u0646\u0638\u0631 \u0634\u0645\u0627 \u0628\u0639\u062f \u0627\u0632 \u0628\u0631\u0631\u0633\u06cc \u062a\u0648\u0633\u0637 \u067e\u0630\u06cc\u0631\u063424\u060c \u062f\u0631 \u0635\u0648\u0631\u062a \u0627\u0645\u06a9\u0627\u0646 \u0645\u0646\u062a\u0634\u0631 \u062e\u0648\u0627\u0647\u062f \u0634\u062f."
                    ]
                  };
                  return $globalActions["Fragment.showToast"]?.apply(null, [
                    ...actionArgs.args
                  ]);
                })()
              : undefined;
          if (
            $steps["invokeGlobalAction"] != null &&
            typeof $steps["invokeGlobalAction"] === "object" &&
            typeof $steps["invokeGlobalAction"].then === "function"
          ) {
            $steps["invokeGlobalAction"] = await $steps["invokeGlobalAction"];
          }

          $steps["splunk"] = true
            ? (() => {
                const actionArgs = {
                  args: [
                    (() => {
                      try {
                        return {
                          group: "feedback",
                          data: {
                            doctor_id: $props.doctorUserId,
                            comment_id: $props.feedbackId,
                            edit_text: value
                          },
                          type: "edit_comment"
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

          $steps["runCode"] = true
            ? (() => {
                const actionArgs = {
                  customFunction: async () => {
                    return console.log($steps.request);
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
        }}
        onClickSendReport={async value => {
          const $steps = {};

          $steps["login"] =
            $ctx.auth.isLogin == false
              ? (() => {
                  const actionArgs = { args: [] };
                  return $globalActions["AuthGlobalContext.login"]?.apply(
                    null,
                    [...actionArgs.args]
                  );
                })()
              : undefined;
          if (
            $steps["login"] != null &&
            typeof $steps["login"] === "object" &&
            typeof $steps["login"].then === "function"
          ) {
            $steps["login"] = await $steps["login"];
          }

          $steps["if10Character"] =
            $ctx.auth.isLogin &&
            value.length < 10 &&
            $state.raviReviewOptions.isOther
              ? (() => {
                  const actionArgs = {
                    args: [
                      "error",
                      "\u062a\u0639\u062f\u0627\u062f \u062d\u0631\u0648\u0641 \u0628\u0627\u06cc\u062f \u0628\u06cc\u0634 \u0627\u0632 10 \u062d\u0631\u0641 \u0628\u0627\u0634\u062f.",
                      undefined,
                      5000
                    ]
                  };
                  return $globalActions["Fragment.showToast"]?.apply(null, [
                    ...actionArgs.args
                  ]);
                })()
              : undefined;
          if (
            $steps["if10Character"] != null &&
            typeof $steps["if10Character"] === "object" &&
            typeof $steps["if10Character"].then === "function"
          ) {
            $steps["if10Character"] = await $steps["if10Character"];
          }

          $steps["request"] = (() => {
            if (!$ctx.auth.isLogin) {
              return false;
            } else if (value.length >= 10 && $state.raviReviewOptions.isOther) {
              return true;
            } else if (!$state.raviReviewOptions.isOther) {
              return true;
            }
          })()
            ? (() => {
                const actionArgs = {
                  args: [
                    "POST",
                    (() => {
                      try {
                        return `https://apigw.paziresh24.com/ravi/v1/feedbacks/report?id=${$props.feedbackId}`;
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
                    undefined,
                    (() => {
                      try {
                        return {
                          feedback_id: $props.feedbackId,
                          report_text: value
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
                return $globalActions["Fragment.apiRequest"]?.apply(null, [
                  ...actionArgs.args
                ]);
              })()
            : undefined;
          if (
            $steps["request"] != null &&
            typeof $steps["request"] === "object" &&
            typeof $steps["request"].then === "function"
          ) {
            $steps["request"] = await $steps["request"];
          }

          $steps["n8N"] = (() => {
            if (!$ctx.auth.isLogin) {
              return false;
            } else if (value.length >= 10 && $state.raviReviewOptions.isOther) {
              return true;
            } else if (!$state.raviReviewOptions.isOther) {
              return true;
            }
          })()
            ? (() => {
                const actionArgs = {
                  args: [
                    "POST",
                    (() => {
                      try {
                        return `https://apigw.paziresh24.com/ravi/v1/report-webhook?id=${$props.feedbackId}`;
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
                    undefined,
                    (() => {
                      try {
                        return {
                          feedback_id: $props.feedbackId,
                          report_text: value,
                          comment_text: $props.commentText,
                          doctor_slug: $props.doctorSlug
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
                return $globalActions["Fragment.apiRequest"]?.apply(null, [
                  ...actionArgs.args
                ]);
              })()
            : undefined;
          if (
            $steps["n8N"] != null &&
            typeof $steps["n8N"] === "object" &&
            typeof $steps["n8N"].then === "function"
          ) {
            $steps["n8N"] = await $steps["n8N"];
          }

          $steps["toast"] = (() => {
            if (!$ctx.auth.isLogin) {
              return false;
            } else if (value.length >= 10 && $state.raviReviewOptions.isOther) {
              return true;
            } else if (!$state.raviReviewOptions.isOther) {
              return true;
            }
          })()
            ? (() => {
                const actionArgs = {
                  args: [
                    undefined,
                    "\u0646\u0638\u0631 \u0634\u0645\u0627 \u0628\u0631\u0631\u0633\u06cc \u062e\u0648\u0627\u0647\u062f \u0634\u062f.",
                    undefined,
                    5000
                  ]
                };
                return $globalActions["Fragment.showToast"]?.apply(null, [
                  ...actionArgs.args
                ]);
              })()
            : undefined;
          if (
            $steps["toast"] != null &&
            typeof $steps["toast"] === "object" &&
            typeof $steps["toast"].then === "function"
          ) {
            $steps["toast"] = await $steps["toast"];
          }

          $steps["splunk"] = (() => {
            if (!$ctx.auth.isLogin) {
              return false;
            } else if (value.length >= 10 && $state.raviReviewOptions.isOther) {
              return true;
            } else if (!$state.raviReviewOptions.isOther) {
              return true;
            }
          })()
            ? (() => {
                const actionArgs = {
                  args: [
                    (() => {
                      try {
                        return {
                          group: "feedback",
                          data: {
                            doctor_id: $props.doctorUserId,
                            comment_id: $props.feedbackId,
                            report_text: value
                          },
                          type: "report_comment"
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
        onIsOtherChange={async (...eventArgs: any) => {
          generateStateOnChangeProp($state, [
            "raviReviewOptions",
            "isOther"
          ]).apply(null, eventArgs);

          if (
            eventArgs.length > 1 &&
            eventArgs[1] &&
            eventArgs[1]._plasmic_state_init_
          ) {
            return;
          }
        }}
      />
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "raviReviewOptions"],
  raviReviewOptions: ["raviReviewOptions"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  raviReviewOptions: typeof RaviReviewOptions;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicReviewOptions__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicReviewOptions__VariantsArgs;
    args?: PlasmicReviewOptions__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicReviewOptions__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicReviewOptions__ArgsType,
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
          internalArgPropNames: PlasmicReviewOptions__ArgProps,
          internalVariantPropNames: PlasmicReviewOptions__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicReviewOptions__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicReviewOptions";
  } else {
    func.displayName = `PlasmicReviewOptions.${nodeName}`;
  }
  return func;
}

export const PlasmicReviewOptions = Object.assign(
  // Top-level PlasmicReviewOptions renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    raviReviewOptions: makeNodeComponent("raviReviewOptions"),

    // Metadata about props expected for PlasmicReviewOptions
    internalVariantProps: PlasmicReviewOptions__VariantProps,
    internalArgProps: PlasmicReviewOptions__ArgProps
  }
);

export default PlasmicReviewOptions;
/* prettier-ignore-end */
