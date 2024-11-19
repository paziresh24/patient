// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: d_qMEJ14UZf0

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

import SearchInput from "../../SearchInput"; // plasmic-import: qe20xTbxVmkB/component
import { ApiRequest } from "@/common/fragment/components/api-request"; // plasmic-import: vW4UBuHCFshJ/codeComponent
import SearchContent from "../../SearchContent"; // plasmic-import: PfB5nhEPkWQb/component
import Dialog from "../../Dialog"; // plasmic-import: FJiI2-N1is_F/component
import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component
import LocationView from "../../LocationView"; // plasmic-import: p2ixA7V1voJv/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSearch.module.css"; // plasmic-import: d_qMEJ14UZf0/css

import Icon14Icon from "./icons/PlasmicIcon__Icon14"; // plasmic-import: eKLBqU_Fr5SV/icon
import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicSearch__VariantMembers = {
  hasOverlay: "hasOverlay";
};
export type PlasmicSearch__VariantsArgs = {
  hasOverlay?: SingleBooleanChoiceArg<"hasOverlay">;
};
type VariantPropType = keyof PlasmicSearch__VariantsArgs;
export const PlasmicSearch__VariantProps = new Array<VariantPropType>(
  "hasOverlay"
);

export type PlasmicSearch__ArgsType = {
  locations?: any;
  suggestions?: any;
};
type ArgPropType = keyof PlasmicSearch__ArgsType;
export const PlasmicSearch__ArgProps = new Array<ArgPropType>(
  "locations",
  "suggestions"
);

export type PlasmicSearch__OverridesType = {
  root?: Flex__<"div">;
  searchInput?: Flex__<typeof SearchInput>;
  suggestionApi?: Flex__<typeof ApiRequest>;
  searchContent?: Flex__<typeof SearchContent>;
  selectCityDialog?: Flex__<typeof Dialog>;
  getLocationList?: Flex__<typeof ApiRequest>;
  locationView?: Flex__<typeof LocationView>;
  overlay?: Flex__<"div">;
};

export interface DefaultSearchProps {
  locations?: any;
  suggestions?: any;
  hasOverlay?: SingleBooleanChoiceArg<"hasOverlay">;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSearch__RenderFunc(props: {
  variants: PlasmicSearch__VariantsArgs;
  args: PlasmicSearch__ArgsType;
  overrides: PlasmicSearch__OverridesType;
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
        path: "selectCityDialog.open",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "isFocused",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => false
      },
      {
        path: "inputValue",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => ""
      },
      {
        path: "suggestionApi.data",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "suggestionApi.error",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "suggestionApi.loading",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "getLocationList.data",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "getLocationList.error",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "getLocationList.loading",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "hasOverlay",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.hasOverlay
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
      <div
        className={classNames(projectcss.all, sty.freeBox__npNu)}
        onClick={async event => {
          const $steps = {};
        }}
      >
        <SearchInput
          data-plasmic-name={"searchInput"}
          data-plasmic-override={overrides.searchInput}
          className={classNames("__wab_instance", sty.searchInput)}
          inputId={"searchInput"}
          inputValue={(() => {
            try {
              return $state.inputValue;
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
          isFocused={(() => {
            try {
              return $state.isFocused;
            } catch (e) {
              if (
                e instanceof TypeError ||
                e?.plasmicType === "PlasmicUndefinedDataError"
              ) {
                return "isFocused";
              }
              throw e;
            }
          })()}
          onChangeInput={async value => {
            const $steps = {};

            $steps["updateInputValue"] = true
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["inputValue"]
                    },
                    operation: 0,
                    value: value
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
              $steps["updateInputValue"] != null &&
              typeof $steps["updateInputValue"] === "object" &&
              typeof $steps["updateInputValue"].then === "function"
            ) {
              $steps["updateInputValue"] = await $steps["updateInputValue"];
            }
          }}
          onClickCities={async () => {
            const $steps = {};

            $steps["updateSelectCityOpen"] = true
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["selectCityDialog", "open"]
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
              $steps["updateSelectCityOpen"] != null &&
              typeof $steps["updateSelectCityOpen"] === "object" &&
              typeof $steps["updateSelectCityOpen"].then === "function"
            ) {
              $steps["updateSelectCityOpen"] = await $steps[
                "updateSelectCityOpen"
              ];
            }
          }}
          onClickSearchIcon={async () => {
            const $steps = {};

            $steps["goToS"] = !!$state.inputValue
              ? (() => {
                  const actionArgs = { destination: "/s" };
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
              $steps["goToS"] != null &&
              typeof $steps["goToS"] === "object" &&
              typeof $steps["goToS"].then === "function"
            ) {
              $steps["goToS"] = await $steps["goToS"];
            }
          }}
          onFocus={async event => {
            const $steps = {};

            $steps["updateIsFocused"] = true
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["isFocused"]
                    },
                    operation: 0,
                    value: true
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
              $steps["updateIsFocused"] != null &&
              typeof $steps["updateIsFocused"] === "object" &&
              typeof $steps["updateIsFocused"].then === "function"
            ) {
              $steps["updateIsFocused"] = await $steps["updateIsFocused"];
            }
          }}
        />

        {(() => {
          try {
            return $state.isFocused;
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
            className={classNames(projectcss.all, sty.freeBox__vKSpO)}
            id={"suggestionContent"}
          >
            <ApiRequest
              data-plasmic-name={"suggestionApi"}
              data-plasmic-override={overrides.suggestionApi}
              className={classNames("__wab_instance", sty.suggestionApi)}
              errorDisplay={null}
              loadingDisplay={
                <div className={classNames(projectcss.all, sty.freeBox__lD73P)}>
                  <Icon14Icon
                    className={classNames(projectcss.all, sty.svg__ukSyf)}
                    role={"img"}
                  />
                </div>
              }
              method={"GET"}
              onError={generateStateOnChangeProp($state, [
                "suggestionApi",
                "error"
              ])}
              onLoading={generateStateOnChangeProp($state, [
                "suggestionApi",
                "loading"
              ])}
              onSuccess={generateStateOnChangeProp($state, [
                "suggestionApi",
                "data"
              ])}
              url={(() => {
                try {
                  return `https://apigw.paziresh24.com/seapi/v1/suggestion?q=${$state.inputValue}`;
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
              <SearchContent
                data-plasmic-name={"searchContent"}
                data-plasmic-override={overrides.searchContent}
                className={classNames("__wab_instance", sty.searchContent)}
                onClickText={async value => {
                  const $steps = {};

                  $steps["updateInputValue"] = true
                    ? (() => {
                        const actionArgs = {
                          variable: {
                            objRoot: $state,
                            variablePath: ["inputValue"]
                          },
                          operation: 0,
                          value: value
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

                          $stateSet(objRoot, variablePath, value);
                          return value;
                        })?.apply(null, [actionArgs]);
                      })()
                    : undefined;
                  if (
                    $steps["updateInputValue"] != null &&
                    typeof $steps["updateInputValue"] === "object" &&
                    typeof $steps["updateInputValue"].then === "function"
                  ) {
                    $steps["updateInputValue"] = await $steps[
                      "updateInputValue"
                    ];
                  }
                }}
                searchQuery={(() => {
                  try {
                    return $state.inputValue;
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
                suggestion={(() => {
                  try {
                    return $state.suggestionApi.data;
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
            </ApiRequest>
          </div>
        ) : null}
      </div>
      <Dialog
        data-plasmic-name={"selectCityDialog"}
        data-plasmic-override={overrides.selectCityDialog}
        body={
          <div className={classNames(projectcss.all, sty.freeBox___8CERd)}>
            <ApiRequest
              data-plasmic-name={"getLocationList"}
              data-plasmic-override={overrides.getLocationList}
              body={(() => {
                try {
                  return (() => {
                    const formData = new globalThis.FormData();
                    formData.append(
                      "table",
                      JSON.stringify(["city", "province"])
                    );
                    return formData;
                  })();
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return { table: ["city", "province"] };
                  }
                  throw e;
                }
              })()}
              className={classNames("__wab_instance", sty.getLocationList)}
              errorDisplay={null}
              loadingDisplay={
                <div className={classNames(projectcss.all, sty.freeBox__iKi06)}>
                  <Icon14Icon
                    className={classNames(projectcss.all, sty.svg__g3HAz)}
                    role={"img"}
                  />
                </div>
              }
              method={"POST"}
              onError={generateStateOnChangeProp($state, [
                "getLocationList",
                "error"
              ])}
              onLoading={generateStateOnChangeProp($state, [
                "getLocationList",
                "loading"
              ])}
              onSuccess={generateStateOnChangeProp($state, [
                "getLocationList",
                "data"
              ])}
              url={"https://www.paziresh24.com/api/getbaseinfo"}
            >
              <LocationView
                data-plasmic-name={"locationView"}
                data-plasmic-override={overrides.locationView}
                className={classNames("__wab_instance", sty.locationView)}
                locations={(() => {
                  try {
                    return $state.getLocationList.data.result;
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
                selectedProvinceId={"29"}
              />
            </ApiRequest>
          </div>
        }
        className={classNames("__wab_instance", sty.selectCityDialog)}
        noTrigger={true}
        onOpenChange={generateStateOnChangeProp($state, [
          "selectCityDialog",
          "open"
        ])}
        open={generateStateValueProp($state, ["selectCityDialog", "open"])}
        title={"\u0627\u0646\u062a\u062e\u0627\u0628 \u0634\u0647\u0631"}
      />

      {(() => {
        try {
          return $state.isFocused;
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
          data-plasmic-name={"overlay"}
          data-plasmic-override={overrides.overlay}
          className={classNames(projectcss.all, sty.overlay, {
            [sty.overlayhasOverlay]: hasVariant(
              $state,
              "hasOverlay",
              "hasOverlay"
            )
          })}
          onClick={async event => {
            const $steps = {};

            $steps["updateIsFocused"] = true
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["isFocused"]
                    },
                    operation: 0,
                    value: false
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
              $steps["updateIsFocused"] != null &&
              typeof $steps["updateIsFocused"] === "object" &&
              typeof $steps["updateIsFocused"].then === "function"
            ) {
              $steps["updateIsFocused"] = await $steps["updateIsFocused"];
            }
          }}
        />
      ) : null}
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: [
    "root",
    "searchInput",
    "suggestionApi",
    "searchContent",
    "selectCityDialog",
    "getLocationList",
    "locationView",
    "overlay"
  ],
  searchInput: ["searchInput"],
  suggestionApi: ["suggestionApi", "searchContent"],
  searchContent: ["searchContent"],
  selectCityDialog: ["selectCityDialog", "getLocationList", "locationView"],
  getLocationList: ["getLocationList", "locationView"],
  locationView: ["locationView"],
  overlay: ["overlay"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  searchInput: typeof SearchInput;
  suggestionApi: typeof ApiRequest;
  searchContent: typeof SearchContent;
  selectCityDialog: typeof Dialog;
  getLocationList: typeof ApiRequest;
  locationView: typeof LocationView;
  overlay: "div";
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSearch__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSearch__VariantsArgs;
    args?: PlasmicSearch__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSearch__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicSearch__ArgsType,
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
          internalArgPropNames: PlasmicSearch__ArgProps,
          internalVariantPropNames: PlasmicSearch__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSearch__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicSearch";
  } else {
    func.displayName = `PlasmicSearch.${nodeName}`;
  }
  return func;
}

export const PlasmicSearch = Object.assign(
  // Top-level PlasmicSearch renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    searchInput: makeNodeComponent("searchInput"),
    suggestionApi: makeNodeComponent("suggestionApi"),
    searchContent: makeNodeComponent("searchContent"),
    selectCityDialog: makeNodeComponent("selectCityDialog"),
    getLocationList: makeNodeComponent("getLocationList"),
    locationView: makeNodeComponent("locationView"),
    overlay: makeNodeComponent("overlay"),

    // Metadata about props expected for PlasmicSearch
    internalVariantProps: PlasmicSearch__VariantProps,
    internalArgProps: PlasmicSearch__ArgProps
  }
);

export default PlasmicSearch;
/* prettier-ignore-end */
