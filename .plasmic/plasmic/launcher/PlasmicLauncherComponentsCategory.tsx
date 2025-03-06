// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: grxNYctbMek6PL66cujx3u
// Component: 0KB-vfelIleY

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

import projectcss from "./plasmic.module.css"; // plasmic-import: grxNYctbMek6PL66cujx3u/projectcss
import sty from "./PlasmicLauncherComponentsCategory.module.css"; // plasmic-import: 0KB-vfelIleY/css

createPlasmicElementProxy;

export type PlasmicLauncherComponentsCategory__VariantMembers = {
  active: "active";
};
export type PlasmicLauncherComponentsCategory__VariantsArgs = {
  active?: SingleBooleanChoiceArg<"active">;
};
type VariantPropType = keyof PlasmicLauncherComponentsCategory__VariantsArgs;
export const PlasmicLauncherComponentsCategory__VariantProps =
  new Array<VariantPropType>("active");

export type PlasmicLauncherComponentsCategory__ArgsType = {
  name?: string;
  onClick?: () => void;
};
type ArgPropType = keyof PlasmicLauncherComponentsCategory__ArgsType;
export const PlasmicLauncherComponentsCategory__ArgProps =
  new Array<ArgPropType>("name", "onClick");

export type PlasmicLauncherComponentsCategory__OverridesType = {
  root?: Flex__<"div">;
  text?: Flex__<"div">;
};

export interface DefaultLauncherComponentsCategoryProps {
  name?: string;
  onClick?: () => void;
  active?: SingleBooleanChoiceArg<"active">;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicLauncherComponentsCategory__RenderFunc(props: {
  variants: PlasmicLauncherComponentsCategory__VariantsArgs;
  args: PlasmicLauncherComponentsCategory__ArgsType;
  overrides: PlasmicLauncherComponentsCategory__OverridesType;
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
        path: "active",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.active
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
        sty.root,
        "min-w-fit w-max",
        { [sty.rootactive]: hasVariant($state, "active", "active") }
      )}
      onClick={async event => {
        const $steps = {};

        $steps["runOnClick"] = true
          ? (() => {
              const actionArgs = { eventRef: $props["onClick"] };
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
        className={classNames(projectcss.all, projectcss.__wab_text, sty.text)}
      >
        <React.Fragment>
          {(() => {
            try {
              return $props.name;
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
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "text"],
  text: ["text"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  text: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicLauncherComponentsCategory__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicLauncherComponentsCategory__VariantsArgs;
    args?: PlasmicLauncherComponentsCategory__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicLauncherComponentsCategory__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicLauncherComponentsCategory__ArgsType,
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
          internalArgPropNames: PlasmicLauncherComponentsCategory__ArgProps,
          internalVariantPropNames:
            PlasmicLauncherComponentsCategory__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicLauncherComponentsCategory__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicLauncherComponentsCategory";
  } else {
    func.displayName = `PlasmicLauncherComponentsCategory.${nodeName}`;
  }
  return func;
}

export const PlasmicLauncherComponentsCategory = Object.assign(
  // Top-level PlasmicLauncherComponentsCategory renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    text: makeNodeComponent("text"),

    // Metadata about props expected for PlasmicLauncherComponentsCategory
    internalVariantProps: PlasmicLauncherComponentsCategory__VariantProps,
    internalArgProps: PlasmicLauncherComponentsCategory__ArgProps
  }
);

export default PlasmicLauncherComponentsCategory;
/* prettier-ignore-end */
