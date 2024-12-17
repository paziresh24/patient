// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: 6HBcNwr8dz9LuS1Qe36xa5
// Component: df-BFL5jhiFc

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

import projectcss from "./plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import sty from "./PlasmicPaziresh24Chip.module.css"; // plasmic-import: df-BFL5jhiFc/css

import SmileIcon from "../fragment_icons/icons/PlasmicIcon__Smile"; // plasmic-import: J8ozh55UiWsA/icon
import InfoIcon from "../fragment_icons/icons/PlasmicIcon__Info"; // plasmic-import: 7Dhq6fgU-utK/icon

createPlasmicElementProxy;

export type PlasmicPaziresh24Chip__VariantMembers = {
  color: "green" | "blue" | "gray";
  size: "medium" | "small" | "xSmall";
  rounded: "rounded";
};
export type PlasmicPaziresh24Chip__VariantsArgs = {
  color?: SingleChoiceArg<"green" | "blue" | "gray">;
  size?: SingleChoiceArg<"medium" | "small" | "xSmall">;
  rounded?: SingleBooleanChoiceArg<"rounded">;
};
type VariantPropType = keyof PlasmicPaziresh24Chip__VariantsArgs;
export const PlasmicPaziresh24Chip__VariantProps = new Array<VariantPropType>(
  "color",
  "size",
  "rounded"
);

export type PlasmicPaziresh24Chip__ArgsType = {
  content?: string;
  showStartIcon?: boolean;
  showEndIcon?: boolean;
  children?: React.ReactNode;
  slot?: React.ReactNode;
};
type ArgPropType = keyof PlasmicPaziresh24Chip__ArgsType;
export const PlasmicPaziresh24Chip__ArgProps = new Array<ArgPropType>(
  "content",
  "showStartIcon",
  "showEndIcon",
  "children",
  "slot"
);

export type PlasmicPaziresh24Chip__OverridesType = {
  root?: Flex__<"div">;
  freeBox?: Flex__<"div">;
  text?: Flex__<"div">;
};

export interface DefaultPaziresh24ChipProps {
  content?: string;
  showStartIcon?: boolean;
  showEndIcon?: boolean;
  children?: React.ReactNode;
  slot?: React.ReactNode;
  color?: SingleChoiceArg<"green" | "blue" | "gray">;
  size?: SingleChoiceArg<"medium" | "small" | "xSmall">;
  rounded?: SingleBooleanChoiceArg<"rounded">;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicPaziresh24Chip__RenderFunc(props: {
  variants: PlasmicPaziresh24Chip__VariantsArgs;
  args: PlasmicPaziresh24Chip__ArgsType;
  overrides: PlasmicPaziresh24Chip__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          content: "\u0639\u0646\u0648\u0627\u0646",
          showStartIcon: false,
          showEndIcon: false
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
        path: "color",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.color
      },
      {
        path: "size",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.size
      },
      {
        path: "rounded",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.rounded
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
        sty.root,
        {
          [sty.rootcolor_blue]: hasVariant($state, "color", "blue"),
          [sty.rootcolor_gray]: hasVariant($state, "color", "gray"),
          [sty.rootcolor_green]: hasVariant($state, "color", "green"),
          [sty.rootrounded]: hasVariant($state, "rounded", "rounded"),
          [sty.rootsize_medium]: hasVariant($state, "size", "medium"),
          [sty.rootsize_small]: hasVariant($state, "size", "small"),
          [sty.rootsize_xSmall]: hasVariant($state, "size", "xSmall")
        }
      )}
      dir={"rtl"}
    >
      <Stack__
        as={"div"}
        data-plasmic-name={"freeBox"}
        data-plasmic-override={overrides.freeBox}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox, {
          [sty.freeBoxcolor_blue]: hasVariant($state, "color", "blue"),
          [sty.freeBoxcolor_gray]: hasVariant($state, "color", "gray"),
          [sty.freeBoxcolor_green]: hasVariant($state, "color", "green"),
          [sty.freeBoxrounded]: hasVariant($state, "rounded", "rounded"),
          [sty.freeBoxsize_small]: hasVariant($state, "size", "small"),
          [sty.freeBoxsize_xSmall]: hasVariant($state, "size", "xSmall")
        })}
      >
        {(() => {
          try {
            return $props.showStartIcon;
          } catch (e) {
            if (
              e instanceof TypeError ||
              e?.plasmicType === "PlasmicUndefinedDataError"
            ) {
              return true;
            }
            throw e;
          }
        })()
          ? renderPlasmicSlot({
              defaultContents: (
                <SmileIcon
                  className={classNames(projectcss.all, sty.svg__xaRwW)}
                  role={"img"}
                />
              ),

              value: args.children
            })
          : null}
        <div
          data-plasmic-name={"text"}
          data-plasmic-override={overrides.text}
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text,
            {
              [sty.textcolor_blue]: hasVariant($state, "color", "blue"),
              [sty.textcolor_gray]: hasVariant($state, "color", "gray"),
              [sty.textcolor_green]: hasVariant($state, "color", "green"),
              [sty.textsize_medium]: hasVariant($state, "size", "medium"),
              [sty.textsize_small]: hasVariant($state, "size", "small"),
              [sty.textsize_xSmall]: hasVariant($state, "size", "xSmall")
            }
          )}
        >
          <React.Fragment>
            {(() => {
              try {
                return $props.content;
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
        {(() => {
          try {
            return $props.showEndIcon;
          } catch (e) {
            if (
              e instanceof TypeError ||
              e?.plasmicType === "PlasmicUndefinedDataError"
            ) {
              return true;
            }
            throw e;
          }
        })()
          ? renderPlasmicSlot({
              defaultContents: (
                <InfoIcon
                  className={classNames(projectcss.all, sty.svg__vnyqq)}
                  role={"img"}
                />
              ),

              value: args.slot
            })
          : null}
      </Stack__>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "freeBox", "text"],
  freeBox: ["freeBox", "text"],
  text: ["text"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  freeBox: "div";
  text: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicPaziresh24Chip__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicPaziresh24Chip__VariantsArgs;
    args?: PlasmicPaziresh24Chip__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicPaziresh24Chip__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicPaziresh24Chip__ArgsType,
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
          internalArgPropNames: PlasmicPaziresh24Chip__ArgProps,
          internalVariantPropNames: PlasmicPaziresh24Chip__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicPaziresh24Chip__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicPaziresh24Chip";
  } else {
    func.displayName = `PlasmicPaziresh24Chip.${nodeName}`;
  }
  return func;
}

export const PlasmicPaziresh24Chip = Object.assign(
  // Top-level PlasmicPaziresh24Chip renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    freeBox: makeNodeComponent("freeBox"),
    text: makeNodeComponent("text"),

    // Metadata about props expected for PlasmicPaziresh24Chip
    internalVariantProps: PlasmicPaziresh24Chip__VariantProps,
    internalArgProps: PlasmicPaziresh24Chip__ArgProps
  }
);

export default PlasmicPaziresh24Chip;
/* prettier-ignore-end */