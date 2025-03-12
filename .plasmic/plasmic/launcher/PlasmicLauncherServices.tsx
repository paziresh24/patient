// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: grxNYctbMek6PL66cujx3u
// Component: sRZYv0Q2DAH0

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

import LauncherWrapper from "../../LauncherWrapper"; // plasmic-import: 3TTnoIEhqXMk/component
import { Reveal } from "@plasmicpkgs/react-awesome-reveal";
import LauncherComponentsTitle from "../../LauncherComponentsTitle"; // plasmic-import: hyfYYMUJ_ZCV/component
import LauncherComponentsService from "../../LauncherComponentsService"; // plasmic-import: 51AmRlCgKgNN/component
import LauncherComponentsSeparator from "../../LauncherComponentsSeparator"; // plasmic-import: 1FBJsfya0Spv/component

import "@plasmicapp/react-web/lib/plasmic.css";

import projectcss from "./plasmic.module.css"; // plasmic-import: grxNYctbMek6PL66cujx3u/projectcss
import sty from "./PlasmicLauncherServices.module.css"; // plasmic-import: sRZYv0Q2DAH0/css

createPlasmicElementProxy;

export type PlasmicLauncherServices__VariantMembers = {};
export type PlasmicLauncherServices__VariantsArgs = {};
type VariantPropType = keyof PlasmicLauncherServices__VariantsArgs;
export const PlasmicLauncherServices__VariantProps =
  new Array<VariantPropType>();

export type PlasmicLauncherServices__ArgsType = {};
type ArgPropType = keyof PlasmicLauncherServices__ArgsType;
export const PlasmicLauncherServices__ArgProps = new Array<ArgPropType>();

export type PlasmicLauncherServices__OverridesType = {
  root?: Flex__<"div">;
  launcherWrapper?: Flex__<typeof LauncherWrapper>;
};

export interface DefaultLauncherServicesProps {
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicLauncherServices__RenderFunc(props: {
  variants: PlasmicLauncherServices__VariantsArgs;
  args: PlasmicLauncherServices__ArgsType;
  overrides: PlasmicLauncherServices__OverridesType;
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
      <LauncherWrapper
        data-plasmic-name={"launcherWrapper"}
        data-plasmic-override={overrides.launcherWrapper}
        className={classNames("__wab_instance", sty.launcherWrapper)}
      />

      <Reveal
        className={classNames("__wab_instance", sty.reveal__cm1K)}
        triggerOnce={true}
      >
        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__uIxXe)}
        >
          <LauncherComponentsTitle
            className={classNames(
              "__wab_instance",
              sty.launcherComponentsTitle__yVrls
            )}
          />

          <div className={classNames(projectcss.all, sty.freeBox___86G0H)}>
            {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
              (() => {
                try {
                  return [
                    {
                      name: "مراجعین من",
                      icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/services%2Fmy-patients.svg?versionId=",
                      url: "/dashboard/apps/drapp/appointments/"
                    },
                    {
                      name: "ساعت کاری",
                      icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/services%2Fworking-hours.svg?versionId=",
                      url: "/dashboard/apps/drapp/workhours/"
                    },
                    {
                      name: "مرخصی",
                      icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/services%2Fvacation.svg?versionId=",
                      url: "/dashboard/apps/drapp/vacation/"
                    },
                    {
                      name: "تنظیمات",
                      icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/services%2Fbooking-settings.svg?versionId=",
                      url: "/dashboard/apps/drapp/setting/"
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
                    sty.launcherComponentsService__irck1
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
      </Reveal>
      <Reveal
        className={classNames("__wab_instance", sty.reveal___9YwDd)}
        triggerOnce={true}
      >
        <LauncherComponentsSeparator
          className={classNames(
            "__wab_instance",
            sty.launcherComponentsSeparator__dUjm
          )}
        />
      </Reveal>
      <Reveal
        className={classNames("__wab_instance", sty.reveal__q4WNz)}
        triggerOnce={true}
      >
        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__mNsks)}
        >
          <LauncherComponentsTitle
            className={classNames(
              "__wab_instance",
              sty.launcherComponentsTitle__rqL6X
            )}
            title={
              "\u062e\u062f\u0645\u0627\u062a \u067e\u0631\u062f\u0627\u062e\u062a"
            }
          />

          {(() => {
            try {
              return $ctx.Growthbook.features["hamdast::wallet"].hide == true;
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
            <div className={classNames(projectcss.all, sty.freeBox___93XgG)}>
              {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
                (() => {
                  try {
                    return [
                      {
                        name: "تراکنش ها",
                        icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/services%2Ftransactions.svg?versionId=",
                        url: "/dashboard/apps/katibe/bills/"
                      },
                      {
                        name: "فاکتور ها",
                        icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/services%2Finvoices.svg?versionId=",
                        url: "/dashboard/apps/katibe/factors/"
                      },
                      {
                        name: "تنظیمات",
                        icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/services%2Fpayment-setting.svg?versionId=",
                        url: "/dashboard/apps/katibe/setting/"
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
                      sty.launcherComponentsService__pWhtd
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
              return $ctx.Growthbook.features["hamdast::wallet"].hide == false;
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
            <div className={classNames(projectcss.all, sty.freeBox__a49YB)}>
              {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
                (() => {
                  try {
                    return [
                      {
                        name: "تسویه حساب",
                        icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/services%2Ftransactions.svg?versionId=",
                        url: "/dashboard/apps/wallet/payment/"
                      },
                      {
                        name: "تنظیمات",
                        icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/services%2Fpayment-setting.svg?versionId=",
                        url: "/dashboard/apps/wallet/payment/?section=setting"
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
                      sty.launcherComponentsService__swAe
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
      </Reveal>
      <Reveal
        className={classNames("__wab_instance", sty.reveal__ghIlb)}
        triggerOnce={true}
      >
        <LauncherComponentsSeparator
          className={classNames(
            "__wab_instance",
            sty.launcherComponentsSeparator__pOLbH
          )}
        />
      </Reveal>
      <Reveal
        className={classNames("__wab_instance", sty.reveal__l0T55)}
        triggerOnce={true}
      >
        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__ffZ6Q)}
        >
          <LauncherComponentsTitle
            className={classNames(
              "__wab_instance",
              sty.launcherComponentsTitle___2CDui
            )}
            title={"\u0639\u0645\u0644\u06a9\u0631\u062f"}
          />

          <div className={classNames(projectcss.all, sty.freeBox__si3Ts)}>
            {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
              (() => {
                try {
                  return [
                    {
                      name: "رتبه من",
                      icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/services%2Fperformance.svg?versionId=",
                      url: "/dashboard/apps/sanje/my-performance/"
                    },
                    {
                      name: "نظرات",
                      icon: "https://launcher.s3.ir-thr-at1.arvanstorage.ir/services%2Freviews.svg?versionId=",
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
                    sty.launcherComponentsService__xuf5W
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
      </Reveal>
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "launcherWrapper"],
  launcherWrapper: ["launcherWrapper"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  launcherWrapper: typeof LauncherWrapper;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicLauncherServices__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicLauncherServices__VariantsArgs;
    args?: PlasmicLauncherServices__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicLauncherServices__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicLauncherServices__ArgsType,
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
          internalArgPropNames: PlasmicLauncherServices__ArgProps,
          internalVariantPropNames: PlasmicLauncherServices__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicLauncherServices__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicLauncherServices";
  } else {
    func.displayName = `PlasmicLauncherServices.${nodeName}`;
  }
  return func;
}

export const PlasmicLauncherServices = Object.assign(
  // Top-level PlasmicLauncherServices renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    launcherWrapper: makeNodeComponent("launcherWrapper"),

    // Metadata about props expected for PlasmicLauncherServices
    internalVariantProps: PlasmicLauncherServices__VariantProps,
    internalArgProps: PlasmicLauncherServices__ArgProps
  }
);

export default PlasmicLauncherServices;
/* prettier-ignore-end */
