// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: pkMLinFwM9pzwv5S5KpiAu
// Component: WPpw5PhLSljG

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

import { Popover } from "@plasmicpkgs/radix-ui";
import Paziresh24Dialog from "../../Paziresh24Dialog"; // plasmic-import: ZGdhyEBPJSmH/component
import Paziresh24Button from "../../Paziresh24Button"; // plasmic-import: YOhw5fIQJQgB/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import sty from "./PlasmicRaviReviewOptions.module.css"; // plasmic-import: WPpw5PhLSljG/css

import MenuIcon from "../fragment_icons/icons/PlasmicIcon__Menu"; // plasmic-import: dmfb3Ga2IoVt/icon
import InfoIcon from "../fragment_icons/icons/PlasmicIcon__Info"; // plasmic-import: 7Dhq6fgU-utK/icon
import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicRaviReviewOptions__VariantMembers = {};
export type PlasmicRaviReviewOptions__VariantsArgs = {};
type VariantPropType = keyof PlasmicRaviReviewOptions__VariantsArgs;
export const PlasmicRaviReviewOptions__VariantProps =
  new Array<VariantPropType>();

export type PlasmicRaviReviewOptions__ArgsType = {
  onClickSendReport?: (value: string) => void;
  isLoading?: boolean;
};
type ArgPropType = keyof PlasmicRaviReviewOptions__ArgsType;
export const PlasmicRaviReviewOptions__ArgProps = new Array<ArgPropType>(
  "onClickSendReport",
  "isLoading"
);

export type PlasmicRaviReviewOptions__OverridesType = {
  root?: Flex__<"div">;
  popoverCore?: Flex__<typeof Popover>;
  text?: Flex__<"div">;
  reportDialog?: Flex__<typeof Paziresh24Dialog>;
  textarea?: Flex__<"textarea">;
  paziresh24Button?: Flex__<typeof Paziresh24Button>;
};

export interface DefaultRaviReviewOptionsProps {
  onClickSendReport?: (value: string) => void;
  isLoading?: boolean;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicRaviReviewOptions__RenderFunc(props: {
  variants: PlasmicRaviReviewOptions__VariantsArgs;
  args: PlasmicRaviReviewOptions__ArgsType;
  overrides: PlasmicRaviReviewOptions__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          isLoading: false
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
        path: "popoverCore.open",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "reportDialog.open",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "textarea.value",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => ``
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
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        sty.root
      )}
    >
      <Popover
        data-plasmic-name={"popoverCore"}
        data-plasmic-override={overrides.popoverCore}
        className={classNames("__wab_instance", sty.popoverCore)}
        onOpenChange={async (...eventArgs: any) => {
          generateStateOnChangeProp($state, ["popoverCore", "open"]).apply(
            null,
            eventArgs
          );

          if (eventArgs.length > 1 && eventArgs[1]) {
            return;
          }
        }}
        open={generateStateValueProp($state, ["popoverCore", "open"])}
        overlay={
          <div className={classNames(projectcss.all, sty.freeBox__gYjii)}>
            <Stack__
              as={"div"}
              hasGap={true}
              className={classNames(projectcss.all, sty.freeBox__rnAqM)}
              onClick={async event => {
                const $steps = {};

                $steps["updateReportDialogOpen"] = true
                  ? (() => {
                      const actionArgs = {
                        variable: {
                          objRoot: $state,
                          variablePath: ["reportDialog", "open"]
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
                  $steps["updateReportDialogOpen"] != null &&
                  typeof $steps["updateReportDialogOpen"] === "object" &&
                  typeof $steps["updateReportDialogOpen"].then === "function"
                ) {
                  $steps["updateReportDialogOpen"] = await $steps[
                    "updateReportDialogOpen"
                  ];
                }
              }}
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
                {"\u06af\u0632\u0627\u0631\u0634"}
              </div>
              <InfoIcon
                className={classNames(projectcss.all, sty.svg__pNEbA)}
                role={"img"}
              />
            </Stack__>
          </div>
        }
        themeResetClass={classNames(
          projectcss.root_reset,
          projectcss.plasmic_default_styles,
          projectcss.plasmic_mixins,
          projectcss.plasmic_tokens,
          plasmic_paziresh_24_design_system_css.plasmic_tokens
        )}
      >
        <div className={classNames(projectcss.all, sty.freeBox__jp5SJ)}>
          <MenuIcon
            className={classNames(projectcss.all, sty.svg___4Ta3X)}
            role={"img"}
          />
        </div>
      </Popover>
      <Paziresh24Dialog
        data-plasmic-name={"reportDialog"}
        data-plasmic-override={overrides.reportDialog}
        body={
          <React.Fragment>
            <textarea
              data-plasmic-name={"textarea"}
              data-plasmic-override={overrides.textarea}
              className={classNames(
                projectcss.all,
                projectcss.textarea,
                sty.textarea
              )}
              onChange={async (...eventArgs: any) => {
                (e => {
                  generateStateOnChangeProp($state, ["textarea", "value"])(
                    e.target.value
                  );
                }).apply(null, eventArgs);
              }}
              placeholder={
                "\u0644\u0637\u0641\u0627 \u0639\u0644\u062a \u0648 \u0634\u0631\u062d \u06af\u0632\u0627\u0631\u0634 \u0646\u0638\u0631 \u0627\u06cc\u0646 \u06a9\u0627\u0631\u0628\u0631 \u0631\u0627 \u0627\u0639\u0644\u0627\u0645 \u06a9\u0646\u06cc\u062f \u062a\u0627 \u062a\u06cc\u0645 \u067e\u0634\u062a\u06cc\u0628\u0627\u0646\u06cc \u067e\u0630\u06cc\u0631\u063424 \u0628\u0631 \u0627\u0633\u0627\u0633 \u067e\u06cc\u0634\u0646\u0647\u0627\u062f \u0634\u0645\u0627\u060c \u0646\u0638\u0631 \u06a9\u0627\u0631\u0628\u0631 \u0631\u0627 \u0645\u062c\u062f\u062f\u0627 \u0628\u0631\u0631\u0633\u06cc \u0646\u0645\u0627\u06cc\u062f."
              }
              ref={ref => {
                $refs["textarea"] = ref;
              }}
              value={
                generateStateValueProp($state, ["textarea", "value"]) ?? ""
              }
            />

            <Paziresh24Button
              data-plasmic-name={"paziresh24Button"}
              data-plasmic-override={overrides.paziresh24Button}
              children2={
                "\u0627\u0631\u0633\u0627\u0644 \u06af\u0632\u0627\u0631\u0634"
              }
              className={classNames("__wab_instance", sty.paziresh24Button)}
              loading={(() => {
                try {
                  return $props.isLoading;
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return [];
                  }
                  throw e;
                }
              })()}
              onClick={async event => {
                const $steps = {};

                $steps["runOnClickSendReport"] = true
                  ? (() => {
                      const actionArgs = {
                        eventRef: $props["onClickSendReport"],
                        args: [
                          (() => {
                            try {
                              return $state.textarea.value;
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
                  $steps["runOnClickSendReport"] != null &&
                  typeof $steps["runOnClickSendReport"] === "object" &&
                  typeof $steps["runOnClickSendReport"].then === "function"
                ) {
                  $steps["runOnClickSendReport"] = await $steps[
                    "runOnClickSendReport"
                  ];
                }
              }}
            />
          </React.Fragment>
        }
        className={classNames("__wab_instance", sty.reportDialog)}
        noTrigger={true}
        onOpenChange={async (...eventArgs: any) => {
          generateStateOnChangeProp($state, ["reportDialog", "open"]).apply(
            null,
            eventArgs
          );

          if (eventArgs.length > 1 && eventArgs[1]) {
            return;
          }
        }}
        open={generateStateValueProp($state, ["reportDialog", "open"])}
        title={"\u06af\u0632\u0627\u0631\u0634 \u0646\u0638\u0631"}
        trigger={null}
      />
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: [
    "root",
    "popoverCore",
    "text",
    "reportDialog",
    "textarea",
    "paziresh24Button"
  ],
  popoverCore: ["popoverCore", "text"],
  text: ["text"],
  reportDialog: ["reportDialog", "textarea", "paziresh24Button"],
  textarea: ["textarea"],
  paziresh24Button: ["paziresh24Button"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  popoverCore: typeof Popover;
  text: "div";
  reportDialog: typeof Paziresh24Dialog;
  textarea: "textarea";
  paziresh24Button: typeof Paziresh24Button;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicRaviReviewOptions__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicRaviReviewOptions__VariantsArgs;
    args?: PlasmicRaviReviewOptions__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicRaviReviewOptions__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicRaviReviewOptions__ArgsType,
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
          internalArgPropNames: PlasmicRaviReviewOptions__ArgProps,
          internalVariantPropNames: PlasmicRaviReviewOptions__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicRaviReviewOptions__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicRaviReviewOptions";
  } else {
    func.displayName = `PlasmicRaviReviewOptions.${nodeName}`;
  }
  return func;
}

export const PlasmicRaviReviewOptions = Object.assign(
  // Top-level PlasmicRaviReviewOptions renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    popoverCore: makeNodeComponent("popoverCore"),
    text: makeNodeComponent("text"),
    reportDialog: makeNodeComponent("reportDialog"),
    textarea: makeNodeComponent("textarea"),
    paziresh24Button: makeNodeComponent("paziresh24Button"),

    // Metadata about props expected for PlasmicRaviReviewOptions
    internalVariantProps: PlasmicRaviReviewOptions__VariantProps,
    internalArgProps: PlasmicRaviReviewOptions__ArgProps
  }
);

export default PlasmicRaviReviewOptions;
/* prettier-ignore-end */
