// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: 6HBcNwr8dz9LuS1Qe36xa5
// Component: 5O8XqcSJJk6J

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

import "@plasmicapp/react-web/lib/plasmic.css";

import projectcss from "./plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import sty from "./PlasmicPaziresh24MultilineTextInput.module.css"; // plasmic-import: 5O8XqcSJJk6J/css

createPlasmicElementProxy;

export type PlasmicPaziresh24MultilineTextInput__VariantMembers = {};
export type PlasmicPaziresh24MultilineTextInput__VariantsArgs = {};
type VariantPropType = keyof PlasmicPaziresh24MultilineTextInput__VariantsArgs;
export const PlasmicPaziresh24MultilineTextInput__VariantProps =
  new Array<VariantPropType>();

export type PlasmicPaziresh24MultilineTextInput__ArgsType = {
  value?: string;
  onValueChange?: (val: string) => void;
  placeholder?: string;
  autoSize?: boolean;
};
type ArgPropType = keyof PlasmicPaziresh24MultilineTextInput__ArgsType;
export const PlasmicPaziresh24MultilineTextInput__ArgProps =
  new Array<ArgPropType>("value", "onValueChange", "placeholder", "autoSize");

export type PlasmicPaziresh24MultilineTextInput__OverridesType = {
  root?: Flex__<"div">;
  textarea?: Flex__<"textarea">;
};

export interface DefaultPaziresh24MultilineTextInputProps {
  value?: string;
  onValueChange?: (val: string) => void;
  placeholder?: string;
  autoSize?: boolean;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicPaziresh24MultilineTextInput__RenderFunc(props: {
  variants: PlasmicPaziresh24MultilineTextInput__VariantsArgs;
  args: PlasmicPaziresh24MultilineTextInput__ArgsType;
  overrides: PlasmicPaziresh24MultilineTextInput__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          autoSize: false
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
        path: "textarea.value",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) =>
          (() => {
            try {
              return $state.value;
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
        path: "value",
        type: "writable",
        variableType: "text",

        valueProp: "value",
        onChangeProp: "onValueChange"
      },
      {
        path: "height",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => "2.5rem"
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
        sty.root
      )}
    >
      <textarea
        data-plasmic-name={"textarea"}
        data-plasmic-override={overrides.textarea}
        className={classNames(
          projectcss.all,
          projectcss.textarea,
          sty.textarea
        )}
        onChange={async (...eventArgs: any) => {
          (e => {
            generateStateOnChangeProp($state, ["textarea", "value"])(
              e.target.value
            );
          }).apply(null, eventArgs);

          (async event => {
            const $steps = {};

            $steps["updateValue"] = true
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["value"]
                    },
                    operation: 0,
                    value: $state.textarea.value
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
              $steps["updateValue"] != null &&
              typeof $steps["updateValue"] === "object" &&
              typeof $steps["updateValue"].then === "function"
            ) {
              $steps["updateValue"] = await $steps["updateValue"];
            }
          }).apply(null, eventArgs);
        }}
        onInput={async event => {
          const $steps = {};

          $steps["runCode"] = $props.autoSize
            ? (() => {
                const actionArgs = {
                  customFunction: async () => {
                    return (() => {
                      event.currentTarget.style.height = "2.5rem";
                      return (event.currentTarget.style.height =
                        event.currentTarget.scrollHeight + "px");
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
        }}
        placeholder={(() => {
          try {
            return $props.placeholder;
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
        ref={ref => {
          $refs["textarea"] = ref;
        }}
        style={{ resize: "none", overflow: "hidden" }}
        value={generateStateValueProp($state, ["textarea", "value"]) ?? ""}
      />
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "textarea"],
  textarea: ["textarea"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  textarea: "textarea";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicPaziresh24MultilineTextInput__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicPaziresh24MultilineTextInput__VariantsArgs;
    args?: PlasmicPaziresh24MultilineTextInput__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit< // Specify variants directly as props
    PlasmicPaziresh24MultilineTextInput__VariantsArgs,
    ReservedPropsType
  > &
    /* Specify args directly as props*/ Omit<
      PlasmicPaziresh24MultilineTextInput__ArgsType,
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
          internalArgPropNames: PlasmicPaziresh24MultilineTextInput__ArgProps,
          internalVariantPropNames:
            PlasmicPaziresh24MultilineTextInput__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicPaziresh24MultilineTextInput__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicPaziresh24MultilineTextInput";
  } else {
    func.displayName = `PlasmicPaziresh24MultilineTextInput.${nodeName}`;
  }
  return func;
}

export const PlasmicPaziresh24MultilineTextInput = Object.assign(
  // Top-level PlasmicPaziresh24MultilineTextInput renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    textarea: makeNodeComponent("textarea"),

    // Metadata about props expected for PlasmicPaziresh24MultilineTextInput
    internalVariantProps: PlasmicPaziresh24MultilineTextInput__VariantProps,
    internalArgProps: PlasmicPaziresh24MultilineTextInput__ArgProps
  }
);

export default PlasmicPaziresh24MultilineTextInput;
/* prettier-ignore-end */