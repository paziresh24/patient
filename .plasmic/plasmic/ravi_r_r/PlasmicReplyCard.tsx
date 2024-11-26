// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: qY29Y1sogsUa

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

import { DataFetcher } from "@plasmicpkgs/plasmic-query";
import EditAndReport from "../../EditAndReport"; // plasmic-import: 48DkFQMlhcuA/component
import Avatar from "../../Avatar"; // plasmic-import: 3i84rYjQRrs4/component
import Chip from "../../Chip"; // plasmic-import: 1bFBcAoH0lNN/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from "./PlasmicReplyCard.module.css"; // plasmic-import: qY29Y1sogsUa/css

import SmileIcon from "../fragment_icons/icons/PlasmicIcon__Smile"; // plasmic-import: J8ozh55UiWsA/icon
import InfoIcon from "../fragment_icons/icons/PlasmicIcon__Info"; // plasmic-import: 7Dhq6fgU-utK/icon

createPlasmicElementProxy;

export type PlasmicReplyCard__VariantMembers = {};
export type PlasmicReplyCard__VariantsArgs = {};
type VariantPropType = keyof PlasmicReplyCard__VariantsArgs;
export const PlasmicReplyCard__VariantProps = new Array<VariantPropType>();

export type PlasmicReplyCard__ArgsType = {
  replyText?: string;
  userId?: number;
  isDoctor?: boolean;
  id?: string;
  doctorUserId?: string;
  doctorSlug?: string;
};
type ArgPropType = keyof PlasmicReplyCard__ArgsType;
export const PlasmicReplyCard__ArgProps = new Array<ArgPropType>(
  "replyText",
  "userId",
  "isDoctor",
  "id",
  "doctorUserId",
  "doctorSlug"
);

export type PlasmicReplyCard__OverridesType = {
  root?: Flex__<"div">;
  نامکاربر?: Flex__<typeof DataFetcher>;
  نامتگتاریخ?: Flex__<"div">;
  editAndReport?: Flex__<typeof EditAndReport>;
  httpRestApiFetcher?: Flex__<typeof DataFetcher>;
  userAvatar2?: Flex__<typeof Avatar>;
  userAvatar?: Flex__<typeof Avatar>;
  chip?: Flex__<typeof Chip>;
};

export interface DefaultReplyCardProps {
  replyText?: string;
  userId?: number;
  isDoctor?: boolean;
  id?: string;
  doctorUserId?: string;
  doctorSlug?: string;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicReplyCard__RenderFunc(props: {
  variants: PlasmicReplyCard__VariantsArgs;
  args: PlasmicReplyCard__ArgsType;
  overrides: PlasmicReplyCard__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          isDoctor: false
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
      dir={"rtl"}
    >
      <DataFetcher
        data-plasmic-name={"\u0646\u0627\u0645\u06a9\u0627\u0631\u0628\u0631"}
        data-plasmic-override={overrides.نامکاربر}
        className={classNames("__wab_instance", sty.نامکاربر)}
        dataName={"fetchedData"}
        errorDisplay={null}
        errorName={"fetchError"}
        loadingDisplay={null}
        method={"GET"}
        noLayout={false}
        url={(() => {
          try {
            return `https://apigw.paziresh24.com/v1/users/${$props.userId}`;
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
        <DataCtxReader__>
          {$ctx => (
            <div
              data-plasmic-name={
                "\u0646\u0627\u0645\u062a\u06af\u062a\u0627\u0631\u06cc\u062e"
              }
              data-plasmic-override={overrides.نامتگتاریخ}
              className={classNames(projectcss.all, sty.نامتگتاریخ)}
            >
              <EditAndReport
                data-plasmic-name={"editAndReport"}
                data-plasmic-override={overrides.editAndReport}
                className={classNames("__wab_instance", sty.editAndReport)}
                commentText={(() => {
                  try {
                    return $props.replyText;
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
                doctorEncounter={"null"}
                doctorSlug={(() => {
                  try {
                    return $props.doctorSlug;
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
                doctorUserId={(() => {
                  try {
                    return $props.doctorUserId;
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
                explanationOfIssue={"null"}
                feedbackId={(() => {
                  try {
                    return $props.id;
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
                isReply={true}
                qualityOfTreatment={"null"}
                userId={(() => {
                  try {
                    return $props.userId;
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

              <DataFetcher
                data-plasmic-name={"httpRestApiFetcher"}
                data-plasmic-override={overrides.httpRestApiFetcher}
                className={classNames("__wab_instance", sty.httpRestApiFetcher)}
                dataName={"avatarfetchedData"}
                errorDisplay={
                  <DataCtxReader__>
                    {$ctx => "Error fetching data"}
                  </DataCtxReader__>
                }
                errorName={"fetchError"}
                loadingDisplay={
                  <DataCtxReader__>
                    {$ctx => (
                      <Avatar
                        data-plasmic-name={"userAvatar2"}
                        data-plasmic-override={overrides.userAvatar2}
                        className={classNames(
                          "__wab_instance",
                          sty.userAvatar2
                        )}
                        name={(() => {
                          try {
                            return $ctx.fetchedData.users[0].name;
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
                        src={``}
                      />
                    )}
                  </DataCtxReader__>
                }
                method={"GET"}
                noLayout={false}
                previewSpinner={false}
                url={(() => {
                  try {
                    return `https://apigw.paziresh24.com/v1/users/image?user_id=${$props.userId}`;
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
                <DataCtxReader__>
                  {$ctx => (
                    <Avatar
                      data-plasmic-name={"userAvatar"}
                      data-plasmic-override={overrides.userAvatar}
                      className={classNames("__wab_instance", sty.userAvatar)}
                      name={(() => {
                        try {
                          return $ctx.fetchedData.users[0].name;
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
                      src={(() => {
                        try {
                          return $ctx.avatarfetchedData.data.image_url;
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
                  )}
                </DataCtxReader__>
              </DataFetcher>
              <Stack__
                as={"div"}
                hasGap={true}
                className={classNames(projectcss.all, sty.freeBox__dbIvm)}
              >
                <Stack__
                  as={"div"}
                  hasGap={true}
                  className={classNames(projectcss.all, sty.freeBox__rie2S)}
                >
                  <div
                    className={classNames(
                      projectcss.all,
                      projectcss.__wab_text,
                      sty.text___8TwVb
                    )}
                  >
                    <React.Fragment>
                      {(() => {
                        try {
                          return $props.isDoctor
                            ? `${$ctx.fetchedData.users[0].name} ${$ctx.fetchedData.users[0].family}`
                            : $ctx.fetchedData.users[0].name
                            ? $ctx.fetchedData.users[0].name
                            : "کاربر بدون نام";
                        } catch (e) {
                          if (
                            e instanceof TypeError ||
                            e?.plasmicType === "PlasmicUndefinedDataError"
                          ) {
                            return "\u06a9\u0627\u0631\u0628\u0631 \u0628\u062f\u0648\u0646 \u0646\u0627\u0645";
                          }
                          throw e;
                        }
                      })()}
                    </React.Fragment>
                  </div>
                  {(() => {
                    try {
                      return $props.isDoctor;
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
                    <Chip
                      data-plasmic-name={"chip"}
                      data-plasmic-override={overrides.chip}
                      className={classNames("__wab_instance", sty.chip)}
                      color={"green"}
                      content={"\u062f\u0631\u0645\u0627\u0646\u06af\u0631"}
                      rounded={true}
                      size={"xSmall"}
                    />
                  ) : null}
                </Stack__>
              </Stack__>
            </div>
          )}
        </DataCtxReader__>
      </DataFetcher>
      <div className={classNames(projectcss.all, sty.freeBox__pxmoa)}>
        <div
          className={classNames(
            projectcss.all,
            projectcss.__wab_text,
            sty.text__zendm
          )}
        >
          <div
            className={projectcss.__wab_expr_html_text}
            dangerouslySetInnerHTML={{
              __html: (() => {
                try {
                  return $props.replyText;
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return "";
                  }
                  throw e;
                }
              })()
            }}
          />
        </div>
      </div>
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: [
    "root",
    "\u0646\u0627\u0645\u06a9\u0627\u0631\u0628\u0631",
    "\u0646\u0627\u0645\u062a\u06af\u062a\u0627\u0631\u06cc\u062e",
    "editAndReport",
    "httpRestApiFetcher",
    "userAvatar2",
    "userAvatar",
    "chip"
  ],
  نامکاربر: [
    "\u0646\u0627\u0645\u06a9\u0627\u0631\u0628\u0631",
    "\u0646\u0627\u0645\u062a\u06af\u062a\u0627\u0631\u06cc\u062e",
    "editAndReport",
    "httpRestApiFetcher",
    "userAvatar2",
    "userAvatar",
    "chip"
  ],
  نامتگتاریخ: [
    "\u0646\u0627\u0645\u062a\u06af\u062a\u0627\u0631\u06cc\u062e",
    "editAndReport",
    "httpRestApiFetcher",
    "userAvatar2",
    "userAvatar",
    "chip"
  ],
  editAndReport: ["editAndReport"],
  httpRestApiFetcher: ["httpRestApiFetcher", "userAvatar2", "userAvatar"],
  userAvatar2: ["userAvatar2"],
  userAvatar: ["userAvatar"],
  chip: ["chip"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  نامکاربر: typeof DataFetcher;
  نامتگتاریخ: "div";
  editAndReport: typeof EditAndReport;
  httpRestApiFetcher: typeof DataFetcher;
  userAvatar2: typeof Avatar;
  userAvatar: typeof Avatar;
  chip: typeof Chip;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicReplyCard__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicReplyCard__VariantsArgs;
    args?: PlasmicReplyCard__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicReplyCard__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicReplyCard__ArgsType,
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
          internalArgPropNames: PlasmicReplyCard__ArgProps,
          internalVariantPropNames: PlasmicReplyCard__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicReplyCard__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicReplyCard";
  } else {
    func.displayName = `PlasmicReplyCard.${nodeName}`;
  }
  return func;
}

export const PlasmicReplyCard = Object.assign(
  // Top-level PlasmicReplyCard renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    نامکاربر: makeNodeComponent(
      "\u0646\u0627\u0645\u06a9\u0627\u0631\u0628\u0631"
    ),
    نامتگتاریخ: makeNodeComponent(
      "\u0646\u0627\u0645\u062a\u06af\u062a\u0627\u0631\u06cc\u062e"
    ),
    editAndReport: makeNodeComponent("editAndReport"),
    httpRestApiFetcher: makeNodeComponent("httpRestApiFetcher"),
    userAvatar2: makeNodeComponent("userAvatar2"),
    userAvatar: makeNodeComponent("userAvatar"),
    chip: makeNodeComponent("chip"),

    // Metadata about props expected for PlasmicReplyCard
    internalVariantProps: PlasmicReplyCard__VariantProps,
    internalArgProps: PlasmicReplyCard__ArgProps
  }
);

export default PlasmicReplyCard;
/* prettier-ignore-end */
