// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: grxNYctbMek6PL66cujx3u
// Component: SALc6_vQPXlG

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

import LauncherComponentsTitle from "../../LauncherComponentsTitle"; // plasmic-import: hyfYYMUJ_ZCV/component
import LauncherComponentsService from "../../LauncherComponentsService"; // plasmic-import: 51AmRlCgKgNN/component

import "@plasmicapp/react-web/lib/plasmic.css";

import projectcss from "./plasmic.module.css"; // plasmic-import: grxNYctbMek6PL66cujx3u/projectcss
import sty from "./PlasmicLauncherBlocksShortcuts.module.css"; // plasmic-import: SALc6_vQPXlG/css

createPlasmicElementProxy;

export type PlasmicLauncherBlocksShortcuts__VariantMembers = {};
export type PlasmicLauncherBlocksShortcuts__VariantsArgs = {};
type VariantPropType = keyof PlasmicLauncherBlocksShortcuts__VariantsArgs;
export const PlasmicLauncherBlocksShortcuts__VariantProps =
  new Array<VariantPropType>();

export type PlasmicLauncherBlocksShortcuts__ArgsType = {};
type ArgPropType = keyof PlasmicLauncherBlocksShortcuts__ArgsType;
export const PlasmicLauncherBlocksShortcuts__ArgProps =
  new Array<ArgPropType>();

export type PlasmicLauncherBlocksShortcuts__OverridesType = {
  root?: Flex__<"div">;
  launcherComponentsTitle?: Flex__<typeof LauncherComponentsTitle>;
};

export interface DefaultLauncherBlocksShortcutsProps {
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicLauncherBlocksShortcuts__RenderFunc(props: {
  variants: PlasmicLauncherBlocksShortcuts__VariantsArgs;
  args: PlasmicLauncherBlocksShortcuts__ArgsType;
  overrides: PlasmicLauncherBlocksShortcuts__OverridesType;
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
        sty.root
      )}
    >
      <LauncherComponentsTitle
        data-plasmic-name={"launcherComponentsTitle"}
        data-plasmic-override={overrides.launcherComponentsTitle}
        className={classNames("__wab_instance", sty.launcherComponentsTitle)}
        moreLink={"/_/services"}
        moreTitle={(() => {
          try {
            return $ctx.auth.info?.provider?.job_title === "doctor"
              ? "همه خدمات"
              : null;
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
        title={
          "\u062e\u062f\u0645\u0627\u062a \u067e\u0631\u06a9\u0627\u0631\u0628\u0631\u062f"
        }
      />

      {(() => {
        try {
          return $ctx.auth.info?.provider?.job_title === "doctor";
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
        <div className={classNames(projectcss.all, sty.freeBox___9RuOc)}>
          {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
            (() => {
              try {
                return [
                  {
                    name: "مراجعین من",
                    icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/shortcuts%2Fmy-patients.svg?versionId=",
                    url: "/dashboard/apps/drapp/appointments/"
                  },
                  {
                    name: "ساعت کاری",
                    icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/shortcuts%2Fworking-hours.svg?versionId=",
                    url: "/dashboard/apps/drapp/workhours/"
                  },
                  {
                    name: "مرخصی",
                    icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/shortcuts%2Fvacation.svg?versionId=",
                    url: "/dashboard/apps/drapp/vacation/"
                  },
                  {
                    name: "نظرات",
                    icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/shortcuts%2Freviews.svg?versionId=",
                    url: "/dashboard/apps/ravi/my_prifile_feedbacks/"
                  }
                ];
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
              <LauncherComponentsService
                className={classNames(
                  "__wab_instance",
                  sty.launcherComponentsService__cIyhr
                )}
                icon={(() => {
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
                key={currentIndex}
                link={(() => {
                  try {
                    return currentItem.url;
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
                name={(() => {
                  try {
                    return currentItem.name;
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
            );
          })}
        </div>
      ) : null}
      {(() => {
        try {
          return $ctx.auth.info?.provider?.job_title !== "doctor";
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
        <div className={classNames(projectcss.all, sty.freeBox__pfGz1)}>
          {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
            (() => {
              try {
                return [
                  {
                    name: "نوبت های من",
                    icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/shortcuts%2Fpatient%2Fmy-appointments.svg?versionId=",
                    url: "/dashboard/appointments/"
                  },
                  {
                    name: "دوستان من",
                    icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/shortcuts%2Fpatient%2Fmy-friends.svg?versionId=",
                    url: "/dashboard/subuser/"
                  },
                  {
                    name: "پزشکان من",
                    icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/shortcuts%2Fpatient%2Fmy-doctors.svg?versionId=",
                    url: "/dashboard/bookmarks/"
                  },
                  {
                    name: "نظرات من",
                    icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/shortcuts%2Fpatient%2Fmy-reviews.svg?versionId=",
                    url: "/dashboard/apps/ravi/my_feedbacks/"
                  }
                ];
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
              <LauncherComponentsService
                className={classNames(
                  "__wab_instance",
                  sty.launcherComponentsService__vrQg
                )}
                icon={(() => {
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
                key={currentIndex}
                link={(() => {
                  try {
                    return currentItem.url;
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
                name={(() => {
                  try {
                    return currentItem.name;
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
            );
          })}
        </div>
      ) : null}
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "launcherComponentsTitle"],
  launcherComponentsTitle: ["launcherComponentsTitle"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  launcherComponentsTitle: typeof LauncherComponentsTitle;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicLauncherBlocksShortcuts__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicLauncherBlocksShortcuts__VariantsArgs;
    args?: PlasmicLauncherBlocksShortcuts__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicLauncherBlocksShortcuts__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicLauncherBlocksShortcuts__ArgsType,
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
          internalArgPropNames: PlasmicLauncherBlocksShortcuts__ArgProps,
          internalVariantPropNames: PlasmicLauncherBlocksShortcuts__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicLauncherBlocksShortcuts__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicLauncherBlocksShortcuts";
  } else {
    func.displayName = `PlasmicLauncherBlocksShortcuts.${nodeName}`;
  }
  return func;
}

export const PlasmicLauncherBlocksShortcuts = Object.assign(
  // Top-level PlasmicLauncherBlocksShortcuts renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    launcherComponentsTitle: makeNodeComponent("launcherComponentsTitle"),

    // Metadata about props expected for PlasmicLauncherBlocksShortcuts
    internalVariantProps: PlasmicLauncherBlocksShortcuts__VariantProps,
    internalArgProps: PlasmicLauncherBlocksShortcuts__ArgProps
  }
);

export default PlasmicLauncherBlocksShortcuts;
/* prettier-ignore-end */
