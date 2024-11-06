// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: 7r312uiqyadpVPdnRoAggk
// Component: fKBGdItR62E2

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

import ProfileActions from "../../ProfileActions"; // plasmic-import: VtINgkEb27Pn/component
import ProfileInfo from "../../ProfileInfo"; // plasmic-import: rFaRrp2J8jq8/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: 7r312uiqyadpVPdnRoAggk/projectcss
import sty from "./PlasmicProfileHead.module.css"; // plasmic-import: fKBGdItR62E2/css

import Icon4Icon from "./icons/PlasmicIcon__Icon4"; // plasmic-import: YUYx96s4ZKDV/icon

createPlasmicElementProxy;

export type PlasmicProfileHead__VariantMembers = {};
export type PlasmicProfileHead__VariantsArgs = {};
type VariantPropType = keyof PlasmicProfileHead__VariantsArgs;
export const PlasmicProfileHead__VariantProps = new Array<VariantPropType>();

export type PlasmicProfileHead__ArgsType = {
  children?: React.ReactNode;
  pageViewCount?: string;
  serviceList?: any;
  displayName?: string;
  title?: string;
  subTitle?: string;
  imageUrl?: string;
  slug?: string;
};
type ArgPropType = keyof PlasmicProfileHead__ArgsType;
export const PlasmicProfileHead__ArgProps = new Array<ArgPropType>(
  "children",
  "pageViewCount",
  "serviceList",
  "displayName",
  "title",
  "subTitle",
  "imageUrl",
  "slug"
);

export type PlasmicProfileHead__OverridesType = {
  root?: Flex__<"div">;
  profileActions?: Flex__<typeof ProfileActions>;
  viewCount?: Flex__<"div">;
  svg?: Flex__<"svg">;
  profileInfo?: Flex__<typeof ProfileInfo>;
};

export interface DefaultProfileHeadProps {
  children?: React.ReactNode;
  pageViewCount?: string;
  serviceList?: any;
  displayName?: string;
  title?: string;
  subTitle?: string;
  imageUrl?: string;
  slug?: string;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicProfileHead__RenderFunc(props: {
  variants: PlasmicProfileHead__VariantsArgs;
  args: PlasmicProfileHead__ArgsType;
  overrides: PlasmicProfileHead__OverridesType;
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
        sty.root
      )}
    >
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__exjNw)}
      >
        <div className={classNames(projectcss.all, sty.freeBox__tuVqM)}>
          <ProfileActions
            data-plasmic-name={"profileActions"}
            data-plasmic-override={overrides.profileActions}
            className={classNames("__wab_instance", sty.profileActions)}
            slug={(() => {
              try {
                return $props.slug;
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
            data-plasmic-name={"viewCount"}
            data-plasmic-override={overrides.viewCount}
            className={classNames(projectcss.all, sty.viewCount)}
          >
            <span
              className={classNames(
                projectcss.all,
                projectcss.span,
                projectcss.__wab_text,
                sty.span__plQaR
              )}
            >
              <React.Fragment>
                {(() => {
                  try {
                    return Intl.NumberFormat("en", {
                      notation: "compact"
                    }).format($props.pageViewCount);
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "PlasmicUndefinedDataError"
                    ) {
                      return "301K";
                    }
                    throw e;
                  }
                })()}
              </React.Fragment>
            </span>
            <Icon4Icon
              data-plasmic-name={"svg"}
              data-plasmic-override={overrides.svg}
              className={classNames(projectcss.all, sty.svg)}
              role={"img"}
            />
          </div>
        </div>
      </Stack__>
      <ProfileInfo
        data-plasmic-name={"profileInfo"}
        data-plasmic-override={overrides.profileInfo}
        className={classNames("__wab_instance", sty.profileInfo)}
        displayName={(() => {
          try {
            return $props.displayName;
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
        imageUrl={(() => {
          try {
            return $props.imageUrl;
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
        subTitle={(() => {
          try {
            return $props.subTitle;
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
            return $props.title;
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

      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__ekp4F, "no-scroll")}
      >
        {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
          (() => {
            try {
              return $props.serviceList;
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
            <span
              className={classNames(
                projectcss.all,
                projectcss.span,
                projectcss.__wab_text,
                sty.span__yflB8
              )}
              key={currentIndex}
            >
              <React.Fragment>
                {(() => {
                  try {
                    return currentItem;
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "PlasmicUndefinedDataError"
                    ) {
                      return "\u06a9\u0645\u0631\u062f\u0631\u062f";
                    }
                    throw e;
                  }
                })()}
              </React.Fragment>
            </span>
          );
        })}
      </Stack__>
      <div className={classNames(projectcss.all, sty.freeBox__k5Fnv)}>
        {renderPlasmicSlot({
          defaultContents: null,
          value: args.children
        })}
      </div>
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "profileActions", "viewCount", "svg", "profileInfo"],
  profileActions: ["profileActions"],
  viewCount: ["viewCount", "svg"],
  svg: ["svg"],
  profileInfo: ["profileInfo"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  profileActions: typeof ProfileActions;
  viewCount: "div";
  svg: "svg";
  profileInfo: typeof ProfileInfo;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicProfileHead__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicProfileHead__VariantsArgs;
    args?: PlasmicProfileHead__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicProfileHead__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicProfileHead__ArgsType,
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
          internalArgPropNames: PlasmicProfileHead__ArgProps,
          internalVariantPropNames: PlasmicProfileHead__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicProfileHead__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicProfileHead";
  } else {
    func.displayName = `PlasmicProfileHead.${nodeName}`;
  }
  return func;
}

export const PlasmicProfileHead = Object.assign(
  // Top-level PlasmicProfileHead renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    profileActions: makeNodeComponent("profileActions"),
    viewCount: makeNodeComponent("viewCount"),
    svg: makeNodeComponent("svg"),
    profileInfo: makeNodeComponent("profileInfo"),

    // Metadata about props expected for PlasmicProfileHead
    internalVariantProps: PlasmicProfileHead__VariantProps,
    internalArgProps: PlasmicProfileHead__ArgProps
  }
);

export default PlasmicProfileHead;
/* prettier-ignore-end */
