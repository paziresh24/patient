// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: pfHDjmK7Jo_j

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
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicHomePageShortcuts.module.css"; // plasmic-import: pfHDjmK7Jo_j/css

createPlasmicElementProxy;

export type PlasmicHomePageShortcuts__VariantMembers = {};
export type PlasmicHomePageShortcuts__VariantsArgs = {};
type VariantPropType = keyof PlasmicHomePageShortcuts__VariantsArgs;
export const PlasmicHomePageShortcuts__VariantProps =
  new Array<VariantPropType>();

export type PlasmicHomePageShortcuts__ArgsType = {};
type ArgPropType = keyof PlasmicHomePageShortcuts__ArgsType;
export const PlasmicHomePageShortcuts__ArgProps = new Array<ArgPropType>();

export type PlasmicHomePageShortcuts__OverridesType = {
  root?: Flex__<"div">;
  link?: Flex__<"a"> & Partial<LinkProps>;
  img?: Flex__<typeof PlasmicImg__>;
};

export interface DefaultHomePageShortcutsProps {
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicHomePageShortcuts__RenderFunc(props: {
  variants: PlasmicHomePageShortcuts__VariantsArgs;
  args: PlasmicHomePageShortcuts__ArgsType;
  overrides: PlasmicHomePageShortcuts__OverridesType;
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
    (() => {
      try {
        return !!$ctx.Growthbook.features?.[
          `theme-config:${globalThis.location.hostname}`
        ]?.["homePageShortcuts"];
      } catch (e) {
        if (
          e instanceof TypeError ||
          e?.plasmicType === "PlasmicUndefinedDataError"
        ) {
          return false;
        }
        throw e;
      }
    })() ? (
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
          plasmic_antd_5_hostless_css.plasmic_tokens,
          sty.root
        )}
      >
        <div
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text___0ThdV
          )}
        >
          {"\u062f\u0633\u062a\u0631\u0633\u06cc \u0633\u0631\u06cc\u0639"}
        </div>
        <div className={classNames(projectcss.all, sty.freeBox__fOgx)}>
          {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
            (() => {
              try {
                return $ctx.Growthbook.features?.[
                  `theme-config:${globalThis.location.hostname}`
                ]?.["shortcuts"];
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return [];
                }
                throw e;
              }
            })()
          ).map((__plasmic_item_0, __plasmic_idx_0) => {
            const currentItem = __plasmic_item_0;
            const currentIndex = __plasmic_idx_0;
            return (
              <Stack__
                as={PlasmicLink__}
                data-plasmic-name={"link"}
                data-plasmic-override={overrides.link}
                hasGap={true}
                className={classNames(projectcss.all, projectcss.a, sty.link)}
                component={Link}
                href={(() => {
                  try {
                    return currentItem.link;
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
                key={currentIndex}
                platform={"nextjs"}
              >
                <div
                  className={classNames(projectcss.all, sty.freeBox___3MuYb)}
                >
                  <PlasmicImg__
                    data-plasmic-name={"img"}
                    data-plasmic-override={overrides.img}
                    alt={""}
                    className={classNames(sty.img)}
                    displayHeight={"100%"}
                    displayMaxHeight={"none"}
                    displayMaxWidth={"100%"}
                    displayMinHeight={"0"}
                    displayMinWidth={"0"}
                    displayWidth={"100%"}
                    loading={"lazy"}
                    src={(() => {
                      try {
                        return currentItem.icon;
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
                <div
                  className={classNames(
                    projectcss.all,
                    projectcss.__wab_text,
                    sty.text__cf4Vq
                  )}
                >
                  <React.Fragment>
                    {(() => {
                      try {
                        return currentItem.title;
                      } catch (e) {
                        if (
                          e instanceof TypeError ||
                          e?.plasmicType === "PlasmicUndefinedDataError"
                        ) {
                          return "\u067e\u0632\u0634\u06a9\u0627\u0646 MRI";
                        }
                        throw e;
                      }
                    })()}
                  </React.Fragment>
                </div>
              </Stack__>
            );
          })}
        </div>
      </Stack__>
    ) : null
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "link", "img"],
  link: ["link", "img"],
  img: ["img"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  link: "a";
  img: typeof PlasmicImg__;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicHomePageShortcuts__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicHomePageShortcuts__VariantsArgs;
    args?: PlasmicHomePageShortcuts__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicHomePageShortcuts__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicHomePageShortcuts__ArgsType,
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
          internalArgPropNames: PlasmicHomePageShortcuts__ArgProps,
          internalVariantPropNames: PlasmicHomePageShortcuts__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicHomePageShortcuts__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicHomePageShortcuts";
  } else {
    func.displayName = `PlasmicHomePageShortcuts.${nodeName}`;
  }
  return func;
}

export const PlasmicHomePageShortcuts = Object.assign(
  // Top-level PlasmicHomePageShortcuts renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    link: makeNodeComponent("link"),
    img: makeNodeComponent("img"),

    // Metadata about props expected for PlasmicHomePageShortcuts
    internalVariantProps: PlasmicHomePageShortcuts__VariantProps,
    internalArgProps: PlasmicHomePageShortcuts__ArgProps
  }
);

export default PlasmicHomePageShortcuts;
/* prettier-ignore-end */
