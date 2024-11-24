// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: q0EXGV78MZIZ

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

import { ApiRequest } from "@/common/fragment/components/api-request"; // plasmic-import: rQxw_Usvf1CS/codeComponent

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from "./PlasmicExternalRate.module.css"; // plasmic-import: q0EXGV78MZIZ/css

createPlasmicElementProxy;

export type PlasmicExternalRate__VariantMembers = {};
export type PlasmicExternalRate__VariantsArgs = {};
type VariantPropType = keyof PlasmicExternalRate__VariantsArgs;
export const PlasmicExternalRate__VariantProps = new Array<VariantPropType>();

export type PlasmicExternalRate__ArgsType = {
  doctorSlug?: string;
};
type ArgPropType = keyof PlasmicExternalRate__ArgsType;
export const PlasmicExternalRate__ArgProps = new Array<ArgPropType>(
  "doctorSlug"
);

export type PlasmicExternalRate__OverridesType = {
  root?: Flex__<"div">;
  apiRequest?: Flex__<typeof ApiRequest>;
  img?: Flex__<typeof PlasmicImg__>;
};

export interface DefaultExternalRateProps {
  doctorSlug?: string;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicExternalRate__RenderFunc(props: {
  variants: PlasmicExternalRate__VariantsArgs;
  args: PlasmicExternalRate__ArgsType;
  overrides: PlasmicExternalRate__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          doctorSlug:
            "\u062f\u06a9\u062a\u0631-\u0641\u0631\u0647\u0627\u062f-\u0635\u0628\u0631\u06cc"
        },
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

  const stateSpecs: Parameters<typeof useDollarState>[0] = React.useMemo(
    () => [
      {
        path: "apiRequest.data",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "apiRequest.error",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "apiRequest.loading",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      }
    ],
    [$props, $ctx, $refs]
  );
  const $state = useDollarState(stateSpecs, {
    $props,
    $ctx,
    $queries: {},
    $refs
  });

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
      <div
        className={classNames(
          projectcss.all,
          projectcss.__wab_text,
          sty.text___74CBm
        )}
      >
        {
          "\u0627\u0645\u062a\u06cc\u0627\u0632 \u062f\u06a9\u062a\u0631 \u062f\u0631 \u0633\u0627\u06cc\u062a \u0647\u0627\u06cc \u062f\u06cc\u06af\u0631 : "
        }
      </div>
      <div className={classNames(projectcss.all, sty.freeBox__vTb0S)}>
        <ApiRequest
          data-plasmic-name={"apiRequest"}
          data-plasmic-override={overrides.apiRequest}
          className={classNames("__wab_instance", sty.apiRequest)}
          errorDisplay={
            <div
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text__pl3JC
              )}
            >
              {"Error fetching data"}
            </div>
          }
          loadingDisplay={
            <div
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text__gj9Uu
              )}
            >
              {"Loading..."}
            </div>
          }
          method={"GET"}
          onError={generateStateOnChangeProp($state, ["apiRequest", "error"])}
          onLoading={generateStateOnChangeProp($state, [
            "apiRequest",
            "loading"
          ])}
          onSuccess={generateStateOnChangeProp($state, ["apiRequest", "data"])}
          url={(() => {
            try {
              return `https://apigw.paziresh24.com/ravi/v3/external_rate?where=(doctor_slug,eq,${$props.doctorSlug})`;
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
        >
          <div className={classNames(projectcss.all, sty.freeBox__aKb16)}>
            {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
              (() => {
                try {
                  return $state.apiRequest.data.list[0].rates;
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
                <div
                  className={classNames(projectcss.all, sty.freeBox__klCi4)}
                  key={currentIndex}
                >
                  <div
                    className={classNames(projectcss.all, sty.freeBox__psyxg)}
                  >
                    <PlasmicImg__
                      data-plasmic-name={"img"}
                      data-plasmic-override={overrides.img}
                      alt={""}
                      className={classNames(sty.img)}
                      displayHeight={"auto"}
                      displayMaxHeight={"none"}
                      displayMaxWidth={"100%"}
                      displayMinHeight={"0"}
                      displayMinWidth={"0"}
                      displayWidth={"auto"}
                      loading={"lazy"}
                      src={(() => {
                        try {
                          return currentItem.favicon;
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
                      className={classNames(
                        projectcss.all,
                        projectcss.__wab_text,
                        sty.text__cie6B
                      )}
                      onClick={async event => {
                        const $steps = {};

                        $steps["goToPage"] = true
                          ? (() => {
                              const actionArgs = {
                                destination: (() => {
                                  try {
                                    return currentItem.link;
                                  } catch (e) {
                                    if (
                                      e instanceof TypeError ||
                                      e?.plasmicType ===
                                        "PlasmicUndefinedDataError"
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
                      <React.Fragment>
                        {(() => {
                          try {
                            return currentItem.source;
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
                    <div
                      className={classNames(
                        projectcss.all,
                        projectcss.__wab_text,
                        sty.text___0KxbA
                      )}
                    >
                      <React.Fragment>
                        {(() => {
                          try {
                            return currentItem.rich_snippet.top
                              .detected_extensions.rating;
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
                    <div
                      className={classNames(
                        projectcss.all,
                        projectcss.__wab_text,
                        sty.text___6TE8Y
                      )}
                    >
                      <React.Fragment>
                        {(() => {
                          try {
                            return `(از ${currentItem.rich_snippet.top.detected_extensions.reviews} نظر)`;
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
                  </div>
                </div>
              );
            })}
          </div>
        </ApiRequest>
      </div>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "apiRequest", "img"],
  apiRequest: ["apiRequest", "img"],
  img: ["img"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  apiRequest: typeof ApiRequest;
  img: typeof PlasmicImg__;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicExternalRate__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicExternalRate__VariantsArgs;
    args?: PlasmicExternalRate__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicExternalRate__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicExternalRate__ArgsType,
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
          internalArgPropNames: PlasmicExternalRate__ArgProps,
          internalVariantPropNames: PlasmicExternalRate__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicExternalRate__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicExternalRate";
  } else {
    func.displayName = `PlasmicExternalRate.${nodeName}`;
  }
  return func;
}

export const PlasmicExternalRate = Object.assign(
  // Top-level PlasmicExternalRate renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    apiRequest: makeNodeComponent("apiRequest"),
    img: makeNodeComponent("img"),

    // Metadata about props expected for PlasmicExternalRate
    internalVariantProps: PlasmicExternalRate__VariantProps,
    internalArgProps: PlasmicExternalRate__ArgProps
  }
);

export default PlasmicExternalRate;
/* prettier-ignore-end */
