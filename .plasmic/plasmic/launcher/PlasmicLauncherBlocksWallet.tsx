// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: grxNYctbMek6PL66cujx3u
// Component: h-1safqUkN1a

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

import { ApiRequest } from "@/common/fragment/components/api-request"; // plasmic-import: IpxudV5ARc89/codeComponent

import "@plasmicapp/react-web/lib/plasmic.css";

import projectcss from "./plasmic.module.css"; // plasmic-import: grxNYctbMek6PL66cujx3u/projectcss
import sty from "./PlasmicLauncherBlocksWallet.module.css"; // plasmic-import: h-1safqUkN1a/css

import LauncherIconsWalletIcon from "./icons/PlasmicIcon__LauncherIconsWallet"; // plasmic-import: KKbq06nKrEoJ/icon
import LauncherIconsLoaderIcon from "./icons/PlasmicIcon__LauncherIconsLoader"; // plasmic-import: 4lP5I8e4Rz71/icon
import LauncherIconsChevronLeftIcon from "./icons/PlasmicIcon__LauncherIconsChevronLeft"; // plasmic-import: bpf8GR68xA_B/icon

createPlasmicElementProxy;

export type PlasmicLauncherBlocksWallet__VariantMembers = {};
export type PlasmicLauncherBlocksWallet__VariantsArgs = {};
type VariantPropType = keyof PlasmicLauncherBlocksWallet__VariantsArgs;
export const PlasmicLauncherBlocksWallet__VariantProps =
  new Array<VariantPropType>();

export type PlasmicLauncherBlocksWallet__ArgsType = {};
type ArgPropType = keyof PlasmicLauncherBlocksWallet__ArgsType;
export const PlasmicLauncherBlocksWallet__ArgProps = new Array<ArgPropType>();

export type PlasmicLauncherBlocksWallet__OverridesType = {
  root?: Flex__<"div">;
  apiRequest?: Flex__<typeof ApiRequest>;
  span?: Flex__<"span">;
};

export interface DefaultLauncherBlocksWalletProps {
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicLauncherBlocksWallet__RenderFunc(props: {
  variants: PlasmicLauncherBlocksWallet__VariantsArgs;
  args: PlasmicLauncherBlocksWallet__ArgsType;
  overrides: PlasmicLauncherBlocksWallet__OverridesType;
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
        sty.root
      )}
      onClick={async event => {
        const $steps = {};

        $steps["goToHttpsWwwPaziresh24ComDashboardAppsWalletPayment"] = true
          ? (() => {
              const actionArgs = {
                destination:
                  "https://www.paziresh24.com/dashboard/apps/wallet/payment/"
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
          $steps["goToHttpsWwwPaziresh24ComDashboardAppsWalletPayment"] !=
            null &&
          typeof $steps[
            "goToHttpsWwwPaziresh24ComDashboardAppsWalletPayment"
          ] === "object" &&
          typeof $steps["goToHttpsWwwPaziresh24ComDashboardAppsWalletPayment"]
            .then === "function"
        ) {
          $steps["goToHttpsWwwPaziresh24ComDashboardAppsWalletPayment"] =
            await $steps["goToHttpsWwwPaziresh24ComDashboardAppsWalletPayment"];
        }
      }}
    >
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__nrZdj)}
      >
        <LauncherIconsWalletIcon
          className={classNames(projectcss.all, sty.svg__kOroc)}
          role={"img"}
        />

        <div
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text__vx14S
          )}
        >
          {"\u06a9\u06cc\u0641 \u067e\u0648\u0644"}
        </div>
      </Stack__>
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__j27OP)}
      >
        <ApiRequest
          data-plasmic-name={"apiRequest"}
          data-plasmic-override={overrides.apiRequest}
          className={classNames("__wab_instance", sty.apiRequest)}
          errorDisplay={null}
          loadingDisplay={
            <LauncherIconsLoaderIcon
              className={classNames(projectcss.all, sty.svg__fRj6R)}
              role={"img"}
            />
          }
          method={"GET"}
          onError={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, ["apiRequest", "error"]).apply(
              null,
              eventArgs
            );
          }}
          onLoading={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, ["apiRequest", "loading"]).apply(
              null,
              eventArgs
            );
          }}
          onSuccess={async (...eventArgs: any) => {
            generateStateOnChangeProp($state, ["apiRequest", "data"]).apply(
              null,
              eventArgs
            );
          }}
          url={"https://apigw.paziresh24.com/v1/details-payment"}
        >
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text__o6HKn
            )}
          >
            <React.Fragment>
              <React.Fragment>{""}</React.Fragment>
              {
                <span
                  data-plasmic-name={"span"}
                  data-plasmic-override={overrides.span}
                  className={classNames(
                    projectcss.all,
                    projectcss.span,
                    projectcss.__wab_text,
                    projectcss.plasmic_default__inline,
                    sty.span
                  )}
                >
                  <React.Fragment>
                    {(() => {
                      try {
                        return $state.apiRequest.data[1].sum_Unpaid_Amount.toLocaleString(
                          "fa-IR"
                        );
                      } catch (e) {
                        if (
                          e instanceof TypeError ||
                          e?.plasmicType === "PlasmicUndefinedDataError"
                        ) {
                          return "\u06f0";
                        }
                        throw e;
                      }
                    })()}
                  </React.Fragment>
                </span>
              }
              <React.Fragment>
                {" \u062a\u0648\u0645\u0627\u0646"}
              </React.Fragment>
            </React.Fragment>
          </div>
        </ApiRequest>
        <LauncherIconsChevronLeftIcon
          className={classNames(projectcss.all, sty.svg__wJkmF)}
          role={"img"}
        />
      </Stack__>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "apiRequest", "span"],
  apiRequest: ["apiRequest", "span"],
  span: ["span"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  apiRequest: typeof ApiRequest;
  span: "span";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicLauncherBlocksWallet__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicLauncherBlocksWallet__VariantsArgs;
    args?: PlasmicLauncherBlocksWallet__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicLauncherBlocksWallet__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicLauncherBlocksWallet__ArgsType,
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
          internalArgPropNames: PlasmicLauncherBlocksWallet__ArgProps,
          internalVariantPropNames: PlasmicLauncherBlocksWallet__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicLauncherBlocksWallet__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicLauncherBlocksWallet";
  } else {
    func.displayName = `PlasmicLauncherBlocksWallet.${nodeName}`;
  }
  return func;
}

export const PlasmicLauncherBlocksWallet = Object.assign(
  // Top-level PlasmicLauncherBlocksWallet renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    apiRequest: makeNodeComponent("apiRequest"),
    span: makeNodeComponent("span"),

    // Metadata about props expected for PlasmicLauncherBlocksWallet
    internalVariantProps: PlasmicLauncherBlocksWallet__VariantProps,
    internalArgProps: PlasmicLauncherBlocksWallet__ArgProps
  }
);

export default PlasmicLauncherBlocksWallet;
/* prettier-ignore-end */
