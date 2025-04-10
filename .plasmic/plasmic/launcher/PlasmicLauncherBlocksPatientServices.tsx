/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: grxNYctbMek6PL66cujx3u
// Component: ofxhzuPg2IHJ

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
import sty from "./PlasmicLauncherBlocksPatientServices.module.css"; // plasmic-import: ofxhzuPg2IHJ/css

createPlasmicElementProxy;

export type PlasmicLauncherBlocksPatientServices__VariantMembers = {};
export type PlasmicLauncherBlocksPatientServices__VariantsArgs = {};
type VariantPropType = keyof PlasmicLauncherBlocksPatientServices__VariantsArgs;
export const PlasmicLauncherBlocksPatientServices__VariantProps =
  new Array<VariantPropType>();

export type PlasmicLauncherBlocksPatientServices__ArgsType = {};
type ArgPropType = keyof PlasmicLauncherBlocksPatientServices__ArgsType;
export const PlasmicLauncherBlocksPatientServices__ArgProps =
  new Array<ArgPropType>();

export type PlasmicLauncherBlocksPatientServices__OverridesType = {
  root?: Flex__<"div">;
  launcherComponentsTitle?: Flex__<typeof LauncherComponentsTitle>;
  freeBox?: Flex__<"div">;
  launcherComponentsService?: Flex__<typeof LauncherComponentsService>;
};

export interface DefaultLauncherBlocksPatientServicesProps {
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicLauncherBlocksPatientServices__RenderFunc(props: {
  variants: PlasmicLauncherBlocksPatientServices__VariantsArgs;
  args: PlasmicLauncherBlocksPatientServices__ArgsType;
  overrides: PlasmicLauncherBlocksPatientServices__OverridesType;
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
        title={
          "\u0628\u0631\u0627\u06cc \u0628\u06cc\u0645\u0627\u0631\u0627\u0646"
        }
      />

      <div
        data-plasmic-name={"freeBox"}
        data-plasmic-override={overrides.freeBox}
        className={classNames(projectcss.all, sty.freeBox)}
      >
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
              data-plasmic-name={"launcherComponentsService"}
              data-plasmic-override={overrides.launcherComponentsService}
              className={classNames(
                "__wab_instance",
                sty.launcherComponentsService
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
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: [
    "root",
    "launcherComponentsTitle",
    "freeBox",
    "launcherComponentsService"
  ],
  launcherComponentsTitle: ["launcherComponentsTitle"],
  freeBox: ["freeBox", "launcherComponentsService"],
  launcherComponentsService: ["launcherComponentsService"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  launcherComponentsTitle: typeof LauncherComponentsTitle;
  freeBox: "div";
  launcherComponentsService: typeof LauncherComponentsService;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicLauncherBlocksPatientServices__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicLauncherBlocksPatientServices__VariantsArgs;
    args?: PlasmicLauncherBlocksPatientServices__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit< // Specify variants directly as props
    PlasmicLauncherBlocksPatientServices__VariantsArgs,
    ReservedPropsType
  > &
    /* Specify args directly as props*/ Omit<
      PlasmicLauncherBlocksPatientServices__ArgsType,
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
          internalArgPropNames: PlasmicLauncherBlocksPatientServices__ArgProps,
          internalVariantPropNames:
            PlasmicLauncherBlocksPatientServices__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicLauncherBlocksPatientServices__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicLauncherBlocksPatientServices";
  } else {
    func.displayName = `PlasmicLauncherBlocksPatientServices.${nodeName}`;
  }
  return func;
}

export const PlasmicLauncherBlocksPatientServices = Object.assign(
  // Top-level PlasmicLauncherBlocksPatientServices renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    launcherComponentsTitle: makeNodeComponent("launcherComponentsTitle"),
    freeBox: makeNodeComponent("freeBox"),
    launcherComponentsService: makeNodeComponent("launcherComponentsService"),

    // Metadata about props expected for PlasmicLauncherBlocksPatientServices
    internalVariantProps: PlasmicLauncherBlocksPatientServices__VariantProps,
    internalArgProps: PlasmicLauncherBlocksPatientServices__ArgProps
  }
);

export default PlasmicLauncherBlocksPatientServices;
/* prettier-ignore-end */
