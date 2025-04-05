/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: Lt7HZLy_mQCZ

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
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicFilterExpertiseItem.module.css"; // plasmic-import: Lt7HZLy_mQCZ/css

import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicFilterExpertiseItem__VariantMembers = {
  isSelected: "isSelected";
  hasIcon: "hasIcon";
  hasBorder: "hasBorder";
};
export type PlasmicFilterExpertiseItem__VariantsArgs = {
  isSelected?: SingleBooleanChoiceArg<"isSelected">;
  hasIcon?: SingleBooleanChoiceArg<"hasIcon">;
  hasBorder?: SingleBooleanChoiceArg<"hasBorder">;
};
type VariantPropType = keyof PlasmicFilterExpertiseItem__VariantsArgs;
export const PlasmicFilterExpertiseItem__VariantProps =
  new Array<VariantPropType>("isSelected", "hasIcon", "hasBorder");

export type PlasmicFilterExpertiseItem__ArgsType = {
  title?: string;
  value?: string;
  link?: string;
  onClick?: (value: string, link: string) => void;
};
type ArgPropType = keyof PlasmicFilterExpertiseItem__ArgsType;
export const PlasmicFilterExpertiseItem__ArgProps = new Array<ArgPropType>(
  "title",
  "value",
  "link",
  "onClick"
);

export type PlasmicFilterExpertiseItem__OverridesType = {
  root?: Flex__<"div">;
  freeBox?: Flex__<"div">;
  text?: Flex__<"div">;
  svg?: Flex__<"svg">;
};

export interface DefaultFilterExpertiseItemProps {
  title?: string;
  value?: string;
  link?: string;
  onClick?: (value: string, link: string) => void;
  isSelected?: SingleBooleanChoiceArg<"isSelected">;
  hasIcon?: SingleBooleanChoiceArg<"hasIcon">;
  hasBorder?: SingleBooleanChoiceArg<"hasBorder">;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicFilterExpertiseItem__RenderFunc(props: {
  variants: PlasmicFilterExpertiseItem__VariantsArgs;
  args: PlasmicFilterExpertiseItem__ArgsType;
  overrides: PlasmicFilterExpertiseItem__OverridesType;
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
        path: "isSelected",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.isSelected
      },
      {
        path: "hasIcon",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.hasIcon
      },
      {
        path: "hasBorder",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.hasBorder
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
        sty.root,
        {
          [sty.roothasBorder]: hasVariant($state, "hasBorder", "hasBorder"),
          [sty.roothasIcon]: hasVariant($state, "hasIcon", "hasIcon"),
          [sty.rootisSelected]: hasVariant($state, "isSelected", "isSelected")
        }
      )}
    >
      <div
        data-plasmic-name={"freeBox"}
        data-plasmic-override={overrides.freeBox}
        className={classNames(projectcss.all, sty.freeBox, {
          [sty.freeBoxhasIcon]: hasVariant($state, "hasIcon", "hasIcon"),
          [sty.freeBoxisSelected]: hasVariant(
            $state,
            "isSelected",
            "isSelected"
          )
        })}
        onClick={async event => {
          const $steps = {};

          $steps["runOnClick"] = true
            ? (() => {
                const actionArgs = {
                  eventRef: $props["onClick"],
                  args: [
                    (() => {
                      try {
                        return $props.value;
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
                        return $props.link;
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
        }}
      >
        <div
          data-plasmic-name={"text"}
          data-plasmic-override={overrides.text}
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text,
            {
              [sty.textisSelected]: hasVariant(
                $state,
                "isSelected",
                "isSelected"
              )
            }
          )}
        >
          <React.Fragment>
            {(() => {
              try {
                return $props.title;
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
        <ChevronLeftIcon
          data-plasmic-name={"svg"}
          data-plasmic-override={overrides.svg}
          className={classNames(projectcss.all, sty.svg, {
            [sty.svghasIcon]: hasVariant($state, "hasIcon", "hasIcon")
          })}
          role={"img"}
        />
      </div>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "freeBox", "text", "svg"],
  freeBox: ["freeBox", "text", "svg"],
  text: ["text"],
  svg: ["svg"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  freeBox: "div";
  text: "div";
  svg: "svg";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicFilterExpertiseItem__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicFilterExpertiseItem__VariantsArgs;
    args?: PlasmicFilterExpertiseItem__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicFilterExpertiseItem__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicFilterExpertiseItem__ArgsType,
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
          internalArgPropNames: PlasmicFilterExpertiseItem__ArgProps,
          internalVariantPropNames: PlasmicFilterExpertiseItem__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicFilterExpertiseItem__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicFilterExpertiseItem";
  } else {
    func.displayName = `PlasmicFilterExpertiseItem.${nodeName}`;
  }
  return func;
}

export const PlasmicFilterExpertiseItem = Object.assign(
  // Top-level PlasmicFilterExpertiseItem renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    freeBox: makeNodeComponent("freeBox"),
    text: makeNodeComponent("text"),
    svg: makeNodeComponent("svg"),

    // Metadata about props expected for PlasmicFilterExpertiseItem
    internalVariantProps: PlasmicFilterExpertiseItem__VariantProps,
    internalArgProps: PlasmicFilterExpertiseItem__ArgProps
  }
);

export default PlasmicFilterExpertiseItem;
/* prettier-ignore-end */
