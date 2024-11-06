// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: 7r312uiqyadpVPdnRoAggk
// Component: rFaRrp2J8jq8

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

import Avatar from "../../Avatar"; // plasmic-import: 3i84rYjQRrs4/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: 7r312uiqyadpVPdnRoAggk/projectcss
import sty from "./PlasmicProfileInfo.module.css"; // plasmic-import: rFaRrp2J8jq8/css

import Icon5Icon from "./icons/PlasmicIcon__Icon5"; // plasmic-import: 1QRRV71mMOrH/icon

createPlasmicElementProxy;

export type PlasmicProfileInfo__VariantMembers = {};
export type PlasmicProfileInfo__VariantsArgs = {};
type VariantPropType = keyof PlasmicProfileInfo__VariantsArgs;
export const PlasmicProfileInfo__VariantProps = new Array<VariantPropType>();

export type PlasmicProfileInfo__ArgsType = {
  displayName?: string;
  title?: string;
  subTitle?: string;
  imageUrl?: string;
};
type ArgPropType = keyof PlasmicProfileInfo__ArgsType;
export const PlasmicProfileInfo__ArgProps = new Array<ArgPropType>(
  "displayName",
  "title",
  "subTitle",
  "imageUrl"
);

export type PlasmicProfileInfo__OverridesType = {
  root?: Flex__<"div">;
  avatar?: Flex__<typeof Avatar>;
  h1?: Flex__<"h1">;
  svg?: Flex__<"svg">;
};

export interface DefaultProfileInfoProps {
  displayName?: string;
  title?: string;
  subTitle?: string;
  imageUrl?: string;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicProfileInfo__RenderFunc(props: {
  variants: PlasmicProfileInfo__VariantsArgs;
  args: PlasmicProfileInfo__ArgsType;
  overrides: PlasmicProfileInfo__OverridesType;
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
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__iaDop)}
      >
        <Avatar
          data-plasmic-name={"avatar"}
          data-plasmic-override={overrides.avatar}
          alt={(() => {
            try {
              return `دکتر ${$props.displayName}`;
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
          className={classNames("__wab_instance", sty.avatar)}
          name={(() => {
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
          ring={"slate"}
          src={(() => {
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
        />

        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__v8PvT)}
        >
          {(() => {
            try {
              return !!$props.displayName;
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
            <h1
              data-plasmic-name={"h1"}
              data-plasmic-override={overrides.h1}
              className={classNames(
                projectcss.all,
                projectcss.h1,
                projectcss.__wab_text,
                sty.h1
              )}
            >
              <React.Fragment>
                {(() => {
                  try {
                    return $props.displayName;
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "PlasmicUndefinedDataError"
                    ) {
                      return "\u0633\u0648\u062f\u0647 \u0647\u0648\u0634\u0645\u0646\u062f\u06cc";
                    }
                    throw e;
                  }
                })()}
              </React.Fragment>
            </h1>
          ) : null}
          {(() => {
            try {
              return !!$props.title;
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
              className={classNames(projectcss.all, sty.freeBox__n2ZAh)}
            >
              <Icon5Icon
                data-plasmic-name={"svg"}
                data-plasmic-override={overrides.svg}
                className={classNames(projectcss.all, sty.svg)}
                role={"img"}
              />

              <span
                className={classNames(
                  projectcss.all,
                  projectcss.span,
                  projectcss.__wab_text,
                  sty.span__yS8Mj
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
                        return "12 \u0633\u0627\u0644 \u062a\u062c\u0631\u0628\u0647";
                      }
                      throw e;
                    }
                  })()}
                </React.Fragment>
              </span>
            </Stack__>
          ) : null}
          {(() => {
            try {
              return !!$props.subTitle;
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
            <span
              className={classNames(
                projectcss.all,
                projectcss.span,
                projectcss.__wab_text,
                sty.span__rpctd
              )}
            >
              <React.Fragment>
                {(() => {
                  try {
                    return $props.subTitle;
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "PlasmicUndefinedDataError"
                    ) {
                      return "\u0634\u0645\u0627\u0631\u0647 \u0646\u0638\u0627\u0645 \u067e\u0632\u0634\u06a9\u06cc: 128747.";
                    }
                    throw e;
                  }
                })()}
              </React.Fragment>
            </span>
          ) : null}
        </Stack__>
      </Stack__>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "avatar", "h1", "svg"],
  avatar: ["avatar"],
  h1: ["h1"],
  svg: ["svg"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  avatar: typeof Avatar;
  h1: "h1";
  svg: "svg";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicProfileInfo__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicProfileInfo__VariantsArgs;
    args?: PlasmicProfileInfo__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicProfileInfo__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicProfileInfo__ArgsType,
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
          internalArgPropNames: PlasmicProfileInfo__ArgProps,
          internalVariantPropNames: PlasmicProfileInfo__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicProfileInfo__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicProfileInfo";
  } else {
    func.displayName = `PlasmicProfileInfo.${nodeName}`;
  }
  return func;
}

export const PlasmicProfileInfo = Object.assign(
  // Top-level PlasmicProfileInfo renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    avatar: makeNodeComponent("avatar"),
    h1: makeNodeComponent("h1"),
    svg: makeNodeComponent("svg"),

    // Metadata about props expected for PlasmicProfileInfo
    internalVariantProps: PlasmicProfileInfo__VariantProps,
    internalArgProps: PlasmicProfileInfo__ArgProps
  }
);

export default PlasmicProfileInfo;
/* prettier-ignore-end */
