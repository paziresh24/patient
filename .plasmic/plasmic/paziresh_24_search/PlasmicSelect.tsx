/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: aYV_BynI796K

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

import { BaseSelect } from "@plasmicpkgs/react-aria/skinny/registerSelect";
import Label from "../../Label"; // plasmic-import: VZtsPRxhcv3n/component
import { BaseButton } from "@plasmicpkgs/react-aria/skinny/registerButton";
import { BaseSelectValue } from "@plasmicpkgs/react-aria/skinny/registerSelect";
import Description from "../../Description"; // plasmic-import: FjkZHAERUBwD/component
import MenuPopover from "../../MenuPopover"; // plasmic-import: zeBQW6VT5smo/component
import MenuItem from "../../MenuItem"; // plasmic-import: NftCFkaQJ0Bb/component
import MenuSection from "../../MenuSection"; // plasmic-import: V-WvFI1-67qQ/component

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicSelect.module.css"; // plasmic-import: aYV_BynI796K/css

import ChevronDownIcon from "./icons/PlasmicIcon__ChevronDown"; // plasmic-import: mZKfwqg-9kSF/icon

createPlasmicElementProxy;

export type PlasmicSelect__VariantMembers = {
  type: "soft" | "plain";
};
export type PlasmicSelect__VariantsArgs = {
  type?: SingleChoiceArg<"soft" | "plain">;
};
type VariantPropType = keyof PlasmicSelect__VariantsArgs;
export const PlasmicSelect__VariantProps = new Array<VariantPropType>("type");

export type PlasmicSelect__ArgsType = {
  plasmicReactAriaSelectIsOpen?: boolean;
  onPlasmicReactAriaSelectIsOpenChange?: (val: boolean) => void;
  onChange?: (val: string) => void;
  placeholder?: string;
  showLabel?: boolean;
  showDescription?: boolean;
  initialSelectedValue?: "Dynamic options";
  disabled?: boolean;
  ariaLabel?: string;
  onSelectionChange?: (selectedValue: string) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  items?: React.ReactNode;
};
type ArgPropType = keyof PlasmicSelect__ArgsType;
export const PlasmicSelect__ArgProps = new Array<ArgPropType>(
  "plasmicReactAriaSelectIsOpen",
  "onPlasmicReactAriaSelectIsOpenChange",
  "onChange",
  "placeholder",
  "showLabel",
  "showDescription",
  "initialSelectedValue",
  "disabled",
  "ariaLabel",
  "onSelectionChange",
  "label",
  "description",
  "items"
);

export type PlasmicSelect__OverridesType = {
  ariaSelect?: Flex__<typeof BaseSelect>;
  label?: Flex__<typeof Label>;
  ariaButton?: Flex__<typeof BaseButton>;
  ariaSelectedValue?: Flex__<typeof BaseSelectValue>;
  text?: Flex__<"div">;
  svg?: Flex__<"svg">;
  description?: Flex__<typeof Description>;
  menuPopover?: Flex__<typeof MenuPopover>;
};

export interface DefaultSelectProps {
  plasmicReactAriaSelectIsOpen?: boolean;
  onPlasmicReactAriaSelectIsOpenChange?: (val: boolean) => void;
  onChange?: (val: string) => void;
  placeholder?: string;
  showLabel?: boolean;
  showDescription?: boolean;
  initialSelectedValue?: "Dynamic options";
  disabled?: boolean;
  ariaLabel?: string;
  onSelectionChange?: (selectedValue: string) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  items?: React.ReactNode;
  type?: SingleChoiceArg<"soft" | "plain">;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicSelect__RenderFunc(props: {
  variants: PlasmicSelect__VariantsArgs;
  args: PlasmicSelect__ArgsType;
  overrides: PlasmicSelect__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          showLabel: true,
          showDescription: false
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
        path: "ariaSelect.isOpen",
        type: "writable",
        variableType: "boolean",

        valueProp: "plasmicReactAriaSelectIsOpen",
        onChangeProp: "onPlasmicReactAriaSelectIsOpenChange"
      },
      {
        path: "ariaSelect.selectedValue",
        type: "readonly",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) =>
          $props["initialSelectedValue"],

        onChangeProp: "onChange"
      },
      {
        path: "type",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.type
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

  const [$ccVariants, setDollarCcVariants] = React.useState<
    Record<string, boolean>
  >({
    focused: false,
    focusVisible: false,
    disabled: false
  });
  const updateVariant = React.useCallback(
    (changes: Record<string, boolean>) => {
      setDollarCcVariants(prev => {
        if (!Object.keys(changes).some(k => prev[k] !== changes[k])) {
          return prev;
        }
        return { ...prev, ...changes };
      });
    },
    []
  );

  return (
    <BaseSelect
      data-plasmic-name={"ariaSelect"}
      data-plasmic-override={overrides.ariaSelect}
      data-plasmic-root={true}
      data-plasmic-for-node={forNode}
      aria-label={args.ariaLabel}
      className={classNames(
        "__wab_instance",
        projectcss.root_reset,
        projectcss.plasmic_default_styles,
        projectcss.plasmic_mixins,
        projectcss.plasmic_tokens,
        plasmic_fragment_design_system_css.plasmic_tokens,
        plasmic_antd_5_hostless_css.plasmic_tokens,
        sty.ariaSelect,
        { [sty.ariaSelecttype_soft]: hasVariant($state, "type", "soft") }
      )}
      defaultSelectedKey={args.initialSelectedValue}
      isDisabled={args.disabled}
      isOpen={generateStateValueProp($state, ["ariaSelect", "isOpen"])}
      onOpenChange={async (...eventArgs: any) => {
        generateStateOnChangeProp($state, ["ariaSelect", "isOpen"]).apply(
          null,
          eventArgs
        );
      }}
      onSelectionChange={async (...eventArgs: any) => {
        generateStateOnChangeProp($state, [
          "ariaSelect",
          "selectedValue"
        ]).apply(null, eventArgs);

        args.onSelectionChange.apply(null, eventArgs);
      }}
      plasmicUpdateVariant={updateVariant}
      selectedKey={generateStateValueProp($state, [
        "ariaSelect",
        "selectedValue"
      ])}
    >
      {$props.showLabel ? (
        <Label
          data-plasmic-name={"label"}
          data-plasmic-override={overrides.label}
          className={classNames("__wab_instance", sty.label)}
        >
          {renderPlasmicSlot({
            defaultContents: "Label",
            value: args.label
          })}
        </Label>
      ) : null}
      <BaseButton
        data-plasmic-name={"ariaButton"}
        data-plasmic-override={overrides.ariaButton}
        className={classNames("__wab_instance", sty.ariaButton, {
          [sty.ariaButtontype_soft]: hasVariant($state, "type", "soft")
        })}
      >
        <BaseSelectValue
          data-plasmic-name={"ariaSelectedValue"}
          data-plasmic-override={overrides.ariaSelectedValue}
          className={classNames("__wab_instance", sty.ariaSelectedValue)}
          customize={true}
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
            <React.Fragment>
              {(() => {
                try {
                  return $props.placeholder;
                } catch (e) {
                  if (
                    e instanceof TypeError ||
                    e?.plasmicType === "PlasmicUndefinedDataError"
                  ) {
                    return "Select an item";
                  }
                  throw e;
                }
              })()}
            </React.Fragment>
          </div>
        </BaseSelectValue>
        <ChevronDownIcon
          data-plasmic-name={"svg"}
          data-plasmic-override={overrides.svg}
          className={classNames(projectcss.all, sty.svg)}
          role={"img"}
          style={(() => {
            try {
              return {
                transform: `rotate(${
                  $state.ariaSelect.isOpen ? "180" : "0"
                }deg)`
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
      </BaseButton>
      {$props.showDescription ? (
        <Description
          data-plasmic-name={"description"}
          data-plasmic-override={overrides.description}
          className={classNames("__wab_instance", sty.description)}
        >
          {renderPlasmicSlot({
            defaultContents: "Description...",
            value: args.description
          })}
        </Description>
      ) : null}
      <MenuPopover
        data-plasmic-name={"menuPopover"}
        data-plasmic-override={overrides.menuPopover}
        className={classNames("__wab_instance", sty.menuPopover)}
        menuItems={renderPlasmicSlot({
          defaultContents: (
            <React.Fragment>
              <MenuItem label={"Item 1"} value={"item1"} />

              <MenuItem label={"Item 2"} value={"item2"} />

              <MenuItem label={"Item 3"} value={"item3"} />

              <MenuSection
                className={classNames("__wab_instance", sty.menuSection__yPHyJ)}
                header={
                  <div
                    className={classNames(
                      projectcss.all,
                      projectcss.__wab_text,
                      sty.text__rkJcX
                    )}
                  >
                    {"Section"}
                  </div>
                }
                items={
                  <React.Fragment>
                    <MenuItem
                      label={"Section Item 1"}
                      value={"section-item-1"}
                    />

                    <MenuItem
                      label={"Section Item 2"}
                      value={"section-item-2"}
                    />

                    <MenuItem
                      label={"Section Item 3"}
                      value={"section-item-3"}
                    />
                  </React.Fragment>
                }
              />
            </React.Fragment>
          ),
          value: args.items
        })}
        offset={2}
      />
    </BaseSelect>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  ariaSelect: [
    "ariaSelect",
    "label",
    "ariaButton",
    "ariaSelectedValue",
    "text",
    "svg",
    "description",
    "menuPopover"
  ],
  label: ["label"],
  ariaButton: ["ariaButton", "ariaSelectedValue", "text", "svg"],
  ariaSelectedValue: ["ariaSelectedValue", "text"],
  text: ["text"],
  svg: ["svg"],
  description: ["description"],
  menuPopover: ["menuPopover"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  ariaSelect: typeof BaseSelect;
  label: typeof Label;
  ariaButton: typeof BaseButton;
  ariaSelectedValue: typeof BaseSelectValue;
  text: "div";
  svg: "svg";
  description: typeof Description;
  menuPopover: typeof MenuPopover;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicSelect__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicSelect__VariantsArgs;
    args?: PlasmicSelect__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicSelect__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicSelect__ArgsType,
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
          internalArgPropNames: PlasmicSelect__ArgProps,
          internalVariantPropNames: PlasmicSelect__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicSelect__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "ariaSelect") {
    func.displayName = "PlasmicSelect";
  } else {
    func.displayName = `PlasmicSelect.${nodeName}`;
  }
  return func;
}

export const PlasmicSelect = Object.assign(
  // Top-level PlasmicSelect renders the root element
  makeNodeComponent("ariaSelect"),
  {
    // Helper components rendering sub-elements
    label: makeNodeComponent("label"),
    ariaButton: makeNodeComponent("ariaButton"),
    ariaSelectedValue: makeNodeComponent("ariaSelectedValue"),
    text: makeNodeComponent("text"),
    svg: makeNodeComponent("svg"),
    description: makeNodeComponent("description"),
    menuPopover: makeNodeComponent("menuPopover"),

    // Metadata about props expected for PlasmicSelect
    internalVariantProps: PlasmicSelect__VariantProps,
    internalArgProps: PlasmicSelect__ArgProps
  }
);

export default PlasmicSelect;
/* prettier-ignore-end */
