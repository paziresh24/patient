/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: 6HBcNwr8dz9LuS1Qe36xa5
// Component: zljt-TXjec48

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
import sty from "./PlasmicPaziresh24Avatar.module.css"; // plasmic-import: zljt-TXjec48/css

import IconIcon from "./icons/PlasmicIcon__Icon"; // plasmic-import: 34E5G5rzRc3Y/icon

createPlasmicElementProxy;

export type PlasmicPaziresh24Avatar__VariantMembers = {
  ring: "blue" | "green" | "slate";
  badge: "check";
};
export type PlasmicPaziresh24Avatar__VariantsArgs = {
  ring?: SingleChoiceArg<"blue" | "green" | "slate">;
  badge?: SingleChoiceArg<"check">;
};
type VariantPropType = keyof PlasmicPaziresh24Avatar__VariantsArgs;
export const PlasmicPaziresh24Avatar__VariantProps = new Array<VariantPropType>(
  "ring",
  "badge"
);

export type PlasmicPaziresh24Avatar__ArgsType = {
  src?: string;
  name?: string;
  alt?: string;
};
type ArgPropType = keyof PlasmicPaziresh24Avatar__ArgsType;
export const PlasmicPaziresh24Avatar__ArgProps = new Array<ArgPropType>(
  "src",
  "name",
  "alt"
);

export type PlasmicPaziresh24Avatar__OverridesType = {
  root?: Flex__<"div">;
  img?: Flex__<typeof PlasmicImg__>;
  freeBox?: Flex__<"div">;
  text?: Flex__<"div">;
  svg?: Flex__<"svg">;
};

export interface DefaultPaziresh24AvatarProps {
  src?: string;
  name?: string;
  alt?: string;
  ring?: SingleChoiceArg<"blue" | "green" | "slate">;
  badge?: SingleChoiceArg<"check">;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicPaziresh24Avatar__RenderFunc(props: {
  variants: PlasmicPaziresh24Avatar__VariantsArgs;
  args: PlasmicPaziresh24Avatar__ArgsType;
  overrides: PlasmicPaziresh24Avatar__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          src: "https://avatar.iran.liara.run/public/43"
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
        path: "ring",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.ring
      },
      {
        path: "badge",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.badge
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
          [sty.rootring_green]: hasVariant($state, "ring", "green"),
          [sty.rootring_slate]: hasVariant($state, "ring", "slate")
        }
      )}
    >
      {(() => {
        try {
          return $props.src;
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
        <PlasmicImg__
          data-plasmic-name={"img"}
          data-plasmic-override={overrides.img}
          alt={(() => {
            try {
              return $props.alt;
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
          className={classNames(sty.img, {
            [sty.imgring_blue]: hasVariant($state, "ring", "blue"),
            [sty.imgring_green]: hasVariant($state, "ring", "green"),
            [sty.imgring_slate]: hasVariant($state, "ring", "slate")
          })}
          displayHeight={"100%"}
          displayMaxHeight={"none"}
          displayMaxWidth={"100%"}
          displayMinHeight={"0"}
          displayMinWidth={"0"}
          displayWidth={"100%"}
          loading={"lazy"}
          src={(() => {
            try {
              return $props.src;
            } catch (e) {
              if (
                e instanceof TypeError ||
                e?.plasmicType === "PlasmicUndefinedDataError"
              ) {
                return "https://avatar.iran.liara.run/public/43";
              }
              throw e;
            }
          })()}
        />
      ) : null}
      {(() => {
        try {
          return !$props.src;
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
          data-plasmic-name={"freeBox"}
          data-plasmic-override={overrides.freeBox}
          className={classNames(projectcss.all, sty.freeBox, {
            [sty.freeBoxring_blue]: hasVariant($state, "ring", "blue"),
            [sty.freeBoxring_green]: hasVariant($state, "ring", "green"),
            [sty.freeBoxring_slate]: hasVariant($state, "ring", "slate")
          })}
          style={(() => {
            try {
              return (() => {
                const randomColor = str => {
                  if (!str) return "#000000";
                  let hash = 0;
                  for (let i = 0; i < str.length; i++) {
                    hash = str.charCodeAt(i) + ((hash << 5) - hash);
                  }
                  let colour = "#";
                  for (let i = 0; i < 3; i++) {
                    const value = (hash >> (i * 8)) & 255;
                    colour += ("00" + value.toString(16)).substr(-2);
                  }
                  return colour;
                };
                return { backgroundColor: randomColor($props.name) };
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
          <div
            data-plasmic-name={"text"}
            data-plasmic-override={overrides.text}
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text
            )}
          >
            <React.Fragment>
              {(() => {
                try {
                  return `${$props.name.split(" ")?.[0]?.[0] ?? ""}${
                    $props.name.split(" ")?.[1]?.[0] ?? ""
                  }`;
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
      ) : null}
      <IconIcon
        data-plasmic-name={"svg"}
        data-plasmic-override={overrides.svg}
        className={classNames(projectcss.all, sty.svg, {
          [sty.svgbadge_check]: hasVariant($state, "badge", "check"),
          [sty.svgring_slate]: hasVariant($state, "ring", "slate")
        })}
        role={"img"}
      />
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "img", "freeBox", "text", "svg"],
  img: ["img"],
  freeBox: ["freeBox", "text"],
  text: ["text"],
  svg: ["svg"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  img: typeof PlasmicImg__;
  freeBox: "div";
  text: "div";
  svg: "svg";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicPaziresh24Avatar__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicPaziresh24Avatar__VariantsArgs;
    args?: PlasmicPaziresh24Avatar__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicPaziresh24Avatar__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicPaziresh24Avatar__ArgsType,
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
          internalArgPropNames: PlasmicPaziresh24Avatar__ArgProps,
          internalVariantPropNames: PlasmicPaziresh24Avatar__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicPaziresh24Avatar__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicPaziresh24Avatar";
  } else {
    func.displayName = `PlasmicPaziresh24Avatar.${nodeName}`;
  }
  return func;
}

export const PlasmicPaziresh24Avatar = Object.assign(
  // Top-level PlasmicPaziresh24Avatar renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    img: makeNodeComponent("img"),
    freeBox: makeNodeComponent("freeBox"),
    text: makeNodeComponent("text"),
    svg: makeNodeComponent("svg"),

    // Metadata about props expected for PlasmicPaziresh24Avatar
    internalVariantProps: PlasmicPaziresh24Avatar__VariantProps,
    internalArgProps: PlasmicPaziresh24Avatar__ArgProps
  }
);

export default PlasmicPaziresh24Avatar;
/* prettier-ignore-end */
