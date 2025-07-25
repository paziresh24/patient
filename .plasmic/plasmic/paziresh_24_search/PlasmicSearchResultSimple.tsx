/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: dQKny9PQUcJM

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

import SearchContentItem from "../../SearchContentItem"; // plasmic-import: NqExHRSculUA/component
import SearchRequest from "../../SearchRequest"; // plasmic-import: 35vwUOYdUX87/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSearchResultSimple.module.css"; // plasmic-import: dQKny9PQUcJM/css

import Icon32Icon from "./icons/PlasmicIcon__Icon32"; // plasmic-import: Gz4YUaFhVw-g/icon

import { uniq as __lib_lodash__uniq } from "lodash";

createPlasmicElementProxy;

export type PlasmicSearchResultSimple__VariantMembers = {};
export type PlasmicSearchResultSimple__VariantsArgs = {};
type VariantPropType = keyof PlasmicSearchResultSimple__VariantsArgs;
export const PlasmicSearchResultSimple__VariantProps =
  new Array<VariantPropType>();

export type PlasmicSearchResultSimple__ArgsType = {
  inputValue?: string;
  cityId?: string;
};
type ArgPropType = keyof PlasmicSearchResultSimple__ArgsType;
export const PlasmicSearchResultSimple__ArgProps = new Array<ArgPropType>(
  "inputValue",
  "cityId"
);

export type PlasmicSearchResultSimple__OverridesType = {
  root?: Flex__<typeof SearchContentItem>;
  freeBox?: Flex__<"div">;
  searchRequest?: Flex__<typeof SearchRequest>;
  link?: Flex__<"a"> & Partial<LinkProps>;
  svg?: Flex__<"svg">;
  text?: Flex__<"div">;
};

export interface DefaultSearchResultSimpleProps {
  inputValue?: string;
  cityId?: string;
  className?: string;
}

const $$ = {
  lodash: {
    uniq: __lib_lodash__uniq
  }
};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSearchResultSimple__RenderFunc(props: {
  variants: PlasmicSearchResultSimple__VariantsArgs;
  args: PlasmicSearchResultSimple__ArgsType;
  overrides: PlasmicSearchResultSimple__OverridesType;
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
    <SearchContentItem
      data-plasmic-name={"root"}
      data-plasmic-override={overrides.root}
      data-plasmic-root={true}
      data-plasmic-for-node={forNode}
      className={classNames("__wab_instance", sty.root)}
      iconType={"category-icon"}
      title={"\u0646\u062a\u0627\u06cc\u062c"}
    >
      <div
        data-plasmic-name={"freeBox"}
        data-plasmic-override={overrides.freeBox}
        className={classNames(
          projectcss.all,
          sty.freeBox,
          "suggestion_content"
        )}
      >
        <SearchRequest
          data-plasmic-name={"searchRequest"}
          data-plasmic-override={overrides.searchRequest}
          className={classNames("__wab_instance", sty.searchRequest)}
          searchOptionalFilters={(() => {
            try {
              return {
                ...($props.cityId != -1 ? { city_id: [$props.cityId] } : {})
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
          searchQuery={(() => {
            try {
              return $props.inputValue;
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
          suggestionExecutionSource={true}
        />

        {(() => {
          try {
            return !!$props.inputValue;
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
            as={PlasmicLink__}
            data-plasmic-name={"link"}
            data-plasmic-override={overrides.link}
            hasGap={true}
            className={classNames(projectcss.all, projectcss.a, sty.link)}
            component={Link}
            href={(() => {
              try {
                return (() => {
                  const semanticSearchParam =
                    $ctx.Growthbook &&
                    $ctx.Growthbook?.isReady &&
                    $ctx.Growthbook?.features?.["search-semantic-search"]
                      ? "true"
                      : "false";
                  return `/s/?text=${$props.inputValue}&ref=search_suggestion_box&semantic_search=${semanticSearchParam}`;
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
            onClick={async event => {
              const $steps = {};

              $steps["saveToHistory"] = true
                ? (() => {
                    const actionArgs = {
                      customFunction: async () => {
                        return (() => {
                          const history = $$.lodash.uniq(
                            JSON.parse(localStorage.getItem("history") ?? "[]")
                          );
                          const newHistory = history.filter(
                            historyItem => historyItem !== $props.inputValue
                          );
                          return localStorage.setItem(
                            "history",
                            JSON.stringify([...newHistory, $props.inputValue])
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
                $steps["saveToHistory"] != null &&
                typeof $steps["saveToHistory"] === "object" &&
                typeof $steps["saveToHistory"].then === "function"
              ) {
                $steps["saveToHistory"] = await $steps["saveToHistory"];
              }
            }}
            platform={"nextjs"}
          >
            <Icon32Icon
              data-plasmic-name={"svg"}
              data-plasmic-override={overrides.svg}
              className={classNames(projectcss.all, sty.svg)}
              role={"img"}
            />

            <div
              data-plasmic-name={"text"}
              data-plasmic-override={overrides.text}
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text
              )}
            >
              <div
                className={projectcss.__wab_expr_html_text}
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    try {
                      return `<em> ${$props.inputValue} </em>`;
                    } catch (e) {
                      if (
                        e instanceof TypeError ||
                        e?.plasmicType === "PlasmicUndefinedDataError"
                      ) {
                        return "";
                      }
                      throw e;
                    }
                  })()
                }}
              />
            </div>
          </Stack__>
        ) : null}
      </div>
    </SearchContentItem>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "freeBox", "searchRequest", "link", "svg", "text"],
  freeBox: ["freeBox", "searchRequest", "link", "svg", "text"],
  searchRequest: ["searchRequest"],
  link: ["link", "svg", "text"],
  svg: ["svg"],
  text: ["text"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: typeof SearchContentItem;
  freeBox: "div";
  searchRequest: typeof SearchRequest;
  link: "a";
  svg: "svg";
  text: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSearchResultSimple__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSearchResultSimple__VariantsArgs;
    args?: PlasmicSearchResultSimple__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSearchResultSimple__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    // Specify args directly as props
    Omit<PlasmicSearchResultSimple__ArgsType, ReservedPropsType> &
    // Specify overrides for each element directly as props
    Omit<
      NodeOverridesType<T>,
      ReservedPropsType | VariantPropType | ArgPropType
    > &
    // Specify props for the root element
    Omit<
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
          internalArgPropNames: PlasmicSearchResultSimple__ArgProps,
          internalVariantPropNames: PlasmicSearchResultSimple__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSearchResultSimple__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicSearchResultSimple";
  } else {
    func.displayName = `PlasmicSearchResultSimple.${nodeName}`;
  }
  return func;
}

export const PlasmicSearchResultSimple = Object.assign(
  // Top-level PlasmicSearchResultSimple renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    freeBox: makeNodeComponent("freeBox"),
    searchRequest: makeNodeComponent("searchRequest"),
    link: makeNodeComponent("link"),
    svg: makeNodeComponent("svg"),
    text: makeNodeComponent("text"),

    // Metadata about props expected for PlasmicSearchResultSimple
    internalVariantProps: PlasmicSearchResultSimple__VariantProps,
    internalArgProps: PlasmicSearchResultSimple__ArgProps
  }
);

export default PlasmicSearchResultSimple;
/* prettier-ignore-end */
