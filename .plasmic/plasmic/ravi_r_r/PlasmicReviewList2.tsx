// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: Kz2u6VAJ02yE

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

import RaviFilters from "../../RaviFilters"; // plasmic-import: G0AKBMWLNTrM/component
import ReviewCard2 from "../../ReviewCard2"; // plasmic-import: fh6BVdoIxXpv/component
import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component
import RaviAlert from "../../RaviAlert"; // plasmic-import: 22UkaHSSFOEU/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_ravi_design_system_css from "../ravi_design_system/plasmic.module.css"; // plasmic-import: pkMLinFwM9pzwv5S5KpiAu/projectcss
import plasmic_paziresh_24_design_system_css from "../paziresh_24_design_system/plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from "./PlasmicReviewList2.module.css"; // plasmic-import: Kz2u6VAJ02yE/css

import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicReviewList2__VariantMembers = {};
export type PlasmicReviewList2__VariantsArgs = {};
type VariantPropType = keyof PlasmicReviewList2__VariantsArgs;
export const PlasmicReviewList2__VariantProps = new Array<VariantPropType>();

export type PlasmicReviewList2__ArgsType = {
  reviewResponse?: any;
  paginationLoadingStatus?: boolean;
  nextPageTrigger?: (page: string) => void;
  pageInfo?: any;
  onSearch?: (value: string) => void;
  onFilter?: (value: string) => void;
  onSort?: (value: string) => void;
  hideRates?: boolean;
  information?: any;
  centers?: any;
};
type ArgPropType = keyof PlasmicReviewList2__ArgsType;
export const PlasmicReviewList2__ArgProps = new Array<ArgPropType>(
  "reviewResponse",
  "paginationLoadingStatus",
  "nextPageTrigger",
  "pageInfo",
  "onSearch",
  "onFilter",
  "onSort",
  "hideRates",
  "information",
  "centers"
);

export type PlasmicReviewList2__OverridesType = {
  root?: Flex__<"div">;
  raviFilters?: Flex__<typeof RaviFilters>;
  reviewCard2?: Flex__<typeof ReviewCard2>;
  button?: Flex__<typeof Button>;
  raviAlert?: Flex__<typeof RaviAlert>;
};

export interface DefaultReviewList2Props {
  reviewResponse?: any;
  paginationLoadingStatus?: boolean;
  nextPageTrigger?: (page: string) => void;
  pageInfo?: any;
  onSearch?: (value: string) => void;
  onFilter?: (value: string) => void;
  onSort?: (value: string) => void;
  hideRates?: boolean;
  information?: any;
  centers?: any;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicReviewList2__RenderFunc(props: {
  variants: PlasmicReviewList2__VariantsArgs;
  args: PlasmicReviewList2__ArgsType;
  overrides: PlasmicReviewList2__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          paginationLoadingStatus: false,
          hideRates: false
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

  const $globalActions = useGlobalActions?.();

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
        plasmic_ravi_design_system_css.plasmic_tokens,
        plasmic_paziresh_24_design_system_css.plasmic_tokens,
        sty.root
      )}
    >
      {(() => {
        try {
          return !$props.hideRates;
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
        <div className={classNames(projectcss.all, sty.freeBox__ryKs)}>
          <div className={classNames(projectcss.all, sty.freeBox__gHhth)}>
            <RaviFilters
              data-plasmic-name={"raviFilters"}
              data-plasmic-override={overrides.raviFilters}
              className={classNames("__wab_instance", sty.raviFilters)}
              filterList={(() => {
                try {
                  return [
                    {
                      value: "all",
                      label: "همه نظرات"
                    },
                    ...($ctx.auth.isLogin
                      ? [
                          {
                            value: "my_feedbacks",
                            label: "نظرات من"
                          }
                        ]
                      : []),
                    ...($ctx.auth?.info?.id === $props.information?.user_id
                      ? [
                          {
                            value: "not_recommended",
                            label: "نظرات منفی"
                          }
                        ]
                      : []),
                    {
                      value: "visited",
                      label: "بیماران دارای نوبت"
                    },
                    ...$props.centers.map(center => ({
                      value: center.id,
                      label: center.name
                    }))
                  ];
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
              onChangeSearch={async value => {
                const $steps = {};

                $steps["runOnSearch"] = true
                  ? (() => {
                      const actionArgs = {
                        eventRef: $props["onSearch"],
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
                  $steps["runOnSearch"] != null &&
                  typeof $steps["runOnSearch"] === "object" &&
                  typeof $steps["runOnSearch"].then === "function"
                ) {
                  $steps["runOnSearch"] = await $steps["runOnSearch"];
                }

                $steps["invokeGlobalAction"] = true
                  ? (() => {
                      const actionArgs = {
                        args: [
                          (() => {
                            try {
                              return {
                                group: "feedback",
                                data: {
                                  doctor_id: $props.information.id,
                                  search_text: value
                                },
                                type: "search_in_comment"
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
                          })(),
                          (() => {
                            try {
                              return "https://splunk-ravi-hec.paziresh24.com";
                            } catch (e) {
                              if (
                                e instanceof TypeError ||
                                e?.plasmicType === "PlasmicUndefinedDataError"
                              ) {
                                return undefined;
                              }
                              throw e;
                            }
                          })(),
                          (() => {
                            try {
                              return "3dfb4505-637a-4dfa-8c5d-4e4343d6ba0d";
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
                  $steps["invokeGlobalAction"] != null &&
                  typeof $steps["invokeGlobalAction"] === "object" &&
                  typeof $steps["invokeGlobalAction"].then === "function"
                ) {
                  $steps["invokeGlobalAction"] = await $steps[
                    "invokeGlobalAction"
                  ];
                }
              }}
              onSelectFilter={async value => {
                const $steps = {};

                $steps["runOnFilter"] = true
                  ? (() => {
                      const actionArgs = {
                        eventRef: $props["onFilter"],
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
                  $steps["runOnFilter"] != null &&
                  typeof $steps["runOnFilter"] === "object" &&
                  typeof $steps["runOnFilter"].then === "function"
                ) {
                  $steps["runOnFilter"] = await $steps["runOnFilter"];
                }

                $steps["updateStateVariable"] = true
                  ? (() => {
                      const actionArgs = {};
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
                        undefined;
                      })?.apply(null, [actionArgs]);
                    })()
                  : undefined;
                if (
                  $steps["updateStateVariable"] != null &&
                  typeof $steps["updateStateVariable"] === "object" &&
                  typeof $steps["updateStateVariable"].then === "function"
                ) {
                  $steps["updateStateVariable"] = await $steps[
                    "updateStateVariable"
                  ];
                }
              }}
              onSelectSort={async value => {
                const $steps = {};

                $steps["runOnSort"] = true
                  ? (() => {
                      const actionArgs = {
                        eventRef: $props["onSort"],
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
                  $steps["runOnSort"] != null &&
                  typeof $steps["runOnSort"] === "object" &&
                  typeof $steps["runOnSort"].then === "function"
                ) {
                  $steps["runOnSort"] = await $steps["runOnSort"];
                }

                $steps["splunk"] = true
                  ? (() => {
                      const actionArgs = {
                        args: [
                          (() => {
                            try {
                              return {
                                group: "feedback",
                                data: {
                                  doctor_id: $props.information.id,
                                  sort: value
                                },
                                type: "sort_comment"
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
                          })(),
                          (() => {
                            try {
                              return "https://splunk-ravi-hec.paziresh24.com";
                            } catch (e) {
                              if (
                                e instanceof TypeError ||
                                e?.plasmicType === "PlasmicUndefinedDataError"
                              ) {
                                return undefined;
                              }
                              throw e;
                            }
                          })(),
                          (() => {
                            try {
                              return "3dfb4505-637a-4dfa-8c5d-4e4343d6ba0d";
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
                  $steps["splunk"] != null &&
                  typeof $steps["splunk"] === "object" &&
                  typeof $steps["splunk"].then === "function"
                ) {
                  $steps["splunk"] = await $steps["splunk"];
                }
              }}
              sortList={(() => {
                try {
                  return [
                    {
                      label: "مرتبط ترین",
                      value: "default_order"
                    },
                    {
                      label: "محبوب ترین",
                      value: "count_like"
                    },
                    {
                      label: "جدید ترین",
                      value: "created_at"
                    }
                  ];
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
          {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
            (() => {
              try {
                return $props.reviewResponse;
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return [];
                }
                throw e;
              }
            })()
          ).map((__plasmic_item_0, __plasmic_idx_0) => {
            const currentItem = __plasmic_item_0;
            const currentIndex = __plasmic_idx_0;
            return (
              <Stack__
                as={"div"}
                hasGap={true}
                className={classNames(projectcss.all, sty.freeBox__n1Ldu)}
                key={currentIndex}
              >
                <ReviewCard2
                  data-plasmic-name={"reviewCard2"}
                  data-plasmic-override={overrides.reviewCard2}
                  avgRateValue={(() => {
                    try {
                      return currentItem.avg_rate_value;
                    } catch (e) {
                      if (
                        e instanceof TypeError ||
                        e?.plasmicType === "PlasmicUndefinedDataError"
                      ) {
                        return 0;
                      }
                      throw e;
                    }
                  })()}
                  className={classNames("__wab_instance", sty.reviewCard2)}
                  commentText={(() => {
                    try {
                      return currentItem.description;
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
                  docCenter={(() => {
                    try {
                      return currentItem.center_name;
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
                  doctorId={(() => {
                    try {
                      return $props.information.user_id;
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
                  doctorSlug={(() => {
                    try {
                      return currentItem.doctor_slug;
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
                  feedbackId={(() => {
                    try {
                      return currentItem.Id;
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
                  like={(() => {
                    try {
                      return currentItem.count_like;
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
                  setTime={(() => {
                    try {
                      return (() => {
                        return (() => {
                          const createdDate = new Date(currentItem.created_at);
                          const currentDate = new Date();
                          const timeDiff = Math.abs(currentDate - createdDate);
                          const daysDiff = Math.ceil(
                            timeDiff / (1000 * 60 * 60 * 24)
                          );
                          const numbers = [
                            "صفر",
                            "یک",
                            "دو",
                            "سه",
                            "چهار",
                            "پنج",
                            "شش",
                            "هفت",
                            "هشت",
                            "نه",
                            "ده"
                          ];

                          const numToPersian = num => {
                            const units = [
                              "",
                              "یک",
                              "دو",
                              "سه",
                              "چهار",
                              "پنج",
                              "شش",
                              "هفت",
                              "هشت",
                              "نه"
                            ];

                            const teens = [
                              "ده",
                              "یازده",
                              "دوازده",
                              "سیزده",
                              "چهارده",
                              "پانزده",
                              "شانزده",
                              "هفده",
                              "هجده",
                              "نوزده"
                            ];

                            const tens = [
                              "",
                              "ده",
                              "بیست",
                              "سی",
                              "چهل",
                              "پنجاه",
                              "شصت",
                              "هفتاد",
                              "هشتاد",
                              "نود"
                            ];

                            if (num < 10) return units[num];
                            if (num < 20) return teens[num - 10];
                            if (num < 100) {
                              const ten = Math.floor(num / 10);
                              const unit = num % 10;
                              return `${tens[ten]}${
                                unit > 0 ? ` و ${units[unit]}` : ""
                              }`;
                            }
                            if (num < 1000) {
                              const hundred = Math.floor(num / 100);
                              const remainder = num % 100;
                              return `${units[hundred]}صد${
                                remainder > 0
                                  ? ` و ${numToPersian(remainder)}`
                                  : ""
                              }`;
                            }
                          };
                          if (daysDiff === 0) {
                            return "امروز";
                          } else if (daysDiff === 1) {
                            return "دیروز";
                          } else if (daysDiff < 7) {
                            return `${numbers[daysDiff]} روز پیش`;
                          } else if (daysDiff < 30) {
                            const weeksDiff = Math.floor(daysDiff / 7);
                            if (weeksDiff === 1) {
                              return "یک هفته پیش";
                            }
                            return `${numbers[weeksDiff]} هفته پیش`;
                          } else if (daysDiff < 365) {
                            const monthsDiff = Math.floor(daysDiff / 30);
                            if (monthsDiff === 1) {
                              return "یک ماه پیش";
                            }
                            return `${numToPersian(monthsDiff)} ماه پیش`;
                          } else {
                            const yearsDiff = Math.floor(daysDiff / 365);
                            if (yearsDiff === 1) {
                              return "یک سال پیش";
                            } else if (yearsDiff === 2) {
                              return "دو سال پیش";
                            } else {
                              return `${numToPersian(yearsDiff)} سال پیش`;
                            }
                          }
                        })();
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
                  userId={(() => {
                    try {
                      return currentItem.user_id;
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
                  visitedTag={(() => {
                    try {
                      return currentItem.visit_status === "visited";
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
                />

                <div
                  className={classNames(projectcss.all, sty.freeBox__oRu6)}
                />
              </Stack__>
            );
          })}
          <div className={classNames(projectcss.all, sty.freeBox__d7Bcd)}>
            <Button
              data-plasmic-name={"button"}
              data-plasmic-override={overrides.button}
              children2={
                "\u0645\u0634\u0627\u0647\u062f\u0647 \u0628\u06cc\u0634\u062a\u0631"
              }
              className={classNames("__wab_instance", sty.button)}
              loading={(() => {
                try {
                  return $props.paginationLoadingStatus;
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

                $steps["runNextPageTrigger"] = true
                  ? (() => {
                      const actionArgs = {
                        eventRef: $props["nextPageTrigger"],
                        args: [
                          (() => {
                            try {
                              return $props.pageInfo.page + 1;
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
                  $steps["runNextPageTrigger"] != null &&
                  typeof $steps["runNextPageTrigger"] === "object" &&
                  typeof $steps["runNextPageTrigger"].then === "function"
                ) {
                  $steps["runNextPageTrigger"] = await $steps[
                    "runNextPageTrigger"
                  ];
                }

                $steps["splunk"] = true
                  ? (() => {
                      const actionArgs = {
                        args: [
                          (() => {
                            try {
                              return {
                                group: "feedback",
                                data: {
                                  doctor_id: $props.information.id,
                                  page: $props.pageInfo.page + 1
                                },
                                type: "show_more_button"
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
                          })(),
                          undefined,
                          (() => {
                            try {
                              return "f4fd4b50-fe90-48f3-a1ab-5a5070140318";
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
                  $steps["splunk"] != null &&
                  typeof $steps["splunk"] === "object" &&
                  typeof $steps["splunk"].then === "function"
                ) {
                  $steps["splunk"] = await $steps["splunk"];
                }
              }}
              outline={true}
            />
          </div>
        </div>
      ) : null}
      {(() => {
        try {
          return $props.hideRates;
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
        <div className={classNames(projectcss.all, sty.freeBox___1XPtz)}>
          <RaviAlert
            data-plasmic-name={"raviAlert"}
            data-plasmic-override={overrides.raviAlert}
            className={classNames("__wab_instance", sty.raviAlert)}
            content={
              "\u0628\u0647 \u062f\u0631\u062e\u0648\u0627\u0633\u062a \u067e\u0632\u0634\u06a9\u060c \u0645\u0634\u0627\u0647\u062f\u0647 \u0628\u062e\u0634 \u0646\u0638\u0631\u0627\u062a \u0627\u0645\u06a9\u0627\u0646 \u067e\u0630\u06cc\u0631 \u0646\u0645\u06cc \u0628\u0627\u0634\u062f."
            }
          />
        </div>
      ) : null}
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "raviFilters", "reviewCard2", "button", "raviAlert"],
  raviFilters: ["raviFilters"],
  reviewCard2: ["reviewCard2"],
  button: ["button"],
  raviAlert: ["raviAlert"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  raviFilters: typeof RaviFilters;
  reviewCard2: typeof ReviewCard2;
  button: typeof Button;
  raviAlert: typeof RaviAlert;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicReviewList2__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicReviewList2__VariantsArgs;
    args?: PlasmicReviewList2__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicReviewList2__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicReviewList2__ArgsType,
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
          internalArgPropNames: PlasmicReviewList2__ArgProps,
          internalVariantPropNames: PlasmicReviewList2__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicReviewList2__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicReviewList2";
  } else {
    func.displayName = `PlasmicReviewList2.${nodeName}`;
  }
  return func;
}

export const PlasmicReviewList2 = Object.assign(
  // Top-level PlasmicReviewList2 renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    raviFilters: makeNodeComponent("raviFilters"),
    reviewCard2: makeNodeComponent("reviewCard2"),
    button: makeNodeComponent("button"),
    raviAlert: makeNodeComponent("raviAlert"),

    // Metadata about props expected for PlasmicReviewList2
    internalVariantProps: PlasmicReviewList2__VariantProps,
    internalArgProps: PlasmicReviewList2__ArgProps
  }
);

export default PlasmicReviewList2;
/* prettier-ignore-end */
