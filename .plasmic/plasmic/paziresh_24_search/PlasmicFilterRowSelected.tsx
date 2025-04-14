/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: HnQNuSjSSQcZ

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

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicFilterRowSelected.module.css"; // plasmic-import: HnQNuSjSSQcZ/css

import Icon13Icon from "./icons/PlasmicIcon__Icon13"; // plasmic-import: E9NGWfCxi3aB/icon

createPlasmicElementProxy;

export type PlasmicFilterRowSelected__VariantMembers = {};
export type PlasmicFilterRowSelected__VariantsArgs = {};
type VariantPropType = keyof PlasmicFilterRowSelected__VariantsArgs;
export const PlasmicFilterRowSelected__VariantProps =
  new Array<VariantPropType>();

export type PlasmicFilterRowSelected__ArgsType = {
  onDelete?: () => void;
  filters?: any;
  onClickRemoveItem?: (name: string, value: string) => void;
  categories?: any;
  selected?: any;
};
type ArgPropType = keyof PlasmicFilterRowSelected__ArgsType;
export const PlasmicFilterRowSelected__ArgProps = new Array<ArgPropType>(
  "onDelete",
  "filters",
  "onClickRemoveItem",
  "categories",
  "selected"
);

export type PlasmicFilterRowSelected__OverridesType = {
  root?: Flex__<"div">;
  text?: Flex__<"div">;
  svg?: Flex__<"svg">;
};

export interface DefaultFilterRowSelectedProps {
  onDelete?: () => void;
  filters?: any;
  onClickRemoveItem?: (name: string, value: string) => void;
  categories?: any;
  selected?: any;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicFilterRowSelected__RenderFunc(props: {
  variants: PlasmicFilterRowSelected__VariantsArgs;
  args: PlasmicFilterRowSelected__ArgsType;
  overrides: PlasmicFilterRowSelected__OverridesType;
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
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__yyeat, "no-scroll")}
      >
        {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
          (() => {
            try {
              return (() => {
                const filters = $props.filters;
                const categories = $props.categories;
                const selected = $props.selected;
                const freeturnItems = {
                  all: "هر زمان",
                  today: "امروز",
                  tomorrow: "تا فردا",
                  nextThreeDays: "تا سه روز آینده",
                  nextFiveDays: "تا پنج روز آینده",
                  nextSevenDays: "تا هفت روز آینده"
                };
                const text = selected?.text
                  ? {
                      title: selected.text,
                      value: selected.text,
                      name: "text"
                    }
                  : null;
                const selectedFilters = filters
                  .map(filter =>
                    selected?.[filter.name]
                      ? {
                          title:
                            filter.type == "switch"
                              ? filter.title
                              : filter.items.find(
                                  item => item.value === selected?.[filter.name]
                                ).title,
                          name: filter.name,
                          value: selected[filter.name]
                        }
                      : null
                  )
                  .filter(Boolean);
                const freeTurn = selected?.freeturn
                  ? {
                      title: freeturnItems[selected.freeturn],
                      value: selected.freeturn,
                      name: "freeTurn"
                    }
                  : null;
                const selectedCategory = selected?.category
                  ? {
                      title: categories.find(
                        cat => cat.value === selected.category
                      )?.title,
                      name: "category",
                      value: selected.category
                    }
                  : null;
                const selectedSubcategory = selected?.sub_category
                  ? {
                      title: categories
                        .find(cat => cat.value === selected.category)
                        ?.sub_categories.find(
                          sub => sub.value === selected.sub_category
                        ).title,
                      value: selected.sub_category,
                      name: "sub_category"
                    }
                  : null;
                const allSelectedFilters = [
                  selectedCategory,
                  selectedSubcategory,
                  freeTurn,
                  text,
                  ...selectedFilters
                ].filter(Boolean);
                return allSelectedFilters;
              })();
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
              className={classNames(projectcss.all, sty.freeBox__wvnew)}
              key={currentIndex}
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
                      return currentItem.title;
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
              <Icon13Icon
                data-plasmic-name={"svg"}
                data-plasmic-override={overrides.svg}
                className={classNames(projectcss.all, sty.svg)}
                onClick={async event => {
                  const $steps = {};

                  $steps["runOnClickRemoveItem"] = true
                    ? (() => {
                        const actionArgs = {
                          eventRef: $props["onClickRemoveItem"],
                          args: [
                            (() => {
                              try {
                                return currentItem.name;
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
                            })()
                          ]
                        };
                        return (({ eventRef, args }) => {
                          return eventRef?.(...(args ?? []));
                        })?.apply(null, [actionArgs]);
                      })()
                    : undefined;
                  if (
                    $steps["runOnClickRemoveItem"] != null &&
                    typeof $steps["runOnClickRemoveItem"] === "object" &&
                    typeof $steps["runOnClickRemoveItem"].then === "function"
                  ) {
                    $steps["runOnClickRemoveItem"] = await $steps[
                      "runOnClickRemoveItem"
                    ];
                  }
                }}
                role={"img"}
              />
            </Stack__>
          );
        })}
      </Stack__>
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "text", "svg"],
  text: ["text"],
  svg: ["svg"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  text: "div";
  svg: "svg";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicFilterRowSelected__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicFilterRowSelected__VariantsArgs;
    args?: PlasmicFilterRowSelected__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicFilterRowSelected__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicFilterRowSelected__ArgsType,
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
          internalArgPropNames: PlasmicFilterRowSelected__ArgProps,
          internalVariantPropNames: PlasmicFilterRowSelected__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicFilterRowSelected__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicFilterRowSelected";
  } else {
    func.displayName = `PlasmicFilterRowSelected.${nodeName}`;
  }
  return func;
}

export const PlasmicFilterRowSelected = Object.assign(
  // Top-level PlasmicFilterRowSelected renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    text: makeNodeComponent("text"),
    svg: makeNodeComponent("svg"),

    // Metadata about props expected for PlasmicFilterRowSelected
    internalVariantProps: PlasmicFilterRowSelected__VariantProps,
    internalArgProps: PlasmicFilterRowSelected__ArgProps
  }
);

export default PlasmicFilterRowSelected;
/* prettier-ignore-end */
