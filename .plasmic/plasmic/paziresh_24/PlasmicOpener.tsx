// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: iDYgiKJB9Yi7CUB81stQBK
// Component: HdziC2GDkrKd

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

import Button from "../../Button"; // plasmic-import: wRtWBmTexyYF/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: iDYgiKJB9Yi7CUB81stQBK/projectcss
import sty from "./PlasmicOpener.module.css"; // plasmic-import: HdziC2GDkrKd/css

import ChevronUpsvgIcon from "./icons/PlasmicIcon__ChevronUpsvg"; // plasmic-import: EyMvPikEuDUD/icon
import ChevronDownsvgIcon from "./icons/PlasmicIcon__ChevronDownsvg"; // plasmic-import: zCwXncSoUStt/icon

createPlasmicElementProxy;

export type PlasmicOpener__VariantMembers = {};
export type PlasmicOpener__VariantsArgs = {};
type VariantPropType = keyof PlasmicOpener__VariantsArgs;
export const PlasmicOpener__VariantProps = new Array<VariantPropType>();

export type PlasmicOpener__ArgsType = {
  children?: React.ReactNode;
};
type ArgPropType = keyof PlasmicOpener__ArgsType;
export const PlasmicOpener__ArgProps = new Array<ArgPropType>("children");

export type PlasmicOpener__OverridesType = {
  root?: Flex__<"div">;
  button?: Flex__<typeof Button>;
};

export interface DefaultOpenerProps {
  children?: React.ReactNode;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicOpener__RenderFunc(props: {
  variants: PlasmicOpener__VariantsArgs;
  args: PlasmicOpener__ArgsType;
  overrides: PlasmicOpener__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(() => Object.assign({}, props.args), [props.args]);

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
        path: "isOpen",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => false
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
      dir={"rtl"}
    >
      <div
        className={classNames(projectcss.all, sty.freeBox__szq7H)}
        style={(() => {
          try {
            return (() => {
              if (!$state.isOpen) {
                return { "max-height": "200px" };
              }
            })();
          } catch (e) {
            if (
              e instanceof TypeError ||
              e?.plasmicType === "PlasmicUndefinedDataError"
            ) {
              return {};
            }
            throw e;
          }
        })()}
      >
        {renderPlasmicSlot({
          defaultContents: null,
          value: args.children
        })}
        {(() => {
          try {
            return !$state.isOpen;
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
          <div className={classNames(projectcss.all, sty.freeBox___08FzU)} />
        ) : null}
      </div>
      <Button
        data-plasmic-name={"button"}
        data-plasmic-override={overrides.button}
        children2={
          <React.Fragment>
            {(() => {
              try {
                return $state.isOpen ? "مشاهده کمتر" : "مشاهده بیشتر";
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return "\u0645\u0634\u0627\u0647\u062f\u0647 \u0628\u06cc\u0634\u062a\u0631";
                }
                throw e;
              }
            })()}
          </React.Fragment>
        }
        className={classNames("__wab_instance", sty.button)}
        color={"text"}
        endIcon={null}
        onClick={async event => {
          const $steps = {};

          $steps["updateIsOpen"] = true
            ? (() => {
                const actionArgs = {
                  variable: {
                    objRoot: $state,
                    variablePath: ["isOpen"]
                  },
                  operation: 4
                };
                return (({ variable, value, startIndex, deleteCount }) => {
                  if (!variable) {
                    return;
                  }
                  const { objRoot, variablePath } = variable;

                  const oldValue = $stateGet(objRoot, variablePath);
                  $stateSet(objRoot, variablePath, !oldValue);
                  return !oldValue;
                })?.apply(null, [actionArgs]);
              })()
            : undefined;
          if (
            $steps["updateIsOpen"] != null &&
            typeof $steps["updateIsOpen"] === "object" &&
            typeof $steps["updateIsOpen"].then === "function"
          ) {
            $steps["updateIsOpen"] = await $steps["updateIsOpen"];
          }
        }}
        showStartIcon={true}
        size={"compact"}
        startIcon={
          <React.Fragment>
            {(() => {
              try {
                return $state.isOpen;
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
              <ChevronUpsvgIcon
                className={classNames(projectcss.all, sty.svg___6QgYe)}
                role={"img"}
              />
            ) : null}
            {(() => {
              try {
                return !$state.isOpen;
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
              <ChevronDownsvgIcon
                className={classNames(projectcss.all, sty.svg__ekHWz)}
                role={"img"}
              />
            ) : null}
          </React.Fragment>
        }
      />
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "button"],
  button: ["button"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  button: typeof Button;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicOpener__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicOpener__VariantsArgs;
    args?: PlasmicOpener__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicOpener__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicOpener__ArgsType,
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
          internalArgPropNames: PlasmicOpener__ArgProps,
          internalVariantPropNames: PlasmicOpener__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicOpener__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicOpener";
  } else {
    func.displayName = `PlasmicOpener.${nodeName}`;
  }
  return func;
}

export const PlasmicOpener = Object.assign(
  // Top-level PlasmicOpener renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    button: makeNodeComponent("button"),

    // Metadata about props expected for PlasmicOpener
    internalVariantProps: PlasmicOpener__VariantProps,
    internalArgProps: PlasmicOpener__ArgProps
  }
);

export default PlasmicOpener;
/* prettier-ignore-end */
