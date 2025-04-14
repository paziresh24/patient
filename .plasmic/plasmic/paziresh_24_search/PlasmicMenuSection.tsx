/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: V-WvFI1-67qQ

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

import { BaseSection } from "@plasmicpkgs/react-aria/skinny/registerSection";
import MenuItem from "../../MenuItem"; // plasmic-import: NftCFkaQJ0Bb/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicMenuSection.module.css"; // plasmic-import: V-WvFI1-67qQ/css

createPlasmicElementProxy;

export type PlasmicMenuSection__VariantMembers = {};
export type PlasmicMenuSection__VariantsArgs = {};
type VariantPropType = keyof PlasmicMenuSection__VariantsArgs;
export const PlasmicMenuSection__VariantProps = new Array<VariantPropType>();

export type PlasmicMenuSection__ArgsType = {
  header?: React.ReactNode;
  items?: React.ReactNode;
};
type ArgPropType = keyof PlasmicMenuSection__ArgsType;
export const PlasmicMenuSection__ArgProps = new Array<ArgPropType>(
  "header",
  "items"
);

export type PlasmicMenuSection__OverridesType = {
  root?: Flex__<typeof BaseSection>;
  freeBox?: Flex__<"div">;
};

export interface DefaultMenuSectionProps {
  header?: React.ReactNode;
  items?: React.ReactNode;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicMenuSection__RenderFunc(props: {
  variants: PlasmicMenuSection__VariantsArgs;
  args: PlasmicMenuSection__ArgsType;
  overrides: PlasmicMenuSection__OverridesType;
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
    <BaseSection
      data-plasmic-name={"root"}
      data-plasmic-override={overrides.root}
      data-plasmic-root={true}
      data-plasmic-for-node={forNode}
      className={classNames(
        "__wab_instance",
        projectcss.root_reset,
        projectcss.plasmic_default_styles,
        projectcss.plasmic_mixins,
        projectcss.plasmic_tokens,
        plasmic_fragment_design_system_css.plasmic_tokens,
        sty.root
      )}
      header={
        <div
          data-plasmic-name={"freeBox"}
          data-plasmic-override={overrides.freeBox}
          className={classNames(projectcss.all, sty.freeBox)}
        >
          {renderPlasmicSlot({
            defaultContents: "Section Header",
            value: args.header,
            className: classNames(sty.slotTargetHeader)
          })}
        </div>
      }
      items={renderPlasmicSlot({
        defaultContents: (
          <React.Fragment>
            <MenuItem label={"Section Item 1"} value={"section-item-1"} />

            <MenuItem label={"Section Item 2"} value={"section-item-2"} />

            <MenuItem label={"Section Item 3"} value={"section-item-3"} />
          </React.Fragment>
        ),
        value: args.items
      })}
    />
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "freeBox"],
  freeBox: ["freeBox"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: typeof BaseSection;
  freeBox: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicMenuSection__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicMenuSection__VariantsArgs;
    args?: PlasmicMenuSection__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicMenuSection__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicMenuSection__ArgsType,
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
          internalArgPropNames: PlasmicMenuSection__ArgProps,
          internalVariantPropNames: PlasmicMenuSection__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicMenuSection__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicMenuSection";
  } else {
    func.displayName = `PlasmicMenuSection.${nodeName}`;
  }
  return func;
}

export const PlasmicMenuSection = Object.assign(
  // Top-level PlasmicMenuSection renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    freeBox: makeNodeComponent("freeBox"),

    // Metadata about props expected for PlasmicMenuSection
    internalVariantProps: PlasmicMenuSection__VariantProps,
    internalArgProps: PlasmicMenuSection__ArgProps
  }
);

export default PlasmicMenuSection;
/* prettier-ignore-end */
