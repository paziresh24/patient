/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: s-wlX7BnSeTl

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

import SortItem from "../../SortItem"; // plasmic-import: MqTyVWkHhgx_/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSort.module.css"; // plasmic-import: s-wlX7BnSeTl/css

import Icon14Icon from "./icons/PlasmicIcon__Icon14"; // plasmic-import: eKLBqU_Fr5SV/icon

createPlasmicElementProxy;

export type PlasmicSort__VariantMembers = {};
export type PlasmicSort__VariantsArgs = {};
type VariantPropType = keyof PlasmicSort__VariantsArgs;
export const PlasmicSort__VariantProps = new Array<VariantPropType>();

export type PlasmicSort__ArgsType = {
  orderItems?: any;
  selectedSort?: string;
  selectedTurn?: string;
  total?: string;
  onChangeFreeTurn?: (value: string) => void;
  onChangeSort?: (value: string) => void;
  isLoading?: boolean;
};
type ArgPropType = keyof PlasmicSort__ArgsType;
export const PlasmicSort__ArgProps = new Array<ArgPropType>(
  "orderItems",
  "selectedSort",
  "selectedTurn",
  "total",
  "onChangeFreeTurn",
  "onChangeSort",
  "isLoading"
);

export type PlasmicSort__OverridesType = {
  root?: Flex__<"div">;
  sort?: Flex__<typeof SortItem>;
  freeTurn?: Flex__<typeof SortItem>;
  text?: Flex__<"div">;
  svg?: Flex__<"svg">;
};

export interface DefaultSortProps {
  orderItems?: any;
  selectedSort?: string;
  selectedTurn?: string;
  total?: string;
  onChangeFreeTurn?: (value: string) => void;
  onChangeSort?: (value: string) => void;
  isLoading?: boolean;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSort__RenderFunc(props: {
  variants: PlasmicSort__VariantsArgs;
  args: PlasmicSort__ArgsType;
  overrides: PlasmicSort__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          isLoading: false
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
        path: "freeTurnItems",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => ({
          all: "\u0647\u0631 \u0632\u0645\u0627\u0646",
          today: "\u0627\u0645\u0631\u0648\u0632",
          tomorrow: "\u062a\u0627 \u0641\u0631\u062f\u0627",
          nextThreeDays:
            "\u062a\u0627 \u0633\u0647 \u0631\u0648\u0632 \u0622\u06cc\u0646\u062f\u0647",
          nextFiveDays:
            "\u062a\u0627 \u067e\u0646\u062c \u0631\u0648\u0632 \u0622\u06cc\u0646\u062f\u0647",
          nextSevenDays:
            "\u062a\u0627 \u0647\u0641\u062a \u0631\u0648\u0632 \u0622\u06cc\u0646\u062f\u0647"
        })
      },
      {
        path: "sort.selectValue",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "freeTurn.selectValue",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) =>
          $props["initialSelectedValue"]
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
        sty.root
      )}
    >
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__s6Ax2)}
      >
        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__owPgt)}
        >
          <SortItem
            data-plasmic-name={"sort"}
            data-plasmic-override={overrides.sort}
            className={classNames("__wab_instance", sty.sort)}
            initialSelectedValue={undefined}
            items={(() => {
              try {
                return (() => {
                  const list = $props.orderItems;
                  const items = Object.keys(list).map(key => ({
                    label: list[key],
                    value: key
                  }));
                  return items;
                })();
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
            label={"\u0645\u0631\u062a\u0628 \u0633\u0627\u0632\u06cc:"}
            onChange={args.onChangeSort}
            onSelectValueChange={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, ["sort", "selectValue"]).apply(
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
            placeholder={(() => {
              try {
                return !!$props.selectedSort
                  ? $props.orderItems[$props.selectedSort]
                  : Object.values($props.orderItems)[0] || "";
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
            selectValue={generateStateValueProp($state, [
              "sort",
              "selectValue"
            ])}
          />

          <SortItem
            data-plasmic-name={"freeTurn"}
            data-plasmic-override={overrides.freeTurn}
            initialSelectedValue={undefined}
            items={(() => {
              try {
                return (() => {
                  const list = $state.freeTurnItems;
                  const items = Object.keys(list).map(key => ({
                    label: list[key],
                    value: key
                  }));
                  return items;
                })();
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
            label={
              "\u0646\u0632\u062f\u06cc\u06a9 \u062a\u0631\u06cc\u0646 \u0646\u0648\u0628\u062a:"
            }
            onChange={args.onChangeFreeTurn}
            onSelectValueChange={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, [
                "freeTurn",
                "selectValue"
              ]).apply(null, eventArgs);

              if (
                eventArgs.length > 1 &&
                eventArgs[1] &&
                eventArgs[1]._plasmic_state_init_
              ) {
                return;
              }
            }}
            placeholder={(() => {
              try {
                return !!$props.selectedTurn
                  ? $state.freeTurnItems[$props.selectedTurn]
                  : Object.values($state.freeTurnItems)[0] || "";
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
            selectValue={generateStateValueProp($state, [
              "freeTurn",
              "selectValue"
            ])}
          />
        </Stack__>
        <div className={classNames(projectcss.all, sty.freeBox___9E8T)}>
          {(() => {
            try {
              return !!$props.total && !$props.isLoading;
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
                    return ` ${$props.total} نتیجه`;
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "PlasmicUndefinedDataError"
                    ) {
                      return "\u0646\u062a\u06cc\u062c\u0647";
                    }
                    throw e;
                  }
                })()}
              </React.Fragment>
            </div>
          ) : null}
          {(() => {
            try {
              return $props.isLoading;
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
            <Icon14Icon
              data-plasmic-name={"svg"}
              data-plasmic-override={overrides.svg}
              className={classNames(projectcss.all, sty.svg)}
              role={"img"}
            />
          ) : null}
        </div>
      </Stack__>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "sort", "freeTurn", "text", "svg"],
  sort: ["sort"],
  freeTurn: ["freeTurn"],
  text: ["text"],
  svg: ["svg"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  sort: typeof SortItem;
  freeTurn: typeof SortItem;
  text: "div";
  svg: "svg";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSort__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSort__VariantsArgs;
    args?: PlasmicSort__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSort__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicSort__ArgsType,
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
          internalArgPropNames: PlasmicSort__ArgProps,
          internalVariantPropNames: PlasmicSort__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSort__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicSort";
  } else {
    func.displayName = `PlasmicSort.${nodeName}`;
  }
  return func;
}

export const PlasmicSort = Object.assign(
  // Top-level PlasmicSort renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    sort: makeNodeComponent("sort"),
    freeTurn: makeNodeComponent("freeTurn"),
    text: makeNodeComponent("text"),
    svg: makeNodeComponent("svg"),

    // Metadata about props expected for PlasmicSort
    internalVariantProps: PlasmicSort__VariantProps,
    internalArgProps: PlasmicSort__ArgProps
  }
);

export default PlasmicSort;
/* prettier-ignore-end */
