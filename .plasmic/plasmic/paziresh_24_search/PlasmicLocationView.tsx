// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: p2ixA7V1voJv

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

import TextInput from "../../TextInput"; // plasmic-import: 6w9lKEd-r02I/component
import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component
import UserLocation from "../../UserLocation"; // plasmic-import: YoStZ8eQd9r-/component
import LocationList from "../../LocationList"; // plasmic-import: WC4zcEVYQzEC/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicLocationView.module.css"; // plasmic-import: p2ixA7V1voJv/css

import SearchSvgIcon from "./icons/PlasmicIcon__SearchSvg"; // plasmic-import: QrVR5pllCw55/icon
import CheckSvgIcon from "./icons/PlasmicIcon__CheckSvg"; // plasmic-import: 6y6ixEKeF2Sb/icon
import Icon44Icon from "./icons/PlasmicIcon__Icon44"; // plasmic-import: mnMqeXnQZuQo/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicLocationView__VariantMembers = {};
export type PlasmicLocationView__VariantsArgs = {};
type VariantPropType = keyof PlasmicLocationView__VariantsArgs;
export const PlasmicLocationView__VariantProps = new Array<VariantPropType>();

export type PlasmicLocationView__ArgsType = {
  locations?: any;
  selectedProvinceId?: string;
  onClickCity?: (value: any) => void;
  onClickAllCities?: () => void;
  onFocusInput?: (value: boolean) => void;
  selectedCity?: any;
};
type ArgPropType = keyof PlasmicLocationView__ArgsType;
export const PlasmicLocationView__ArgProps = new Array<ArgPropType>(
  "locations",
  "selectedProvinceId",
  "onClickCity",
  "onClickAllCities",
  "onFocusInput",
  "selectedCity"
);

export type PlasmicLocationView__OverridesType = {
  root?: Flex__<"div">;
  textInput?: Flex__<typeof TextInput>;
  text?: Flex__<"div">;
  button?: Flex__<typeof Button>;
  svg?: Flex__<"svg">;
  userLocation?: Flex__<typeof UserLocation>;
  locationList?: Flex__<typeof LocationList>;
};

export interface DefaultLocationViewProps {
  locations?: any;
  selectedProvinceId?: string;
  onClickCity?: (value: any) => void;
  onClickAllCities?: () => void;
  onFocusInput?: (value: boolean) => void;
  selectedCity?: any;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicLocationView__RenderFunc(props: {
  variants: PlasmicLocationView__VariantsArgs;
  args: PlasmicLocationView__ArgsType;
  overrides: PlasmicLocationView__OverridesType;
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
        path: "textInput.value",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => ""
      },
      {
        path: "filteredCities",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) =>
          (() => {
            try {
              return $props.locations;
            } catch (e) {
              if (
                e instanceof TypeError ||
                e?.plasmicType === "PlasmicUndefinedDataError"
              ) {
                return {};
              }
              throw e;
            }
          })()
      },
      {
        path: "userLocation.userCity",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "isUserLocationOpen",
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
        plasmic_antd_5_hostless_css.plasmic_tokens,
        sty.root,
        "locations-container"
      )}
    >
      <div
        className={classNames(projectcss.all, sty.freeBox__gvQGw)}
        onClick={async event => {
          const $steps = {};

          $steps["runOnFocusInput"] = true
            ? (() => {
                const actionArgs = {
                  eventRef: $props["onFocusInput"],
                  args: [true]
                };
                return (({ eventRef, args }) => {
                  return eventRef?.(...(args ?? []));
                })?.apply(null, [actionArgs]);
              })()
            : undefined;
          if (
            $steps["runOnFocusInput"] != null &&
            typeof $steps["runOnFocusInput"] === "object" &&
            typeof $steps["runOnFocusInput"].then === "function"
          ) {
            $steps["runOnFocusInput"] = await $steps["runOnFocusInput"];
          }

          $steps["runCode"] = false
            ? (() => {
                const actionArgs = {
                  customFunction: async () => {
                    return (() => {
                      const list =
                        globalThis.document.getElementById("cities-list");
                      if (list) {
                        return (list.scrollTop = 0);
                      }
                    })();
                  }
                };
                return (({ customFunction }) => {
                  return customFunction();
                })?.apply(null, [actionArgs]);
              })()
            : undefined;
          if (
            $steps["runCode"] != null &&
            typeof $steps["runCode"] === "object" &&
            typeof $steps["runCode"].then === "function"
          ) {
            $steps["runCode"] = await $steps["runCode"];
          }
        }}
      >
        <TextInput
          data-plasmic-name={"textInput"}
          data-plasmic-override={overrides.textInput}
          className={classNames("__wab_instance", sty.textInput)}
          name={"search"}
          onChange={async (...eventArgs: any) => {
            ((...eventArgs) => {
              generateStateOnChangeProp($state, ["textInput", "value"])(
                (e => e.target?.value).apply(null, eventArgs)
              );
            }).apply(null, eventArgs);

            if (
              eventArgs.length > 1 &&
              eventArgs[1] &&
              eventArgs[1]._plasmic_state_init_
            ) {
              return;
            }

            (async event => {
              const $steps = {};

              $steps["runCode"] = true
                ? (() => {
                    const actionArgs = {
                      customFunction: async () => {
                        return (() => {
                          const list =
                            globalThis.document.getElementById("cities-list");
                          if (list && list.scrollTop > 0) {
                            return (list.scrollTop = 0);
                          }
                        })();
                      }
                    };
                    return (({ customFunction }) => {
                      return customFunction();
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps["runCode"] != null &&
                typeof $steps["runCode"] === "object" &&
                typeof $steps["runCode"].then === "function"
              ) {
                $steps["runCode"] = await $steps["runCode"];
              }
            }).apply(null, eventArgs);
          }}
          placeholder={
            "\u062c\u0633\u062a\u062c\u0648 \u062f\u0631 \u0634\u0647\u0631 \u0647\u0627"
          }
          type={"text"}
          value={generateStateValueProp($state, ["textInput", "value"]) ?? ""}
        />
      </div>
      <Stack__
        as={"div"}
        hasGap={true}
        className={classNames(projectcss.all, sty.freeBox___3K4Wv)}
      >
        <div
          className={classNames(projectcss.all, sty.freeBox__urbAk)}
          onClick={async event => {
            const $steps = {};

            $steps["runOnClickAllCities"] = true
              ? (() => {
                  const actionArgs = { eventRef: $props["onClickAllCities"] };
                  return (({ eventRef, args }) => {
                    return eventRef?.(...(args ?? []));
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["runOnClickAllCities"] != null &&
              typeof $steps["runOnClickAllCities"] === "object" &&
              typeof $steps["runOnClickAllCities"].then === "function"
            ) {
              $steps["runOnClickAllCities"] = await $steps[
                "runOnClickAllCities"
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
            {"\u0647\u0645\u0647 \u0634\u0647\u0631\u0647\u0627"}
          </div>
        </div>
        <Button
          data-plasmic-name={"button"}
          data-plasmic-override={overrides.button}
          children2={"\u0627\u0637\u0631\u0627\u0641 \u0645\u0646"}
          className={classNames("__wab_instance", sty.button)}
          color={"text"}
          onClick={async event => {
            const $steps = {};

            $steps["runOnClickCity"] = true
              ? (() => {
                  const actionArgs = {
                    eventRef: $props["onClickCity"],
                    args: [
                      (() => {
                        try {
                          return {
                            id: $props.selectedCity.id,
                            name: $props.selectedCity.name,
                            en_slug: $props.selectedCity.en_slug,
                            province_id:
                              $props.selectedCity.province_id || "-1",
                            is_aroundme: true
                          };
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
              $steps["runOnClickCity"] != null &&
              typeof $steps["runOnClickCity"] === "object" &&
              typeof $steps["runOnClickCity"].then === "function"
            ) {
              $steps["runOnClickCity"] = await $steps["runOnClickCity"];
            }
          }}
          showStartIcon={true}
          startIcon={
            <Icon44Icon
              data-plasmic-name={"svg"}
              data-plasmic-override={overrides.svg}
              className={classNames(projectcss.all, sty.svg)}
              role={"img"}
            />
          }
        />

        {false ? (
          <UserLocation
            data-plasmic-name={"userLocation"}
            data-plasmic-override={overrides.userLocation}
            className={classNames("__wab_instance", sty.userLocation)}
            isOpen={(() => {
              try {
                return $state.isUserLocationOpen;
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return false;
                }
                throw e;
              }
            })()}
            onUserCityChange={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, [
                "userLocation",
                "userCity"
              ]).apply(null, eventArgs);

              if (
                eventArgs.length > 1 &&
                eventArgs[1] &&
                eventArgs[1]._plasmic_state_init_
              ) {
                return;
              }
            }}
          />
        ) : null}
      </Stack__>
      <div
        className={classNames(projectcss.all, sty.freeBox__hlKod)}
        id={"cities-list"}
      >
        <LocationList
          data-plasmic-name={"locationList"}
          data-plasmic-override={overrides.locationList}
          className={classNames("__wab_instance", sty.locationList)}
          locations={(() => {
            try {
              return $props.locations;
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
          onClick={async value => {
            const $steps = {};

            $steps["runOnClickCity"] = true
              ? (() => {
                  const actionArgs = {
                    eventRef: $props["onClickCity"],
                    args: [
                      (() => {
                        try {
                          return value;
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
              $steps["runOnClickCity"] != null &&
              typeof $steps["runOnClickCity"] === "object" &&
              typeof $steps["runOnClickCity"].then === "function"
            ) {
              $steps["runOnClickCity"] = await $steps["runOnClickCity"];
            }
          }}
          searchTerm={(() => {
            try {
              return $state.textInput.value;
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
          selectedProvinceId={(() => {
            try {
              return $props.selectedProvinceId;
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
      </div>
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: [
    "root",
    "textInput",
    "text",
    "button",
    "svg",
    "userLocation",
    "locationList"
  ],
  textInput: ["textInput"],
  text: ["text"],
  button: ["button", "svg"],
  svg: ["svg"],
  userLocation: ["userLocation"],
  locationList: ["locationList"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  textInput: typeof TextInput;
  text: "div";
  button: typeof Button;
  svg: "svg";
  userLocation: typeof UserLocation;
  locationList: typeof LocationList;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicLocationView__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicLocationView__VariantsArgs;
    args?: PlasmicLocationView__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicLocationView__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicLocationView__ArgsType,
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
          internalArgPropNames: PlasmicLocationView__ArgProps,
          internalVariantPropNames: PlasmicLocationView__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicLocationView__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicLocationView";
  } else {
    func.displayName = `PlasmicLocationView.${nodeName}`;
  }
  return func;
}

export const PlasmicLocationView = Object.assign(
  // Top-level PlasmicLocationView renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    textInput: makeNodeComponent("textInput"),
    text: makeNodeComponent("text"),
    button: makeNodeComponent("button"),
    svg: makeNodeComponent("svg"),
    userLocation: makeNodeComponent("userLocation"),
    locationList: makeNodeComponent("locationList"),

    // Metadata about props expected for PlasmicLocationView
    internalVariantProps: PlasmicLocationView__VariantProps,
    internalArgProps: PlasmicLocationView__ArgProps
  }
);

export default PlasmicLocationView;
/* prettier-ignore-end */
