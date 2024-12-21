// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: pkMLinFwM9pzwv5S5KpiAu
// Component: eIcAmCTlZ2yT

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

import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import sty from "./PlasmicRaviTabs.module.css"; // plasmic-import: eIcAmCTlZ2yT/css

createPlasmicElementProxy;

export type PlasmicRaviTabs__VariantMembers = {
  isNegative: "isNegative";
};
export type PlasmicRaviTabs__VariantsArgs = {
  isNegative?: SingleBooleanChoiceArg<"isNegative">;
};
type VariantPropType = keyof PlasmicRaviTabs__VariantsArgs;
export const PlasmicRaviTabs__VariantProps = new Array<VariantPropType>(
  "isNegative"
);

export type PlasmicRaviTabs__ArgsType = {
  onClickTab?: (value: string) => void;
};
type ArgPropType = keyof PlasmicRaviTabs__ArgsType;
export const PlasmicRaviTabs__ArgProps = new Array<ArgPropType>("onClickTab");

export type PlasmicRaviTabs__OverridesType = {
  root?: Flex__<"div">;
};

export interface DefaultRaviTabsProps {
  onClickTab?: (value: string) => void;
  isNegative?: SingleBooleanChoiceArg<"isNegative">;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicRaviTabs__RenderFunc(props: {
  variants: PlasmicRaviTabs__VariantsArgs;
  args: PlasmicRaviTabs__ArgsType;
  overrides: PlasmicRaviTabs__OverridesType;
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
        path: "isNegative",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.isNegative
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
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        plasmic_antd_5_hostless_css.plasmic_tokens,
        sty.root,
        { [sty.rootisNegative]: hasVariant($state, "isNegative", "isNegative") }
      )}
    >
      <div
        className={classNames(projectcss.all, sty.freeBox__nvBGv)}
        dir={"rtl"}
      >
        <div
          className={classNames(projectcss.all, sty.freeBox__f9WWe, {
            [sty.freeBoxisNegative__f9WWe01K8K]: hasVariant(
              $state,
              "isNegative",
              "isNegative"
            )
          })}
          onClick={async event => {
            const $steps = {};

            $steps["runOnClickTab"] = true
              ? (() => {
                  const actionArgs = {
                    eventRef: $props["onClickTab"],
                    args: ["positive"]
                  };
                  return (({ eventRef, args }) => {
                    return eventRef?.(...(args ?? []));
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["runOnClickTab"] != null &&
              typeof $steps["runOnClickTab"] === "object" &&
              typeof $steps["runOnClickTab"].then === "function"
            ) {
              $steps["runOnClickTab"] = await $steps["runOnClickTab"];
            }
          }}
        >
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text__a5Jaq,
              {
                [sty.textisNegative__a5Jaq01K8K]: hasVariant(
                  $state,
                  "isNegative",
                  "isNegative"
                )
              }
            )}
            style={(() => {
              try {
                return {
                  ...(!$state.isNegative
                    ? { opacity: "100%" }
                    : { opacity: "75%" })
                };
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
          >
            {
              "\u0628\u0627\u0632\u062e\u0648\u0631\u062f \u0645\u062b\u0628\u062a"
            }
          </div>
        </div>
        <div
          className={classNames(projectcss.all, sty.freeBox__gCRwe, {
            [sty.freeBoxisNegative__gCRwe01K8K]: hasVariant(
              $state,
              "isNegative",
              "isNegative"
            )
          })}
          onClick={async event => {
            const $steps = {};

            $steps["runOnClickTab"] = true
              ? (() => {
                  const actionArgs = {
                    eventRef: $props["onClickTab"],
                    args: ["negative"]
                  };
                  return (({ eventRef, args }) => {
                    return eventRef?.(...(args ?? []));
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["runOnClickTab"] != null &&
              typeof $steps["runOnClickTab"] === "object" &&
              typeof $steps["runOnClickTab"].then === "function"
            ) {
              $steps["runOnClickTab"] = await $steps["runOnClickTab"];
            }
          }}
        >
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text__mDK6
            )}
            style={(() => {
              try {
                return {
                  ...($state.isNegative
                    ? { opacity: "100%" }
                    : { opacity: "75%" })
                };
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
          >
            {
              "\u0628\u0627\u0632\u062e\u0648\u0631\u062f \u0645\u0646\u0641\u06cc"
            }
          </div>
        </div>
      </div>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicRaviTabs__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicRaviTabs__VariantsArgs;
    args?: PlasmicRaviTabs__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicRaviTabs__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicRaviTabs__ArgsType,
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
          internalArgPropNames: PlasmicRaviTabs__ArgProps,
          internalVariantPropNames: PlasmicRaviTabs__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicRaviTabs__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicRaviTabs";
  } else {
    func.displayName = `PlasmicRaviTabs.${nodeName}`;
  }
  return func;
}

export const PlasmicRaviTabs = Object.assign(
  // Top-level PlasmicRaviTabs renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements

    // Metadata about props expected for PlasmicRaviTabs
    internalVariantProps: PlasmicRaviTabs__VariantProps,
    internalArgProps: PlasmicRaviTabs__ArgProps
  }
);

export default PlasmicRaviTabs;
/* prettier-ignore-end */
