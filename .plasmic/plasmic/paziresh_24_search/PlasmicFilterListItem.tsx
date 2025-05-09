/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: SBcorS0J8ajp

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

import { Switch } from "@/common/fragment/components/switch"; // plasmic-import: 3ov1diNJvJkk/codeComponent
import { RadioFilter } from "@/common/fragment/components/radioFilter"; // plasmic-import: 4HH4ImSoMWKe/codeComponent

import { useScreenVariants as useScreenVariantsbr2UhI7UlpvR } from "../fragment_icons/PlasmicGlobalVariant__Screen"; // plasmic-import: BR2UhI7ulpvR/globalVariant

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicFilterListItem.module.css"; // plasmic-import: SBcorS0J8ajp/css

createPlasmicElementProxy;

export type PlasmicFilterListItem__VariantMembers = {
  isLastChild: "isLastChild";
};
export type PlasmicFilterListItem__VariantsArgs = {
  isLastChild?: SingleBooleanChoiceArg<"isLastChild">;
};
type VariantPropType = keyof PlasmicFilterListItem__VariantsArgs;
export const PlasmicFilterListItem__VariantProps = new Array<VariantPropType>(
  "isLastChild"
);

export type PlasmicFilterListItem__ArgsType = {
  item?: any;
  onClick?: (value: string, name: string) => void;
  selected?: string;
};
type ArgPropType = keyof PlasmicFilterListItem__ArgsType;
export const PlasmicFilterListItem__ArgProps = new Array<ArgPropType>(
  "item",
  "onClick",
  "selected"
);

export type PlasmicFilterListItem__OverridesType = {
  root?: Flex__<"div">;
  text?: Flex__<"div">;
  switchButton?: Flex__<typeof Switch>;
  radioFilter?: Flex__<typeof RadioFilter>;
};

export interface DefaultFilterListItemProps {
  item?: any;
  onClick?: (value: string, name: string) => void;
  selected?: string;
  isLastChild?: SingleBooleanChoiceArg<"isLastChild">;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicFilterListItem__RenderFunc(props: {
  variants: PlasmicFilterListItem__VariantsArgs;
  args: PlasmicFilterListItem__ArgsType;
  overrides: PlasmicFilterListItem__OverridesType;
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
        path: "radioFilter.selected",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) =>
          (() => {
            try {
              return $props.selected;
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
        path: "switchButton.checked",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) =>
          (() => {
            try {
              return $props.selected == "true" ? true : false;
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
        path: "isLastChild",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.isLastChild
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
        sty.root,
        {
          [sty.rootisLastChild]: hasVariant(
            $state,
            "isLastChild",
            "isLastChild"
          )
        }
      )}
    >
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__iBo76)}
      >
        <div
          data-plasmic-name={"text"}
          data-plasmic-override={overrides.text}
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text
          )}
        >
          <React.Fragment>
            {(() => {
              try {
                return $props.item.title;
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
        {(() => {
          try {
            return $props.item.type === "switch";
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
          <Switch
            data-plasmic-name={"switchButton"}
            data-plasmic-override={overrides.switchButton}
            checked={generateStateValueProp($state, [
              "switchButton",
              "checked"
            ])}
            className={classNames("__wab_instance", sty.switchButton)}
            onCheckedChange={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, [
                "switchButton",
                "checked"
              ]).apply(null, eventArgs);

              (async checked => {
                const $steps = {};

                $steps["runOnClick"] = true
                  ? (() => {
                      const actionArgs = {
                        eventRef: $props["onClick"],
                        args: [
                          (() => {
                            try {
                              return $state.switchButton.checked;
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
                              return $props.item.name;
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
              }).apply(null, eventArgs);
            }}
          />
        ) : null}
      </Stack__>
      {(() => {
        try {
          return $props.item.type === "radio";
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
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__gfvgx)}
        >
          <RadioFilter
            data-plasmic-name={"radioFilter"}
            data-plasmic-override={overrides.radioFilter}
            className={classNames("__wab_instance", sty.radioFilter)}
            items={(() => {
              try {
                return $props.item.items.map(item => ({
                  label: item.title,
                  value: item.value,
                  count: item.count
                }));
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return (() => {
                    const __composite = [
                      { label: null, value: null, count: null },
                      { label: null, value: null, count: null },
                      {},
                      {}
                    ];
                    __composite["0"]["label"] =
                      "\u06af\u0632\u06cc\u0646\u0647 \u0627\u0648\u0644";
                    __composite["0"]["value"] = "first";
                    __composite["0"]["count"] = 50;
                    __composite["1"]["label"] =
                      "\u06af\u0632\u06cc\u0646\u0647 \u062f\u0648\u0645";
                    __composite["1"]["value"] = "second";
                    __composite["1"]["count"] = 22;
                    return __composite;
                  })();
                }
                throw e;
              }
            })()}
            onChange={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, [
                "radioFilter",
                "selected"
              ]).apply(null, eventArgs);

              (async selected => {
                const $steps = {};

                $steps["runOnClick"] = true
                  ? (() => {
                      const actionArgs = {
                        eventRef: $props["onClick"],
                        args: [
                          (() => {
                            try {
                              return $state.radioFilter.selected;
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
                              return $props.item.name;
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
              }).apply(null, eventArgs);
            }}
            value={generateStateValueProp($state, ["radioFilter", "selected"])}
          />
        </Stack__>
      ) : null}
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "text", "switchButton", "radioFilter"],
  text: ["text"],
  switchButton: ["switchButton"],
  radioFilter: ["radioFilter"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  text: "div";
  switchButton: typeof Switch;
  radioFilter: typeof RadioFilter;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicFilterListItem__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicFilterListItem__VariantsArgs;
    args?: PlasmicFilterListItem__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicFilterListItem__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicFilterListItem__ArgsType,
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
          internalArgPropNames: PlasmicFilterListItem__ArgProps,
          internalVariantPropNames: PlasmicFilterListItem__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicFilterListItem__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicFilterListItem";
  } else {
    func.displayName = `PlasmicFilterListItem.${nodeName}`;
  }
  return func;
}

export const PlasmicFilterListItem = Object.assign(
  // Top-level PlasmicFilterListItem renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    text: makeNodeComponent("text"),
    switchButton: makeNodeComponent("switchButton"),
    radioFilter: makeNodeComponent("radioFilter"),

    // Metadata about props expected for PlasmicFilterListItem
    internalVariantProps: PlasmicFilterListItem__VariantProps,
    internalArgProps: PlasmicFilterListItem__ArgProps
  }
);

export default PlasmicFilterListItem;
/* prettier-ignore-end */
