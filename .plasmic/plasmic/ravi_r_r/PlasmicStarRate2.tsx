// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: XaRCJPYGaC31

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
import projectcss from "./plasmic.module.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from "./PlasmicStarRate2.module.css"; // plasmic-import: XaRCJPYGaC31/css

import Icon24Icon from "./icons/PlasmicIcon__Icon24"; // plasmic-import: 7LGrDRQSghPi/icon
import Icon26Icon from "./icons/PlasmicIcon__Icon26"; // plasmic-import: 1xT9nrQ-SKoC/icon
import Icon25Icon from "./icons/PlasmicIcon__Icon25"; // plasmic-import: IEsYKS2W7QnA/icon
import Icon27Icon from "./icons/PlasmicIcon__Icon27"; // plasmic-import: yTqbbBJJjjHv/icon
import Icon28Icon from "./icons/PlasmicIcon__Icon28"; // plasmic-import: Wdkh9W7OENwz/icon
import Icon29Icon from "./icons/PlasmicIcon__Icon29"; // plasmic-import: IoeAvP4DtBEU/icon
import Icon30Icon from "./icons/PlasmicIcon__Icon30"; // plasmic-import: gfizOXjAEdC3/icon

createPlasmicElementProxy;

export type PlasmicStarRate2__VariantMembers = {
  rate:
    | "_0"
    | "_01"
    | "_02"
    | "_03"
    | "_04"
    | "_05"
    | "_06"
    | "_07"
    | "_08"
    | "_09"
    | "_1";
};
export type PlasmicStarRate2__VariantsArgs = {
  rate?: SingleChoiceArg<
    | "_0"
    | "_01"
    | "_02"
    | "_03"
    | "_04"
    | "_05"
    | "_06"
    | "_07"
    | "_08"
    | "_09"
    | "_1"
  >;
};
type VariantPropType = keyof PlasmicStarRate2__VariantsArgs;
export const PlasmicStarRate2__VariantProps = new Array<VariantPropType>(
  "rate"
);

export type PlasmicStarRate2__ArgsType = {};
type ArgPropType = keyof PlasmicStarRate2__ArgsType;
export const PlasmicStarRate2__ArgProps = new Array<ArgPropType>();

export type PlasmicStarRate2__OverridesType = {
  root?: Flex__<"div">;
  svg?: Flex__<"svg">;
};

export interface DefaultStarRate2Props {
  rate?: SingleChoiceArg<
    | "_0"
    | "_01"
    | "_02"
    | "_03"
    | "_04"
    | "_05"
    | "_06"
    | "_07"
    | "_08"
    | "_09"
    | "_1"
  >;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicStarRate2__RenderFunc(props: {
  variants: PlasmicStarRate2__VariantsArgs;
  args: PlasmicStarRate2__ArgsType;
  overrides: PlasmicStarRate2__OverridesType;
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
        path: "rate",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.rate
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
        sty.root,
        {
          [sty.rootrate__01]: hasVariant($state, "rate", "_01"),
          [sty.rootrate__02]: hasVariant($state, "rate", "_02"),
          [sty.rootrate__03]: hasVariant($state, "rate", "_03"),
          [sty.rootrate__04]: hasVariant($state, "rate", "_04"),
          [sty.rootrate__05]: hasVariant($state, "rate", "_05"),
          [sty.rootrate__06]: hasVariant($state, "rate", "_06"),
          [sty.rootrate__07]: hasVariant($state, "rate", "_07"),
          [sty.rootrate__08]: hasVariant($state, "rate", "_08"),
          [sty.rootrate__09]: hasVariant($state, "rate", "_09"),
          [sty.rootrate__0]: hasVariant($state, "rate", "_0"),
          [sty.rootrate__1]: hasVariant($state, "rate", "_1")
        }
      )}
    >
      <PlasmicIcon__
        data-plasmic-name={"svg"}
        data-plasmic-override={overrides.svg}
        PlasmicIconType={
          hasVariant($state, "rate", "_1")
            ? Icon30Icon
            : hasVariant($state, "rate", "_09")
            ? Icon29Icon
            : hasVariant($state, "rate", "_08")
            ? Icon29Icon
            : hasVariant($state, "rate", "_07")
            ? Icon28Icon
            : hasVariant($state, "rate", "_06")
            ? Icon28Icon
            : hasVariant($state, "rate", "_05")
            ? Icon27Icon
            : hasVariant($state, "rate", "_04")
            ? Icon25Icon
            : hasVariant($state, "rate", "_03")
            ? Icon25Icon
            : hasVariant($state, "rate", "_02")
            ? Icon26Icon
            : hasVariant($state, "rate", "_01")
            ? Icon26Icon
            : Icon24Icon
        }
        className={classNames(projectcss.all, sty.svg, {
          [sty.svgrate__01]: hasVariant($state, "rate", "_01"),
          [sty.svgrate__02]: hasVariant($state, "rate", "_02"),
          [sty.svgrate__03]: hasVariant($state, "rate", "_03"),
          [sty.svgrate__04]: hasVariant($state, "rate", "_04"),
          [sty.svgrate__05]: hasVariant($state, "rate", "_05"),
          [sty.svgrate__06]: hasVariant($state, "rate", "_06"),
          [sty.svgrate__07]: hasVariant($state, "rate", "_07"),
          [sty.svgrate__08]: hasVariant($state, "rate", "_08"),
          [sty.svgrate__09]: hasVariant($state, "rate", "_09"),
          [sty.svgrate__0]: hasVariant($state, "rate", "_0"),
          [sty.svgrate__1]: hasVariant($state, "rate", "_1")
        })}
        role={"img"}
      />
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "svg"],
  svg: ["svg"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  svg: "svg";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicStarRate2__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicStarRate2__VariantsArgs;
    args?: PlasmicStarRate2__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicStarRate2__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicStarRate2__ArgsType,
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
          internalArgPropNames: PlasmicStarRate2__ArgProps,
          internalVariantPropNames: PlasmicStarRate2__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicStarRate2__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicStarRate2";
  } else {
    func.displayName = `PlasmicStarRate2.${nodeName}`;
  }
  return func;
}

export const PlasmicStarRate2 = Object.assign(
  // Top-level PlasmicStarRate2 renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    svg: makeNodeComponent("svg"),

    // Metadata about props expected for PlasmicStarRate2
    internalVariantProps: PlasmicStarRate2__VariantProps,
    internalArgProps: PlasmicStarRate2__ArgProps
  }
);

export default PlasmicStarRate2;
/* prettier-ignore-end */
