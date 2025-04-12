/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: fc2TT88raN5pz7nywm4q4q
// Component: Y2Dk4BvdV4zZ

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

import LineClamp from "../../LineClamp"; // plasmic-import: fa_t7ELXcm5k/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: fc2TT88raN5pz7nywm4q4q/projectcss
import sty from "./PlasmicHamdastCywoc24Widget.module.css"; // plasmic-import: Y2Dk4BvdV4zZ/css

import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon
import BoldHeartIcon from "../fragment_icons/icons/PlasmicIcon__BoldHeart"; // plasmic-import: eZfYsLpdWQA_/icon
import IconIcon from "./icons/PlasmicIcon__Icon"; // plasmic-import: mdCQRjpmt3JR/icon
import Icon2Icon from "./icons/PlasmicIcon__Icon2"; // plasmic-import: Xi4h3RrdBOIg/icon

createPlasmicElementProxy;

export type PlasmicHamdastCywoc24Widget__VariantMembers = {};
export type PlasmicHamdastCywoc24Widget__VariantsArgs = {};
type VariantPropType = keyof PlasmicHamdastCywoc24Widget__VariantsArgs;
export const PlasmicHamdastCywoc24Widget__VariantProps =
  new Array<VariantPropType>();

export type PlasmicHamdastCywoc24Widget__ArgsType = {
  data?: any;
  profileData?: any;
};
type ArgPropType = keyof PlasmicHamdastCywoc24Widget__ArgsType;
export const PlasmicHamdastCywoc24Widget__ArgProps = new Array<ArgPropType>(
  "data",
  "profileData"
);

export type PlasmicHamdastCywoc24Widget__OverridesType = {
  root?: Flex__<"div">;
  span?: Flex__<"span">;
  img?: Flex__<typeof PlasmicImg__>;
};

export interface DefaultHamdastCywoc24WidgetProps {
  data?: any;
  profileData?: any;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicHamdastCywoc24Widget__RenderFunc(props: {
  variants: PlasmicHamdastCywoc24Widget__VariantsArgs;
  args: PlasmicHamdastCywoc24Widget__ArgsType;
  overrides: PlasmicHamdastCywoc24Widget__OverridesType;
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
      <div className={classNames(projectcss.all, sty.freeBox__b5Bt)}>
        <div
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text__n8Z2V
          )}
        >
          <React.Fragment>
            <React.Fragment>
              {
                "\u0627\u0632 \u0627\u06cc\u0646\u0633\u062a\u0627\u06af\u0631\u0627\u0645 "
              }
            </React.Fragment>
            {
              <span
                data-plasmic-name={"span"}
                data-plasmic-override={overrides.span}
                className={classNames(
                  projectcss.all,
                  projectcss.span,
                  projectcss.__wab_text,
                  projectcss.plasmic_default__inline,
                  sty.span
                )}
              >
                <React.Fragment>
                  {(() => {
                    try {
                      return (
                        $props.profileData.information.name +
                        " " +
                        $props.profileData.information.family
                      );
                    } catch (e) {
                      if (
                        e instanceof TypeError ||
                        e?.plasmicType === "PlasmicUndefinedDataError"
                      ) {
                        return "-";
                      }
                      throw e;
                    }
                  })()}
                </React.Fragment>
              </span>
            }
            <React.Fragment>{""}</React.Fragment>
          </React.Fragment>
        </div>
        <div
          className={classNames(projectcss.all, sty.freeBox__mZiXu)}
          onClick={async event => {
            const $steps = {};

            $steps["goToPage"] = true
              ? (() => {
                  const actionArgs = {
                    destination: (() => {
                      try {
                        return $props.data.full_blog_url?.replace(
                          "http://162.223.88.39",
                          "https://www.paziresh24.com/_/cywoc24/posts"
                        );
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
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text__r52Lx
            )}
          >
            {"\u0645\u0634\u0627\u0647\u062f\u0647 \u0647\u0645\u0647"}
          </div>
          <ChevronLeftIcon
            className={classNames(projectcss.all, sty.svg__lHvKo)}
            role={"img"}
          />
        </div>
      </div>
      <div className={classNames(projectcss.all, sty.freeBox__hDmYn)}>
        {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
          (() => {
            try {
              return $props.data.last_post;
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
              as={"div"}
              hasGap={true}
              className={classNames(
                projectcss.all,
                sty.freeBox__kgCa,
                "no-scroll"
              )}
              key={currentIndex}
              onClick={async event => {
                const $steps = {};

                $steps["goToPage"] = true
                  ? (() => {
                      const actionArgs = {
                        destination: (() => {
                          try {
                            return currentItem.full_url?.replace(
                              "http://162.223.88.39",
                              "https://www.paziresh24.com/_/cywoc24/posts"
                            );
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
              <div className={classNames(projectcss.all, sty.freeBox__pTbBa)}>
                <PlasmicImg__
                  data-plasmic-name={"img"}
                  data-plasmic-override={overrides.img}
                  alt={""}
                  className={classNames(sty.img)}
                  displayHeight={"170px"}
                  displayMaxHeight={"none"}
                  displayMaxWidth={"100%"}
                  displayMinHeight={"0"}
                  displayMinWidth={"150px"}
                  displayWidth={"150px"}
                  loading={"lazy"}
                  src={(() => {
                    try {
                      return currentItem.cover_image;
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
                  width={``}
                />

                <div className={classNames(projectcss.all, sty.freeBox__bcYUe)}>
                  <Stack__
                    as={"div"}
                    hasGap={true}
                    className={classNames(projectcss.all, sty.freeBox__eobMb)}
                  >
                    <Stack__
                      as={"div"}
                      hasGap={true}
                      className={classNames(projectcss.all, sty.freeBox__lBen8)}
                    >
                      <BoldHeartIcon
                        className={classNames(projectcss.all, sty.svg__bwbqq)}
                        role={"img"}
                      />

                      <div
                        className={classNames(
                          projectcss.all,
                          projectcss.__wab_text,
                          sty.text__yv4CW
                        )}
                      >
                        <React.Fragment>
                          {(() => {
                            try {
                              return currentItem.like_count?.toLocaleString();
                            } catch (e) {
                              if (
                                e instanceof TypeError ||
                                e?.plasmicType === "PlasmicUndefinedDataError"
                              ) {
                                return "";
                              }
                              throw e;
                            }
                          })()}
                        </React.Fragment>
                      </div>
                    </Stack__>
                    <Stack__
                      as={"div"}
                      hasGap={true}
                      className={classNames(projectcss.all, sty.freeBox__uHyL2)}
                    >
                      <IconIcon
                        className={classNames(projectcss.all, sty.svg__mIZud)}
                        role={"img"}
                      />

                      <div
                        className={classNames(
                          projectcss.all,
                          projectcss.__wab_text,
                          sty.text__i9Xnp
                        )}
                      >
                        <React.Fragment>
                          {(() => {
                            try {
                              return currentItem.view_count?.toLocaleString();
                            } catch (e) {
                              if (
                                e instanceof TypeError ||
                                e?.plasmicType === "PlasmicUndefinedDataError"
                              ) {
                                return "";
                              }
                              throw e;
                            }
                          })()}
                        </React.Fragment>
                      </div>
                    </Stack__>
                  </Stack__>
                </div>
                {(() => {
                  try {
                    return currentItem.full_url?.includes("video");
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
                  <div
                    className={classNames(projectcss.all, sty.freeBox__kYfm2)}
                  >
                    <Icon2Icon
                      className={classNames(projectcss.all, sty.svg__s4WQw)}
                      role={"img"}
                    />
                  </div>
                ) : null}
              </div>
              <Stack__
                as={"div"}
                hasGap={true}
                className={classNames(projectcss.all, sty.freeBox___2L9Jc)}
              >
                <LineClamp
                  className={classNames("__wab_instance", sty.lineClamp__s0VBh)}
                >
                  <div
                    className={classNames(
                      projectcss.all,
                      projectcss.__wab_text,
                      sty.text___376FV
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
                            return "";
                          }
                          throw e;
                        }
                      })()}
                    </React.Fragment>
                  </div>
                </LineClamp>
                <LineClamp
                  className={classNames("__wab_instance", sty.lineClamp__zuIjy)}
                  numberOfLines={2}
                >
                  <div
                    className={classNames(
                      projectcss.all,
                      projectcss.__wab_text,
                      sty.text__d9KEn
                    )}
                  >
                    <React.Fragment>
                      {(() => {
                        try {
                          return currentItem.short_intro?.replace("\n", " ");
                        } catch (e) {
                          if (
                            e instanceof TypeError ||
                            e?.plasmicType === "PlasmicUndefinedDataError"
                          ) {
                            return "";
                          }
                          throw e;
                        }
                      })()}
                    </React.Fragment>
                  </div>
                </LineClamp>
              </Stack__>
            </Stack__>
          );
        })}
      </div>
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "span", "img"],
  span: ["span"],
  img: ["img"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  span: "span";
  img: typeof PlasmicImg__;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicHamdastCywoc24Widget__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicHamdastCywoc24Widget__VariantsArgs;
    args?: PlasmicHamdastCywoc24Widget__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicHamdastCywoc24Widget__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicHamdastCywoc24Widget__ArgsType,
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
          internalArgPropNames: PlasmicHamdastCywoc24Widget__ArgProps,
          internalVariantPropNames: PlasmicHamdastCywoc24Widget__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicHamdastCywoc24Widget__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicHamdastCywoc24Widget";
  } else {
    func.displayName = `PlasmicHamdastCywoc24Widget.${nodeName}`;
  }
  return func;
}

export const PlasmicHamdastCywoc24Widget = Object.assign(
  // Top-level PlasmicHamdastCywoc24Widget renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    span: makeNodeComponent("span"),
    img: makeNodeComponent("img"),

    // Metadata about props expected for PlasmicHamdastCywoc24Widget
    internalVariantProps: PlasmicHamdastCywoc24Widget__VariantProps,
    internalArgProps: PlasmicHamdastCywoc24Widget__ArgProps
  }
);

export default PlasmicHamdastCywoc24Widget;
/* prettier-ignore-end */
