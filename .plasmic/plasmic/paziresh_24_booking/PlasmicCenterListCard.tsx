// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: 8NbkXymcLwvMUC2yXeRrWk
// Component: nIhB-6JCIkj-

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

import BookingNotAvailible from "../../BookingNotAvailible"; // plasmic-import: HI9wFtACqPcK/component
import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component
import Dialog from "../../Dialog"; // plasmic-import: FJiI2-N1is_F/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: 8NbkXymcLwvMUC2yXeRrWk/projectcss
import sty from "./PlasmicCenterListCard.module.css"; // plasmic-import: nIhB-6JCIkj-/css

import Icon9Icon from "./icons/PlasmicIcon__Icon9"; // plasmic-import: 0gLQ04Nbu4rj/icon
import Icon10Icon from "./icons/PlasmicIcon__Icon10"; // plasmic-import: 6P7akNzsUIt3/icon
import Icon7Icon from "./icons/PlasmicIcon__Icon7"; // plasmic-import: lTkwh8jbYYBj/icon
import Icon5Icon from "./icons/PlasmicIcon__Icon5"; // plasmic-import: aV0jjDZF4Ql6/icon
import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicCenterListCard__VariantMembers = {
  type: "online" | "hospital" | "office";
  inActive: "inActive";
};
export type PlasmicCenterListCard__VariantsArgs = {
  type?: SingleChoiceArg<"online" | "hospital" | "office">;
  inActive?: SingleBooleanChoiceArg<"inActive">;
};
type VariantPropType = keyof PlasmicCenterListCard__VariantsArgs;
export const PlasmicCenterListCard__VariantProps = new Array<VariantPropType>(
  "type",
  "inActive"
);

export type PlasmicCenterListCard__ArgsType = {
  title?: string;
  address?: string;
  freeTurn?: string;
  nextFreeTurn?: string;
  isAvailable?: boolean;
  phoneNumbers?: any;
  waitingTime?: string;
  onClick?: () => void;
};
type ArgPropType = keyof PlasmicCenterListCard__ArgsType;
export const PlasmicCenterListCard__ArgProps = new Array<ArgPropType>(
  "title",
  "address",
  "freeTurn",
  "nextFreeTurn",
  "isAvailable",
  "phoneNumbers",
  "waitingTime",
  "onClick"
);

export type PlasmicCenterListCard__OverridesType = {
  root?: Flex__<"div">;
  bookingNotAvailible?: Flex__<typeof BookingNotAvailible>;
  dialog?: Flex__<typeof Dialog>;
};

export interface DefaultCenterListCardProps {
  title?: string;
  address?: string;
  freeTurn?: string;
  nextFreeTurn?: string;
  isAvailable?: boolean;
  phoneNumbers?: any;
  waitingTime?: string;
  onClick?: () => void;
  type?: SingleChoiceArg<"online" | "hospital" | "office">;
  inActive?: SingleBooleanChoiceArg<"inActive">;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicCenterListCard__RenderFunc(props: {
  variants: PlasmicCenterListCard__VariantsArgs;
  args: PlasmicCenterListCard__ArgsType;
  overrides: PlasmicCenterListCard__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          isAvailable: false
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
        path: "inActive",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.inActive
      },
      {
        path: "type",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.type
      },
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
        sty.root,
        {
          [sty.rootinActive]: hasVariant($state, "inActive", "inActive"),
          [sty.rootinActive_type_office]:
            hasVariant($state, "inActive", "inActive") &&
            hasVariant($state, "type", "office"),
          [sty.roottype_hospital]: hasVariant($state, "type", "hospital"),
          [sty.roottype_office]: hasVariant($state, "type", "office"),
          [sty.roottype_online]: hasVariant($state, "type", "online")
        }
      )}
      onClick={async event => {
        const $steps = {};

        $steps["runOnClick"] = !$state.inActive
          ? (() => {
              const actionArgs = { eventRef: $props["onClick"] };
              return (({ eventRef, args }) => {
                return eventRef?.(...(args ?? []));
              })?.apply(null, [actionArgs]);
            })()
          : undefined;
        if (
          $steps["runOnClick"] != null &&
          typeof $steps["runOnClick"] === "object" &&
          typeof $steps["runOnClick"].then === "function"
        ) {
          $steps["runOnClick"] = await $steps["runOnClick"];
        }
      }}
    >
      <div
        className={classNames(projectcss.all, sty.freeBox___3OKkV, {
          [sty.freeBoxinActive___3OKkVnPejH]: hasVariant(
            $state,
            "inActive",
            "inActive"
          ),
          [sty.freeBoxinActive_type_online___3OKkVnPejHHxzXc]:
            hasVariant($state, "type", "online") &&
            hasVariant($state, "inActive", "inActive"),
          [sty.freeBoxtype_office___3OKkVcViZf]: hasVariant(
            $state,
            "type",
            "office"
          ),
          [sty.freeBoxtype_online___3OKkVhxzXc]: hasVariant(
            $state,
            "type",
            "online"
          )
        })}
      >
        <Stack__
          as={"div"}
          hasGap={true}
          className={classNames(projectcss.all, sty.freeBox__euqmt, {
            [sty.freeBoxinActive__euqmtNPejH]: hasVariant(
              $state,
              "inActive",
              "inActive"
            )
          })}
        >
          <div
            className={classNames(projectcss.all, sty.freeBox__w2VtW, {
              [sty.freeBoxinActive__w2VtWnPejH]: hasVariant(
                $state,
                "inActive",
                "inActive"
              ),
              [sty.freeBoxtype_hospital__w2VtWdUdd3]: hasVariant(
                $state,
                "type",
                "hospital"
              ),
              [sty.freeBoxtype_online__w2VtWhxzXc]: hasVariant(
                $state,
                "type",
                "online"
              )
            })}
          >
            <Icon9Icon
              className={classNames(projectcss.all, sty.svg__rChDo, {
                [sty.svgtype_hospital__rChDOdUdd3]: hasVariant(
                  $state,
                  "type",
                  "hospital"
                ),
                [sty.svgtype_online__rChDOhxzXc]: hasVariant(
                  $state,
                  "type",
                  "online"
                )
              })}
              role={"img"}
            />

            <Icon10Icon
              className={classNames(projectcss.all, sty.svg__e5OhW, {
                [sty.svgtype_hospital__e5OhWdUdd3]: hasVariant(
                  $state,
                  "type",
                  "hospital"
                ),
                [sty.svgtype_office__e5OhWcViZf]: hasVariant(
                  $state,
                  "type",
                  "office"
                ),
                [sty.svgtype_online__e5OhWhxzXc]: hasVariant(
                  $state,
                  "type",
                  "online"
                )
              })}
              role={"img"}
            />

            <Icon7Icon
              className={classNames(projectcss.all, sty.svg__c1OeN, {
                [sty.svginActive__c1OeNnPejH]: hasVariant(
                  $state,
                  "inActive",
                  "inActive"
                ),
                [sty.svgtype_hospital__c1OeNdUdd3]: hasVariant(
                  $state,
                  "type",
                  "hospital"
                ),
                [sty.svgtype_office__c1OeNcViZf]: hasVariant(
                  $state,
                  "type",
                  "office"
                ),
                [sty.svgtype_online__c1OeNhxzXc]: hasVariant(
                  $state,
                  "type",
                  "online"
                )
              })}
              role={"img"}
            />
          </div>
          <div
            className={classNames(projectcss.all, sty.freeBox__naxc8, {
              [sty.freeBoxinActive__naxc8NPejH]: hasVariant(
                $state,
                "inActive",
                "inActive"
              ),
              [sty.freeBoxinActive_type_office__naxc8NPejHCViZf]:
                hasVariant($state, "inActive", "inActive") &&
                hasVariant($state, "type", "office"),
              [sty.freeBoxinActive_type_online__naxc8NPejHHxzXc]:
                hasVariant($state, "type", "online") &&
                hasVariant($state, "inActive", "inActive"),
              [sty.freeBoxtype_hospital__naxc8DUdd3]: hasVariant(
                $state,
                "type",
                "hospital"
              ),
              [sty.freeBoxtype_online__naxc8HxzXc]: hasVariant(
                $state,
                "type",
                "online"
              )
            })}
          >
            <div
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text__g0Smo,
                {
                  [sty.textinActive__g0SmoNPejH]: hasVariant(
                    $state,
                    "inActive",
                    "inActive"
                  ),
                  [sty.texttype_hospital__g0SmodUdd3]: hasVariant(
                    $state,
                    "type",
                    "hospital"
                  ),
                  [sty.texttype_online__g0SmohxzXc]: hasVariant(
                    $state,
                    "type",
                    "online"
                  )
                }
              )}
            >
              <React.Fragment>
                {(() => {
                  try {
                    return $props.title;
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "PlasmicUndefinedDataError"
                    ) {
                      return "\u0645\u0637\u0628 \u062f\u06a9\u062a\u0631 \u0633\u06cc\u062f\u0639\u0644\u06cc\u0631\u0636\u0627 \u0645\u0631\u0648\u062c\u06cc";
                    }
                    throw e;
                  }
                })()}
              </React.Fragment>
            </div>
            <Icon5Icon
              className={classNames(projectcss.all, sty.svg__dVe8D)}
              role={"img"}
            />
          </div>
        </Stack__>
        {(
          hasVariant($state, "inActive", "inActive")
            ? (() => {
                try {
                  return !$props.isOnlineType;
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return true;
                  }
                  throw e;
                }
              })()
            : hasVariant($state, "type", "online")
            ? true
            : (() => {
                try {
                  return !$props.isOnlineType;
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return true;
                  }
                  throw e;
                }
              })()
        ) ? (
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text__sdKiX,
              {
                [sty.textinActive__sdKiXnPejH]: hasVariant(
                  $state,
                  "inActive",
                  "inActive"
                ),
                [sty.texttype_office__sdKiXcViZf]: hasVariant(
                  $state,
                  "type",
                  "office"
                ),
                [sty.texttype_online__sdKiXhxzXc]: hasVariant(
                  $state,
                  "type",
                  "online"
                )
              }
            )}
          >
            <React.Fragment>
              {(() => {
                try {
                  return $props.address;
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return "\u06a9\u0627\u0634\u0627\u0646\u060c \u062e\u06cc\u0627\u0628\u0627\u0646 \u0627\u0645\u0627\u0645 \u062e\u0645\u06cc\u0646\u06cc\u060c \u0631\u0648\u0628\u0631\u0648\u06cc \u062f\u0631\u0645\u0627\u0646\u06af\u0627\u0647 \u06af\u0644\u0627\u0628\u0686\u06cc\u060c  \u0637\u0628\u0642\u0647 \u062f\u0648\u0645 \u0633\u0627\u062e\u062a\u0645\u0627\u0646 \u067e\u0632\u0634\u06a9\u0627\u0646 \u0627\u0645\u0627\u0645 \u0631\u0636\u0627 (\u0639)";
                  }
                  throw e;
                }
              })()}
            </React.Fragment>
          </div>
        ) : null}
      </div>
      {(() => {
        try {
          return (
            (!!$props.freeTurn && $props.isAvailable) || !!$props.waitingTime
          );
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
          className={classNames(projectcss.all, sty.freeBox__dMd33, {
            [sty.freeBoxinActive__dMd33NPejH]: hasVariant(
              $state,
              "inActive",
              "inActive"
            )
          })}
        >
          {(() => {
            try {
              return !!$props.freeTurn && $props.isAvailable;
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
            <div
              className={classNames(projectcss.all, sty.freeBox__h91Lz, {
                [sty.freeBoxinActive__h91LzNPejH]: hasVariant(
                  $state,
                  "inActive",
                  "inActive"
                ),
                [sty.freeBoxtype_hospital__h91LzdUdd3]: hasVariant(
                  $state,
                  "type",
                  "hospital"
                )
              })}
            >
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__sp5S9,
                  {
                    [sty.texttype_online__sp5S9HxzXc]: hasVariant(
                      $state,
                      "type",
                      "online"
                    )
                  }
                )}
              >
                {hasVariant($state, "type", "online") ? (
                  <React.Fragment>
                    {(() => {
                      try {
                        return "زمان پاسخگویی:";
                      } catch (e) {
                        if (
                          e instanceof TypeError ||
                          e?.plasmicType === "PlasmicUndefinedDataError"
                        ) {
                          return "\u0627\u0648\u0644\u06cc\u0646 \u0646\u0648\u0628\u062a \u062e\u0627\u0644\u06cc:";
                        }
                        throw e;
                      }
                    })()}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {(() => {
                      try {
                        return "اولین نوبت خالی:";
                      } catch (e) {
                        if (
                          e instanceof TypeError ||
                          e?.plasmicType === "PlasmicUndefinedDataError"
                        ) {
                          return "\u0627\u0648\u0644\u06cc\u0646 \u0646\u0648\u0628\u062a \u062e\u0627\u0644\u06cc:";
                        }
                        throw e;
                      }
                    })()}
                  </React.Fragment>
                )}
              </div>
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__rCwe
                )}
              >
                <React.Fragment>
                  {(() => {
                    try {
                      return $props.freeTurn;
                    } catch (e) {
                      if (
                        e instanceof TypeError ||
                        e?.plasmicType === "PlasmicUndefinedDataError"
                      ) {
                        return "\u0627\u0645\u0631\u0648\u0632 6:00 \u0639\u0635\u0631";
                      }
                      throw e;
                    }
                  })()}
                </React.Fragment>
              </div>
            </div>
          ) : null}
          {(() => {
            try {
              return !!$props.waitingTime;
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
            <Stack__
              as={"div"}
              hasGap={true}
              className={classNames(projectcss.all, sty.freeBox__tVlyB, {
                [sty.freeBoxinActive__tVlyBnPejH]: hasVariant(
                  $state,
                  "inActive",
                  "inActive"
                ),
                [sty.freeBoxtype_hospital__tVlyBdUdd3]: hasVariant(
                  $state,
                  "type",
                  "hospital"
                )
              })}
            >
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__akpHx,
                  {
                    [sty.texttype_online__akpHxhxzXc]: hasVariant(
                      $state,
                      "type",
                      "online"
                    )
                  }
                )}
              >
                {hasVariant($state, "type", "online") ? (
                  <React.Fragment>
                    {(() => {
                      try {
                        return "زمان پاسخگویی:";
                      } catch (e) {
                        if (
                          e instanceof TypeError ||
                          e?.plasmicType === "PlasmicUndefinedDataError"
                        ) {
                          return "\u0627\u0648\u0644\u06cc\u0646 \u0646\u0648\u0628\u062a \u062e\u0627\u0644\u06cc:";
                        }
                        throw e;
                      }
                    })()}
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {(() => {
                      try {
                        return "میانگین زمان انتظار تا ویزیت:";
                      } catch (e) {
                        if (
                          e instanceof TypeError ||
                          e?.plasmicType === "PlasmicUndefinedDataError"
                        ) {
                          return "\u0627\u0648\u0644\u06cc\u0646 \u0646\u0648\u0628\u062a \u062e\u0627\u0644\u06cc:";
                        }
                        throw e;
                      }
                    })()}
                  </React.Fragment>
                )}
              </div>
              <div
                className={classNames(
                  projectcss.all,
                  projectcss.__wab_text,
                  sty.text__l8IiZ
                )}
              >
                <React.Fragment>
                  {(() => {
                    try {
                      return $props.waitingTime;
                    } catch (e) {
                      if (
                        e instanceof TypeError ||
                        e?.plasmicType === "PlasmicUndefinedDataError"
                      ) {
                        return "\u0627\u0645\u0631\u0648\u0632 6:00 \u0639\u0635\u0631";
                      }
                      throw e;
                    }
                  })()}
                </React.Fragment>
              </div>
            </Stack__>
          ) : null}
        </div>
      ) : null}
      {(
        hasVariant($state, "inActive", "inActive")
          ? (() => {
              try {
                return !$props.isAvailable || !!$state.inActive;
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return true;
                }
                throw e;
              }
            })()
          : (() => {
              try {
                return !$props.isAvailable || $state.inActive;
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return true;
                }
                throw e;
              }
            })()
      ) ? (
        <div
          className={classNames(projectcss.all, sty.freeBox__hWtMj, {
            [sty.freeBoxinActive__hWtMjNPejH]: hasVariant(
              $state,
              "inActive",
              "inActive"
            )
          })}
        >
          <BookingNotAvailible
            data-plasmic-name={"bookingNotAvailible"}
            data-plasmic-override={overrides.bookingNotAvailible}
            className={classNames("__wab_instance", sty.bookingNotAvailible, {
              [sty.bookingNotAvailibleinActive]: hasVariant(
                $state,
                "inActive",
                "inActive"
              ),
              [sty.bookingNotAvailibletype_hospital]: hasVariant(
                $state,
                "type",
                "hospital"
              )
            })}
            message={
              "\u0632\u0645\u0627\u0646 \u0646\u0648\u0628\u062a \u062f\u0647\u06cc \u067e\u0632\u0634\u06a9 \u0628\u0647 \u067e\u0627\u06cc\u0627\u0646 \u0631\u0633\u06cc\u062f\u0647 \u0627\u0633\u062a."
            }
            nextFreeTurn={(() => {
              try {
                return $props.nextFreeTurn;
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
      ) : null}
      {(
        hasVariant($state, "inActive", "inActive")
          ? (() => {
              try {
                return $props.isAvailable;
              } catch (e) {
                if (
                  e instanceof TypeError ||
                  e?.plasmicType === "PlasmicUndefinedDataError"
                ) {
                  return true;
                }
                throw e;
              }
            })()
          : true
      ) ? (
        <div
          className={classNames(projectcss.all, sty.freeBox__gtke, {
            [sty.freeBoxinActive__gtkenPejH]: hasVariant(
              $state,
              "inActive",
              "inActive"
            )
          })}
        >
          <div
            className={classNames(
              projectcss.all,
              projectcss.__wab_text,
              sty.text___9MYwY,
              {
                [sty.textinActive___9MYwYnPejH]: hasVariant(
                  $state,
                  "inActive",
                  "inActive"
                )
              }
            )}
          >
            {
              "\u0646\u0648\u0628\u062a \u062f\u0647\u06cc \u0627\u06cc\u0646\u062a\u0631\u0646\u062a\u06cc \u062f\u0631 \u0627\u06cc\u0646 \u0645\u0637\u0628 \u063a\u06cc\u0631 \u0641\u0639\u0627\u0644 \u0627\u0633\u062a."
            }
          </div>
          {(
            hasVariant($state, "inActive", "inActive")
              ? (() => {
                  try {
                    return $props.phoneNumbers.length !== 0;
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "PlasmicUndefinedDataError"
                    ) {
                      return true;
                    }
                    throw e;
                  }
                })()
              : true
          ) ? (
            <Button
              children2={
                <React.Fragment>
                  {(() => {
                    try {
                      return `تماس تلفنی با ${
                        $state?.type === "hospital" ? "مرکز درمانی" : "مطب پزشک"
                      }`;
                    } catch (e) {
                      if (
                        e instanceof TypeError ||
                        e?.plasmicType === "PlasmicUndefinedDataError"
                      ) {
                        return "Button";
                      }
                      throw e;
                    }
                  })()}
                </React.Fragment>
              }
              className={classNames("__wab_instance", sty.button__bWb6L, {
                [sty.buttoninActive__bWb6LnPejH]: hasVariant(
                  $state,
                  "inActive",
                  "inActive"
                )
              })}
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
              outline={true}
            />
          ) : null}
          <Dialog
            data-plasmic-name={"dialog"}
            data-plasmic-override={overrides.dialog}
            body={
              <div
                className={classNames(projectcss.all, sty.freeBox__ovUQk, {
                  [sty.freeBoxinActive__ovUQkNPejH]: hasVariant(
                    $state,
                    "inActive",
                    "inActive"
                  )
                })}
              >
                {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
                  (() => {
                    try {
                      return $props.phoneNumbers;
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
                    <Button
                      children2={
                        <React.Fragment>
                          {(() => {
                            try {
                              return currentItem;
                            } catch (e) {
                              if (
                                e instanceof TypeError ||
                                e?.plasmicType === "PlasmicUndefinedDataError"
                              ) {
                                return "Button";
                              }
                              throw e;
                            }
                          })()}
                        </React.Fragment>
                      }
                      className={classNames(
                        "__wab_instance",
                        sty.button__dLaJz
                      )}
                      key={currentIndex}
                      onClick={async event => {
                        const $steps = {};

                        $steps["runCode"] = true
                          ? (() => {
                              const actionArgs = {
                                customFunction: async () => {
                                  return (location.href = `tel:${currentItem}`);
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
                      outline={true}
                    />
                  );
                })}
              </div>
            }
            className={classNames("__wab_instance", sty.dialog, {
              [sty.dialoginActive]: hasVariant($state, "inActive", "inActive")
            })}
            noTrigger={true}
            onOpenChange={generateStateOnChangeProp($state, ["dialog", "open"])}
            open={generateStateValueProp($state, ["dialog", "open"])}
            title={
              <React.Fragment>
                {(() => {
                  try {
                    return `تماس تلفنی با ${
                      $state?.type === "hospital" ? "مرکز درمانی" : "مطب پزشک"
                    }`;
                  } catch (e) {
                    if (
                      e instanceof TypeError ||
                      e?.plasmicType === "PlasmicUndefinedDataError"
                    ) {
                      return "Dialog title";
                    }
                    throw e;
                  }
                })()}
              </React.Fragment>
            }
            trigger={
              <Button
                children2={
                  <div
                    className={classNames(
                      projectcss.all,
                      projectcss.__wab_text,
                      sty.text__fmRb5
                    )}
                  >
                    {"Show dialog"}
                  </div>
                }
                className={classNames("__wab_instance", {
                  [sty.buttoninActive__oMbj6NPejH]: hasVariant(
                    $state,
                    "inActive",
                    "inActive"
                  )
                })}
                endIcon={
                  <ChevronLeftIcon
                    className={classNames(projectcss.all, sty.svg__pWp9W)}
                    role={"img"}
                  />
                }
                startIcon={
                  <ChevronRightIcon
                    className={classNames(projectcss.all, sty.svg__avOGg)}
                    role={"img"}
                  />
                }
              />
            }
          />
        </div>
      ) : null}
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "bookingNotAvailible", "dialog"],
  bookingNotAvailible: ["bookingNotAvailible"],
  dialog: ["dialog"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  bookingNotAvailible: typeof BookingNotAvailible;
  dialog: typeof Dialog;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicCenterListCard__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicCenterListCard__VariantsArgs;
    args?: PlasmicCenterListCard__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicCenterListCard__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicCenterListCard__ArgsType,
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
          internalArgPropNames: PlasmicCenterListCard__ArgProps,
          internalVariantPropNames: PlasmicCenterListCard__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicCenterListCard__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicCenterListCard";
  } else {
    func.displayName = `PlasmicCenterListCard.${nodeName}`;
  }
  return func;
}

export const PlasmicCenterListCard = Object.assign(
  // Top-level PlasmicCenterListCard renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    bookingNotAvailible: makeNodeComponent("bookingNotAvailible"),
    dialog: makeNodeComponent("dialog"),

    // Metadata about props expected for PlasmicCenterListCard
    internalVariantProps: PlasmicCenterListCard__VariantProps,
    internalArgProps: PlasmicCenterListCard__ArgProps
  }
);

export default PlasmicCenterListCard;
/* prettier-ignore-end */
