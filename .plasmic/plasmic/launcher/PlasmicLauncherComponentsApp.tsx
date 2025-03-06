// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: grxNYctbMek6PL66cujx3u
// Component: 25u6_6Q-fQwp

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

import projectcss from "./plasmic.module.css"; // plasmic-import: grxNYctbMek6PL66cujx3u/projectcss
import sty from "./PlasmicLauncherComponentsApp.module.css"; // plasmic-import: 25u6_6Q-fQwp/css

createPlasmicElementProxy;

export type PlasmicLauncherComponentsApp__VariantMembers = {
  soon: "soon";
};
export type PlasmicLauncherComponentsApp__VariantsArgs = {
  soon?: SingleBooleanChoiceArg<"soon">;
};
type VariantPropType = keyof PlasmicLauncherComponentsApp__VariantsArgs;
export const PlasmicLauncherComponentsApp__VariantProps =
  new Array<VariantPropType>("soon");

export type PlasmicLauncherComponentsApp__ArgsType = {
  name?: string;
  link?: string;
  avatar?: string;
  description?: string;
};
type ArgPropType = keyof PlasmicLauncherComponentsApp__ArgsType;
export const PlasmicLauncherComponentsApp__ArgProps = new Array<ArgPropType>(
  "name",
  "link",
  "avatar",
  "description"
);

export type PlasmicLauncherComponentsApp__OverridesType = {
  root?: Flex__<"div">;
  img?: Flex__<typeof PlasmicImg__>;
};

export interface DefaultLauncherComponentsAppProps {
  name?: string;
  link?: string;
  avatar?: string;
  description?: string;
  soon?: SingleBooleanChoiceArg<"soon">;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicLauncherComponentsApp__RenderFunc(props: {
  variants: PlasmicLauncherComponentsApp__VariantsArgs;
  args: PlasmicLauncherComponentsApp__ArgsType;
  overrides: PlasmicLauncherComponentsApp__OverridesType;
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

  const stateSpecs: Parameters<typeof useDollarState>[0] = React.useMemo(
    () => [
      {
        path: "soon",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.soon
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
        sty.root,
        { [sty.rootsoon]: hasVariant($state, "soon", "soon") }
      )}
      onClick={async event => {
        const $steps = {};

        $steps["goToPage"] = true
          ? (() => {
              const actionArgs = {
                destination: (() => {
                  try {
                    return $props.link;
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
      <PlasmicImg__
        data-plasmic-name={"img"}
        data-plasmic-override={overrides.img}
        alt={""}
        className={classNames(sty.img, {
          [sty.imgsoon]: hasVariant($state, "soon", "soon")
        })}
        displayHeight={"46px"}
        displayMaxHeight={"none"}
        displayMaxWidth={"100%"}
        displayMinHeight={"0"}
        displayMinWidth={"0"}
        displayWidth={"46px"}
        height={"46"}
        loading={"lazy"}
        src={(() => {
          try {
            return $props.avatar;
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
        width={"46"}
      />

      <div
        className={classNames(projectcss.all, sty.freeBox___94WL, {
          [sty.freeBoxsoon___94WLwdK6]: hasVariant($state, "soon", "soon")
        })}
      >
        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox___9RkNp, {
            [sty.freeBoxsoon___9RkNPwdK6]: hasVariant($state, "soon", "soon")
          })}
        >
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text__wwO2O,
              { [sty.textsoon__wwO2OwdK6]: hasVariant($state, "soon", "soon") }
            )}
          >
            <React.Fragment>
              {(() => {
                try {
                  return $props.name;
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
          {(hasVariant($state, "soon", "soon") ? true : false) ? (
            <div
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text__rrEuk,
                {
                  [sty.textsoon__rrEukwdK6]: hasVariant($state, "soon", "soon")
                }
              )}
            >
              {"\u0628\u0632\u0648\u062f\u06cc"}
            </div>
          ) : null}
        </Stack__>
        <div
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text__xiGce,
            { [sty.textsoon__xiGcewdK6]: hasVariant($state, "soon", "soon") }
          )}
        >
          <React.Fragment>
            {(() => {
              try {
                return $props.description;
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
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "img"],
  img: ["img"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  img: typeof PlasmicImg__;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicLauncherComponentsApp__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicLauncherComponentsApp__VariantsArgs;
    args?: PlasmicLauncherComponentsApp__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicLauncherComponentsApp__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicLauncherComponentsApp__ArgsType,
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
          internalArgPropNames: PlasmicLauncherComponentsApp__ArgProps,
          internalVariantPropNames: PlasmicLauncherComponentsApp__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicLauncherComponentsApp__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicLauncherComponentsApp";
  } else {
    func.displayName = `PlasmicLauncherComponentsApp.${nodeName}`;
  }
  return func;
}

export const PlasmicLauncherComponentsApp = Object.assign(
  // Top-level PlasmicLauncherComponentsApp renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    img: makeNodeComponent("img"),

    // Metadata about props expected for PlasmicLauncherComponentsApp
    internalVariantProps: PlasmicLauncherComponentsApp__VariantProps,
    internalArgProps: PlasmicLauncherComponentsApp__ArgProps
  }
);

export default PlasmicLauncherComponentsApp;
/* prettier-ignore-end */
