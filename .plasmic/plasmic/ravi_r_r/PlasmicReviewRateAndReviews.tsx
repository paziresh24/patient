/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: qb59XTke1gWO

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

import ReviewRateAndCommentCount from "../../ReviewRateAndCommentCount"; // plasmic-import: etOCIhcu_Yx5/component
import ReviewProgressList from "../../ReviewProgressList"; // plasmic-import: xpGRRNKB86D2/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_ravi_design_system_css from "../ravi_design_system/plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from "./PlasmicReviewRateAndReviews.module.css"; // plasmic-import: qb59XTke1gWO/css

createPlasmicElementProxy;

export type PlasmicReviewRateAndReviews__VariantMembers = {};
export type PlasmicReviewRateAndReviews__VariantsArgs = {};
type VariantPropType = keyof PlasmicReviewRateAndReviews__VariantsArgs;
export const PlasmicReviewRateAndReviews__VariantProps =
  new Array<VariantPropType>();

export type PlasmicReviewRateAndReviews__ArgsType = {
  displayName?: string;
  hideRates?: boolean;
  rateCount?: string;
  rate?: string;
  seo?: any;
  items?: any;
  hideProgressList?: boolean;
};
type ArgPropType = keyof PlasmicReviewRateAndReviews__ArgsType;
export const PlasmicReviewRateAndReviews__ArgProps = new Array<ArgPropType>(
  "displayName",
  "hideRates",
  "rateCount",
  "rate",
  "seo",
  "items",
  "hideProgressList"
);

export type PlasmicReviewRateAndReviews__OverridesType = {
  root?: Flex__<"div">;
  h2?: Flex__<"h2">;
  freeBox?: Flex__<"div">;
  reviewRateAndCommentCount?: Flex__<typeof ReviewRateAndCommentCount>;
  reviewProgressList?: Flex__<typeof ReviewProgressList>;
};

export interface DefaultReviewRateAndReviewsProps {
  displayName?: string;
  hideRates?: boolean;
  rateCount?: string;
  rate?: string;
  seo?: any;
  items?: any;
  hideProgressList?: boolean;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicReviewRateAndReviews__RenderFunc(props: {
  variants: PlasmicReviewRateAndReviews__VariantsArgs;
  args: PlasmicReviewRateAndReviews__ArgsType;
  overrides: PlasmicReviewRateAndReviews__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          hideRates: false,
          rateCount: ``,
          rate: ``,
          items: [
            {
              label:
                "\u0628\u0631\u062e\u0648\u0631\u062f \u0645\u0646\u0627\u0633\u0628",
              value: "2.5"
            },
            {
              label:
                "\u062a\u0648\u0636\u06cc\u062d \u062f\u0631 \u0647\u0646\u06af\u0627\u0645 \u0648\u06cc\u0632\u06cc\u062a",
              value: "4.5"
            },
            {
              label:
                "\u0645\u0647\u0627\u0631\u062a \u0648 \u062a\u062e\u0635\u0635",
              value: "3.8"
            }
          ],
          hideProgressList: false
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
        plasmic_ravi_design_system_css.plasmic_tokens,
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        sty.root
      )}
    >
      <h2
        data-plasmic-name={"h2"}
        data-plasmic-override={overrides.h2}
        className={classNames(
          projectcss.all,
          projectcss.h2,
          projectcss.__wab_text,
          sty.h2
        )}
      >
        <React.Fragment>
          {(() => {
            try {
              return `نظرات درمورد ${$props?.displayName || ""}`;
            } catch (e) {
              if (
                e instanceof TypeError ||
                e?.plasmicType === "PlasmicUndefinedDataError"
              ) {
                return "\u0646\u0638\u0631\u0627\u062a \u062f\u0631\u0645\u0648\u0631\u062f ";
              }
              throw e;
            }
          })()}
        </React.Fragment>
      </h2>
      <Stack__
        as={"div"}
        data-plasmic-name={"freeBox"}
        data-plasmic-override={overrides.freeBox}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox)}
      >
        <ReviewRateAndCommentCount
          data-plasmic-name={"reviewRateAndCommentCount"}
          data-plasmic-override={overrides.reviewRateAndCommentCount}
          className={classNames(
            "__wab_instance",
            sty.reviewRateAndCommentCount
          )}
          hideRates={args.hideRates}
          rate={args.rate}
          rateCount={args.rateCount}
          seo={args.seo}
        />

        <ReviewProgressList
          data-plasmic-name={"reviewProgressList"}
          data-plasmic-override={overrides.reviewProgressList}
          className={classNames("__wab_instance", sty.reviewProgressList)}
          hideRates={args.hideProgressList}
          items={args.items}
        />
      </Stack__>
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: [
    "root",
    "h2",
    "freeBox",
    "reviewRateAndCommentCount",
    "reviewProgressList"
  ],
  h2: ["h2"],
  freeBox: ["freeBox", "reviewRateAndCommentCount", "reviewProgressList"],
  reviewRateAndCommentCount: ["reviewRateAndCommentCount"],
  reviewProgressList: ["reviewProgressList"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  h2: "h2";
  freeBox: "div";
  reviewRateAndCommentCount: typeof ReviewRateAndCommentCount;
  reviewProgressList: typeof ReviewProgressList;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicReviewRateAndReviews__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicReviewRateAndReviews__VariantsArgs;
    args?: PlasmicReviewRateAndReviews__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicReviewRateAndReviews__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicReviewRateAndReviews__ArgsType,
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
          internalArgPropNames: PlasmicReviewRateAndReviews__ArgProps,
          internalVariantPropNames: PlasmicReviewRateAndReviews__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicReviewRateAndReviews__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicReviewRateAndReviews";
  } else {
    func.displayName = `PlasmicReviewRateAndReviews.${nodeName}`;
  }
  return func;
}

export const PlasmicReviewRateAndReviews = Object.assign(
  // Top-level PlasmicReviewRateAndReviews renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    h2: makeNodeComponent("h2"),
    freeBox: makeNodeComponent("freeBox"),
    reviewRateAndCommentCount: makeNodeComponent("reviewRateAndCommentCount"),
    reviewProgressList: makeNodeComponent("reviewProgressList"),

    // Metadata about props expected for PlasmicReviewRateAndReviews
    internalVariantProps: PlasmicReviewRateAndReviews__VariantProps,
    internalArgProps: PlasmicReviewRateAndReviews__ArgProps
  }
);

export default PlasmicReviewRateAndReviews;
/* prettier-ignore-end */
