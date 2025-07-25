/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: 8NbkXymcLwvMUC2yXeRrWk
// Component: 4Y4p7schjdHw

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

import BookingCenterListCard from "../../BookingCenterListCard"; // plasmic-import: nIhB-6JCIkj-/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: 8NbkXymcLwvMUC2yXeRrWk/projectcss
import sty from "./PlasmicBookingCenterList.module.css"; // plasmic-import: 4Y4p7schjdHw/css

createPlasmicElementProxy;

export type PlasmicBookingCenterList__VariantMembers = {};
export type PlasmicBookingCenterList__VariantsArgs = {};
type VariantPropType = keyof PlasmicBookingCenterList__VariantsArgs;
export const PlasmicBookingCenterList__VariantProps =
  new Array<VariantPropType>();

export type PlasmicBookingCenterList__ArgsType = {
  centers?: any;
  onClick?: (id: string) => void;
};
type ArgPropType = keyof PlasmicBookingCenterList__ArgsType;
export const PlasmicBookingCenterList__ArgProps = new Array<ArgPropType>(
  "centers",
  "onClick"
);

export type PlasmicBookingCenterList__OverridesType = {
  root?: Flex__<"div">;
  bookingCenterListCard?: Flex__<typeof BookingCenterListCard>;
};

export interface DefaultBookingCenterListProps {
  centers?: any;
  onClick?: (id: string) => void;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicBookingCenterList__RenderFunc(props: {
  variants: PlasmicBookingCenterList__VariantsArgs;
  args: PlasmicBookingCenterList__ArgsType;
  overrides: PlasmicBookingCenterList__OverridesType;
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
        sty.root
      )}
    >
      {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
        (() => {
          try {
            return $props.centers;
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
          <BookingCenterListCard
            data-plasmic-name={"bookingCenterListCard"}
            data-plasmic-override={overrides.bookingCenterListCard}
            address={(() => {
              try {
                return currentItem.address;
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
            className={classNames("__wab_instance", sty.bookingCenterListCard)}
            freeTurn={(() => {
              try {
                return currentItem.freeTurn;
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
            inActive={(() => {
              try {
                return !currentItem.isActive;
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
            isAvailable={(() => {
              try {
                return currentItem.isAvailable;
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
            key={currentIndex}
            nextFreeTurn={(() => {
              try {
                return currentItem.nextFreeTurn;
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
            onClick={async () => {
              const $steps = {};

              $steps["runOnClick"] = true
                ? (() => {
                    const actionArgs = {
                      eventRef: $props["onClick"],
                      args: [
                        (() => {
                          try {
                            return currentItem.id;
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
                $steps["runOnClick"] != null &&
                typeof $steps["runOnClick"] === "object" &&
                typeof $steps["runOnClick"].then === "function"
              ) {
                $steps["runOnClick"] = await $steps["runOnClick"];
              }
            }}
            phoneNumbers={(() => {
              try {
                return currentItem.phoneNumbers;
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
            title={(() => {
              try {
                return currentItem.name;
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
            type={(() => {
              try {
                return currentItem.type;
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
            waitingTime={(() => {
              try {
                return currentItem.waitingTime;
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
        );
      })}
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "bookingCenterListCard"],
  bookingCenterListCard: ["bookingCenterListCard"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  bookingCenterListCard: typeof BookingCenterListCard;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicBookingCenterList__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicBookingCenterList__VariantsArgs;
    args?: PlasmicBookingCenterList__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicBookingCenterList__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicBookingCenterList__ArgsType,
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
          internalArgPropNames: PlasmicBookingCenterList__ArgProps,
          internalVariantPropNames: PlasmicBookingCenterList__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicBookingCenterList__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicBookingCenterList";
  } else {
    func.displayName = `PlasmicBookingCenterList.${nodeName}`;
  }
  return func;
}

export const PlasmicBookingCenterList = Object.assign(
  // Top-level PlasmicBookingCenterList renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    bookingCenterListCard: makeNodeComponent("bookingCenterListCard"),

    // Metadata about props expected for PlasmicBookingCenterList
    internalVariantProps: PlasmicBookingCenterList__VariantProps,
    internalArgProps: PlasmicBookingCenterList__ArgProps
  }
);

export default PlasmicBookingCenterList;
/* prettier-ignore-end */
