// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: U2aZfSUKx5oQ

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

import { AntdAccordion } from "@plasmicpkgs/antd5/skinny/registerCollapse";
import { accordionHelpers as AntdAccordion_Helpers } from "@plasmicpkgs/antd5/skinny/registerCollapse";
import { AntdAccordionItem } from "@plasmicpkgs/antd5/skinny/registerCollapse";
import SeoBoxInfoChevronDown from "../../SeoBoxInfoChevronDown"; // plasmic-import: VmG209fK2-rp/component
import ListItem from "../../ListItem"; // plasmic-import: SNiC1tNNivYG/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSeoBoxInfo.module.css"; // plasmic-import: U2aZfSUKx5oQ/css

createPlasmicElementProxy;

export type PlasmicSeoBoxInfo__VariantMembers = {};
export type PlasmicSeoBoxInfo__VariantsArgs = {};
type VariantPropType = keyof PlasmicSeoBoxInfo__VariantsArgs;
export const PlasmicSeoBoxInfo__VariantProps = new Array<VariantPropType>();

export type PlasmicSeoBoxInfo__ArgsType = {
  title?: string;
  description?: string;
  content?: string;
  footer?: any;
};
type ArgPropType = keyof PlasmicSeoBoxInfo__ArgsType;
export const PlasmicSeoBoxInfo__ArgProps = new Array<ArgPropType>(
  "title",
  "description",
  "content",
  "footer"
);

export type PlasmicSeoBoxInfo__OverridesType = {
  root?: Flex__<"div">;
  accordion?: Flex__<typeof AntdAccordion>;
  accordion2?: Flex__<typeof AntdAccordion>;
  listItem?: Flex__<typeof ListItem>;
};

export interface DefaultSeoBoxInfoProps {
  title?: string;
  description?: string;
  content?: string;
  footer?: any;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSeoBoxInfo__RenderFunc(props: {
  variants: PlasmicSeoBoxInfo__VariantsArgs;
  args: PlasmicSeoBoxInfo__ArgsType;
  overrides: PlasmicSeoBoxInfo__OverridesType;
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
        path: "accordion.activePanelId",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined,

        onMutate: generateOnMutateForSpec(
          "activePanelId",
          AntdAccordion_Helpers
        )
      },
      {
        path: "accordion2.activePanelId",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined,

        onMutate: generateOnMutateForSpec(
          "activePanelId",
          AntdAccordion_Helpers
        )
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
        sty.root
      )}
    >
      <div
        className={classNames(
          projectcss.all,
          projectcss.__wab_text,
          sty.text__t4VyU
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
                return "";
              }
              throw e;
            }
          })()}
        </React.Fragment>
      </div>
      <div
        className={classNames(
          projectcss.all,
          projectcss.__wab_text,
          sty.text__jTiL
        )}
      >
        <React.Fragment>
          {(() => {
            try {
              return $props.description;
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
      {(() => {
        const child$Props = {
          activeKey: generateStateValueProp($state, [
            "accordion",
            "activePanelId"
          ]),
          bordered: false,
          className: classNames("__wab_instance", sty.accordion),
          ghost: true,
          items: (
            <React.Fragment>
              <AntdAccordionItem
                className={classNames(
                  "__wab_instance",
                  sty.accordionItem__pzlDa
                )}
                id={1}
                label2={
                  <div
                    className={classNames(projectcss.all, sty.freeBox__hoM8C)}
                  >
                    <div
                      className={classNames(
                        projectcss.all,
                        projectcss.__wab_text,
                        sty.text__lyS1M
                      )}
                    >
                      {
                        "\u062f\u0631\u0628\u0627\u0631\u0647 \u0627\u06cc\u0646 \u0635\u0641\u062d\u0647"
                      }
                    </div>
                    <SeoBoxInfoChevronDown
                      className={classNames(
                        "__wab_instance",
                        sty.seoBoxInfoChevronDown___9LaBm
                      )}
                      isOpen={(() => {
                        try {
                          return $state.accordion.activePanelId == 1;
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
                    />
                  </div>
                }
                showArrow={true}
              >
                <div className={classNames(projectcss.all, sty.freeBox__cWy6U)}>
                  <div
                    className={classNames(
                      projectcss.all,
                      projectcss.__wab_text,
                      sty.text__oddIb,
                      "seo_box_content"
                    )}
                  >
                    <div
                      className={projectcss.__wab_expr_html_text}
                      dangerouslySetInnerHTML={{
                        __html: (() => {
                          try {
                            return $props.content.trim();
                          } catch (e) {
                            if (
                              e instanceof TypeError ||
                              e?.plasmicType === "PlasmicUndefinedDataError"
                            ) {
                              return "\u0644\u06cc\u0633\u062a \u0647\u0645\u0647 \u067e\u0632\u0634\u06a9\u0627\u0646 \u0648 \u0645\u0631\u0627\u06a9\u0632 \u062f\u0631\u0645\u0627\u0646\u06cc \u0627\u06cc\u0631\u0627\u0646\n\u0645\u0634\u0627\u0647\u062f\u0647 \u0644\u06cc\u0633\u062a \u0647\u0645\u0647 \u067e\u0632\u0634\u06a9\u0627\u0646 \u0648 \u0645\u0631\u0627\u06a9\u0632 \u062f\u0631\u0645\u0627\u0646\u06cc \u0627\u06cc\u0631\u0627\u0646 \u0648 \u062f\u0631\u06cc\u0627\u0641\u062a \u0646\u0648\u0628\u062a \u0648\u06cc\u0632\u06cc\u062a \u062d\u0636\u0648\u0631\u06cc \u0648 \u0648\u06cc\u0632\u06cc\u062a \u0622\u0646\u0644\u0627\u06cc\u0646 \u067e\u0632\u0634\u06a9\u06cc \u0628\u0647 \u0635\u0648\u0631\u062a \u062a\u0644\u0641\u0646\u06cc \u0648 \u0645\u062a\u0646\u06cc \u062f\u0631 \u067e\u0630\u06cc\u0631\u0634\u06f2\u06f4 \u0627\u06cc\u0631\u0627\u0646\n\n\u0631\u0627\u0647\u0646\u0645\u0627\u06cc \u0646\u0648\u0628\u062a \u062f\u0647\u06cc \u0627\u06cc\u0646\u062a\u0631\u0646\u062a\u06cc \u067e\u0632\u0634\u06a9\u0627\u0646 \u0627\u06cc\u0631\u0627\u0646\n\u0628\u0627 \u0627\u0633\u062a\u0641\u0627\u062f\u0647 \u0627\u0632 \u0628\u062e\u0634 \u062c\u0633\u062a\u062c\u0648 \u0648 \u0641\u06cc\u0644\u062a\u0631\u0647\u0627\u06cc \u0645\u0648\u062c\u0648\u062f \u062f\u0631 \u0627\u06cc\u0646 \u0635\u0641\u062d\u0647 \u0628\u0647\u062a\u0631\u06cc\u0646 \u067e\u0632\u0634\u06a9\u0627\u0646 \u0627\u06cc\u0631\u0627\u0646 \u0631\u0627 \u062c\u0633\u062a\u062c\u0648 \u0648 \u0628\u0627 \u06a9\u0644\u06cc\u06a9 \u0628\u0631 \u0631\u0648\u06cc \u062f\u06a9\u0645\u0647 \u062f\u0631\u06cc\u0627\u0641\u062a \u0646\u0648\u0628\u062a\u060c \u0627\u0648\u0644\u06cc\u0646 \u0646\u0648\u0628\u062a \u062e\u0627\u0644\u06cc \u0631\u0627 \u0627\u0646\u062a\u062e\u0627\u0628 \u06a9\u0646\u06cc\u062f. \u0647\u0645\u0686\u0646\u06cc\u0646 \u062f\u0631 \u0635\u0648\u0631\u062a\u06cc \u06a9\u0647 \u067e\u0632\u0634\u06a9\u0627\u0646 \u0628\u0631\u0646\u0627\u0645\u0647 \u06a9\u0627\u0631\u06cc \u062e\u0648\u062f \u0631\u0627 \u062a\u06a9\u0645\u06cc\u0644 \u06a9\u0631\u062f\u0647 \u0628\u0627\u0634\u0646\u062f\u060c \u0645\u06cc\u062a\u0648\u0627\u0646\u06cc\u062f \u062f\u0631 \u0632\u0645\u0627\u0646 \u062f\u0644\u062e\u0648\u0627\u0647 \u062e\u0648\u062f \u0646\u0648\u0628\u062a \u062f\u0631\u06cc\u0627\u0641\u062a \u06a9\u0646\u06cc\u062f.\n\n\u0628\u0647\u062a\u0631\u06cc\u0646 \u067e\u0632\u0634\u06a9 \u062f\u0631 \u0627\u06cc\u0631\u0627\u0646 \u06a9\u06cc\u0633\u062a\u061f\n\u0628\u0631\u0627\u06cc \u0627\u0646\u062a\u062e\u0627\u0628 \u0628\u0647\u062a\u0631\u06cc\u0646 \u062f\u06a9\u062a\u0631 \u062f\u0631 \u0627\u06cc\u0631\u0627\u0646 \u0645\u06cc \u062a\u0648\u0627\u0646\u06cc\u062f \u0628\u0627 \u062a\u0648\u062c\u0647 \u0628\u0647 \u062a\u0639\u062f\u0627\u062f \u0628\u0627\u0632\u062f\u06cc\u062f \u0627\u0632 \u0635\u0641\u062d\u0647 \u0647\u0631 \u067e\u0632\u0634\u06a9 \u0648 \u0645\u0634\u0627\u0647\u062f\u0647 \u0646\u0638\u0631\u0627\u062a \u062f\u06cc\u06af\u0631 \u06a9\u0627\u0631\u0628\u0631\u0627\u0646 \u0633\u0627\u06cc\u062a\u060c \u0628\u0647\u062a\u0631\u06cc\u0646 \u0645\u062a\u062e\u0635\u0635\u0627\u0646 \u0627\u06cc\u0631\u0627\u0646 \u0631\u0627 \u0634\u0646\u0627\u0633\u0627\u06cc\u06cc \u0648 \u0627\u0632 \u0627\u06cc\u0634\u0627\u0646 \u0648\u06cc\u0632\u06cc\u062a \u0622\u0646\u0644\u0627\u06cc\u0646 \u0648 \u0646\u0648\u0628\u062a \u062d\u0636\u0648\u0631\u06cc \u062f\u0631\u06cc\u0627\u0641\u062a \u06a9\u0646\u06cc\u062f.\n\n\u0628\u0647\u062a\u0631\u06cc\u0646 \u0645\u062a\u062e\u0635\u0635\u0627\u0646 \u0627\u06cc\u0631\u0627\u0646 \u062f\u0631 \u067e\u0630\u06cc\u0631\u0634\u06f2\u06f4 \u0622\u0645\u0627\u062f\u0647 \u0648\u06cc\u0632\u06cc\u062a \u062d\u0636\u0648\u0631\u06cc \u0648 \u067e\u0627\u0633\u062e\u06af\u0648\u06cc\u06cc \u0628\u0647 \u0633\u0648\u0627\u0644\u0627\u062a \u067e\u0632\u0634\u06a9\u06cc \u0634\u0645\u0627 \u0647\u0633\u062a\u0646\u062f. \u0627\u0644\u0628\u062a\u0647 \u062f\u0631 \u0646\u0638\u0631 \u062f\u0627\u0634\u062a\u0647 \u0628\u0627\u0634\u06cc\u062f \u06a9\u0647 \u0627\u0646\u062a\u0642\u0627\u0644 \u06a9\u0631\u0648\u0646\u0627 \u062f\u0631 \u0645\u0631\u0627\u06a9\u0632 \u062f\u0631\u0645\u0627\u0646\u06cc\u060c \u0633\u0647 \u0628\u0631\u0627\u0628\u0631 \u0627\u0645\u0627\u06a9\u0646 \u0639\u0627\u062f\u06cc \u0627\u0633\u062a ! \u0628\u0627 \u0627\u06cc\u0646 \u0648\u062c\u0648\u062f \u0645\u06cc\u062a\u0648\u0627\u0646\u06cc\u062f \u0628\u062f\u0648\u0646 \u062d\u0636\u0648\u0631 \u062f\u0631 \u0645\u0637\u0628 \u06cc\u0627 \u0628\u06cc\u0645\u0627\u0631\u0633\u062a\u0627\u0646\u060c \u062f\u0631 \u062e\u0627\u0646\u0647 \u0628\u0627 \u0628\u0647\u062a\u0631\u06cc\u0646 \u067e\u0632\u0634\u06a9\u0627\u0646 \u0627\u06cc\u0631\u0627\u0646 \u062a\u0644\u0641\u0646\u06cc \u0648 \u0645\u062a\u0646\u06cc \u06af\u0641\u062a\u06af\u0648 \u06a9\u0646\u06cc\u062f.\n\n\u0633\u0627\u06cc\u062a \u067e\u0630\u06cc\u0631\u0634\u06f2\u06f4 \u062e\u062f\u0645\u0627\u062a\u06cc \u0631\u0627 \u0628\u0631\u0627\u06cc \u0634\u0645\u0627 \u0641\u0631\u0627\u0647\u0645 \u0622\u0648\u0631\u062f\u0647 \u062a\u0627 \u062f\u0631 \u0633\u0631\u06cc\u0639\u062a\u0631\u06cc\u0646 \u0632\u0645\u0627\u0646 \u0648 \u0628\u0647 \u0631\u0627\u062d\u062a \u062a\u0631\u06cc\u0646 \u0634\u06cc\u0648\u0647 \u0628\u0627 \u062c\u0633\u062a\u062c\u0648\u06cc \u067e\u0632\u0634\u06a9 \u0645\u0648\u0631\u062f \u0646\u0638\u0631 \u062e\u0648\u062f\u060c \u0646\u0648\u0628\u062a \u062e\u0648\u062f \u0631\u0627 \u0627\u0632 \u062f\u06a9\u062a\u0631 \u0645\u062a\u062e\u0635\u0635 \u0627\u06cc\u0631\u0627\u0646 \u062f\u0631\u06cc\u0627\u0641\u062a \u0646\u0645\u0627\u06cc\u06cc\u062f.\n\n\u062c\u0647\u062a \u06a9\u0627\u0631\u0628\u0631\u06cc \u0628\u0647\u062a\u0631 \u0648 \u0628\u0647\u0631\u0647 \u0645\u0646\u062f\u06cc \u06a9\u0627\u0645\u0644 \u0627\u0632 \u062e\u062f\u0645\u0627\u062a \u0648 \u0646\u0648\u0628\u062a \u062f\u0647\u06cc\u060c \u0627\u067e\u0644\u06cc\u06a9\u06cc\u0634\u0646 \u0646\u0648\u0628\u062a \u062f\u0647\u06cc \u067e\u0632\u0634\u06a9\u0627\u0646 \u067e\u0630\u06cc\u0631\u0634\u06f2\u06f4 \u0631\u0627 \u062f\u0627\u0646\u0644\u0648\u062f \u06a9\u0646\u06cc\u062f.";
                            }
                            throw e;
                          }
                        })()
                      }}
                    />
                  </div>
                  {(() => {
                    try {
                      return $props.footer.length > 0;
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
                      className={classNames(projectcss.all, sty.freeBox__rZuZx)}
                    >
                      {(() => {
                        const child$Props = {
                          activeKey: generateStateValueProp($state, [
                            "accordion2",
                            "activePanelId"
                          ]),
                          bordered: false,
                          className: classNames(
                            "__wab_instance",
                            sty.accordion2
                          ),
                          items: (
                            <React.Fragment>
                              {(_par =>
                                !_par
                                  ? []
                                  : Array.isArray(_par)
                                  ? _par
                                  : [_par])(
                                (() => {
                                  try {
                                    return $props.footer;
                                  } catch (e) {
                                    if (
                                      e instanceof TypeError ||
                                      e?.plasmicType ===
                                        "PlasmicUndefinedDataError"
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
                                  <AntdAccordionItem
                                    className={classNames(
                                      "__wab_instance",
                                      sty.accordionItem__mcamD
                                    )}
                                    id={(() => {
                                      try {
                                        return currentIndex;
                                      } catch (e) {
                                        if (
                                          e instanceof TypeError ||
                                          e?.plasmicType ===
                                            "PlasmicUndefinedDataError"
                                        ) {
                                          return undefined;
                                        }
                                        throw e;
                                      }
                                    })()}
                                    key={currentIndex}
                                    label2={
                                      <div
                                        className={classNames(
                                          projectcss.all,
                                          sty.freeBox___6Tl8X
                                        )}
                                      >
                                        <div
                                          className={classNames(
                                            projectcss.all,
                                            projectcss.__wab_text,
                                            sty.text__mQvFy
                                          )}
                                        >
                                          <React.Fragment>
                                            {(() => {
                                              try {
                                                return currentItem.title;
                                              } catch (e) {
                                                if (
                                                  e instanceof TypeError ||
                                                  e?.plasmicType ===
                                                    "PlasmicUndefinedDataError"
                                                ) {
                                                  return "First Item";
                                                }
                                                throw e;
                                              }
                                            })()}
                                          </React.Fragment>
                                        </div>
                                        <SeoBoxInfoChevronDown
                                          className={classNames(
                                            "__wab_instance",
                                            sty.seoBoxInfoChevronDown__upE8B
                                          )}
                                          isOpen={(() => {
                                            try {
                                              return (
                                                $state.accordion2
                                                  .activePanelId == currentIndex
                                              );
                                            } catch (e) {
                                              if (
                                                e instanceof TypeError ||
                                                e?.plasmicType ===
                                                  "PlasmicUndefinedDataError"
                                              ) {
                                                return [];
                                              }
                                              throw e;
                                            }
                                          })()}
                                        />
                                      </div>
                                    }
                                    showArrow={true}
                                  >
                                    <div
                                      className={classNames(
                                        projectcss.all,
                                        sty.freeBox___6JMv1
                                      )}
                                    >
                                      {(_par =>
                                        !_par
                                          ? []
                                          : Array.isArray(_par)
                                          ? _par
                                          : [_par])(
                                        (() => {
                                          try {
                                            return currentItem.items;
                                          } catch (e) {
                                            if (
                                              e instanceof TypeError ||
                                              e?.plasmicType ===
                                                "PlasmicUndefinedDataError"
                                            ) {
                                              return [];
                                            }
                                            throw e;
                                          }
                                        })()
                                      ).map(
                                        (__plasmic_item_1, __plasmic_idx_1) => {
                                          const currentItem = __plasmic_item_1;
                                          const currentIndex = __plasmic_idx_1;
                                          return (
                                            <ListItem
                                              data-plasmic-name={"listItem"}
                                              data-plasmic-override={
                                                overrides.listItem
                                              }
                                              className={classNames(
                                                "__wab_instance",
                                                sty.listItem
                                              )}
                                              hasIcon={true}
                                              key={currentIndex}
                                              onClick={async value => {
                                                const $steps = {};

                                                $steps["goToPage"] = true
                                                  ? (() => {
                                                      const actionArgs = {
                                                        destination: (() => {
                                                          try {
                                                            return value;
                                                          } catch (e) {
                                                            if (
                                                              e instanceof
                                                                TypeError ||
                                                              e?.plasmicType ===
                                                                "PlasmicUndefinedDataError"
                                                            ) {
                                                              return undefined;
                                                            }
                                                            throw e;
                                                          }
                                                        })()
                                                      };
                                                      return (({
                                                        destination
                                                      }) => {
                                                        if (
                                                          typeof destination ===
                                                            "string" &&
                                                          destination.startsWith(
                                                            "#"
                                                          )
                                                        ) {
                                                          document
                                                            .getElementById(
                                                              destination.substr(
                                                                1
                                                              )
                                                            )
                                                            .scrollIntoView({
                                                              behavior: "smooth"
                                                            });
                                                        } else {
                                                          __nextRouter?.push(
                                                            destination
                                                          );
                                                        }
                                                      })?.apply(null, [
                                                        actionArgs
                                                      ]);
                                                    })()
                                                  : undefined;
                                                if (
                                                  $steps["goToPage"] != null &&
                                                  typeof $steps["goToPage"] ===
                                                    "object" &&
                                                  typeof $steps["goToPage"]
                                                    .then === "function"
                                                ) {
                                                  $steps["goToPage"] =
                                                    await $steps["goToPage"];
                                                }
                                              }}
                                              title={(() => {
                                                try {
                                                  return currentItem.name;
                                                } catch (e) {
                                                  if (
                                                    e instanceof TypeError ||
                                                    e?.plasmicType ===
                                                      "PlasmicUndefinedDataError"
                                                  ) {
                                                    return undefined;
                                                  }
                                                  throw e;
                                                }
                                              })()}
                                              value={(() => {
                                                try {
                                                  return currentItem.url;
                                                } catch (e) {
                                                  if (
                                                    e instanceof TypeError ||
                                                    e?.plasmicType ===
                                                      "PlasmicUndefinedDataError"
                                                  ) {
                                                    return undefined;
                                                  }
                                                  throw e;
                                                }
                                              })()}
                                            />
                                          );
                                        }
                                      )}
                                    </div>
                                  </AntdAccordionItem>
                                );
                              })}
                              <AntdAccordionItem
                                className={classNames(
                                  "__wab_instance",
                                  sty.accordionItem__djABw
                                )}
                                id={2}
                                label2={
                                  <div
                                    className={classNames(
                                      projectcss.all,
                                      projectcss.__wab_text,
                                      sty.text__ubWXv
                                    )}
                                  >
                                    {"Second Item"}
                                  </div>
                                }
                                showArrow={true}
                              >
                                <div
                                  className={classNames(
                                    projectcss.all,
                                    projectcss.__wab_text,
                                    sty.text__vsyh
                                  )}
                                >
                                  {"Second Children"}
                                </div>
                              </AntdAccordionItem>
                            </React.Fragment>
                          ),
                          onChange: generateStateOnChangePropForCodeComponents(
                            $state,
                            "activePanelId",
                            ["accordion2", "activePanelId"],
                            AntdAccordion_Helpers
                          ),
                          size: "middle"
                        };
                        initializeCodeComponentStates(
                          $state,
                          [
                            {
                              name: "activePanelId",
                              plasmicStateName: "accordion2.activePanelId"
                            }
                          ],
                          [],
                          AntdAccordion_Helpers ?? {},
                          child$Props
                        );

                        return (
                          <AntdAccordion
                            data-plasmic-name={"accordion2"}
                            data-plasmic-override={overrides.accordion2}
                            {...child$Props}
                          />
                        );
                      })()}
                    </div>
                  ) : null}
                </div>
              </AntdAccordionItem>
              <AntdAccordionItem
                className={classNames(
                  "__wab_instance",
                  sty.accordionItem__s85Li
                )}
                id={2}
                label2={
                  <div
                    className={classNames(
                      projectcss.all,
                      projectcss.__wab_text,
                      sty.text__wv3S
                    )}
                  >
                    {"Second Item"}
                  </div>
                }
                showArrow={true}
              >
                <div
                  className={classNames(
                    projectcss.all,
                    projectcss.__wab_text,
                    sty.text__uPeh
                  )}
                >
                  {"Second Children"}
                </div>
              </AntdAccordionItem>
            </React.Fragment>
          ),
          onChange: generateStateOnChangePropForCodeComponents(
            $state,
            "activePanelId",
            ["accordion", "activePanelId"],
            AntdAccordion_Helpers
          ),
          size: "small"
        };
        initializeCodeComponentStates(
          $state,
          [
            {
              name: "activePanelId",
              plasmicStateName: "accordion.activePanelId"
            }
          ],
          [],
          AntdAccordion_Helpers ?? {},
          child$Props
        );

        return (
          <AntdAccordion
            data-plasmic-name={"accordion"}
            data-plasmic-override={overrides.accordion}
            {...child$Props}
          />
        );
      })()}
    </Stack__>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ["root", "accordion", "accordion2", "listItem"],
  accordion: ["accordion", "accordion2", "listItem"],
  accordion2: ["accordion2", "listItem"],
  listItem: ["listItem"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  accordion: typeof AntdAccordion;
  accordion2: typeof AntdAccordion;
  listItem: typeof ListItem;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSeoBoxInfo__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSeoBoxInfo__VariantsArgs;
    args?: PlasmicSeoBoxInfo__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSeoBoxInfo__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicSeoBoxInfo__ArgsType,
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
          internalArgPropNames: PlasmicSeoBoxInfo__ArgProps,
          internalVariantPropNames: PlasmicSeoBoxInfo__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSeoBoxInfo__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicSeoBoxInfo";
  } else {
    func.displayName = `PlasmicSeoBoxInfo.${nodeName}`;
  }
  return func;
}

export const PlasmicSeoBoxInfo = Object.assign(
  // Top-level PlasmicSeoBoxInfo renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    accordion: makeNodeComponent("accordion"),
    accordion2: makeNodeComponent("accordion2"),
    listItem: makeNodeComponent("listItem"),

    // Metadata about props expected for PlasmicSeoBoxInfo
    internalVariantProps: PlasmicSeoBoxInfo__VariantProps,
    internalArgProps: PlasmicSeoBoxInfo__ArgProps
  }
);

export default PlasmicSeoBoxInfo;
/* prettier-ignore-end */
