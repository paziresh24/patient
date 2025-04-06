/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: ZU8LNETTLz6R

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

import { Popover } from "@plasmicpkgs/radix-ui";

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_ravi_design_system_css from "../ravi_design_system/plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from "./PlasmicNoReview.module.css"; // plasmic-import: ZU8LNETTLz6R/css

import Icon5Icon from "./icons/PlasmicIcon__Icon5"; // plasmic-import: nlR9y6ohoS5X/icon

createPlasmicElementProxy;

export type PlasmicNoReview__VariantMembers = {};
export type PlasmicNoReview__VariantsArgs = {};
type VariantPropType = keyof PlasmicNoReview__VariantsArgs;
export const PlasmicNoReview__VariantProps = new Array<VariantPropType>();

export type PlasmicNoReview__ArgsType = {};
type ArgPropType = keyof PlasmicNoReview__ArgsType;
export const PlasmicNoReview__ArgProps = new Array<ArgPropType>();

export type PlasmicNoReview__OverridesType = {
  root?: Flex__<"div">;
  popoverCore?: Flex__<typeof Popover>;
  svg?: Flex__<"svg">;
};

export interface DefaultNoReviewProps {
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicNoReview__RenderFunc(props: {
  variants: PlasmicNoReview__VariantsArgs;
  args: PlasmicNoReview__ArgsType;
  overrides: PlasmicNoReview__OverridesType;
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
        path: "popoverCore.open",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
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
        plasmic_ravi_design_system_css.plasmic_tokens,
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        sty.root
      )}
    >
      <div className={classNames(projectcss.all, sty.freeBox___4332B)}>
        <div
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text__uOwgV
          )}
        >
          {
            "\u0628\u0647 \u062f\u0644\u06cc\u0644 \u062a\u0639\u062f\u0627\u062f \u06a9\u0645 \u0646\u0638\u0631\u0627\u062a\u060c \u0627\u0645\u062a\u06cc\u0627\u0632 \u0642\u0627\u0628\u0644 \u0646\u0645\u0627\u06cc\u0634 \u0646\u06cc\u0633\u062a."
          }
        </div>
        <Popover
          data-plasmic-name={"popoverCore"}
          data-plasmic-override={overrides.popoverCore}
          className={classNames("__wab_instance", sty.popoverCore)}
          onOpenChange={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, ["popoverCore", "open"]).apply(
              null,
              eventArgs
            );
          }}
          open={generateStateValueProp($state, ["popoverCore", "open"])}
          overlay={
            <div className={classNames(projectcss.all, sty.freeBox___1VoxC)}>
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__xt6U
                )}
              >
                <React.Fragment>
                  {(() => {
                    try {
                      return `برای نمایش امتیاز پزشک حداقل 5 نظر لازم است ثبت شده باشد.`;
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
            </div>
          }
          themeResetClass={classNames(
            projectcss.root_reset,
            projectcss.plasmic_default_styles,
            projectcss.plasmic_mixins,
            projectcss.plasmic_tokens,
            plasmic_fragment_design_system_css.plasmic_tokens,
            plasmic_ravi_design_system_css.plasmic_tokens,
            plasmic_paziresh_24_design_system_css.plasmic_tokens
          )}
        >
          <div
            className={classNames(projectcss.all, sty.freeBox__wQaq2)}
            onClick={async event => {
              const $steps = {};

              $steps["runCode"] = true
                ? (() => {
                    const actionArgs = {
                      customFunction: async () => {
                        return event.stopPropagation();
                      }
                    };
                    return (({ customFunction }) => {
                      return customFunction();
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps["runCode"] != null &&
                typeof $steps["runCode"] === "object" &&
                typeof $steps["runCode"].then === "function"
              ) {
                $steps["runCode"] = await $steps["runCode"];
              }
            }}
          >
            <Icon5Icon
              data-plasmic-name={"svg"}
              data-plasmic-override={overrides.svg}
              className={classNames(projectcss.all, sty.svg)}
              role={"img"}
            />
          </div>
        </Popover>
      </div>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "popoverCore", "svg"],
  popoverCore: ["popoverCore", "svg"],
  svg: ["svg"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  popoverCore: typeof Popover;
  svg: "svg";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicNoReview__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicNoReview__VariantsArgs;
    args?: PlasmicNoReview__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicNoReview__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicNoReview__ArgsType,
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
          internalArgPropNames: PlasmicNoReview__ArgProps,
          internalVariantPropNames: PlasmicNoReview__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicNoReview__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicNoReview";
  } else {
    func.displayName = `PlasmicNoReview.${nodeName}`;
  }
  return func;
}

export const PlasmicNoReview = Object.assign(
  // Top-level PlasmicNoReview renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    popoverCore: makeNodeComponent("popoverCore"),
    svg: makeNodeComponent("svg"),

    // Metadata about props expected for PlasmicNoReview
    internalVariantProps: PlasmicNoReview__VariantProps,
    internalArgProps: PlasmicNoReview__ArgProps
  }
);

export default PlasmicNoReview;
/* prettier-ignore-end */
