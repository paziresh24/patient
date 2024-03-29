// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: dtSZu4xyXUej

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

import Select from "../../Select"; // plasmic-import: zIWWWwAA3-2B/component
import TextInput from "../../TextInput"; // plasmic-import: iKLtt-X_YZoa/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from "./PlasmicFilter.module.css"; // plasmic-import: dtSZu4xyXUej/css

import SearchsvgIcon from "./icons/PlasmicIcon__Searchsvg"; // plasmic-import: W3TLlIDrGJdy/icon
import ChecksvgIcon from "./icons/PlasmicIcon__Checksvg"; // plasmic-import: NWCYMTObqr7D/icon

createPlasmicElementProxy;

export type PlasmicFilter__VariantMembers = {};
export type PlasmicFilter__VariantsArgs = {};
type VariantPropType = keyof PlasmicFilter__VariantsArgs;
export const PlasmicFilter__VariantProps = new Array<VariantPropType>();

export type PlasmicFilter__ArgsType = {
  centerList?: any;
  isLoggedIn?: boolean;
  onSearch?: (text: string) => void;
  onFilter?: (value: string) => void;
  onSort?: (value: string) => void;
};
type ArgPropType = keyof PlasmicFilter__ArgsType;
export const PlasmicFilter__ArgProps = new Array<ArgPropType>(
  "centerList",
  "isLoggedIn",
  "onSearch",
  "onFilter",
  "onSort"
);

export type PlasmicFilter__OverridesType = {
  root?: Flex__<"div">;
  freeBox?: Flex__<"div">;
  select?: Flex__<typeof Select>;
  select2?: Flex__<typeof Select>;
  textInput?: Flex__<typeof TextInput>;
};

export interface DefaultFilterProps {
  centerList?: any;
  isLoggedIn?: boolean;
  onSearch?: (text: string) => void;
  onFilter?: (value: string) => void;
  onSort?: (value: string) => void;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicFilter__RenderFunc(props: {
  variants: PlasmicFilter__VariantsArgs;
  args: PlasmicFilter__ArgsType;
  overrides: PlasmicFilter__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          centerList: [],
          isLoggedIn: false
        },
        props.args
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

  const currentUser = useCurrentUser?.() || {};

  const stateSpecs: Parameters<typeof useDollarState>[0] = React.useMemo(
    () => [
      {
        path: "textInput.value",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => ""
      },
      {
        path: "select.value",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => "all"
      },
      {
        path: "select2.value",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => "created_at"
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
      <Stack__
        as={"div"}
        data-plasmic-name={"freeBox"}
        data-plasmic-override={overrides.freeBox}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox)}
      >
        <Select
          data-plasmic-name={"select"}
          data-plasmic-override={overrides.select}
          className={classNames("__wab_instance", sty.select)}
          onChange={async (...eventArgs: any) => {
            ((...eventArgs) => {
              generateStateOnChangeProp($state, ["select", "value"])(
                eventArgs[0]
              );
            }).apply(null, eventArgs);
            (async value => {
              const $steps = {};

              $steps["runOnFilter"] = true
                ? (() => {
                    const actionArgs = {
                      eventRef: $props["onFilter"],
                      args: [
                        (() => {
                          try {
                            return $state.select.value;
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
                $steps["runOnFilter"] != null &&
                typeof $steps["runOnFilter"] === "object" &&
                typeof $steps["runOnFilter"].then === "function"
              ) {
                $steps["runOnFilter"] = await $steps["runOnFilter"];
              }
            }).apply(null, eventArgs);
          }}
          options={(() => {
            try {
              return [
                { value: "all", label: "همه نظرات" },
                ...($props.isLoggedIn
                  ? [{ value: "my_feedbacks", label: "نظرات من" }]
                  : []),
                { value: "recommended", label: "نظرات منفی" },
                { value: "has_nobat", label: "بیماران دارای نوبت" },
                ...$props.centerList.map(center => ({
                  value: center.id,
                  label: center.name
                }))
              ];
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
          value={generateStateValueProp($state, ["select", "value"])}
        />

        <Select
          data-plasmic-name={"select2"}
          data-plasmic-override={overrides.select2}
          className={classNames("__wab_instance", sty.select2)}
          onChange={async (...eventArgs: any) => {
            ((...eventArgs) => {
              generateStateOnChangeProp($state, ["select2", "value"])(
                eventArgs[0]
              );
            }).apply(null, eventArgs);
            (async value => {
              const $steps = {};

              $steps["runOnSort"] = true
                ? (() => {
                    const actionArgs = {
                      eventRef: $props["onSort"],
                      args: [
                        (() => {
                          try {
                            return $state.select2.value;
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
                $steps["runOnSort"] != null &&
                typeof $steps["runOnSort"] === "object" &&
                typeof $steps["runOnSort"].then === "function"
              ) {
                $steps["runOnSort"] = await $steps["runOnSort"];
              }
            }).apply(null, eventArgs);
          }}
          options={(() => {
            const __composite = [
              { value: null, label: null },
              { label: null, value: null },
              { label: null, value: null }
            ];
            __composite["0"]["value"] = "default_order";
            __composite["0"]["label"] =
              "\u0645\u0631\u062a\u0628\u0637 \u062a\u0631\u06cc\u0646";
            __composite["1"]["label"] =
              "\u062c\u062f\u06cc\u062f \u062a\u0631\u06cc\u0646";
            __composite["1"]["value"] = "created_at";
            __composite["2"]["label"] =
              "\u0645\u062d\u0628\u0648\u0628 \u062a\u0631\u06cc\u0646";
            __composite["2"]["value"] = "like";
            return __composite;
          })()}
          value={generateStateValueProp($state, ["select2", "value"])}
        />
      </Stack__>
      <TextInput
        data-plasmic-name={"textInput"}
        data-plasmic-override={overrides.textInput}
        className={classNames("__wab_instance", sty.textInput)}
        onChange={async (...eventArgs: any) => {
          ((...eventArgs) => {
            generateStateOnChangeProp($state, ["textInput", "value"])(
              (e => e.target?.value).apply(null, eventArgs)
            );
          }).apply(null, eventArgs);
          (async event => {
            const $steps = {};

            $steps["runOnSearch"] = true
              ? (() => {
                  const actionArgs = {
                    eventRef: $props["onSearch"],
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
              $steps["runOnSearch"] != null &&
              typeof $steps["runOnSearch"] === "object" &&
              typeof $steps["runOnSearch"].then === "function"
            ) {
              $steps["runOnSearch"] = await $steps["runOnSearch"];
            }
          }).apply(null, eventArgs);
        }}
        placeholder={
          "\u062c\u0633\u062a\u062c\u0648\u06cc \u0646\u0627\u0645 \u0628\u06cc\u0645\u0627\u0631\u06cc \u0648... \u062f\u0631 \u0646\u0638\u0631\u0627\u062a"
        }
        value={generateStateValueProp($state, ["textInput", "value"]) ?? ""}
      />
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "freeBox", "select", "select2", "textInput"],
  freeBox: ["freeBox", "select", "select2"],
  select: ["select"],
  select2: ["select2"],
  textInput: ["textInput"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  freeBox: "div";
  select: typeof Select;
  select2: typeof Select;
  textInput: typeof TextInput;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicFilter__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicFilter__VariantsArgs;
    args?: PlasmicFilter__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicFilter__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicFilter__ArgsType,
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
          internalArgPropNames: PlasmicFilter__ArgProps,
          internalVariantPropNames: PlasmicFilter__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicFilter__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicFilter";
  } else {
    func.displayName = `PlasmicFilter.${nodeName}`;
  }
  return func;
}

export const PlasmicFilter = Object.assign(
  // Top-level PlasmicFilter renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    freeBox: makeNodeComponent("freeBox"),
    select: makeNodeComponent("select"),
    select2: makeNodeComponent("select2"),
    textInput: makeNodeComponent("textInput"),

    // Metadata about props expected for PlasmicFilter
    internalVariantProps: PlasmicFilter__VariantProps,
    internalArgProps: PlasmicFilter__ArgProps
  }
);

export default PlasmicFilter;
/* prettier-ignore-end */
