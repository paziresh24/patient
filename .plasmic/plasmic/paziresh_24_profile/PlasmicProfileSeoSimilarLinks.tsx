/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: 7r312uiqyadpVPdnRoAggk
// Component: t9YD5mtJ9Hq-

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

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: 7r312uiqyadpVPdnRoAggk/projectcss
import sty from "./PlasmicProfileSeoSimilarLinks.module.css"; // plasmic-import: t9YD5mtJ9Hq-/css

import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicProfileSeoSimilarLinks__VariantMembers = {};
export type PlasmicProfileSeoSimilarLinks__VariantsArgs = {};
type VariantPropType = keyof PlasmicProfileSeoSimilarLinks__VariantsArgs;
export const PlasmicProfileSeoSimilarLinks__VariantProps =
  new Array<VariantPropType>();

export type PlasmicProfileSeoSimilarLinks__ArgsType = {
  title?: string;
  url?: string;
};
type ArgPropType = keyof PlasmicProfileSeoSimilarLinks__ArgsType;
export const PlasmicProfileSeoSimilarLinks__ArgProps = new Array<ArgPropType>(
  "title",
  "url"
);

export type PlasmicProfileSeoSimilarLinks__OverridesType = {
  root?: Flex__<"div">;
  freeBox?: Flex__<"div">;
  text?: Flex__<"div">;
  svg?: Flex__<"svg">;
};

export interface DefaultProfileSeoSimilarLinksProps {
  title?: string;
  url?: string;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicProfileSeoSimilarLinks__RenderFunc(props: {
  variants: PlasmicProfileSeoSimilarLinks__VariantsArgs;
  args: PlasmicProfileSeoSimilarLinks__ArgsType;
  overrides: PlasmicProfileSeoSimilarLinks__OverridesType;
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
        sty.root
      )}
    >
      <Stack__
        as={"div"}
        data-plasmic-name={"freeBox"}
        data-plasmic-override={overrides.freeBox}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox)}
        onClick={async event => {
          const $steps = {};

          $steps["goToPage"] = true
            ? (() => {
                const actionArgs = {
                  destination: (() => {
                    try {
                      return $props.url;
                    } catch (e) {
                      if (
                        e instanceof TypeError ||
                        e?.plasmicType === "PlasmicUndefinedDataError"
                      ) {
                        return undefined;
                      }
                      throw e;
                    }
                  })()
                };
                return (({ destination }) => {
                  if (
                    typeof destination === "string" &&
                    destination.startsWith("#")
                  ) {
                    document
                      .getElementById(destination.substr(1))
                      .scrollIntoView({ behavior: "smooth" });
                  } else {
                    __nextRouter?.push(destination);
                  }
                })?.apply(null, [actionArgs]);
              })()
            : undefined;
          if (
            $steps["goToPage"] != null &&
            typeof $steps["goToPage"] === "object" &&
            typeof $steps["goToPage"].then === "function"
          ) {
            $steps["goToPage"] = await $steps["goToPage"];
          }
        }}
      >
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
                  return "\u0622\u06cc\u062a\u0645 \u0627\u0648\u0644";
                }
                throw e;
              }
            })()}
          </React.Fragment>
        </div>
        <ChevronLeftIcon
          data-plasmic-name={"svg"}
          data-plasmic-override={overrides.svg}
          className={classNames(projectcss.all, sty.svg)}
          role={"img"}
        />
      </Stack__>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "freeBox", "text", "svg"],
  freeBox: ["freeBox", "text", "svg"],
  text: ["text"],
  svg: ["svg"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  freeBox: "div";
  text: "div";
  svg: "svg";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicProfileSeoSimilarLinks__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicProfileSeoSimilarLinks__VariantsArgs;
    args?: PlasmicProfileSeoSimilarLinks__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicProfileSeoSimilarLinks__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicProfileSeoSimilarLinks__ArgsType,
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
          internalArgPropNames: PlasmicProfileSeoSimilarLinks__ArgProps,
          internalVariantPropNames: PlasmicProfileSeoSimilarLinks__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicProfileSeoSimilarLinks__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicProfileSeoSimilarLinks";
  } else {
    func.displayName = `PlasmicProfileSeoSimilarLinks.${nodeName}`;
  }
  return func;
}

export const PlasmicProfileSeoSimilarLinks = Object.assign(
  // Top-level PlasmicProfileSeoSimilarLinks renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    freeBox: makeNodeComponent("freeBox"),
    text: makeNodeComponent("text"),
    svg: makeNodeComponent("svg"),

    // Metadata about props expected for PlasmicProfileSeoSimilarLinks
    internalVariantProps: PlasmicProfileSeoSimilarLinks__VariantProps,
    internalArgProps: PlasmicProfileSeoSimilarLinks__ArgProps
  }
);

export default PlasmicProfileSeoSimilarLinks;
/* prettier-ignore-end */
