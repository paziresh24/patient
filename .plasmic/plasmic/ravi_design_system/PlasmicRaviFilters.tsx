// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: pkMLinFwM9pzwv5S5KpiAu
// Component: G0AKBMWLNTrM

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

import Select from "../../Select"; // plasmic-import: _-4ghU5Xu-FB/component
import TextInput from "../../TextInput"; // plasmic-import: OSr_35iNKRP7/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import sty from "./PlasmicRaviFilters.module.css"; // plasmic-import: G0AKBMWLNTrM/css

import SearchSvgIcon from "./icons/PlasmicIcon__SearchSvg"; // plasmic-import: RWKjnOz8vXgd/icon
import CheckSvgIcon from "./icons/PlasmicIcon__CheckSvg"; // plasmic-import: H_mGbG9dNFMm/icon

createPlasmicElementProxy;

export type PlasmicRaviFilters__VariantMembers = {};
export type PlasmicRaviFilters__VariantsArgs = {};
type VariantPropType = keyof PlasmicRaviFilters__VariantsArgs;
export const PlasmicRaviFilters__VariantProps = new Array<VariantPropType>();

export type PlasmicRaviFilters__ArgsType = {
  filterList?: any;
  textInputValue?: string;
  onTextInputValueChange?: (val: string) => void;
  onSelectFilter?: (value: string) => void;
  sortList?: any;
  onSelectSort?: (value: string) => void;
  onChangeSearch?: (value: string) => void;
};
type ArgPropType = keyof PlasmicRaviFilters__ArgsType;
export const PlasmicRaviFilters__ArgProps = new Array<ArgPropType>(
  "filterList",
  "textInputValue",
  "onTextInputValueChange",
  "onSelectFilter",
  "sortList",
  "onSelectSort",
  "onChangeSearch"
);

export type PlasmicRaviFilters__OverridesType = {
  root?: Flex__<"div">;
  freeBox?: Flex__<"div">;
  filters?: Flex__<typeof Select>;
  select?: Flex__<typeof Select>;
  textInput?: Flex__<typeof TextInput>;
};

export interface DefaultRaviFiltersProps {
  filterList?: any;
  textInputValue?: string;
  onTextInputValueChange?: (val: string) => void;
  onSelectFilter?: (value: string) => void;
  sortList?: any;
  onSelectSort?: (value: string) => void;
  onChangeSearch?: (value: string) => void;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicRaviFilters__RenderFunc(props: {
  variants: PlasmicRaviFilters__VariantsArgs;
  args: PlasmicRaviFilters__ArgsType;
  overrides: PlasmicRaviFilters__OverridesType;
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
        path: "filters.value",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) =>
          (() => {
            try {
              return $props.filterList?.[0]?.value;
            } catch (e) {
              if (
                e instanceof TypeError ||
                e?.plasmicType === "PlasmicUndefinedDataError"
              ) {
                return "all";
              }
              throw e;
            }
          })()
      },
      {
        path: "select.value",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) =>
          (() => {
            try {
              return $props.sortList?.[0]?.value;
            } catch (e) {
              if (
                e instanceof TypeError ||
                e?.plasmicType === "PlasmicUndefinedDataError"
              ) {
                return "-default_order";
              }
              throw e;
            }
          })()
      },
      {
        path: "textInput.value",
        type: "writable",
        variableType: "text",

        valueProp: "textInputValue",
        onChangeProp: "onTextInputValueChange"
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
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        plasmic_antd_5_hostless_css.plasmic_tokens,
        sty.root
      )}
      dir={"rtl"}
    >
      <Stack__
        as={"div"}
        data-plasmic-name={"freeBox"}
        data-plasmic-override={overrides.freeBox}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox)}
        dir={"rtl"}
      >
        <Select
          data-plasmic-name={"filters"}
          data-plasmic-override={overrides.filters}
          className={classNames("__wab_instance", sty.filters)}
          onChange={async (...eventArgs: any) => {
            ((...eventArgs) => {
              generateStateOnChangeProp($state, ["filters", "value"])(
                eventArgs[0]
              );
            }).apply(null, eventArgs);

            if (
              eventArgs.length > 1 &&
              eventArgs[1] &&
              eventArgs[1]._plasmic_state_init_
            ) {
              return;
            }

            (async value => {
              const $steps = {};

              $steps["runOnSelectFilter"] = true
                ? (() => {
                    const actionArgs = {
                      eventRef: $props["onSelectFilter"],
                      args: [
                        (() => {
                          try {
                            return value;
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
                $steps["runOnSelectFilter"] != null &&
                typeof $steps["runOnSelectFilter"] === "object" &&
                typeof $steps["runOnSelectFilter"].then === "function"
              ) {
                $steps["runOnSelectFilter"] = await $steps["runOnSelectFilter"];
              }
            }).apply(null, eventArgs);
          }}
          options={(() => {
            try {
              return $props.filterList;
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
          placeholder={
            "\u0627\u0646\u062a\u062e\u0627\u0628 \u06a9\u0646\u06cc\u062f..."
          }
          value={generateStateValueProp($state, ["filters", "value"])}
        />

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

            if (
              eventArgs.length > 1 &&
              eventArgs[1] &&
              eventArgs[1]._plasmic_state_init_
            ) {
              return;
            }

            (async value => {
              const $steps = {};

              $steps["runOnSelectSort"] = true
                ? (() => {
                    const actionArgs = {
                      eventRef: $props["onSelectSort"],
                      args: [
                        (() => {
                          try {
                            return value;
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
                $steps["runOnSelectSort"] != null &&
                typeof $steps["runOnSelectSort"] === "object" &&
                typeof $steps["runOnSelectSort"].then === "function"
              ) {
                $steps["runOnSelectSort"] = await $steps["runOnSelectSort"];
              }
            }).apply(null, eventArgs);
          }}
          options={(() => {
            try {
              return $props.sortList;
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
          placeholder={
            "\u0627\u0646\u062a\u062e\u0627\u0628 \u06a9\u0646\u06cc\u062f..."
          }
          value={generateStateValueProp($state, ["select", "value"])}
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

          if (
            eventArgs.length > 1 &&
            eventArgs[1] &&
            eventArgs[1]._plasmic_state_init_
          ) {
            return;
          }

          (async event => {
            const $steps = {};

            $steps["runOnChangeSearch"] = true
              ? (() => {
                  const actionArgs = {
                    eventRef: $props["onChangeSearch"],
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
              $steps["runOnChangeSearch"] != null &&
              typeof $steps["runOnChangeSearch"] === "object" &&
              typeof $steps["runOnChangeSearch"].then === "function"
            ) {
              $steps["runOnChangeSearch"] = await $steps["runOnChangeSearch"];
            }
          }).apply(null, eventArgs);
        }}
        placeholder={
          "\u062c\u0633\u062a\u062c\u0648 \u062f\u0631 \u0646\u0638\u0631\u0627\u062a \u0628\u06cc\u0645\u0627\u0631\u0627\u0646"
        }
        value={generateStateValueProp($state, ["textInput", "value"]) ?? ""}
      />
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "freeBox", "filters", "select", "textInput"],
  freeBox: ["freeBox", "filters", "select"],
  filters: ["filters"],
  select: ["select"],
  textInput: ["textInput"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  freeBox: "div";
  filters: typeof Select;
  select: typeof Select;
  textInput: typeof TextInput;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicRaviFilters__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicRaviFilters__VariantsArgs;
    args?: PlasmicRaviFilters__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicRaviFilters__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicRaviFilters__ArgsType,
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
          internalArgPropNames: PlasmicRaviFilters__ArgProps,
          internalVariantPropNames: PlasmicRaviFilters__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicRaviFilters__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicRaviFilters";
  } else {
    func.displayName = `PlasmicRaviFilters.${nodeName}`;
  }
  return func;
}

export const PlasmicRaviFilters = Object.assign(
  // Top-level PlasmicRaviFilters renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    freeBox: makeNodeComponent("freeBox"),
    filters: makeNodeComponent("filters"),
    select: makeNodeComponent("select"),
    textInput: makeNodeComponent("textInput"),

    // Metadata about props expected for PlasmicRaviFilters
    internalVariantProps: PlasmicRaviFilters__VariantProps,
    internalArgProps: PlasmicRaviFilters__ArgProps
  }
);

export default PlasmicRaviFilters;
/* prettier-ignore-end */
