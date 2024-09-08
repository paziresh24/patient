// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: h9Dbk9ygddw7UVEq1NNhKi
// Component: fa_t7ELXcm5k

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

import projectcss from "./plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import sty from "./PlasmicLineClamp.module.css"; // plasmic-import: fa_t7ELXcm5k/css

createPlasmicElementProxy;

export type PlasmicLineClamp__VariantMembers = {};
export type PlasmicLineClamp__VariantsArgs = {};
type VariantPropType = keyof PlasmicLineClamp__VariantsArgs;
export const PlasmicLineClamp__VariantProps = new Array<VariantPropType>();

export type PlasmicLineClamp__ArgsType = {
  children?: React.ReactNode;
  numberOfLines?: number;
};
type ArgPropType = keyof PlasmicLineClamp__ArgsType;
export const PlasmicLineClamp__ArgProps = new Array<ArgPropType>(
  "children",
  "numberOfLines"
);

export type PlasmicLineClamp__OverridesType = {
  root?: Flex__<"div">;
};

export interface DefaultLineClampProps {
  children?: React.ReactNode;
  numberOfLines?: number;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicLineClamp__RenderFunc(props: {
  variants: PlasmicLineClamp__VariantsArgs;
  args: PlasmicLineClamp__ArgsType;
  overrides: PlasmicLineClamp__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          numberOfLines: 1
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
        sty.root
      )}
      style={(() => {
        try {
          return {
            overflow: "hidden",
            "-webkit-line-clamp": $props.numberOfLines.toString(),
            "-webkit-box-orient": "vertical",
            display: "-webkit-box"
          };
        } catch (e) {
          if (
            e instanceof TypeError ||
            e?.plasmicType === "PlasmicUndefinedDataError"
          ) {
            return {};
          }
          throw e;
        }
      })()}
    >
      {renderPlasmicSlot({
        defaultContents: null,
        value: args.children
      })}
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
  PlasmicLineClamp__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicLineClamp__VariantsArgs;
    args?: PlasmicLineClamp__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicLineClamp__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicLineClamp__ArgsType,
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
          internalArgPropNames: PlasmicLineClamp__ArgProps,
          internalVariantPropNames: PlasmicLineClamp__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicLineClamp__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicLineClamp";
  } else {
    func.displayName = `PlasmicLineClamp.${nodeName}`;
  }
  return func;
}

export const PlasmicLineClamp = Object.assign(
  // Top-level PlasmicLineClamp renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements

    // Metadata about props expected for PlasmicLineClamp
    internalVariantProps: PlasmicLineClamp__VariantProps,
    internalArgProps: PlasmicLineClamp__ArgProps
  }
);

export default PlasmicLineClamp;
/* prettier-ignore-end */
