/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: MqTyVWkHhgx_

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

import Select from "../../Select"; // plasmic-import: aYV_BynI796K/component
import MenuItem from "../../MenuItem"; // plasmic-import: NftCFkaQJ0Bb/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSortItem.module.css"; // plasmic-import: MqTyVWkHhgx_/css

createPlasmicElementProxy;

export type PlasmicSortItem__VariantMembers = {};
export type PlasmicSortItem__VariantsArgs = {};
type VariantPropType = keyof PlasmicSortItem__VariantsArgs;
export const PlasmicSortItem__VariantProps = new Array<VariantPropType>();

export type PlasmicSortItem__ArgsType = {
  selectValue?: string;
  onSelectValueChange?: (val: string) => void;
  label?: string;
  placeholder?: string;
  items?: any;
  initialSelectedValue?: "Dynamic options";
  onChange?: (value: string) => void;
};
type ArgPropType = keyof PlasmicSortItem__ArgsType;
export const PlasmicSortItem__ArgProps = new Array<ArgPropType>(
  "selectValue",
  "onSelectValueChange",
  "label",
  "placeholder",
  "items",
  "initialSelectedValue",
  "onChange"
);

export type PlasmicSortItem__OverridesType = {
  root?: Flex__<"div">;
  freeBox?: Flex__<"div">;
  select?: Flex__<typeof Select>;
  menuItem?: Flex__<typeof MenuItem>;
};

export interface DefaultSortItemProps {
  selectValue?: string;
  onSelectValueChange?: (val: string) => void;
  label?: string;
  placeholder?: string;
  items?: any;
  initialSelectedValue?: "Dynamic options";
  onChange?: (value: string) => void;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSortItem__RenderFunc(props: {
  variants: PlasmicSortItem__VariantsArgs;
  args: PlasmicSortItem__ArgsType;
  overrides: PlasmicSortItem__OverridesType;
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
        path: "select.value",
        type: "writable",
        variableType: "text",

        valueProp: "selectValue",
        onChangeProp: "onSelectValueChange"
      },
      {
        path: "select.plasmicReactAriaSelectIsOpen",
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
        plasmic_antd_5_hostless_css.plasmic_tokens,
        sty.root
      )}
    >
      <Stack__
        as={"div"}
        data-plasmic-name={"freeBox"}
        data-plasmic-override={overrides.freeBox}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox)}
        style={(() => {
          try {
            return {
              border: $state.select.plasmicReactAriaSelectIsOpen
                ? "1px solid #3861FB"
                : "1px solid transparent"
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
        })()}
      >
        <div
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text__gnK1J,
            (() => {
              try {
                return "hidden lg:flex";
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
          <React.Fragment>
            {(() => {
              try {
                return $props.label;
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return "";
                }
                throw e;
              }
            })()}
          </React.Fragment>
        </div>
        <Select
          data-plasmic-name={"select"}
          data-plasmic-override={overrides.select}
          className={classNames("__wab_instance", sty.select)}
          initialSelectedValue={args.initialSelectedValue}
          items={(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
            (() => {
              try {
                return $props.items;
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
              <MenuItem
                data-plasmic-name={"menuItem"}
                data-plasmic-override={overrides.menuItem}
                className={classNames("__wab_instance", sty.menuItem)}
                key={currentIndex}
                label={(() => {
                  try {
                    return currentItem.label;
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
                    return currentItem.value;
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
          label={
            <div
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text__uq9B
              )}
            >
              {"Label"}
            </div>
          }
          onChange={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, ["select", "value"]).apply(
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

            (async val => {
              const $steps = {};

              $steps["runOnChange"] = false
                ? (() => {
                    const actionArgs = {
                      eventRef: $props["onChange"],
                      args: [
                        (() => {
                          try {
                            return val;
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
                $steps["runOnChange"] != null &&
                typeof $steps["runOnChange"] === "object" &&
                typeof $steps["runOnChange"].then === "function"
              ) {
                $steps["runOnChange"] = await $steps["runOnChange"];
              }
            }).apply(null, eventArgs);
          }}
          onPlasmicReactAriaSelectIsOpenChange={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, [
              "select",
              "plasmicReactAriaSelectIsOpen"
            ]).apply(null, eventArgs);

            if (
              eventArgs.length > 1 &&
              eventArgs[1] &&
              eventArgs[1]._plasmic_state_init_
            ) {
              return;
            }
          }}
          onSelectionChange={async selectedValue => {
            const $steps = {};

            $steps["runOnChange"] = true
              ? (() => {
                  const actionArgs = {
                    eventRef: $props["onChange"],
                    args: [
                      (() => {
                        try {
                          return selectedValue;
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
              $steps["runOnChange"] != null &&
              typeof $steps["runOnChange"] === "object" &&
              typeof $steps["runOnChange"].then === "function"
            ) {
              $steps["runOnChange"] = await $steps["runOnChange"];
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
          plasmicReactAriaSelectIsOpen={generateStateValueProp($state, [
            "select",
            "plasmicReactAriaSelectIsOpen"
          ])}
          showDescription={false}
          showLabel={false}
          type={"plain"}
        />
      </Stack__>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "freeBox", "select", "menuItem"],
  freeBox: ["freeBox", "select", "menuItem"],
  select: ["select", "menuItem"],
  menuItem: ["menuItem"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  freeBox: "div";
  select: typeof Select;
  menuItem: typeof MenuItem;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSortItem__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSortItem__VariantsArgs;
    args?: PlasmicSortItem__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSortItem__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicSortItem__ArgsType,
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
          internalArgPropNames: PlasmicSortItem__ArgProps,
          internalVariantPropNames: PlasmicSortItem__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSortItem__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicSortItem";
  } else {
    func.displayName = `PlasmicSortItem.${nodeName}`;
  }
  return func;
}

export const PlasmicSortItem = Object.assign(
  // Top-level PlasmicSortItem renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    freeBox: makeNodeComponent("freeBox"),
    select: makeNodeComponent("select"),
    menuItem: makeNodeComponent("menuItem"),

    // Metadata about props expected for PlasmicSortItem
    internalVariantProps: PlasmicSortItem__VariantProps,
    internalArgProps: PlasmicSortItem__ArgProps
  }
);

export default PlasmicSortItem;
/* prettier-ignore-end */
