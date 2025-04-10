/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: 8NbkXymcLwvMUC2yXeRrWk
// Component: Z7E4nvI5-Dtv

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

import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: 8NbkXymcLwvMUC2yXeRrWk/projectcss
import sty from "./PlasmicBookingAddressesWrapper.module.css"; // plasmic-import: Z7E4nvI5-Dtv/css

import Icon14Icon from "./icons/PlasmicIcon__Icon14"; // plasmic-import: B-8Hh4cFrk03/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicBookingAddressesWrapper__VariantMembers = {};
export type PlasmicBookingAddressesWrapper__VariantsArgs = {};
type VariantPropType = keyof PlasmicBookingAddressesWrapper__VariantsArgs;
export const PlasmicBookingAddressesWrapper__VariantProps =
  new Array<VariantPropType>();

export type PlasmicBookingAddressesWrapper__ArgsType = {
  slug?: string;
  children?: React.ReactNode;
};
type ArgPropType = keyof PlasmicBookingAddressesWrapper__ArgsType;
export const PlasmicBookingAddressesWrapper__ArgProps = new Array<ArgPropType>(
  "slug",
  "children"
);

export type PlasmicBookingAddressesWrapper__OverridesType = {
  root?: Flex__<"div">;
  h2?: Flex__<"h2">;
  button?: Flex__<typeof Button>;
  svg?: Flex__<"svg">;
  text?: Flex__<"div">;
};

export interface DefaultBookingAddressesWrapperProps {
  slug?: string;
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

function PlasmicBookingAddressesWrapper__RenderFunc(props: {
  variants: PlasmicBookingAddressesWrapper__VariantsArgs;
  args: PlasmicBookingAddressesWrapper__ArgsType;
  overrides: PlasmicBookingAddressesWrapper__OverridesType;
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
      <div className={classNames(projectcss.all, sty.freeBox__oTCv2)}>
        <h2
          data-plasmic-name={"h2"}
          data-plasmic-override={overrides.h2}
          className={classNames(
            projectcss.all,
            projectcss.h2,
            projectcss.__wab_text,
            sty.h2
          )}
        >
          {
            "\u0622\u062f\u0631\u0633 \u0648 \u062a\u0644\u0641\u0646 \u062a\u0645\u0627\u0633"
          }
        </h2>
        <Button
          data-plasmic-name={"button"}
          data-plasmic-override={overrides.button}
          children2={
            <div
              data-plasmic-name={"text"}
              data-plasmic-override={overrides.text}
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text
              )}
            >
              {
                "\u06af\u0632\u0627\u0631\u0634 \u062a\u0644\u0641\u0646 \u0648 \u0622\u062f\u0631\u0633 \u0635\u062d\u06cc\u062d"
              }
            </div>
          }
          className={classNames("__wab_instance", sty.button)}
          color={"text"}
          link={(() => {
            try {
              return `https://survey.porsline.ir/s/35ggjRX?slug=${$props.slug}&test_src=profile_eslah`;
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
          showStartIcon={true}
          startIcon={
            <Icon14Icon
              data-plasmic-name={"svg"}
              data-plasmic-override={overrides.svg}
              className={classNames(projectcss.all, sty.svg)}
              role={"img"}
            />
          }
        />
      </div>
      <div className={classNames(projectcss.all, sty.freeBox__mlKb3)}>
        {renderPlasmicSlot({
          defaultContents: null,
          value: args.children
        })}
      </div>
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "h2", "button", "svg", "text"],
  h2: ["h2"],
  button: ["button", "svg", "text"],
  svg: ["svg"],
  text: ["text"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  h2: "h2";
  button: typeof Button;
  svg: "svg";
  text: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicBookingAddressesWrapper__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicBookingAddressesWrapper__VariantsArgs;
    args?: PlasmicBookingAddressesWrapper__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicBookingAddressesWrapper__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicBookingAddressesWrapper__ArgsType,
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
          internalArgPropNames: PlasmicBookingAddressesWrapper__ArgProps,
          internalVariantPropNames: PlasmicBookingAddressesWrapper__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicBookingAddressesWrapper__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicBookingAddressesWrapper";
  } else {
    func.displayName = `PlasmicBookingAddressesWrapper.${nodeName}`;
  }
  return func;
}

export const PlasmicBookingAddressesWrapper = Object.assign(
  // Top-level PlasmicBookingAddressesWrapper renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    h2: makeNodeComponent("h2"),
    button: makeNodeComponent("button"),
    svg: makeNodeComponent("svg"),
    text: makeNodeComponent("text"),

    // Metadata about props expected for PlasmicBookingAddressesWrapper
    internalVariantProps: PlasmicBookingAddressesWrapper__VariantProps,
    internalArgProps: PlasmicBookingAddressesWrapper__ArgProps
  }
);

export default PlasmicBookingAddressesWrapper;
/* prettier-ignore-end */
