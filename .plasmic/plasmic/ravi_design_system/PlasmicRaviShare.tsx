// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: pkMLinFwM9pzwv5S5KpiAu
// Component: TkOtksyueyFt

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

import Paziresh24Button from "../../Paziresh24Button"; // plasmic-import: YOhw5fIQJQgB/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import sty from "./PlasmicRaviShare.module.css"; // plasmic-import: TkOtksyueyFt/css

import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon
import Icon17Icon from "./icons/PlasmicIcon__Icon17"; // plasmic-import: eY1DBpTFd9o5/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon
import EitaaIcon from "../fragment_icons/icons/PlasmicIcon__Eitaa"; // plasmic-import: qxWwW7vbw7na/icon
import Icon13Icon from "./icons/PlasmicIcon__Icon13"; // plasmic-import: PThHSf9f7Uhv/icon
import Icon16Icon from "./icons/PlasmicIcon__Icon16"; // plasmic-import: SIg-07GJeTGn/icon
import Icon15Icon from "./icons/PlasmicIcon__Icon15"; // plasmic-import: y07O1zQfCwYo/icon

createPlasmicElementProxy;

export type PlasmicRaviShare__VariantMembers = {};
export type PlasmicRaviShare__VariantsArgs = {};
type VariantPropType = keyof PlasmicRaviShare__VariantsArgs;
export const PlasmicRaviShare__VariantProps = new Array<VariantPropType>();

export type PlasmicRaviShare__ArgsType = {
  onClickWhatsup?: () => void;
  onClickTelegram?: () => void;
  onClickEitaa?: () => void;
  onClickTwitter?: () => void;
  onClickCopy?: () => void;
  shareUrl?: string;
};
type ArgPropType = keyof PlasmicRaviShare__ArgsType;
export const PlasmicRaviShare__ArgProps = new Array<ArgPropType>(
  "onClickWhatsup",
  "onClickTelegram",
  "onClickEitaa",
  "onClickTwitter",
  "onClickCopy",
  "shareUrl"
);

export type PlasmicRaviShare__OverridesType = {
  root?: Flex__<"div">;
  eitaa?: Flex__<typeof Paziresh24Button>;
  eitaa2?: Flex__<typeof Paziresh24Button>;
  telegram2?: Flex__<typeof Paziresh24Button>;
  whatsup?: Flex__<typeof Paziresh24Button>;
  paziresh24Button?: Flex__<typeof Paziresh24Button>;
};

export interface DefaultRaviShareProps {
  onClickWhatsup?: () => void;
  onClickTelegram?: () => void;
  onClickEitaa?: () => void;
  onClickTwitter?: () => void;
  onClickCopy?: () => void;
  shareUrl?: string;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicRaviShare__RenderFunc(props: {
  variants: PlasmicRaviShare__VariantsArgs;
  args: PlasmicRaviShare__ArgsType;
  overrides: PlasmicRaviShare__OverridesType;
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
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        plasmic_antd_5_hostless_css.plasmic_tokens,
        sty.root
      )}
    >
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox__hJpfd)}
        dir={"rtl"}
      >
        <div
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text___2YyfJ
          )}
        >
          {
            "\u0627\u06cc\u0646 \u0646\u0638\u0631 \u0631\u0627 \u0628\u0627 \u062f\u06cc\u06af\u0631\u0627\u0646 \u0628\u0647 \u0627\u0634\u062a\u0631\u0627\u06a9 \u0628\u06af\u0630\u0627\u0631\u06cc\u062f."
          }
        </div>
        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__fJyfo)}
        >
          <Paziresh24Button
            data-plasmic-name={"eitaa"}
            data-plasmic-override={overrides.eitaa}
            children2={
              <Stack__
                as={"div"}
                hasGap={true}
                className={classNames(projectcss.all, sty.freeBox__iBb9C)}
              >
                <Icon17Icon
                  className={classNames(projectcss.all, sty.svg___23Crn)}
                  role={"img"}
                />

                <div
                  className={classNames(
                    projectcss.all,
                    projectcss.__wab_text,
                    sty.text__lHxpw
                  )}
                >
                  {"\u062a\u0648\u06cc\u06cc\u062a\u0631"}
                </div>
              </Stack__>
            }
            className={classNames("__wab_instance", sty.eitaa)}
            color={"blue"}
            onClick={async event => {
              const $steps = {};

              $steps["runOnClickTwitter"] = true
                ? (() => {
                    const actionArgs = { eventRef: $props["onClickTwitter"] };
                    return (({ eventRef, args }) => {
                      return eventRef?.(...(args ?? []));
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps["runOnClickTwitter"] != null &&
                typeof $steps["runOnClickTwitter"] === "object" &&
                typeof $steps["runOnClickTwitter"].then === "function"
              ) {
                $steps["runOnClickTwitter"] = await $steps["runOnClickTwitter"];
              }
            }}
          />

          <Paziresh24Button
            data-plasmic-name={"eitaa2"}
            data-plasmic-override={overrides.eitaa2}
            children2={
              <Stack__
                as={"div"}
                hasGap={true}
                className={classNames(projectcss.all, sty.freeBox__blmIp)}
              >
                <EitaaIcon
                  className={classNames(projectcss.all, sty.svg___9OgqJ)}
                  role={"img"}
                />

                <div
                  className={classNames(
                    projectcss.all,
                    projectcss.__wab_text,
                    sty.text__u0Bw8
                  )}
                >
                  {"\u0627\u06cc\u062a\u0627"}
                </div>
              </Stack__>
            }
            className={classNames("__wab_instance", sty.eitaa2)}
            color={"orange"}
            onClick={async event => {
              const $steps = {};

              $steps["runOnClickEitaa"] = true
                ? (() => {
                    const actionArgs = { eventRef: $props["onClickEitaa"] };
                    return (({ eventRef, args }) => {
                      return eventRef?.(...(args ?? []));
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps["runOnClickEitaa"] != null &&
                typeof $steps["runOnClickEitaa"] === "object" &&
                typeof $steps["runOnClickEitaa"].then === "function"
              ) {
                $steps["runOnClickEitaa"] = await $steps["runOnClickEitaa"];
              }
            }}
          />

          <Paziresh24Button
            data-plasmic-name={"telegram2"}
            data-plasmic-override={overrides.telegram2}
            children2={
              <Stack__
                as={"div"}
                hasGap={true}
                className={classNames(projectcss.all, sty.freeBox__gK4J)}
              >
                <Icon13Icon
                  className={classNames(projectcss.all, sty.svg___4IAk)}
                  role={"img"}
                />

                <div
                  className={classNames(
                    projectcss.all,
                    projectcss.__wab_text,
                    sty.text__rnV3G
                  )}
                >
                  {"\u062a\u0644\u06af\u0631\u0627\u0645"}
                </div>
              </Stack__>
            }
            className={classNames("__wab_instance", sty.telegram2)}
            onClick={async event => {
              const $steps = {};

              $steps["runOnClickTelegram"] = true
                ? (() => {
                    const actionArgs = { eventRef: $props["onClickTelegram"] };
                    return (({ eventRef, args }) => {
                      return eventRef?.(...(args ?? []));
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps["runOnClickTelegram"] != null &&
                typeof $steps["runOnClickTelegram"] === "object" &&
                typeof $steps["runOnClickTelegram"].then === "function"
              ) {
                $steps["runOnClickTelegram"] = await $steps[
                  "runOnClickTelegram"
                ];
              }
            }}
          />

          <Paziresh24Button
            data-plasmic-name={"whatsup"}
            data-plasmic-override={overrides.whatsup}
            children2={
              <div className={classNames(projectcss.all, sty.freeBox__kfRmr)}>
                <Icon16Icon
                  className={classNames(projectcss.all, sty.svg__jrS9V)}
                  role={"img"}
                />

                <div
                  className={classNames(
                    projectcss.all,
                    projectcss.__wab_text,
                    sty.text__n22Tb
                  )}
                >
                  {"\u0648\u0627\u062a\u0633\u0627\u067e"}
                </div>
              </div>
            }
            className={classNames("__wab_instance", sty.whatsup)}
            color={"green"}
            onClick={async event => {
              const $steps = {};

              $steps["runOnClickWhatsup"] = true
                ? (() => {
                    const actionArgs = { eventRef: $props["onClickWhatsup"] };
                    return (({ eventRef, args }) => {
                      return eventRef?.(...(args ?? []));
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps["runOnClickWhatsup"] != null &&
                typeof $steps["runOnClickWhatsup"] === "object" &&
                typeof $steps["runOnClickWhatsup"].then === "function"
              ) {
                $steps["runOnClickWhatsup"] = await $steps["runOnClickWhatsup"];
              }
            }}
          />
        </Stack__>
        <div className={classNames(projectcss.all, sty.freeBox___2Nok)} />

        <div className={classNames(projectcss.all, sty.freeBox__xiL3S)}>
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text___7PlKo
            )}
          >
            <React.Fragment>
              {(() => {
                try {
                  return $props.shareUrl;
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
              return true;
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
            <Paziresh24Button
              data-plasmic-name={"paziresh24Button"}
              data-plasmic-override={overrides.paziresh24Button}
              children2={
                <Stack__
                  as={"div"}
                  hasGap={true}
                  className={classNames(projectcss.all, sty.freeBox___48A)}
                >
                  <Icon15Icon
                    className={classNames(projectcss.all, sty.svg__uKugV)}
                    role={"img"}
                  />

                  <div
                    className={classNames(
                      projectcss.all,
                      projectcss.__wab_text,
                      sty.text__scpTh
                    )}
                  >
                    {"\u06a9\u067e\u06cc \u0644\u06cc\u0646\u06a9"}
                  </div>
                </Stack__>
              }
              className={classNames("__wab_instance", sty.paziresh24Button)}
              color={"softBlue"}
              onClick={async event => {
                const $steps = {};

                $steps["runOnClickCopy"] = true
                  ? (() => {
                      const actionArgs = { eventRef: $props["onClickCopy"] };
                      return (({ eventRef, args }) => {
                        return eventRef?.(...(args ?? []));
                      })?.apply(null, [actionArgs]);
                    })()
                  : undefined;
                if (
                  $steps["runOnClickCopy"] != null &&
                  typeof $steps["runOnClickCopy"] === "object" &&
                  typeof $steps["runOnClickCopy"].then === "function"
                ) {
                  $steps["runOnClickCopy"] = await $steps["runOnClickCopy"];
                }
              }}
              outline={true}
            />
          ) : null}
        </div>
      </Stack__>
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "eitaa", "eitaa2", "telegram2", "whatsup", "paziresh24Button"],
  eitaa: ["eitaa"],
  eitaa2: ["eitaa2"],
  telegram2: ["telegram2"],
  whatsup: ["whatsup"],
  paziresh24Button: ["paziresh24Button"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  eitaa: typeof Paziresh24Button;
  eitaa2: typeof Paziresh24Button;
  telegram2: typeof Paziresh24Button;
  whatsup: typeof Paziresh24Button;
  paziresh24Button: typeof Paziresh24Button;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicRaviShare__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicRaviShare__VariantsArgs;
    args?: PlasmicRaviShare__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicRaviShare__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicRaviShare__ArgsType,
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
          internalArgPropNames: PlasmicRaviShare__ArgProps,
          internalVariantPropNames: PlasmicRaviShare__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicRaviShare__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicRaviShare";
  } else {
    func.displayName = `PlasmicRaviShare.${nodeName}`;
  }
  return func;
}

export const PlasmicRaviShare = Object.assign(
  // Top-level PlasmicRaviShare renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    eitaa: makeNodeComponent("eitaa"),
    eitaa2: makeNodeComponent("eitaa2"),
    telegram2: makeNodeComponent("telegram2"),
    whatsup: makeNodeComponent("whatsup"),
    paziresh24Button: makeNodeComponent("paziresh24Button"),

    // Metadata about props expected for PlasmicRaviShare
    internalVariantProps: PlasmicRaviShare__VariantProps,
    internalArgProps: PlasmicRaviShare__ArgProps
  }
);

export default PlasmicRaviShare;
/* prettier-ignore-end */
