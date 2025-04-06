/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: D9wOnIMjhmFJ

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

import RaviReviewFeedback from "../../RaviReviewFeedback"; // plasmic-import: lZJoIJWYs8o9/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_ravi_design_system_css from "../ravi_design_system/plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from "./PlasmicReviewFeedback.module.css"; // plasmic-import: D9wOnIMjhmFJ/css

createPlasmicElementProxy;

export type PlasmicReviewFeedback__VariantMembers = {};
export type PlasmicReviewFeedback__VariantsArgs = {};
type VariantPropType = keyof PlasmicReviewFeedback__VariantsArgs;
export const PlasmicReviewFeedback__VariantProps = new Array<VariantPropType>();

export type PlasmicReviewFeedback__ArgsType = {};
type ArgPropType = keyof PlasmicReviewFeedback__ArgsType;
export const PlasmicReviewFeedback__ArgProps = new Array<ArgPropType>();

export type PlasmicReviewFeedback__OverridesType = {
  root?: Flex__<"div">;
  raviReviewFeedback?: Flex__<typeof RaviReviewFeedback>;
};

export interface DefaultReviewFeedbackProps {
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicReviewFeedback__RenderFunc(props: {
  variants: PlasmicReviewFeedback__VariantsArgs;
  args: PlasmicReviewFeedback__ArgsType;
  overrides: PlasmicReviewFeedback__OverridesType;
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
        sty.root
      )}
    >
      <RaviReviewFeedback
        data-plasmic-name={"raviReviewFeedback"}
        data-plasmic-override={overrides.raviReviewFeedback}
        className={classNames("__wab_instance", sty.raviReviewFeedback)}
        negativeList={[
          {
            label:
              "\u0628\u0631\u062e\u0648\u0631\u062f \u0646\u0627\u0645\u0646\u0627\u0633\u0628",
            value: "poor_encounter"
          },
          {
            label:
              "\u0628\u06cc\u200c\u062a\u0648\u062c\u0647\u06cc \u0628\u0647 \u0628\u06cc\u0645\u0627\u0631",
            value: "lack_of_attention"
          },
          {
            label:
              "\u062a\u0627\u062e\u06cc\u0631 \u062f\u0631 \u0645\u0644\u0627\u0642\u0627\u062a",
            value: "delay_in_meeting"
          },
          {
            label:
              "\u062a\u0648\u0636\u06cc\u062d\u0627\u062a \u0646\u0627\u0642\u0635 \u0648 \u0645\u0628\u0647\u0645",
            value: "incomplete_explanations"
          },
          {
            label:
              "\u0639\u062f\u0645 \u0631\u0639\u0627\u06cc\u062a \u0627\u062f\u0628",
            value: "impoliteness"
          }
        ]}
        positiveList={[
          {
            label:
              "\u0628\u0631\u062e\u0648\u0631\u062f \u0645\u0646\u0627\u0633\u0628",
            value: "good_encounter"
          },
          {
            label: "\u0648\u0642\u062a\u200c\u0634\u0646\u0627\u0633\u06cc",
            value: "punctuality"
          },
          {
            label:
              "\u062a\u0648\u0636\u06cc\u062d\u0627\u062a \u06a9\u0627\u0645\u0644 \u0648 \u0645\u0641\u06cc\u062f",
            value: "clear_explanations"
          },
          {
            label:
              "\u062f\u0642\u062a \u0648 \u062a\u0648\u062c\u0647 \u0628\u0647 \u0628\u06cc\u0645\u0627\u0631",
            value: "attention_to_patient"
          },
          {
            label:
              "\u0631\u0639\u0627\u06cc\u062a \u0627\u062f\u0628 \u0648 \u0627\u062d\u062a\u0631\u0627\u0645",
            value: "politeness"
          }
        ]}
      />
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "raviReviewFeedback"],
  raviReviewFeedback: ["raviReviewFeedback"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  raviReviewFeedback: typeof RaviReviewFeedback;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicReviewFeedback__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicReviewFeedback__VariantsArgs;
    args?: PlasmicReviewFeedback__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicReviewFeedback__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicReviewFeedback__ArgsType,
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
          internalArgPropNames: PlasmicReviewFeedback__ArgProps,
          internalVariantPropNames: PlasmicReviewFeedback__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicReviewFeedback__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicReviewFeedback";
  } else {
    func.displayName = `PlasmicReviewFeedback.${nodeName}`;
  }
  return func;
}

export const PlasmicReviewFeedback = Object.assign(
  // Top-level PlasmicReviewFeedback renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    raviReviewFeedback: makeNodeComponent("raviReviewFeedback"),

    // Metadata about props expected for PlasmicReviewFeedback
    internalVariantProps: PlasmicReviewFeedback__VariantProps,
    internalArgProps: PlasmicReviewFeedback__ArgProps
  }
);

export default PlasmicReviewFeedback;
/* prettier-ignore-end */
