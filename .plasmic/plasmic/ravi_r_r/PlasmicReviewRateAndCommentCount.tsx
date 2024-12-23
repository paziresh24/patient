// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: etOCIhcu_Yx5

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

import RaviRateAndCommentCount from "../../RaviRateAndCommentCount"; // plasmic-import: sq-hoyjtWZlg/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_ravi_design_system_css from "../ravi_design_system/plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from "./PlasmicReviewRateAndCommentCount.module.css"; // plasmic-import: etOCIhcu_Yx5/css

createPlasmicElementProxy;

export type PlasmicReviewRateAndCommentCount__VariantMembers = {};
export type PlasmicReviewRateAndCommentCount__VariantsArgs = {};
type VariantPropType = keyof PlasmicReviewRateAndCommentCount__VariantsArgs;
export const PlasmicReviewRateAndCommentCount__VariantProps =
  new Array<VariantPropType>();

export type PlasmicReviewRateAndCommentCount__ArgsType = {
  hideRates?: boolean;
  rateCount?: string;
  rate?: string;
};
type ArgPropType = keyof PlasmicReviewRateAndCommentCount__ArgsType;
export const PlasmicReviewRateAndCommentCount__ArgProps =
  new Array<ArgPropType>("hideRates", "rateCount", "rate");

export type PlasmicReviewRateAndCommentCount__OverridesType = {
  root?: Flex__<"div">;
  raviRateAndCommentCount?: Flex__<typeof RaviRateAndCommentCount>;
};

export interface DefaultReviewRateAndCommentCountProps {
  hideRates?: boolean;
  rateCount?: string;
  rate?: string;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicReviewRateAndCommentCount__RenderFunc(props: {
  variants: PlasmicReviewRateAndCommentCount__VariantsArgs;
  args: PlasmicReviewRateAndCommentCount__ArgsType;
  overrides: PlasmicReviewRateAndCommentCount__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          hideRates: false,
          rateCount: (() => {
            try {
              return undefined;
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
          rate: ``
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
        plasmic_antd_5_hostless_css.plasmic_tokens,
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        sty.root
      )}
    >
      <RaviRateAndCommentCount
        data-plasmic-name={"raviRateAndCommentCount"}
        data-plasmic-override={overrides.raviRateAndCommentCount}
        className={classNames("__wab_instance", sty.raviRateAndCommentCount)}
        hideRates={args.hideRates}
        rate={args.rate}
        rateCount={args.rateCount}
      />
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "raviRateAndCommentCount"],
  raviRateAndCommentCount: ["raviRateAndCommentCount"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  raviRateAndCommentCount: typeof RaviRateAndCommentCount;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicReviewRateAndCommentCount__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicReviewRateAndCommentCount__VariantsArgs;
    args?: PlasmicReviewRateAndCommentCount__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicReviewRateAndCommentCount__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicReviewRateAndCommentCount__ArgsType,
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
          internalArgPropNames: PlasmicReviewRateAndCommentCount__ArgProps,
          internalVariantPropNames:
            PlasmicReviewRateAndCommentCount__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicReviewRateAndCommentCount__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicReviewRateAndCommentCount";
  } else {
    func.displayName = `PlasmicReviewRateAndCommentCount.${nodeName}`;
  }
  return func;
}

export const PlasmicReviewRateAndCommentCount = Object.assign(
  // Top-level PlasmicReviewRateAndCommentCount renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    raviRateAndCommentCount: makeNodeComponent("raviRateAndCommentCount"),

    // Metadata about props expected for PlasmicReviewRateAndCommentCount
    internalVariantProps: PlasmicReviewRateAndCommentCount__VariantProps,
    internalArgProps: PlasmicReviewRateAndCommentCount__ArgProps
  }
);

export default PlasmicReviewRateAndCommentCount;
/* prettier-ignore-end */