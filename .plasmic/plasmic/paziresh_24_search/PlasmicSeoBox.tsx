// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: LCOgDdMa8kxO

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

import SeoBoxBreadcrumbs from "../../SeoBoxBreadcrumbs"; // plasmic-import: 9I3tpcyd3g2y/component
import SeoBoxInfo from "../../SeoBoxInfo"; // plasmic-import: U2aZfSUKx5oQ/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSeoBox.module.css"; // plasmic-import: LCOgDdMa8kxO/css

createPlasmicElementProxy;

export type PlasmicSeoBox__VariantMembers = {};
export type PlasmicSeoBox__VariantsArgs = {};
type VariantPropType = keyof PlasmicSeoBox__VariantsArgs;
export const PlasmicSeoBox__VariantProps = new Array<VariantPropType>();

export type PlasmicSeoBox__ArgsType = {
  seoInfo?: any;
  footer?: any;
};
type ArgPropType = keyof PlasmicSeoBox__ArgsType;
export const PlasmicSeoBox__ArgProps = new Array<ArgPropType>(
  "seoInfo",
  "footer"
);

export type PlasmicSeoBox__OverridesType = {
  root?: Flex__<"div">;
  seoBoxBreadcrumbs?: Flex__<typeof SeoBoxBreadcrumbs>;
  seoBoxInfo?: Flex__<typeof SeoBoxInfo>;
};

export interface DefaultSeoBoxProps {
  seoInfo?: any;
  footer?: any;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSeoBox__RenderFunc(props: {
  variants: PlasmicSeoBox__VariantsArgs;
  args: PlasmicSeoBox__ArgsType;
  overrides: PlasmicSeoBox__OverridesType;
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
        plasmic_antd_5_hostless_css.plasmic_tokens,
        sty.root
      )}
    >
      <SeoBoxBreadcrumbs
        data-plasmic-name={"seoBoxBreadcrumbs"}
        data-plasmic-override={overrides.seoBoxBreadcrumbs}
        breadcrumbs={(() => {
          try {
            return $props.seoInfo.breadcrumbs;
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
        className={classNames("__wab_instance", sty.seoBoxBreadcrumbs)}
      />

      <SeoBoxInfo
        data-plasmic-name={"seoBoxInfo"}
        data-plasmic-override={overrides.seoBoxInfo}
        className={classNames("__wab_instance", sty.seoBoxInfo)}
        content={(() => {
          try {
            return $props.seoInfo.seo_box;
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
        description={(() => {
          try {
            return $props.seoInfo.description;
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
        footer={(() => {
          try {
            return $props.footer;
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
        title={(() => {
          try {
            return $props.seoInfo.heading;
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
      />
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "seoBoxBreadcrumbs", "seoBoxInfo"],
  seoBoxBreadcrumbs: ["seoBoxBreadcrumbs"],
  seoBoxInfo: ["seoBoxInfo"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  seoBoxBreadcrumbs: typeof SeoBoxBreadcrumbs;
  seoBoxInfo: typeof SeoBoxInfo;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSeoBox__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSeoBox__VariantsArgs;
    args?: PlasmicSeoBox__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSeoBox__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicSeoBox__ArgsType,
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
          internalArgPropNames: PlasmicSeoBox__ArgProps,
          internalVariantPropNames: PlasmicSeoBox__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSeoBox__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicSeoBox";
  } else {
    func.displayName = `PlasmicSeoBox.${nodeName}`;
  }
  return func;
}

export const PlasmicSeoBox = Object.assign(
  // Top-level PlasmicSeoBox renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    seoBoxBreadcrumbs: makeNodeComponent("seoBoxBreadcrumbs"),
    seoBoxInfo: makeNodeComponent("seoBoxInfo"),

    // Metadata about props expected for PlasmicSeoBox
    internalVariantProps: PlasmicSeoBox__VariantProps,
    internalArgProps: PlasmicSeoBox__ArgProps
  }
);

export default PlasmicSeoBox;
/* prettier-ignore-end */
