/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: sV_mee6VG9G8

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

import * as pp from "@plasmicapp/react-web";

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_ravi_design_system_css from "../ravi_design_system/plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from "./PlasmicCustomSelect__Option.module.css"; // plasmic-import: sV_mee6VG9G8/css

import SUPER__PlasmicCustomSelect from "./PlasmicCustomSelect"; // plasmic-import: zIWWWwAA3-2B/render

createPlasmicElementProxy;

export type PlasmicCustomSelect__Option__VariantMembers = {
  isSelected: "isSelected";
  isHighlighted: "isHighlighted";
  isDisabled: "isDisabled";
};
export type PlasmicCustomSelect__Option__VariantsArgs = {
  isSelected?: SingleBooleanChoiceArg<"isSelected">;
  isHighlighted?: SingleBooleanChoiceArg<"isHighlighted">;
  isDisabled?: SingleBooleanChoiceArg<"isDisabled">;
};
type VariantPropType = keyof PlasmicCustomSelect__Option__VariantsArgs;
export const PlasmicCustomSelect__Option__VariantProps =
  new Array<VariantPropType>("isSelected", "isHighlighted", "isDisabled");

export type PlasmicCustomSelect__Option__ArgsType = {
  children?: React.ReactNode;
  value?: string;
  textValue?: string;
};
type ArgPropType = keyof PlasmicCustomSelect__Option__ArgsType;
export const PlasmicCustomSelect__Option__ArgProps = new Array<ArgPropType>(
  "children",
  "value",
  "textValue"
);

export type PlasmicCustomSelect__Option__OverridesType = {
  root?: Flex__<"div">;
  labelContainer?: Flex__<"div">;
};

export interface DefaultCustomSelect__OptionProps
  extends pp.BaseSelectOptionProps {}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicCustomSelect__Option__RenderFunc(props: {
  variants: PlasmicCustomSelect__Option__VariantsArgs;
  args: PlasmicCustomSelect__Option__ArgsType;
  overrides: PlasmicCustomSelect__Option__OverridesType;
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
        path: "isHighlighted",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.isHighlighted
      },
      {
        path: "isDisabled",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.isDisabled
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

  const superContexts = {
    CustomSelect: React.useContext(SUPER__PlasmicCustomSelect.Context)
  };

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
        plasmic_ravi_design_system_css.plasmic_tokens,
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        sty.root,
        {
          [sty.rootisDisabled]: hasVariant($state, "isDisabled", "isDisabled"),
          [sty.rootisHighlighted]: hasVariant(
            $state,
            "isHighlighted",
            "isHighlighted"
          ),
          [sty.rootisSelected]: hasVariant($state, "isSelected", "isSelected")
        }
      )}
    >
      <div
        data-plasmic-name={"labelContainer"}
        data-plasmic-override={overrides.labelContainer}
        className={classNames(projectcss.all, sty.labelContainer)}
      >
        {renderPlasmicSlot({
          defaultContents: "Option",
          value: args.children,
          className: classNames(sty.slotTargetChildren, {
            [sty.slotTargetChildrenisDisabled]: hasVariant(
              $state,
              "isDisabled",
              "isDisabled"
            ),
            [sty.slotTargetChildrenisHighlighted]: hasVariant(
              $state,
              "isHighlighted",
              "isHighlighted"
            ),
            [sty.slotTargetChildrenisSelected]: hasVariant(
              $state,
              "isSelected",
              "isSelected"
            )
          })
        })}
      </div>
    </div>
  ) as React.ReactElement | null;
}

function useBehavior<P extends pp.BaseSelectOptionProps>(
  props: P,
  ref: pp.SelectOptionRef
) {
  return pp.useSelectOption(
    PlasmicCustomSelect__Option,
    props,
    {
      isSelectedVariant: { group: "isSelected", variant: "isSelected" },
      isDisabledVariant: { group: "isDisabled", variant: "isDisabled" },
      isHighlightedVariant: {
        group: "isHighlighted",
        variant: "isHighlighted"
      },
      labelSlot: "children",
      root: "root",
      labelContainer: "labelContainer"
    },
    ref
  );
}

const PlasmicDescendants = {
  root: ["root", "labelContainer"],
  labelContainer: ["labelContainer"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  labelContainer: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicCustomSelect__Option__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicCustomSelect__Option__VariantsArgs;
    args?: PlasmicCustomSelect__Option__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicCustomSelect__Option__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicCustomSelect__Option__ArgsType,
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
          internalArgPropNames: PlasmicCustomSelect__Option__ArgProps,
          internalVariantPropNames: PlasmicCustomSelect__Option__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicCustomSelect__Option__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicCustomSelect__Option";
  } else {
    func.displayName = `PlasmicCustomSelect__Option.${nodeName}`;
  }
  return func;
}

export const PlasmicCustomSelect__Option = Object.assign(
  // Top-level PlasmicCustomSelect__Option renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    labelContainer: makeNodeComponent("labelContainer"),

    // Metadata about props expected for PlasmicCustomSelect__Option
    internalVariantProps: PlasmicCustomSelect__Option__VariantProps,
    internalArgProps: PlasmicCustomSelect__Option__ArgProps,

    useBehavior
  }
);

export default PlasmicCustomSelect__Option;
/* prettier-ignore-end */
