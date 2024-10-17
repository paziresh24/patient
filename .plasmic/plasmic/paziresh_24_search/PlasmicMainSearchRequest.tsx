// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: SctdwrC6-ku4

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

import { ApiRequest } from "@/common/fragment/components/api-request"; // plasmic-import: vW4UBuHCFshJ/codeComponent
import SearchResults from "../../SearchResults"; // plasmic-import: XhSI4pxMLR3L/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicMainSearchRequest.module.css"; // plasmic-import: SctdwrC6-ku4/css

import Icon14Icon from "./icons/PlasmicIcon__Icon14"; // plasmic-import: eKLBqU_Fr5SV/icon

createPlasmicElementProxy;

export type PlasmicMainSearchRequest__VariantMembers = {};
export type PlasmicMainSearchRequest__VariantsArgs = {};
type VariantPropType = keyof PlasmicMainSearchRequest__VariantsArgs;
export const PlasmicMainSearchRequest__VariantProps =
  new Array<VariantPropType>();

export type PlasmicMainSearchRequest__ArgsType = {
  searchQuery?: string;
  onApiRequestDataChange?: (val: any) => void;
  searchFilters?: any;
  page?: number;
  onPageChange2?: (val: string) => void;
  result?: any;
  onResultChange?: (val: string) => void;
  searchOptionalFilters?: any;
};
type ArgPropType = keyof PlasmicMainSearchRequest__ArgsType;
export const PlasmicMainSearchRequest__ArgProps = new Array<ArgPropType>(
  "searchQuery",
  "onApiRequestDataChange",
  "searchFilters",
  "page",
  "onPageChange2",
  "result",
  "onResultChange",
  "searchOptionalFilters"
);

export type PlasmicMainSearchRequest__OverridesType = {
  root?: Flex__<"div">;
  fragmentApiRequest?: Flex__<typeof ApiRequest>;
  svg?: Flex__<"svg">;
  text?: Flex__<"div">;
  searchResults?: Flex__<typeof SearchResults>;
};

export interface DefaultMainSearchRequestProps {
  searchQuery?: string;
  onApiRequestDataChange?: (val: any) => void;
  searchFilters?: any;
  page?: number;
  onPageChange2?: (val: string) => void;
  result?: any;
  onResultChange?: (val: string) => void;
  searchOptionalFilters?: any;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicMainSearchRequest__RenderFunc(props: {
  variants: PlasmicMainSearchRequest__VariantsArgs;
  args: PlasmicMainSearchRequest__ArgsType;
  overrides: PlasmicMainSearchRequest__OverridesType;
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

  const $globalActions = useGlobalActions?.();

  const stateSpecs: Parameters<typeof useDollarState>[0] = React.useMemo(
    () => [
      {
        path: "fragmentApiRequest.data",
        type: "readonly",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined,

        onChangeProp: "onApiRequestDataChange"
      },
      {
        path: "fragmentApiRequest.error",
        type: "private",
        variableType: "object",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "fragmentApiRequest.loading",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "page",
        type: "writable",
        variableType: "number",

        valueProp: "page",
        onChangeProp: "onPageChange2"
      },
      {
        path: "result",
        type: "writable",
        variableType: "array",

        valueProp: "result",
        onChangeProp: "onResultChange"
      },
      {
        path: "total",
        type: "private",
        variableType: "number",
        initFunc: ({ $props, $state, $queries, $ctx }) => 0
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
      <ApiRequest
        data-plasmic-name={"fragmentApiRequest"}
        data-plasmic-override={overrides.fragmentApiRequest}
        children={null}
        className={classNames("__wab_instance", sty.fragmentApiRequest)}
        errorDisplay={
          <div
            data-plasmic-name={"text"}
            data-plasmic-override={overrides.text}
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text
            )}
          >
            {"Error fetching data"}
          </div>
        }
        loadingDisplay={
          (() => {
            try {
              return $state.page === 1;
            } catch (e) {
              if (
                e instanceof TypeError ||
                e?.plasmicType === "PlasmicUndefinedDataError"
              ) {
                return false;
              }
              throw e;
            }
          })() ? (
            <Icon14Icon
              data-plasmic-name={"svg"}
              data-plasmic-override={overrides.svg}
              className={classNames(projectcss.all, sty.svg)}
              role={"img"}
            />
          ) : null
        }
        method={"GET"}
        onError={generateStateOnChangeProp($state, [
          "fragmentApiRequest",
          "error"
        ])}
        onLoading={generateStateOnChangeProp($state, [
          "fragmentApiRequest",
          "loading"
        ])}
        onSuccess={async (...eventArgs: any) => {
          generateStateOnChangeProp($state, [
            "fragmentApiRequest",
            "data"
          ]).apply(null, eventArgs);
          (async data => {
            const $steps = {};

            $steps["consoleLog"] = true
              ? (() => {
                  const actionArgs = {
                    customFunction: async () => {
                      return console.log("ApiRequest On success interaction");
                    }
                  };
                  return (({ customFunction }) => {
                    return customFunction();
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["consoleLog"] != null &&
              typeof $steps["consoleLog"] === "object" &&
              typeof $steps["consoleLog"].then === "function"
            ) {
              $steps["consoleLog"] = await $steps["consoleLog"];
            }

            $steps["stateUpdateByCode"] = (() => {
              console.log(
                "condition",
                $state.fragmentApiRequest.data?.entity?.results,
                !!$state.fragmentApiRequest.data?.entity?.results,
                $state.result
              );
              return !!$state.fragmentApiRequest.data?.entity?.results;
            })()
              ? (() => {
                  const actionArgs = {
                    customFunction: async () => {
                      return (() => {
                        if (!$state.result) {
                          console.log(
                            "Initializing $state.result as an empty array."
                          );
                          $state.result = [];
                        } else {
                          console.log(
                            "Existing $state.result:",
                            $state.result.length,
                            $state.result
                          );
                        }
                        const newResults =
                          $state.fragmentApiRequest.data?.entity?.results;
                        if (newResults && newResults.length > 0) {
                          console.log(
                            "New results fetched:",
                            newResults.length,
                            newResults
                          );
                          const combinedResults = [
                            ...$state.result,
                            ...newResults
                          ];

                          console.log(
                            "Combined results (before deduplication):",
                            combinedResults.length,
                            combinedResults
                          );
                          const uniqueResultsMap = new Map();
                          for (const item of combinedResults) {
                            if (item && item.documentId) {
                              uniqueResultsMap.set(item.documentId, item);
                            } else {
                              console.warn(
                                "Item missing documentId and was skipped:",
                                item
                              );
                            }
                          }
                          const uniqueResults = Array.from(
                            uniqueResultsMap.values()
                          );
                          console.log(
                            "Unique results (after deduplication):",
                            uniqueResults.length,
                            uniqueResults
                          );
                          $state.result = uniqueResults;
                          console.log(
                            "Updated $state.result:",
                            $state.result.length,
                            $state.result
                          );
                        } else {
                          console.log(
                            "No new results to merge. $state.result remains unchanged."
                          );
                        }
                        return setTimeout(() => {
                          console.log(
                            "After 10 seconds, $state.result:",
                            $state.result.length,
                            $state.result
                          );
                        }, 10000);
                      })();
                    }
                  };
                  return (({ customFunction }) => {
                    return customFunction();
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["stateUpdateByCode"] != null &&
              typeof $steps["stateUpdateByCode"] === "object" &&
              typeof $steps["stateUpdateByCode"].then === "function"
            ) {
              $steps["stateUpdateByCode"] = await $steps["stateUpdateByCode"];
            }

            $steps["updateResult"] = false
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["result"]
                    },
                    operation: 0,
                    value: (() => {
                      console.log(
                        "$state.result",
                        $state.result?.length,
                        $state.result
                      );
                      console.log(
                        "$state.fragmentApiRequest.data?.entity?.results",
                        $state.fragmentApiRequest.data?.entity?.results?.length,
                        $state.fragmentApiRequest.data?.entity?.results
                      );
                      return Array.from(
                        new Map(
                          [
                            ...$state.result,
                            ...($state.fragmentApiRequest.data?.entity
                              ?.results ?? [])
                          ].map(item => [item.documentId, item])
                        ).values()
                      );
                    })()
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
              $steps["updateResult"] != null &&
              typeof $steps["updateResult"] === "object" &&
              typeof $steps["updateResult"].then === "function"
            ) {
              $steps["updateResult"] = await $steps["updateResult"];
            }

            $steps["wait10Seconds"] = true
              ? (() => {
                  const actionArgs = {
                    customFunction: async () => {
                      return setTimeout(() => {
                        console.log("Waited for 10 seconds");
                      }, 10000);
                    }
                  };
                  return (({ customFunction }) => {
                    return customFunction();
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["wait10Seconds"] != null &&
              typeof $steps["wait10Seconds"] === "object" &&
              typeof $steps["wait10Seconds"].then === "function"
            ) {
              $steps["wait10Seconds"] = await $steps["wait10Seconds"];
            }

            $steps["updateTotal"] = $state.fragmentApiRequest?.data?.entity
              ?.totalHits
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["total"]
                    },
                    operation: 0,
                    value: $state.fragmentApiRequest?.data?.entity?.totalHits
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
              $steps["updateTotal"] != null &&
              typeof $steps["updateTotal"] === "object" &&
              typeof $steps["updateTotal"].then === "function"
            ) {
              $steps["updateTotal"] = await $steps["updateTotal"];
            }

            $steps["searchViewSplunkEvent"] = false
              ? (() => {
                  const actionArgs = {
                    args: [
                      (() => {
                        try {
                          return JSON.stringify($state.fragmentApiRequest.data);
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
                  return $globalActions["Splunk.sendLog"]?.apply(null, [
                    ...actionArgs.args
                  ]);
                })()
              : undefined;
            if (
              $steps["searchViewSplunkEvent"] != null &&
              typeof $steps["searchViewSplunkEvent"] === "object" &&
              typeof $steps["searchViewSplunkEvent"].then === "function"
            ) {
              $steps["searchViewSplunkEvent"] = await $steps[
                "searchViewSplunkEvent"
              ];
            }
          }).apply(null, eventArgs);
        }}
        params={(() => {
          try {
            return {
              from: (+($state?.page ?? 1) - 1) * 10,
              size: 10,
              query: $props.searchQuery,
              facets: "*",
              ...(Object.values(
                $props.searchFilters ? $props.searchFilters : {}
              ).length > 0 && {
                facetFilters: Object.entries($props.searchFilters).reduce(
                  (acc, item) => {
                    return `${acc?.length > 0 ? `${acc},` : ""}${item[1]
                      .map(i => `${item[0]}:${i}`)
                      .join(",")}`;
                  },
                  ""
                )
              }),
              ...(Object.values(
                $props.searchOptionalFilters ? $props.searchOptionalFilters : {}
              ).length > 0 && {
                optionalFilters: Object.entries(
                  $props.searchOptionalFilters
                ).reduce((acc, item) => {
                  return `${acc?.length > 0 ? `${acc},` : ""}${item[1]
                    .map(i => `${item[0]}:${i}`)
                    .join(",")}`;
                }, "")
              })
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
        })()}
        url={"https://apigw.paziresh24.com/v1/jahannama"}
      />

      {(() => {
        try {
          return $state.page === 1
            ? !$state.fragmentApiRequest?.loading &&
                !!$state.fragmentApiRequest?.data
            : true;
        } catch (e) {
          if (
            e instanceof TypeError ||
            e?.plasmicType === "PlasmicUndefinedDataError"
          ) {
            return false;
          }
          throw e;
        }
      })() ? (
        <SearchResults
          data-plasmic-name={"searchResults"}
          data-plasmic-override={overrides.searchResults}
          className={classNames("__wab_instance", sty.searchResults)}
          imageSrcPrefix={"https://cdn.paziresh24.com"}
          nextPageTrigger={async () => {
            const $steps = {};

            $steps["updatePage"] = true
              ? (() => {
                  const actionArgs = {
                    variable: {
                      objRoot: $state,
                      variablePath: ["page"]
                    },
                    operation: 2
                  };
                  return (({ variable, value, startIndex, deleteCount }) => {
                    if (!variable) {
                      return;
                    }
                    const { objRoot, variablePath } = variable;

                    const oldValue = $stateGet(objRoot, variablePath);
                    $stateSet(objRoot, variablePath, oldValue + 1);
                    return oldValue + 1;
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["updatePage"] != null &&
              typeof $steps["updatePage"] === "object" &&
              typeof $steps["updatePage"].then === "function"
            ) {
              $steps["updatePage"] = await $steps["updatePage"];
            }
          }}
          paginationLoadingStatus={(() => {
            try {
              return $state.fragmentApiRequest.loading;
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
          searchResultResponse={(() => {
            try {
              return {
                search: {
                  query_id: "",
                  total: $state.total,
                  is_landing: false,
                  pagination: {
                    limit: 10,
                    page: $state.page
                  },
                  result: $state.result?.map(item => {
                    if (item.source.record_type === "doctor") {
                      return {
                        _id: item.documentId,
                        id: item.source.doctor_id,
                        server_id: item.source.server_id,
                        type: "doctor",
                        title: item.source.display_name,
                        prefix: item.source.prefix || "",
                        image: `/getImage/p24/search-${
                          item.source.gender ? "men" : "women"
                        }/${item?.source?.image ?? "noimage.png"}?size=150`,
                        view: item.source.number_of_visits,
                        display_expertise: item.source.expertises
                          .map(
                            expertise =>
                              expertise.alias_title || expertise.expertise.name
                          )
                          .join(", "),
                        satisfaction: item.source.satisfaction || 0,
                        rates_count: item.source.rates_count || 0,
                        centers: item.source.centers.map(center => ({
                          id: center.id,
                          status: center.status,
                          user_center_id: center.user_center_id,
                          server_id: center.server_id,
                          name: center.name,
                          display_number: center.display_number,
                          address: center.address,
                          province_name: center.province_name,
                          city_name: center.city_name,
                          center_type: center.center_type,
                          map: {
                            lat: center.map ? center.map.lat : null,
                            lon: center.map ? center.map.lon : null
                          },
                          active_booking: center.active_booking
                        })),
                        display_address_full: `${item.source.city_name}, ${item.source.centers[0].address}`,
                        display_address: (() => {
                          const cityNames = [
                            ...new Set(
                              item.source.centers
                                .filter(center => center.id != "5532")
                                .map(center => center.city_name)
                            )
                          ].join(", ");
                          const centerNames = item.source.centers
                            .filter(
                              center =>
                                center.center_type != 1 && center.id != "5532"
                            )
                            .map(center => center.name)
                            .join(", ");
                          return centerNames
                            ? `${cityNames}, ${centerNames}`
                            : cityNames;
                        })(),
                        waiting_time: null,
                        badges: [],
                        is_bulk: !item.source.centers.some(
                          center => Number(center.status) === 1
                        ),
                        consult_active_booking:
                          item.source.consult_active_booking,
                        presence_active_booking:
                          item.source.presence_active_booking,
                        url: `/dr/${item.source.slug}`,
                        actions: (() => {
                          const actions = [];
                          const now = Math.floor(Date.now() / 1000);
                          const formatTimeToFarsi = timestamp => {
                            const timeDifference = timestamp - now;
                            if (timeDifference <= 0) {
                              return "هم‌اکنون";
                            } else if (timeDifference < 3600) {
                              return "کمتر از 1 ساعت دیگر";
                            } else if (timeDifference < 86400) {
                              const hours = Math.floor(timeDifference / 3600);
                              return `حدود ${hours} ساعت دیگر`;
                            } else {
                              const days = Math.floor(timeDifference / 86400);
                              return `حدود ${days} روز دیگر`;
                            }
                          };
                          const hasOnlineCenter = item.source.centers.some(
                            center => center.id === "5532"
                          );
                          const consult_freeturn = item.source.consult_freeturn;
                          const consultTimeValid =
                            consult_freeturn &&
                            consult_freeturn >= now - 24 * 3600;
                          if (hasOnlineCenter && consultTimeValid) {
                            const isImmediateConsult =
                              consult_freeturn >= now - 90 * 60 &&
                              consult_freeturn <= now + 60 * 60;
                            const outline = false;
                            let top_title = "";
                            if (isImmediateConsult) {
                              top_title = `<span>پاسخ: <b>آنلاین و آماده مشاوره</b></span>`;
                            } else {
                              const timeText =
                                formatTimeToFarsi(consult_freeturn);
                              top_title = `<span>زمان مشاوره: <b>${timeText}</b></span>`;
                            }
                            const consultServiceId =
                              item.source.consult_services &&
                              item.source.consult_services.length > 0
                                ? item.source.consult_services[0].id
                                : "";
                            const url = `/booking/${item.source.slug}?centerId=5532&serviceId=${consultServiceId}&skipTimeSelectStep=true`;
                            actions.push({
                              title: "ویزیت آنلاین",
                              outline: outline,
                              top_title: top_title,
                              url: url
                            });
                          }
                          const presence_freeturn =
                            item.source.presence_freeturn;
                          const presenceTimeValid =
                            presence_freeturn &&
                            presence_freeturn >= now - 24 * 3600;
                          const hasActiveBookingCenter =
                            item.source.centers.some(
                              center =>
                                center.id !== "5532" && center.active_booking
                            );
                          let inPersonTitle = "";
                          if (presenceTimeValid || hasActiveBookingCenter) {
                            inPersonTitle = "نوبت دهی اینترنتی";
                          } else {
                            inPersonTitle = "آدرس و اطلاعات بیشتر";
                          }
                          const inPersonOutline = !presenceTimeValid;
                          let inPersonTopTitle = "";
                          if (presenceTimeValid) {
                            const timeText =
                              formatTimeToFarsi(presence_freeturn);
                            inPersonTopTitle = `<span>اولین نوبت: <b>${timeText}</b></span>`;
                          }
                          const inPersonUrl = `/dr/${item.source.slug}`;
                          actions.push({
                            title: inPersonTitle,
                            outline: inPersonOutline,
                            top_title: inPersonTopTitle,
                            url: inPersonUrl
                          });
                          return actions;
                        })(),
                        experience: item.source.experience,
                        position: item.beforePersonalizationPosition,
                        has_presciption: false,
                        insurances: item.source.insurances,
                        experiment_details: {
                          search_index: "slim_clinic",
                          consult_search_index: "slim_clinic_online_visit"
                        },
                        expertises: item.source.expertises,
                        gender: item.source.gender,
                        expertise: item.source.expertise,
                        rate_info: item.source.rate_info,
                        consult_services: item.source.consult_services,
                        doctor_id: item.source.doctor_id,
                        number_of_visits: item.source.number_of_visits,
                        waiting_time_info: item.source.waiting_time_info,
                        slug: item.source.slug,
                        graduation_date: item.source.graduation_date,
                        star: item.source.star,
                        services: item.source.services.map(service => ({
                          workhours: service.workhours,
                          center_id: service.center_id,
                          id: service.id
                        })),
                        university_name: item.source.university_name,
                        display_name: item.source.display_name,
                        record_type: item.source.record_type,
                        center_id: item.source.center_id,
                        name: item.source.name,
                        medical_code: item.source.medical_code,
                        calculated_rate: item.source.calculated_rate
                      };
                    } else if (item.source.record_type === "center") {
                      return {
                        _id: item.documentId,
                        id: item.source.center_id,
                        server_id: item.source.server_id,
                        type: "center",
                        title: item.source.display_name,
                        image: `/getImage/p24/search-hospitalclinic/${
                          item.source.image ?? "noimage.png"
                        }?size=150`,
                        view: item.source.number_of_visits,
                        address: item.source.address,
                        city_id: item.source.city_id,
                        slug: item.source.slug,
                        url: `/center/${item.source.slug}`,
                        university_name: item.source.university_name,
                        name: item.source.name,
                        record_type: item.source.record_type,
                        status: item.source.status
                      };
                    }
                  })
                }
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
          })()}
        />
      ) : null}
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "fragmentApiRequest", "svg", "text", "searchResults"],
  fragmentApiRequest: ["fragmentApiRequest", "svg", "text"],
  svg: ["svg"],
  text: ["text"],
  searchResults: ["searchResults"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  fragmentApiRequest: typeof ApiRequest;
  svg: "svg";
  text: "div";
  searchResults: typeof SearchResults;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicMainSearchRequest__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicMainSearchRequest__VariantsArgs;
    args?: PlasmicMainSearchRequest__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicMainSearchRequest__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicMainSearchRequest__ArgsType,
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
          internalArgPropNames: PlasmicMainSearchRequest__ArgProps,
          internalVariantPropNames: PlasmicMainSearchRequest__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicMainSearchRequest__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicMainSearchRequest";
  } else {
    func.displayName = `PlasmicMainSearchRequest.${nodeName}`;
  }
  return func;
}

export const PlasmicMainSearchRequest = Object.assign(
  // Top-level PlasmicMainSearchRequest renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    fragmentApiRequest: makeNodeComponent("fragmentApiRequest"),
    svg: makeNodeComponent("svg"),
    text: makeNodeComponent("text"),
    searchResults: makeNodeComponent("searchResults"),

    // Metadata about props expected for PlasmicMainSearchRequest
    internalVariantProps: PlasmicMainSearchRequest__VariantProps,
    internalArgProps: PlasmicMainSearchRequest__ArgProps
  }
);

export default PlasmicMainSearchRequest;
/* prettier-ignore-end */
