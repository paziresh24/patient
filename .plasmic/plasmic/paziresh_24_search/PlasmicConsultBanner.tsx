// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: KmDr0VPQLI2_

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
import Dialog from "../../Dialog"; // plasmic-import: FJiI2-N1is_F/component
import SubstituteDoctor from "../../SubstituteDoctor"; // plasmic-import: 4XueZ64JE9vm/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicConsultBanner.module.css"; // plasmic-import: KmDr0VPQLI2_/css

import Icon37Icon from "./icons/PlasmicIcon__Icon37"; // plasmic-import: BWwuwLrl9Jmd/icon
import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicConsultBanner__VariantMembers = {};
export type PlasmicConsultBanner__VariantsArgs = {};
type VariantPropType = keyof PlasmicConsultBanner__VariantsArgs;
export const PlasmicConsultBanner__VariantProps = new Array<VariantPropType>();

export type PlasmicConsultBanner__ArgsType = {
  categoryValue?: string;
  categoryTitle?: string;
};
type ArgPropType = keyof PlasmicConsultBanner__ArgsType;
export const PlasmicConsultBanner__ArgProps = new Array<ArgPropType>(
  "categoryValue",
  "categoryTitle"
);

export type PlasmicConsultBanner__OverridesType = {
  root?: Flex__<"div">;
  svg?: Flex__<"svg">;
  text?: Flex__<"div">;
  img?: Flex__<typeof PlasmicImg__>;
  button?: Flex__<typeof Button>;
  dialog?: Flex__<typeof Dialog>;
  substituteDoctor?: Flex__<typeof SubstituteDoctor>;
};

export interface DefaultConsultBannerProps {
  categoryValue?: string;
  categoryTitle?: string;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicConsultBanner__RenderFunc(props: {
  variants: PlasmicConsultBanner__VariantsArgs;
  args: PlasmicConsultBanner__ArgsType;
  overrides: PlasmicConsultBanner__OverridesType;
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
        path: "dialog.open",
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
        plasmic_fragment_design_system_css.plasmic_tokens,
        plasmic_antd_5_hostless_css.plasmic_tokens,
        sty.root
      )}
    >
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox___2I0J3)}
        onClick={async event => {
          const $steps = {};

          $steps["updateDialogOpen"] = !!$props.categoryValue
            ? (() => {
                const actionArgs = {
                  variable: {
                    objRoot: $state,
                    variablePath: ["dialog", "open"]
                  },
                  operation: 0
                };
                return (({ variable, value, startIndex, deleteCount }) => {
                  if (!variable) {
                    return;
                  }
                  const { objRoot, variablePath } = variable;

                  $stateSet(objRoot, variablePath, value);
                  return value;
                })?.apply(null, [actionArgs]);
              })()
            : undefined;
          if (
            $steps["updateDialogOpen"] != null &&
            typeof $steps["updateDialogOpen"] === "object" &&
            typeof $steps["updateDialogOpen"].then === "function"
          ) {
            $steps["updateDialogOpen"] = await $steps["updateDialogOpen"];
          }

          $steps["updateDialogOpen2"] = !$props.categoryValue
            ? (() => {
                const actionArgs = { destination: "/s/?turn_type=consult" };
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
            $steps["updateDialogOpen2"] != null &&
            typeof $steps["updateDialogOpen2"] === "object" &&
            typeof $steps["updateDialogOpen2"].then === "function"
          ) {
            $steps["updateDialogOpen2"] = await $steps["updateDialogOpen2"];
          }
        }}
      >
        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__hopQe)}
        >
          <Icon37Icon
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
            <React.Fragment>
              {(() => {
                try {
                  return `همین الان با پزشک متخصص ${
                    !!$props.categoryTitle ? $props.categoryTitle + " " : ""
                  }گفتگو کنید`;
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
        </Stack__>
        {(() => {
          try {
            return !!$props.categoryValue;
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
          <div className={classNames(projectcss.all, sty.freeBox__ooR52)}>
            <PlasmicImg__
              data-plasmic-name={"img"}
              data-plasmic-override={overrides.img}
              alt={""}
              className={classNames(sty.img)}
              displayHeight={"auto"}
              displayMaxHeight={"none"}
              displayMaxWidth={"100%"}
              displayMinHeight={"0"}
              displayMinWidth={"0"}
              displayWidth={"auto"}
              loading={"lazy"}
              src={"https://www.paziresh24.com/cp/img/doctor-group.svg"}
            />

            <Button
              data-plasmic-name={"button"}
              data-plasmic-override={overrides.button}
              children2={
                "\u06af\u0641\u062a\u06af\u0648 \u0628\u0627 \u067e\u0632\u0634\u06a9"
              }
              className={classNames("__wab_instance", sty.button)}
              onClick={async event => {
                const $steps = {};

                $steps["updateDialogOpen"] = true
                  ? (() => {
                      const actionArgs = {
                        variable: {
                          objRoot: $state,
                          variablePath: ["dialog", "open"]
                        },
                        operation: 4
                      };
                      return (({
                        variable,
                        value,
                        startIndex,
                        deleteCount
                      }) => {
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
                  $steps["updateDialogOpen"] != null &&
                  typeof $steps["updateDialogOpen"] === "object" &&
                  typeof $steps["updateDialogOpen"].then === "function"
                ) {
                  $steps["updateDialogOpen"] = await $steps["updateDialogOpen"];
                }
              }}
              showEndIcon={true}
            />
          </div>
        ) : null}
      </Stack__>
      <Dialog
        data-plasmic-name={"dialog"}
        data-plasmic-override={overrides.dialog}
        body={
          <SubstituteDoctor
            data-plasmic-name={"substituteDoctor"}
            data-plasmic-override={overrides.substituteDoctor}
            className={classNames("__wab_instance", sty.substituteDoctor)}
            expertise={(() => {
              try {
                return $props.categoryValue;
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
          />
        }
        className={classNames("__wab_instance", sty.dialog)}
        noTrigger={true}
        onOpenChange={generateStateOnChangeProp($state, ["dialog", "open"])}
        open={generateStateValueProp($state, ["dialog", "open"])}
        title={" "}
      />
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "svg", "text", "img", "button", "dialog", "substituteDoctor"],
  svg: ["svg"],
  text: ["text"],
  img: ["img"],
  button: ["button"],
  dialog: ["dialog", "substituteDoctor"],
  substituteDoctor: ["substituteDoctor"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  svg: "svg";
  text: "div";
  img: typeof PlasmicImg__;
  button: typeof Button;
  dialog: typeof Dialog;
  substituteDoctor: typeof SubstituteDoctor;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicConsultBanner__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicConsultBanner__VariantsArgs;
    args?: PlasmicConsultBanner__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicConsultBanner__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicConsultBanner__ArgsType,
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
          internalArgPropNames: PlasmicConsultBanner__ArgProps,
          internalVariantPropNames: PlasmicConsultBanner__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicConsultBanner__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicConsultBanner";
  } else {
    func.displayName = `PlasmicConsultBanner.${nodeName}`;
  }
  return func;
}

export const PlasmicConsultBanner = Object.assign(
  // Top-level PlasmicConsultBanner renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    svg: makeNodeComponent("svg"),
    text: makeNodeComponent("text"),
    img: makeNodeComponent("img"),
    button: makeNodeComponent("button"),
    dialog: makeNodeComponent("dialog"),
    substituteDoctor: makeNodeComponent("substituteDoctor"),

    // Metadata about props expected for PlasmicConsultBanner
    internalVariantProps: PlasmicConsultBanner__VariantProps,
    internalArgProps: PlasmicConsultBanner__ArgProps
  }
);

export default PlasmicConsultBanner;
/* prettier-ignore-end */
