/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: ThD_BqtT1Qyx

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
import sty from "./PlasmicPeopleAlsoSearchForBox.module.css"; // plasmic-import: ThD_BqtT1Qyx/css

createPlasmicElementProxy;

export type PlasmicPeopleAlsoSearchForBox__VariantMembers = {};
export type PlasmicPeopleAlsoSearchForBox__VariantsArgs = {};
type VariantPropType = keyof PlasmicPeopleAlsoSearchForBox__VariantsArgs;
export const PlasmicPeopleAlsoSearchForBox__VariantProps =
  new Array<VariantPropType>();

export type PlasmicPeopleAlsoSearchForBox__ArgsType = {
  querySuggestionResponse?: any;
};
type ArgPropType = keyof PlasmicPeopleAlsoSearchForBox__ArgsType;
export const PlasmicPeopleAlsoSearchForBox__ArgProps = new Array<ArgPropType>(
  "querySuggestionResponse"
);

export type PlasmicPeopleAlsoSearchForBox__OverridesType = {
  root?: Flex__<"div">;
  title?: Flex__<"div">;
  h3?: Flex__<"h3">;
  linkToSearchs?: Flex__<"a"> & Partial<LinkProps>;
};

export interface DefaultPeopleAlsoSearchForBoxProps {
  querySuggestionResponse?: any;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicPeopleAlsoSearchForBox__RenderFunc(props: {
  variants: PlasmicPeopleAlsoSearchForBox__VariantsArgs;
  args: PlasmicPeopleAlsoSearchForBox__ArgsType;
  overrides: PlasmicPeopleAlsoSearchForBox__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          querySuggestionResponse: {
            statusType: "SUCCESS",
            details: "The process was successful",
            entity: {
              topQuerySuggestions: [
                "\u062f\u06a9\u062a\u0631 \u06af\u0648\u0634 \u062d\u0644\u0642 \u0628\u06cc\u0646\u06cc \u06a9\u0648\u062f\u06a9\u0627\u0646",
                "\u0633\u0648\u0646\u0648\u06af\u0631\u0627\u0641\u06cc",
                "\u062f\u06a9\u062a\u0631 \u0632\u06af\u06cc\u0644 \u062a\u0646\u0627\u0633\u0644\u06cc",
                "\u0627\u0631\u062a\u0648\u067e\u062f",
                "\u0645\u062a\u062e\u0635\u0635 \u0632\u0646\u0627\u0646 \u0648 \u0632\u0627\u06cc\u0645\u0627\u0646",
                "\u0686\u0634\u0645 \u067e\u0632\u0634\u06a9\u06cc",
                "\u062f\u06a9\u062a\u0631 \u0646\u0627\u062a\u0648\u0627\u0646\u06cc \u062c\u0646\u0633\u06cc \u0645\u0631\u062f\u0627\u0646",
                "\u062f\u0627\u062e\u0644\u06cc"
              ],
              topQuerySuggestionsIncludeDocCount: [
                {
                  query:
                    "\u062f\u06a9\u062a\u0631 \u06af\u0648\u0634 \u062d\u0644\u0642 \u0628\u06cc\u0646\u06cc \u06a9\u0648\u062f\u06a9\u0627\u0646",
                  docCount: 0
                },
                {
                  query:
                    "\u0633\u0648\u0646\u0648\u06af\u0631\u0627\u0641\u06cc",
                  docCount: 0
                },
                {
                  query:
                    "\u062f\u06a9\u062a\u0631 \u0632\u06af\u06cc\u0644 \u062a\u0646\u0627\u0633\u0644\u06cc",
                  docCount: 0
                },
                { query: "\u0627\u0631\u062a\u0648\u067e\u062f", docCount: 0 },
                {
                  query:
                    "\u0645\u062a\u062e\u0635\u0635 \u0632\u0646\u0627\u0646 \u0648 \u0632\u0627\u06cc\u0645\u0627\u0646",
                  docCount: 0
                },
                {
                  query: "\u0686\u0634\u0645 \u067e\u0632\u0634\u06a9\u06cc",
                  docCount: 0
                },
                {
                  query:
                    "\u062f\u06a9\u062a\u0631 \u0646\u0627\u062a\u0648\u0627\u0646\u06cc \u062c\u0646\u0633\u06cc \u0645\u0631\u062f\u0627\u0646",
                  docCount: 0
                },
                { query: "\u062f\u0627\u062e\u0644\u06cc", docCount: 0 }
              ],
              topQuerySuggestionsIncludeCategory: [
                {
                  query:
                    "\u062f\u06a9\u062a\u0631 \u06af\u0648\u0634 \u062d\u0644\u0642 \u0628\u06cc\u0646\u06cc \u06a9\u0648\u062f\u06a9\u0627\u0646",
                  category:
                    "\u06af\u0648\u0634\u060c \u062d\u0644\u0642 \u0648 \u0628\u06cc\u0646\u06cc",
                  docCount: 0
                },
                {
                  query:
                    "\u062f\u06a9\u062a\u0631 \u06af\u0648\u0634 \u062d\u0644\u0642 \u0628\u06cc\u0646\u06cc \u06a9\u0648\u062f\u06a9\u0627\u0646",
                  category:
                    "\u06a9\u0631\u0648\u0646\u0627 \u0648\u06cc\u0631\u0648\u0633",
                  docCount: 0
                },
                {
                  query:
                    "\u0645\u062a\u062e\u0635\u0635 \u0632\u0646\u0627\u0646 \u0648 \u0632\u0627\u06cc\u0645\u0627\u0646",
                  category:
                    "\u0632\u0646\u0627\u0646\u060c \u0632\u0627\u06cc\u0645\u0627\u0646 \u0648 \u0646\u0627\u0632\u0627\u06cc\u06cc",
                  docCount: 0
                },
                {
                  query: "\u0686\u0634\u0645 \u067e\u0632\u0634\u06a9\u06cc",
                  category: "\u0686\u0634\u0645 \u067e\u0632\u0634\u06a9\u06cc",
                  docCount: 0
                },
                {
                  query:
                    "\u062f\u06a9\u062a\u0631 \u0645\u0627\u0645\u0648\u06af\u0631\u0627\u0641\u06cc",
                  category:
                    "\u0622\u0632\u0645\u0627\u06cc\u0634\u06af\u0627\u0647 \u0648 \u062a\u0635\u0648\u06cc\u0631\u0628\u0631\u062f\u0627\u0631\u06cc",
                  docCount: 0
                },
                {
                  query:
                    "\u062f\u06a9\u062a\u0631 \u0632\u06af\u06cc\u0644 \u062a\u0646\u0627\u0633\u0644\u06cc",
                  category:
                    "\u06a9\u0644\u06cc\u0647 \u0648 \u0645\u062c\u0627\u0631\u06cc \u0627\u062f\u0631\u0627\u0631\u06cc",
                  docCount: 0
                },
                {
                  query: "\u0627\u0631\u062a\u0648\u067e\u062f",
                  category:
                    "\u0627\u0633\u062a\u062e\u0648\u0627\u0646 \u0648 \u0645\u0641\u0627\u0635\u0644",
                  docCount: 0
                },
                {
                  query:
                    "\u062f\u06a9\u062a\u0631 \u0632\u06af\u06cc\u0644 \u062a\u0646\u0627\u0633\u0644\u06cc \u0645\u0631\u062f\u0627\u0646",
                  category:
                    "\u06a9\u0644\u06cc\u0647 \u0648 \u0645\u062c\u0627\u0631\u06cc \u0627\u062f\u0631\u0627\u0631\u06cc",
                  docCount: 0
                }
              ],
              searchTime: 217
            },
            path: "/api/qs/index/slim_clinic_query_su"
          }
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
        plasmic_antd_5_hostless_css.plasmic_tokens,
        sty.root
      )}
    >
      <div
        data-plasmic-name={"title"}
        data-plasmic-override={overrides.title}
        className={classNames(projectcss.all, projectcss.__wab_text, sty.title)}
      >
        <React.Fragment>
          <React.Fragment>{""}</React.Fragment>
          {
            <h3
              data-plasmic-name={"h3"}
              data-plasmic-override={overrides.h3}
              className={classNames(
                projectcss.all,
                projectcss.h3,
                projectcss.__wab_text,
                sty.h3
              )}
            >
              <React.Fragment>
                <span
                  className={"plasmic_default__all plasmic_default__span"}
                  style={{ fontWeight: 700 }}
                >
                  {
                    "\u062c\u0633\u062a\u062c\u0648\u0647\u0627\u06cc \u0628\u0642\u06cc\u0647 \u0631\u0627 \u0627\u0645\u062a\u062d\u0627\u0646 \u06a9\u0646\u06cc\u062f:"
                  }
                </span>
              </React.Fragment>
            </h3>
          }
          <React.Fragment>{""}</React.Fragment>
        </React.Fragment>
      </div>
      {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
        (() => {
          try {
            return $props.querySuggestionResponse.entity.topQuerySuggestions;
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
          <PlasmicLink__
            data-plasmic-name={"linkToSearchs"}
            data-plasmic-override={overrides.linkToSearchs}
            className={classNames(
              projectcss.all,
              projectcss.a,
              projectcss.__wab_text,
              sty.linkToSearchs
            )}
            component={Link}
            href={(() => {
              try {
                return (() => {
                  {
                    const url = new URL(window.location.href);
                    url.searchParams.set("text", currentItem);
                    url.searchParams.set("from-people-also-like", "1");
                    return url.href;
                  }
                })();
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
            key={currentIndex}
            platform={"nextjs"}
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
                    return "Some link text";
                  }
                  throw e;
                }
              })()}
            </React.Fragment>
          </PlasmicLink__>
        );
      })}
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "title", "h3", "linkToSearchs"],
  title: ["title", "h3"],
  h3: ["h3"],
  linkToSearchs: ["linkToSearchs"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  title: "div";
  h3: "h3";
  linkToSearchs: "a";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicPeopleAlsoSearchForBox__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicPeopleAlsoSearchForBox__VariantsArgs;
    args?: PlasmicPeopleAlsoSearchForBox__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicPeopleAlsoSearchForBox__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicPeopleAlsoSearchForBox__ArgsType,
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
          internalArgPropNames: PlasmicPeopleAlsoSearchForBox__ArgProps,
          internalVariantPropNames: PlasmicPeopleAlsoSearchForBox__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicPeopleAlsoSearchForBox__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicPeopleAlsoSearchForBox";
  } else {
    func.displayName = `PlasmicPeopleAlsoSearchForBox.${nodeName}`;
  }
  return func;
}

export const PlasmicPeopleAlsoSearchForBox = Object.assign(
  // Top-level PlasmicPeopleAlsoSearchForBox renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    title: makeNodeComponent("title"),
    h3: makeNodeComponent("h3"),
    linkToSearchs: makeNodeComponent("linkToSearchs"),

    // Metadata about props expected for PlasmicPeopleAlsoSearchForBox
    internalVariantProps: PlasmicPeopleAlsoSearchForBox__VariantProps,
    internalArgProps: PlasmicPeopleAlsoSearchForBox__ArgProps
  }
);

export default PlasmicPeopleAlsoSearchForBox;
/* prettier-ignore-end */
