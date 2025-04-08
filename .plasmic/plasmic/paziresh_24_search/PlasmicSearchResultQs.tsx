/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: 4t5SBkIXsA5h

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

import { ApiRequest } from "@/common/fragment/components/api-request"; // plasmic-import: vW4UBuHCFshJ/codeComponent
import SearchContentSuggestion from "../../SearchContentSuggestion"; // plasmic-import: 6MD8zdNphdeG/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSearchResultQs.module.css"; // plasmic-import: 4t5SBkIXsA5h/css

import Icon14Icon from "./icons/PlasmicIcon__Icon14"; // plasmic-import: eKLBqU_Fr5SV/icon

import { uniqBy as __lib_lodash__uniqBy } from "lodash";

createPlasmicElementProxy;

export type PlasmicSearchResultQs__VariantMembers = {};
export type PlasmicSearchResultQs__VariantsArgs = {};
type VariantPropType = keyof PlasmicSearchResultQs__VariantsArgs;
export const PlasmicSearchResultQs__VariantProps = new Array<VariantPropType>();

export type PlasmicSearchResultQs__ArgsType = {
  terms?: string;
  onClick?: (value: string) => void;
  citySlug?: string;
};
type ArgPropType = keyof PlasmicSearchResultQs__ArgsType;
export const PlasmicSearchResultQs__ArgProps = new Array<ArgPropType>(
  "terms",
  "onClick",
  "citySlug"
);

export type PlasmicSearchResultQs__OverridesType = {
  root?: Flex__<"div">;
  serchiaSuggestion?: Flex__<typeof ApiRequest>;
  freeBox?: Flex__<"div">;
  svg?: Flex__<"svg">;
  searchContentSuggestion?: Flex__<typeof SearchContentSuggestion>;
};

export interface DefaultSearchResultQsProps {
  terms?: string;
  onClick?: (value: string) => void;
  citySlug?: string;
  className?: string;
}

const $$ = {
  lodash: {
    uniqBy: __lib_lodash__uniqBy
  }
};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSearchResultQs__RenderFunc(props: {
  variants: PlasmicSearchResultQs__VariantsArgs;
  args: PlasmicSearchResultQs__ArgsType;
  overrides: PlasmicSearchResultQs__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          terms: ""
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
        path: "serchiaSuggestion.data",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "serchiaSuggestion.error",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "serchiaSuggestion.loading",
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
        plasmic_antd_5_hostless_css.plasmic_tokens,
        sty.root
      )}
    >
      <ApiRequest
        data-plasmic-name={"serchiaSuggestion"}
        data-plasmic-override={overrides.serchiaSuggestion}
        className={classNames("__wab_instance", sty.serchiaSuggestion)}
        config={(() => {
          try {
            return {
              ...$ctx.Fragment.apiConfig,
              headers: { apikey: "gwiuATzYDmeayT7eqmbHG2obv6lGpqJa" }
            };
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
        errorDisplay={null}
        loadingDisplay={
          <div
            data-plasmic-name={"freeBox"}
            data-plasmic-override={overrides.freeBox}
            className={classNames(projectcss.all, sty.freeBox)}
          >
            <Icon14Icon
              data-plasmic-name={"svg"}
              data-plasmic-override={overrides.svg}
              className={classNames(projectcss.all, sty.svg)}
              role={"img"}
            />
          </div>
        }
        method={"GET"}
        onError={async (...eventArgs: any) => {
          generateStateOnChangeProp($state, [
            "serchiaSuggestion",
            "error"
          ]).apply(null, eventArgs);
        }}
        onLoading={async (...eventArgs: any) => {
          generateStateOnChangeProp($state, [
            "serchiaSuggestion",
            "loading"
          ]).apply(null, eventArgs);
        }}
        onSuccess={async (...eventArgs: any) => {
          generateStateOnChangeProp($state, [
            "serchiaSuggestion",
            "data"
          ]).apply(null, eventArgs);
        }}
        url={(() => {
          try {
            return (() => {
              return `https://searchia.ir/api/v2/qs/index/slim_clinic_query_su?query=${
                $props.terms || ""
              }`;
            })();
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
        <SearchContentSuggestion
          data-plasmic-name={"searchContentSuggestion"}
          data-plasmic-override={overrides.searchContentSuggestion}
          className={classNames("__wab_instance", sty.searchContentSuggestion)}
          onClick={async value => {
            const $steps = {};

            $steps["localstorage"] = true
              ? (() => {
                  const actionArgs = {
                    customFunction: async () => {
                      return (() => {
                        const history = $$.lodash.uniqBy(
                          JSON.parse(localStorage.getItem("history") ?? "[]"),
                          "name"
                        );
                        const newHistory = history.filter(
                          historyItem => historyItem.name !== value.name
                        );
                        return localStorage.setItem(
                          "history",
                          JSON.stringify([...newHistory, value])
                        );
                      })();
                    }
                  };
                  return (({ customFunction }) => {
                    return customFunction();
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["localstorage"] != null &&
              typeof $steps["localstorage"] === "object" &&
              typeof $steps["localstorage"].then === "function"
            ) {
              $steps["localstorage"] = await $steps["localstorage"];
            }

            $steps["goToPage"] = true
              ? (() => {
                  const actionArgs = {
                    destination: (() => {
                      try {
                        return `/s/${
                          $props.citySlug ? $props.citySlug + "/" : ""
                        }?text=${value}`;
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

            $steps["runOnClick"] = true
              ? (() => {
                  const actionArgs = {
                    eventRef: $props["onClick"],
                    args: [
                      (() => {
                        try {
                          return value;
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
                    ]
                  };
                  return (({ eventRef, args }) => {
                    return eventRef?.(...(args ?? []));
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["runOnClick"] != null &&
              typeof $steps["runOnClick"] === "object" &&
              typeof $steps["runOnClick"].then === "function"
            ) {
              $steps["runOnClick"] = await $steps["runOnClick"];
            }
          }}
          topQuerySuggestions={(() => {
            try {
              return $state.serchiaSuggestion.data.entity.topQuerySuggestions;
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
      </ApiRequest>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: [
    "root",
    "serchiaSuggestion",
    "freeBox",
    "svg",
    "searchContentSuggestion"
  ],
  serchiaSuggestion: [
    "serchiaSuggestion",
    "freeBox",
    "svg",
    "searchContentSuggestion"
  ],
  freeBox: ["freeBox", "svg"],
  svg: ["svg"],
  searchContentSuggestion: ["searchContentSuggestion"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  serchiaSuggestion: typeof ApiRequest;
  freeBox: "div";
  svg: "svg";
  searchContentSuggestion: typeof SearchContentSuggestion;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSearchResultQs__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSearchResultQs__VariantsArgs;
    args?: PlasmicSearchResultQs__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSearchResultQs__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicSearchResultQs__ArgsType,
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
          internalArgPropNames: PlasmicSearchResultQs__ArgProps,
          internalVariantPropNames: PlasmicSearchResultQs__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSearchResultQs__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicSearchResultQs";
  } else {
    func.displayName = `PlasmicSearchResultQs.${nodeName}`;
  }
  return func;
}

export const PlasmicSearchResultQs = Object.assign(
  // Top-level PlasmicSearchResultQs renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    serchiaSuggestion: makeNodeComponent("serchiaSuggestion"),
    freeBox: makeNodeComponent("freeBox"),
    svg: makeNodeComponent("svg"),
    searchContentSuggestion: makeNodeComponent("searchContentSuggestion"),

    // Metadata about props expected for PlasmicSearchResultQs
    internalVariantProps: PlasmicSearchResultQs__VariantProps,
    internalArgProps: PlasmicSearchResultQs__ArgProps
  }
);

export default PlasmicSearchResultQs;
/* prettier-ignore-end */
