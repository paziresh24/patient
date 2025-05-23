/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: 6MD8zdNphdeG

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
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSearchContentSuggestion.module.css"; // plasmic-import: 6MD8zdNphdeG/css

import Icon32Icon from "./icons/PlasmicIcon__Icon32"; // plasmic-import: Gz4YUaFhVw-g/icon

createPlasmicElementProxy;

export type PlasmicSearchContentSuggestion__VariantMembers = {};
export type PlasmicSearchContentSuggestion__VariantsArgs = {};
type VariantPropType = keyof PlasmicSearchContentSuggestion__VariantsArgs;
export const PlasmicSearchContentSuggestion__VariantProps =
  new Array<VariantPropType>();

export type PlasmicSearchContentSuggestion__ArgsType = {
  onClick?: (value: any) => void;
  topQuerySuggestions?: any;
};
type ArgPropType = keyof PlasmicSearchContentSuggestion__ArgsType;
export const PlasmicSearchContentSuggestion__ArgProps = new Array<ArgPropType>(
  "onClick",
  "topQuerySuggestions"
);

export type PlasmicSearchContentSuggestion__OverridesType = {
  suggest?: Flex__<"div">;
  freeBox?: Flex__<"div">;
  svg?: Flex__<"svg">;
  text?: Flex__<"div">;
};

export interface DefaultSearchContentSuggestionProps {
  onClick?: (value: any) => void;
  topQuerySuggestions?: any;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSearchContentSuggestion__RenderFunc(props: {
  variants: PlasmicSearchContentSuggestion__VariantsArgs;
  args: PlasmicSearchContentSuggestion__ArgsType;
  overrides: PlasmicSearchContentSuggestion__OverridesType;
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
      data-plasmic-name={"suggest"}
      data-plasmic-override={overrides.suggest}
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
        sty.suggest
      )}
    >
      {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
        (() => {
          try {
            return $props.topQuerySuggestions;
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
            data-plasmic-name={"freeBox"}
            data-plasmic-override={overrides.freeBox}
            hasGap={true}
            className={classNames(projectcss.all, sty.freeBox)}
            key={currentIndex}
            onClick={async event => {
              const $steps = {};

              $steps["runOnClick"] = true
                ? (() => {
                    const actionArgs = {
                      eventRef: $props["onClick"],
                      args: [
                        (() => {
                          try {
                            return currentItem;
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
                      return currentItem;
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
        );
      })}
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  suggest: ["suggest", "freeBox", "svg", "text"],
  freeBox: ["freeBox", "svg", "text"],
  svg: ["svg"],
  text: ["text"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  suggest: "div";
  freeBox: "div";
  svg: "svg";
  text: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSearchContentSuggestion__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSearchContentSuggestion__VariantsArgs;
    args?: PlasmicSearchContentSuggestion__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSearchContentSuggestion__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicSearchContentSuggestion__ArgsType,
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
          internalArgPropNames: PlasmicSearchContentSuggestion__ArgProps,
          internalVariantPropNames: PlasmicSearchContentSuggestion__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSearchContentSuggestion__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "suggest") {
    func.displayName = "PlasmicSearchContentSuggestion";
  } else {
    func.displayName = `PlasmicSearchContentSuggestion.${nodeName}`;
  }
  return func;
}

export const PlasmicSearchContentSuggestion = Object.assign(
  // Top-level PlasmicSearchContentSuggestion renders the root element
  makeNodeComponent("suggest"),
  {
    // Helper components rendering sub-elements
    freeBox: makeNodeComponent("freeBox"),
    svg: makeNodeComponent("svg"),
    text: makeNodeComponent("text"),

    // Metadata about props expected for PlasmicSearchContentSuggestion
    internalVariantProps: PlasmicSearchContentSuggestion__VariantProps,
    internalArgProps: PlasmicSearchContentSuggestion__ArgProps
  }
);

export default PlasmicSearchContentSuggestion;
/* prettier-ignore-end */
