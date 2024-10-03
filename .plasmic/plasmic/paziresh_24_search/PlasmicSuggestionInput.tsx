// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: KILAc4YdRdGh

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

import TextInput from "../../TextInput"; // plasmic-import: 6w9lKEd-r02I/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSuggestionInput.module.css"; // plasmic-import: KILAc4YdRdGh/css

import Icon12Icon from "./icons/PlasmicIcon__Icon12"; // plasmic-import: IrGZtNznvLs2/icon
import Icon13Icon from "./icons/PlasmicIcon__Icon13"; // plasmic-import: E9NGWfCxi3aB/icon

createPlasmicElementProxy;

export type PlasmicSuggestionInput__VariantMembers = {};
export type PlasmicSuggestionInput__VariantsArgs = {};
type VariantPropType = keyof PlasmicSuggestionInput__VariantsArgs;
export const PlasmicSuggestionInput__VariantProps =
  new Array<VariantPropType>();

export type PlasmicSuggestionInput__ArgsType = {
  suggestionTextInputValue?: string;
  onSuggestionTextInputValueChange?: (val: string) => void;
  suggestedContentVisibility?: boolean;
  onSuggestedContentVisibilityChange?: (val: string) => void;
  suggestionContents2?: React.ReactNode;
  optionsLength?: number;
  onSelectedOptionChange?: (val: string) => void;
  onSelect?: (option: number) => void;
};
type ArgPropType = keyof PlasmicSuggestionInput__ArgsType;
export const PlasmicSuggestionInput__ArgProps = new Array<ArgPropType>(
  "suggestionTextInputValue",
  "onSuggestionTextInputValueChange",
  "suggestedContentVisibility",
  "onSuggestedContentVisibilityChange",
  "suggestionContents2",
  "optionsLength",
  "onSelectedOptionChange",
  "onSelect"
);

export type PlasmicSuggestionInput__OverridesType = {
  root?: Flex__<"div">;
  textInput?: Flex__<typeof TextInput>;
  suggestionContents?: Flex__<"div">;
};

export interface DefaultSuggestionInputProps {
  suggestionTextInputValue?: string;
  onSuggestionTextInputValueChange?: (val: string) => void;
  suggestedContentVisibility?: boolean;
  onSuggestedContentVisibilityChange?: (val: string) => void;
  suggestionContents2?: React.ReactNode;
  optionsLength?: number;
  onSelectedOptionChange?: (val: string) => void;
  onSelect?: (option: number) => void;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSuggestionInput__RenderFunc(props: {
  variants: PlasmicSuggestionInput__VariantsArgs;
  args: PlasmicSuggestionInput__ArgsType;
  overrides: PlasmicSuggestionInput__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          optionsLength: 0
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
        type: "writable",
        variableType: "text",

        valueProp: "suggestionTextInputValue",
        onChangeProp: "onSuggestionTextInputValueChange"
      },
      {
        path: "suggestedContentVisibility",
        type: "writable",
        variableType: "boolean",

        valueProp: "suggestedContentVisibility",
        onChangeProp: "onSuggestedContentVisibilityChange"
      },
      {
        path: "selectedOption",
        type: "readonly",
        variableType: "number",
        initFunc: ({ $props, $state, $queries, $ctx }) => 0,

        onChangeProp: "onSelectedOptionChange"
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
      <div
        className={classNames(projectcss.all, sty.freeBox___16WNu)}
        onClick={async event => {
          const $steps = {};

          $steps["updateSuggestedContentVisibility"] = true
            ? (() => {
                const actionArgs = {
                  variable: {
                    objRoot: $state,
                    variablePath: ["suggestedContentVisibility"]
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
            $steps["updateSuggestedContentVisibility"] != null &&
            typeof $steps["updateSuggestedContentVisibility"] === "object" &&
            typeof $steps["updateSuggestedContentVisibility"].then ===
              "function"
          ) {
            $steps["updateSuggestedContentVisibility"] = await $steps[
              "updateSuggestedContentVisibility"
            ];
          }
        }}
        onKeyDown={async event => {
          const $steps = {};

          $steps["arrowDown"] =
            event.key === "ArrowDown"
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["selectedOption"]
                    },
                    operation: 0,
                    value: Math.min(
                      $state.selectedOption + 1,
                      $props.optionsLength - 1
                    )
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
            $steps["arrowDown"] != null &&
            typeof $steps["arrowDown"] === "object" &&
            typeof $steps["arrowDown"].then === "function"
          ) {
            $steps["arrowDown"] = await $steps["arrowDown"];
          }

          $steps["arrowUp"] =
            event.key === "ArrowUp"
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["selectedOption"]
                    },
                    operation: 0,
                    value: Math.max($state.selectedOption - 1, 0)
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
            $steps["arrowUp"] != null &&
            typeof $steps["arrowUp"] === "object" &&
            typeof $steps["arrowUp"].then === "function"
          ) {
            $steps["arrowUp"] = await $steps["arrowUp"];
          }

          $steps["enter"] =
            event.key === "Enter"
              ? (() => {
                  const actionArgs = {
                    eventRef: $props["onSelect"],
                    args: [
                      (() => {
                        try {
                          return $state.selectedOption;
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
            $steps["enter"] != null &&
            typeof $steps["enter"] === "object" &&
            typeof $steps["enter"].then === "function"
          ) {
            $steps["enter"] = await $steps["enter"];
          }

          $steps["updateSuggestedContentVisibility"] =
            event.key === "Enter"
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["suggestedContentVisibility"]
                    },
                    operation: 0,
                    value: false
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
            $steps["updateSuggestedContentVisibility"] != null &&
            typeof $steps["updateSuggestedContentVisibility"] === "object" &&
            typeof $steps["updateSuggestedContentVisibility"].then ===
              "function"
          ) {
            $steps["updateSuggestedContentVisibility"] = await $steps[
              "updateSuggestedContentVisibility"
            ];
          }
        }}
      >
        <TextInput
          data-plasmic-name={"textInput"}
          data-plasmic-override={overrides.textInput}
          className={classNames("__wab_instance", sty.textInput)}
          endIcon={
            <Icon13Icon
              className={classNames(projectcss.all, sty.svg___7MjT1)}
              onClick={async event => {
                const $steps = {};

                $steps["updateTextInputValue"] = true
                  ? (() => {
                      const actionArgs = {
                        variable: {
                          objRoot: $state,
                          variablePath: ["textInput", "value"]
                        },
                        operation: 1
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

                        $stateSet(objRoot, variablePath, undefined);
                        return undefined;
                      })?.apply(null, [actionArgs]);
                    })()
                  : undefined;
                if (
                  $steps["updateTextInputValue"] != null &&
                  typeof $steps["updateTextInputValue"] === "object" &&
                  typeof $steps["updateTextInputValue"].then === "function"
                ) {
                  $steps["updateTextInputValue"] = await $steps[
                    "updateTextInputValue"
                  ];
                }

                $steps["updateTextInputValue2"] = true
                  ? (() => {
                      const actionArgs = {
                        variable: {
                          objRoot: $state,
                          variablePath: ["suggestedContentVisibility"]
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
                  $steps["updateTextInputValue2"] != null &&
                  typeof $steps["updateTextInputValue2"] === "object" &&
                  typeof $steps["updateTextInputValue2"].then === "function"
                ) {
                  $steps["updateTextInputValue2"] = await $steps[
                    "updateTextInputValue2"
                  ];
                }
              }}
              role={"img"}
            />
          }
          onChange={async (...eventArgs: any) => {
            ((...eventArgs) => {
              generateStateOnChangeProp($state, ["textInput", "value"])(
                (e => e.target?.value).apply(null, eventArgs)
              );
            }).apply(null, eventArgs);
            (async event => {
              const $steps = {};

              $steps["updateSelectedOption"] = true
                ? (() => {
                    const actionArgs = {
                      variable: {
                        objRoot: $state,
                        variablePath: ["selectedOption"]
                      },
                      operation: 0,
                      value: 0
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
                $steps["updateSelectedOption"] != null &&
                typeof $steps["updateSelectedOption"] === "object" &&
                typeof $steps["updateSelectedOption"].then === "function"
              ) {
                $steps["updateSelectedOption"] = await $steps[
                  "updateSelectedOption"
                ];
              }
            }).apply(null, eventArgs);
          }}
          placeholder={
            "\u062c\u0633\u062a\u062c\u0648\u06cc \u0628\u06cc\u0645\u0627\u0631\u06cc\u060c \u062a\u062e\u0635\u0635\u060c \u067e\u0632\u0634\u06a9\u060c \u0628\u06cc\u0645\u0627\u0631\u0633\u062a\u0627\u0646 \u0648 ..."
          }
          showEndIcon={(() => {
            try {
              return $state.textInput.value?.length > 0;
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
          showStartIcon={true}
          startIcon={
            <Icon12Icon
              className={classNames(projectcss.all, sty.svg__abY32)}
              onClick={async event => {
                const $steps = {};

                $steps["updateTextInputValue"] = true
                  ? (() => {
                      const actionArgs = {
                        variable: {
                          objRoot: $state,
                          variablePath: ["textInput", "value"]
                        },
                        operation: 0
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
                  typeof $steps["updateTextInputValue"].then === "function"
                ) {
                  $steps["updateTextInputValue"] = await $steps[
                    "updateTextInputValue"
                  ];
                }
              }}
              role={"img"}
            />
          }
          type={(() => {
            try {
              return "search";
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
          value={generateStateValueProp($state, ["textInput", "value"]) ?? ""}
        />
      </div>
      {(() => {
        try {
          return $state.suggestedContentVisibility;
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
          data-plasmic-name={"suggestionContents"}
          data-plasmic-override={overrides.suggestionContents}
          className={classNames(projectcss.all, sty.suggestionContents)}
        >
          {renderPlasmicSlot({
            defaultContents: null,
            value: args.suggestionContents2
          })}
        </div>
      ) : null}
      {(() => {
        try {
          return $state.suggestedContentVisibility && $props.optionsLength > 0;
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
          className={classNames(projectcss.all, sty.freeBox__npgQt)}
          onClick={async event => {
            const $steps = {};

            $steps["updateSuggestedContentVisibility"] = true
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["suggestedContentVisibility"]
                    },
                    operation: 0,
                    value: false
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
              $steps["updateSuggestedContentVisibility"] != null &&
              typeof $steps["updateSuggestedContentVisibility"] === "object" &&
              typeof $steps["updateSuggestedContentVisibility"].then ===
                "function"
            ) {
              $steps["updateSuggestedContentVisibility"] = await $steps[
                "updateSuggestedContentVisibility"
              ];
            }
          }}
        />
      ) : null}
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "textInput", "suggestionContents"],
  textInput: ["textInput"],
  suggestionContents: ["suggestionContents"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  textInput: typeof TextInput;
  suggestionContents: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSuggestionInput__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSuggestionInput__VariantsArgs;
    args?: PlasmicSuggestionInput__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSuggestionInput__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicSuggestionInput__ArgsType,
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
          internalArgPropNames: PlasmicSuggestionInput__ArgProps,
          internalVariantPropNames: PlasmicSuggestionInput__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSuggestionInput__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicSuggestionInput";
  } else {
    func.displayName = `PlasmicSuggestionInput.${nodeName}`;
  }
  return func;
}

export const PlasmicSuggestionInput = Object.assign(
  // Top-level PlasmicSuggestionInput renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    textInput: makeNodeComponent("textInput"),
    suggestionContents: makeNodeComponent("suggestionContents"),

    // Metadata about props expected for PlasmicSuggestionInput
    internalVariantProps: PlasmicSuggestionInput__VariantProps,
    internalArgProps: PlasmicSuggestionInput__ArgProps
  }
);

export default PlasmicSuggestionInput;
/* prettier-ignore-end */
