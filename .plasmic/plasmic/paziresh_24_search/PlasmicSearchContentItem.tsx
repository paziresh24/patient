/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: NqExHRSculUA

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

import SearchContentIcon from "../../SearchContentIcon"; // plasmic-import: TJ3HSI2L1TNq/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSearchContentItem.module.css"; // plasmic-import: NqExHRSculUA/css

createPlasmicElementProxy;

export type PlasmicSearchContentItem__VariantMembers = {};
export type PlasmicSearchContentItem__VariantsArgs = {};
type VariantPropType = keyof PlasmicSearchContentItem__VariantsArgs;
export const PlasmicSearchContentItem__VariantProps =
  new Array<VariantPropType>();

export type PlasmicSearchContentItem__ArgsType = {
  children?: React.ReactNode;
  title?: string;
  iconType?: string;
  component?: string;
};
type ArgPropType = keyof PlasmicSearchContentItem__ArgsType;
export const PlasmicSearchContentItem__ArgProps = new Array<ArgPropType>(
  "children",
  "title",
  "iconType",
  "component"
);

export type PlasmicSearchContentItem__OverridesType = {
  root?: Flex__<"div">;
  searchContentIcon?: Flex__<typeof SearchContentIcon>;
  text?: Flex__<"div">;
};

export interface DefaultSearchContentItemProps {
  children?: React.ReactNode;
  title?: string;
  iconType?: string;
  component?: string;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSearchContentItem__RenderFunc(props: {
  variants: PlasmicSearchContentItem__VariantsArgs;
  args: PlasmicSearchContentItem__ArgsType;
  overrides: PlasmicSearchContentItem__OverridesType;
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
      {(() => {
        try {
          return $props.component !== "search";
        } catch (e) {
          if (
            e instanceof TypeError ||
            e?.plasmicType === "PlasmicUndefinedDataError"
          ) {
            return true;
          }
          throw e;
        }
      })() ? (
        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox___9ODgw)}
        >
          <SearchContentIcon
            data-plasmic-name={"searchContentIcon"}
            data-plasmic-override={overrides.searchContentIcon}
            className={classNames("__wab_instance", sty.searchContentIcon)}
            iconType={(() => {
              try {
                return $props.iconType;
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

          <div
            data-plasmic-name={"text"}
            data-plasmic-override={overrides.text}
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text
            )}
          >
            <React.Fragment>
              {(() => {
                try {
                  return $props.title;
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return "\u062c\u0633\u062a\u062c\u0648 \u0647\u0627\u06cc \u067e\u0631 \u062a\u06a9\u0631\u0627\u0631\u0627";
                  }
                  throw e;
                }
              })()}
            </React.Fragment>
          </div>
        </Stack__>
      ) : null}
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__hoTvt)}
      >
        {renderPlasmicSlot({
          defaultContents: null,
          value: args.children
        })}
      </Stack__>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "searchContentIcon", "text"],
  searchContentIcon: ["searchContentIcon"],
  text: ["text"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  searchContentIcon: typeof SearchContentIcon;
  text: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSearchContentItem__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSearchContentItem__VariantsArgs;
    args?: PlasmicSearchContentItem__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSearchContentItem__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicSearchContentItem__ArgsType,
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
          internalArgPropNames: PlasmicSearchContentItem__ArgProps,
          internalVariantPropNames: PlasmicSearchContentItem__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSearchContentItem__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicSearchContentItem";
  } else {
    func.displayName = `PlasmicSearchContentItem.${nodeName}`;
  }
  return func;
}

export const PlasmicSearchContentItem = Object.assign(
  // Top-level PlasmicSearchContentItem renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    searchContentIcon: makeNodeComponent("searchContentIcon"),
    text: makeNodeComponent("text"),

    // Metadata about props expected for PlasmicSearchContentItem
    internalVariantProps: PlasmicSearchContentItem__VariantProps,
    internalArgProps: PlasmicSearchContentItem__ArgProps
  }
);

export default PlasmicSearchContentItem;
/* prettier-ignore-end */
