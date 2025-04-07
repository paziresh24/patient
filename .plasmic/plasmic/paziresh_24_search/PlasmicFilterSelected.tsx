/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: X6vIyl-hUPim

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

import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicFilterSelected.module.css"; // plasmic-import: X6vIyl-hUPim/css

import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon
import Icon13Icon from "./icons/PlasmicIcon__Icon13"; // plasmic-import: E9NGWfCxi3aB/icon

createPlasmicElementProxy;

export type PlasmicFilterSelected__VariantMembers = {};
export type PlasmicFilterSelected__VariantsArgs = {};
type VariantPropType = keyof PlasmicFilterSelected__VariantsArgs;
export const PlasmicFilterSelected__VariantProps = new Array<VariantPropType>();

export type PlasmicFilterSelected__ArgsType = {
  onDelete?: () => void;
  filters?: any;
  onClickRemoveItem?: (name: string, value: string) => void;
  categories?: any;
  selected?: any;
};
type ArgPropType = keyof PlasmicFilterSelected__ArgsType;
export const PlasmicFilterSelected__ArgProps = new Array<ArgPropType>(
  "onDelete",
  "filters",
  "onClickRemoveItem",
  "categories",
  "selected"
);

export type PlasmicFilterSelected__OverridesType = {
  root?: Flex__<"div">;
  button?: Flex__<typeof Button>;
  svg?: Flex__<"svg">;
};

export interface DefaultFilterSelectedProps {
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

function PlasmicFilterSelected__RenderFunc(props: {
  variants: PlasmicFilterSelected__VariantsArgs;
  args: PlasmicFilterSelected__ArgsType;
  overrides: PlasmicFilterSelected__OverridesType;
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
        plasmic_antd_5_hostless_css.plasmic_tokens,
        sty.root
      )}
    >
      <div className={classNames(projectcss.all, sty.freeBox__l81Mj)}>
        <div
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text__dtT9W
          )}
        >
          {
            "\u0641\u06cc\u0644\u062a\u0631 \u0647\u0627\u06cc \u0627\u0646\u062a\u062e\u0627\u0628 \u0634\u062f\u0647"
          }
        </div>
        <Button
          data-plasmic-name={"button"}
          data-plasmic-override={overrides.button}
          children2={
            <div
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text__f19MM
              )}
            >
              {"\u062d\u0630\u0641"}
            </div>
          }
          className={classNames("__wab_instance", sty.button)}
          color={"text"}
          onClick={async event => {
            const $steps = {};

            $steps["runOnDelete"] = true
              ? (() => {
                  const actionArgs = { eventRef: $props["onDelete"] };
                  return (({ eventRef, args }) => {
                    return eventRef?.(...(args ?? []));
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["runOnDelete"] != null &&
              typeof $steps["runOnDelete"] === "object" &&
              typeof $steps["runOnDelete"].then === "function"
            ) {
              $steps["runOnDelete"] = await $steps["runOnDelete"];
            }
          }}
          shape={"rounded"}
          size={"minimal"}
        />
      </div>
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox___17Ie4)}
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
                const freeturn = selected?.freeturn
                  ? {
                      title: freeturnItems[selected.freeturn],
                      value: selected.freeturn,
                      name: "freeturn"
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
                  freeturn,
                  text,
                  ...selectedFilters
                ].filter(Boolean);
                const sortedArray = allSelectedFilters.sort((a, b) => {
                  const keys = Object.keys(selected);
                  const indexA = keys.indexOf(a.name);
                  const indexB = keys.indexOf(b.name);
                  if (indexA === -1) return 1;
                  if (indexB === -1) return -1;
                  return indexA - indexB;
                });
                return sortedArray;
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
              className={classNames(projectcss.all, sty.freeBox___7Lfff)}
              key={currentIndex}
            >
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__fMuel
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
  root: ["root", "button", "svg"],
  button: ["button"],
  svg: ["svg"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  button: typeof Button;
  svg: "svg";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicFilterSelected__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicFilterSelected__VariantsArgs;
    args?: PlasmicFilterSelected__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicFilterSelected__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicFilterSelected__ArgsType,
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
          internalArgPropNames: PlasmicFilterSelected__ArgProps,
          internalVariantPropNames: PlasmicFilterSelected__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicFilterSelected__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicFilterSelected";
  } else {
    func.displayName = `PlasmicFilterSelected.${nodeName}`;
  }
  return func;
}

export const PlasmicFilterSelected = Object.assign(
  // Top-level PlasmicFilterSelected renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    button: makeNodeComponent("button"),
    svg: makeNodeComponent("svg"),

    // Metadata about props expected for PlasmicFilterSelected
    internalVariantProps: PlasmicFilterSelected__VariantProps,
    internalArgProps: PlasmicFilterSelected__ArgProps
  }
);

export default PlasmicFilterSelected;
/* prettier-ignore-end */
