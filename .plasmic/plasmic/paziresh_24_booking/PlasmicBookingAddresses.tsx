/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: 8NbkXymcLwvMUC2yXeRrWk
// Component: xUh1xJ9SUAar

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
import BookingAddressesCard from "../../BookingAddressesCard"; // plasmic-import: z1k0-vbkFtby/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: 8NbkXymcLwvMUC2yXeRrWk/projectcss
import sty from "./PlasmicBookingAddresses.module.css"; // plasmic-import: xUh1xJ9SUAar/css

import Icon14Icon from "./icons/PlasmicIcon__Icon14"; // plasmic-import: B-8Hh4cFrk03/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicBookingAddresses__VariantMembers = {};
export type PlasmicBookingAddresses__VariantsArgs = {};
type VariantPropType = keyof PlasmicBookingAddresses__VariantsArgs;
export const PlasmicBookingAddresses__VariantProps =
  new Array<VariantPropType>();

export type PlasmicBookingAddresses__ArgsType = {
  centers?: any;
  slug?: string;
};
type ArgPropType = keyof PlasmicBookingAddresses__ArgsType;
export const PlasmicBookingAddresses__ArgProps = new Array<ArgPropType>(
  "centers",
  "slug"
);

export type PlasmicBookingAddresses__OverridesType = {
  root?: Flex__<"div">;
  h2?: Flex__<"h2">;
  button?: Flex__<typeof Button>;
  svg?: Flex__<"svg">;
  text?: Flex__<"div">;
  bookingAddressesCard?: Flex__<typeof BookingAddressesCard>;
};

export interface DefaultBookingAddressesProps {
  centers?: any;
  slug?: string;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicBookingAddresses__RenderFunc(props: {
  variants: PlasmicBookingAddresses__VariantsArgs;
  args: PlasmicBookingAddresses__ArgsType;
  overrides: PlasmicBookingAddresses__OverridesType;
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
      <div className={classNames(projectcss.all, sty.freeBox__ks94I)}>
        <h2
          data-plasmic-name={"h2"}
          data-plasmic-override={overrides.h2}
          className={classNames(
            projectcss.all,
            projectcss.h2,
            projectcss.__wab_text,
            sty.h2
          )}
        >
          {
            "\u0622\u062f\u0631\u0633 \u0648 \u062a\u0644\u0641\u0646 \u062a\u0645\u0627\u0633"
          }
        </h2>
        <Button
          data-plasmic-name={"button"}
          data-plasmic-override={overrides.button}
          children2={
            <div
              data-plasmic-name={"text"}
              data-plasmic-override={overrides.text}
              className={classNames(
                projectcss.all,
                projectcss.__wab_text,
                sty.text
              )}
            >
              {
                "\u06af\u0632\u0627\u0631\u0634 \u062a\u0644\u0641\u0646 \u0648 \u0622\u062f\u0631\u0633 \u0635\u062d\u06cc\u062d"
              }
            </div>
          }
          className={classNames("__wab_instance", sty.button)}
          color={"text"}
          link={(() => {
            try {
              return `https://www.paziresh24.com/patient/contribute/?slug=${$props.slug}&test_src=profile_eslah`;
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
          showStartIcon={true}
          startIcon={
            <Icon14Icon
              data-plasmic-name={"svg"}
              data-plasmic-override={overrides.svg}
              className={classNames(projectcss.all, sty.svg)}
              role={"img"}
            />
          }
        />
      </div>
      <div className={classNames(projectcss.all, sty.freeBox___4Opzc)}>
        {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
          (() => {
            try {
              return $props.centers
                .filter(item => item.id != 5532)
                .map(center => ({
                  title: center.name,
                  map: center.map,
                  id: center.id,
                  address: center.address,
                  city: center.city,
                  display_number_array: center.display_number_array,
                  slug: center.slug,
                  center_type: center.center_type == 1 ? "office" : "hospital",
                  description: center.description?.trim(),
                  userCenterId: center.user_center_id,
                  centerName: center.name
                }));
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
            <BookingAddressesCard
              data-plasmic-name={"bookingAddressesCard"}
              data-plasmic-override={overrides.bookingAddressesCard}
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
              centerId={(() => {
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
              })()}
              centerName={(() => {
                try {
                  return currentItem.centerName;
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
              centerType={(() => {
                try {
                  return currentItem.center_type;
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
              children={null}
              city={(() => {
                try {
                  return currentItem.city;
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
              className={classNames("__wab_instance", sty.bookingAddressesCard)}
              description={(() => {
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
              displayNumberArray={(() => {
                try {
                  return currentItem.display_number_array;
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
              key={currentIndex}
              map={(() => {
                try {
                  return currentItem.map;
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
              slug={(() => {
                try {
                  return $props.slug;
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
                  return currentItem.title;
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
              userCenterId={(() => {
                try {
                  return currentItem.userCenterId;
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
      </div>
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "h2", "button", "svg", "text", "bookingAddressesCard"],
  h2: ["h2"],
  button: ["button", "svg", "text"],
  svg: ["svg"],
  text: ["text"],
  bookingAddressesCard: ["bookingAddressesCard"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  h2: "h2";
  button: typeof Button;
  svg: "svg";
  text: "div";
  bookingAddressesCard: typeof BookingAddressesCard;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicBookingAddresses__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicBookingAddresses__VariantsArgs;
    args?: PlasmicBookingAddresses__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicBookingAddresses__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicBookingAddresses__ArgsType,
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
          internalArgPropNames: PlasmicBookingAddresses__ArgProps,
          internalVariantPropNames: PlasmicBookingAddresses__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicBookingAddresses__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicBookingAddresses";
  } else {
    func.displayName = `PlasmicBookingAddresses.${nodeName}`;
  }
  return func;
}

export const PlasmicBookingAddresses = Object.assign(
  // Top-level PlasmicBookingAddresses renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    h2: makeNodeComponent("h2"),
    button: makeNodeComponent("button"),
    svg: makeNodeComponent("svg"),
    text: makeNodeComponent("text"),
    bookingAddressesCard: makeNodeComponent("bookingAddressesCard"),

    // Metadata about props expected for PlasmicBookingAddresses
    internalVariantProps: PlasmicBookingAddresses__VariantProps,
    internalArgProps: PlasmicBookingAddresses__ArgProps
  }
);

export default PlasmicBookingAddresses;
/* prettier-ignore-end */
