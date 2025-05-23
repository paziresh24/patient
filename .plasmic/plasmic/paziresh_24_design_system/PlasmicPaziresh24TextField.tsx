/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: 6HBcNwr8dz9LuS1Qe36xa5
// Component: hp93_av_kmlL

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

import { BaseTextField } from "@plasmicpkgs/react-aria/skinny/registerTextField";
import Paziresh24AtomsLabel from "../../Paziresh24AtomsLabel"; // plasmic-import: pOApINRkmgnb/component
import Paziresh24AtomsTextInput from "../../Paziresh24AtomsTextInput"; // plasmic-import: PTeLKP71vIWx/component
import Paziresh24AtomsTextAreaInput from "../../Paziresh24AtomsTextAreaInput"; // plasmic-import: HOBObNXYC7Oc/component
import Paziresh24AtomsDescription from "../../Paziresh24AtomsDescription"; // plasmic-import: 54F0s7A58MP4/component

import "@plasmicapp/react-web/lib/plasmic.css";

import projectcss from "./plasmic.module.css"; // plasmic-import: 6HBcNwr8dz9LuS1Qe36xa5/projectcss
import sty from "./PlasmicPaziresh24TextField.module.css"; // plasmic-import: hp93_av_kmlL/css

import CircleIcon from "./icons/PlasmicIcon__Circle"; // plasmic-import: jRmZqHMZZXGp/icon

createPlasmicElementProxy;

export type PlasmicPaziresh24TextField__VariantMembers = {
  multiLine: "multiLine";
  iconStart: "iconStart";
  iconEnd: "iconEnd";
};
export type PlasmicPaziresh24TextField__VariantsArgs = {
  multiLine?: SingleBooleanChoiceArg<"multiLine">;
  iconStart?: SingleBooleanChoiceArg<"iconStart">;
  iconEnd?: SingleBooleanChoiceArg<"iconEnd">;
};
type VariantPropType = keyof PlasmicPaziresh24TextField__VariantsArgs;
export const PlasmicPaziresh24TextField__VariantProps =
  new Array<VariantPropType>("multiLine", "iconStart", "iconEnd");

export type PlasmicPaziresh24TextField__ArgsType = {
  value?: string;
  placeholder?: string;
  showLabel?: boolean;
  showDescription?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  type?: "text" | "search" | "url" | "tel" | "email" | "password";
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
  autoComplete?:
    | "on"
    | "off"
    | "name"
    | "honorific-prefix"
    | "given-name"
    | "additional-name"
    | "family-name"
    | "honorific-suffix"
    | "nickname"
    | "email"
    | "username"
    | "new-password"
    | "current-password"
    | "one-time-code"
    | "organization-title"
    | "organization"
    | "street-address"
    | "shipping"
    | "billing"
    | "address-line1"
    | "address-line2"
    | "address-line3"
    | "address-level4"
    | "address-level3"
    | "address-level2"
    | "address-level1"
    | "country"
    | "country-name"
    | "postal-code"
    | "cc-name"
    | "cc-given-name"
    | "cc-additional-name"
    | "cc-family-name"
    | "cc-number"
    | "cc-exp"
    | "cc-exp-month"
    | "cc-exp-year"
    | "cc-csc"
    | "cc-type"
    | "transaction-currency"
    | "transaction-amount"
    | "language"
    | "bday"
    | "bday-day"
    | "bday-month"
    | "bday-year"
    | "sex"
    | "tel"
    | "tel-country-code"
    | "tel-national"
    | "tel-area-code"
    | "tel-local"
    | "tel-local-suffix"
    | "tel-local-prefix"
    | "tel-extension"
    | "impp"
    | "url"
    | "photo"
    | "webauthn";
  ariaLabel?: string;
  onChange?: (val: string) => void;
  label?: React.ReactNode;
  start?: React.ReactNode;
  end?: React.ReactNode;
  description?: React.ReactNode;
};
type ArgPropType = keyof PlasmicPaziresh24TextField__ArgsType;
export const PlasmicPaziresh24TextField__ArgProps = new Array<ArgPropType>(
  "value",
  "placeholder",
  "showLabel",
  "showDescription",
  "disabled",
  "readOnly",
  "autoFocus",
  "type",
  "inputMode",
  "autoComplete",
  "ariaLabel",
  "onChange",
  "label",
  "start",
  "end",
  "description"
);

export type PlasmicPaziresh24TextField__OverridesType = {
  ariaTextField?: Flex__<typeof BaseTextField>;
  paziresh24AtomsLabel?: Flex__<typeof Paziresh24AtomsLabel>;
  textInput?: Flex__<typeof Paziresh24AtomsTextInput>;
  textAreaInput?: Flex__<typeof Paziresh24AtomsTextAreaInput>;
  paziresh24AtomsDescription?: Flex__<typeof Paziresh24AtomsDescription>;
};

export interface DefaultPaziresh24TextFieldProps {
  value?: string;
  placeholder?: string;
  showLabel?: boolean;
  showDescription?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  type?: "text" | "search" | "url" | "tel" | "email" | "password";
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
  autoComplete?:
    | "on"
    | "off"
    | "name"
    | "honorific-prefix"
    | "given-name"
    | "additional-name"
    | "family-name"
    | "honorific-suffix"
    | "nickname"
    | "email"
    | "username"
    | "new-password"
    | "current-password"
    | "one-time-code"
    | "organization-title"
    | "organization"
    | "street-address"
    | "shipping"
    | "billing"
    | "address-line1"
    | "address-line2"
    | "address-line3"
    | "address-level4"
    | "address-level3"
    | "address-level2"
    | "address-level1"
    | "country"
    | "country-name"
    | "postal-code"
    | "cc-name"
    | "cc-given-name"
    | "cc-additional-name"
    | "cc-family-name"
    | "cc-number"
    | "cc-exp"
    | "cc-exp-month"
    | "cc-exp-year"
    | "cc-csc"
    | "cc-type"
    | "transaction-currency"
    | "transaction-amount"
    | "language"
    | "bday"
    | "bday-day"
    | "bday-month"
    | "bday-year"
    | "sex"
    | "tel"
    | "tel-country-code"
    | "tel-national"
    | "tel-area-code"
    | "tel-local"
    | "tel-local-suffix"
    | "tel-local-prefix"
    | "tel-extension"
    | "impp"
    | "url"
    | "photo"
    | "webauthn";
  ariaLabel?: string;
  onChange?: (val: string) => void;
  label?: React.ReactNode;
  start?: React.ReactNode;
  end?: React.ReactNode;
  description?: React.ReactNode;
  multiLine?: SingleBooleanChoiceArg<"multiLine">;
  iconStart?: SingleBooleanChoiceArg<"iconStart">;
  iconEnd?: SingleBooleanChoiceArg<"iconEnd">;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicPaziresh24TextField__RenderFunc(props: {
  variants: PlasmicPaziresh24TextField__VariantsArgs;
  args: PlasmicPaziresh24TextField__ArgsType;
  overrides: PlasmicPaziresh24TextField__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          showLabel: true,
          showDescription: false,
          readOnly: false,
          autoFocus: false
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
        path: "ariaTextField.value",
        type: "writable",
        variableType: "text",

        valueProp: "value",
        onChangeProp: "onChange"
      },
      {
        path: "multiLine",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.multiLine
      },
      {
        path: "iconStart",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.iconStart
      },
      {
        path: "iconEnd",
        type: "private",
        variableType: "variant",
        initFunc: ({ $props, $state, $queries, $ctx }) => $props.iconEnd
      },
      {
        path: "textInput.value",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "textAreaInput.value",
        type: "private",
        variableType: "text",
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

  const [$ccVariants, setDollarCcVariants] = React.useState<
    Record<string, boolean>
  >({
    disabled: false,
    readonly: false
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
    <BaseTextField
      data-plasmic-name={"ariaTextField"}
      data-plasmic-override={overrides.ariaTextField}
      data-plasmic-root={true}
      data-plasmic-for-node={forNode}
      aria-label={args.ariaLabel}
      autoComplete={args.autoComplete}
      autoFocus={args.autoFocus}
      className={classNames(
        "__wab_instance",
        projectcss.root_reset,
        projectcss.plasmic_default_styles,
        projectcss.plasmic_mixins,
        projectcss.plasmic_tokens,
        sty.ariaTextField,
        {
          [sty.ariaTextFieldiconEnd]: hasVariant($state, "iconEnd", "iconEnd"),
          [sty.ariaTextFieldiconEnd_iconStart]:
            hasVariant($state, "iconStart", "iconStart") &&
            hasVariant($state, "iconEnd", "iconEnd"),
          [sty.ariaTextFieldiconStart]: hasVariant(
            $state,
            "iconStart",
            "iconStart"
          ),
          [sty.ariaTextFieldmultiLine]: hasVariant(
            $state,
            "multiLine",
            "multiLine"
          )
        }
      )}
      inputMode={args.inputMode}
      isDisabled={args.disabled}
      isReadOnly={args.readOnly}
      onChange={async (...eventArgs: any) => {
        generateStateOnChangeProp($state, ["ariaTextField", "value"]).apply(
          null,
          eventArgs
        );
      }}
      plasmicUpdateVariant={updateVariant}
      type={args.type}
      value={generateStateValueProp($state, ["ariaTextField", "value"])}
    >
      {$props.showLabel ? (
        <Paziresh24AtomsLabel
          data-plasmic-name={"paziresh24AtomsLabel"}
          data-plasmic-override={overrides.paziresh24AtomsLabel}
          className={classNames("__wab_instance", sty.paziresh24AtomsLabel, {
            [sty.paziresh24AtomsLabeliconEnd]: hasVariant(
              $state,
              "iconEnd",
              "iconEnd"
            ),
            [sty.paziresh24AtomsLabeliconStart]: hasVariant(
              $state,
              "iconStart",
              "iconStart"
            ),
            [sty.paziresh24AtomsLabelmultiLine]: hasVariant(
              $state,
              "multiLine",
              "multiLine"
            )
          })}
        >
          {renderPlasmicSlot({
            defaultContents: "Label",
            value: args.label
          })}
        </Paziresh24AtomsLabel>
      ) : null}
      <div
        className={classNames(projectcss.all, sty.freeBox__vIqh1, {
          [sty.freeBoxiconEnd__vIqh1R6BoX]: hasVariant(
            $state,
            "iconEnd",
            "iconEnd"
          ),
          [sty.freeBoxiconStart__vIqh1Xgva8]: hasVariant(
            $state,
            "iconStart",
            "iconStart"
          ),
          [sty.freeBoxmultiLine__vIqh1BfcHf]: hasVariant(
            $state,
            "multiLine",
            "multiLine"
          )
        })}
      >
        <div
          className={classNames(projectcss.all, sty.freeBox__dlopK, {
            [sty.freeBoxiconStart__dlopKxgva8]: hasVariant(
              $state,
              "iconStart",
              "iconStart"
            ),
            [sty.freeBoxmultiLine__dlopKbfcHf]: hasVariant(
              $state,
              "multiLine",
              "multiLine"
            )
          })}
        >
          {renderPlasmicSlot({
            defaultContents: (
              <CircleIcon
                className={classNames(projectcss.all, sty.svg___2GSw6)}
                role={"img"}
              />
            ),

            value: args.start,
            className: classNames(sty.slotTargetStart, {
              [sty.slotTargetStarticonStart]: hasVariant(
                $state,
                "iconStart",
                "iconStart"
              )
            })
          })}
        </div>
        {(hasVariant($state, "multiLine", "multiLine") ? false : true) ? (
          <Paziresh24AtomsTextInput
            data-plasmic-name={"textInput"}
            data-plasmic-override={overrides.textInput}
            disabled={$ccVariants["disabled"] ? true : undefined}
            onChange={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, ["textInput", "value"]).apply(
                null,
                eventArgs
              );

              if (
                eventArgs.length > 1 &&
                eventArgs[1] &&
                eventArgs[1]._plasmic_state_init_
              ) {
                return;
              }
            }}
            padded={
              hasVariant($state, "iconStart", "iconStart") &&
              hasVariant($state, "iconEnd", "iconEnd")
                ? ["right", "left"]
                : hasVariant($state, "iconEnd", "iconEnd")
                ? ["right"]
                : hasVariant($state, "iconStart", "iconStart")
                ? ["left"]
                : undefined
            }
            placeholder={args.placeholder}
            value={generateStateValueProp($state, ["textInput", "value"])}
          />
        ) : null}
        {(hasVariant($state, "multiLine", "multiLine") ? true : false) ? (
          <Paziresh24AtomsTextAreaInput
            data-plasmic-name={"textAreaInput"}
            data-plasmic-override={overrides.textAreaInput}
            className={classNames("__wab_instance", {
              [sty.textAreaInputmultiLine]: hasVariant(
                $state,
                "multiLine",
                "multiLine"
              )
            })}
            onChange={async (...eventArgs: any) => {
              generateStateOnChangeProp($state, [
                "textAreaInput",
                "value"
              ]).apply(null, eventArgs);

              if (
                eventArgs.length > 1 &&
                eventArgs[1] &&
                eventArgs[1]._plasmic_state_init_
              ) {
                return;
              }
            }}
            padded={
              hasVariant($state, "iconStart", "iconStart") &&
              hasVariant($state, "iconEnd", "iconEnd")
                ? ["right", "left"]
                : hasVariant($state, "iconEnd", "iconEnd")
                ? ["right"]
                : hasVariant($state, "iconStart", "iconStart")
                ? ["left"]
                : undefined
            }
            placeholder={args.placeholder}
            value={generateStateValueProp($state, ["textAreaInput", "value"])}
          />
        ) : null}
        <div
          className={classNames(projectcss.all, sty.freeBox__aGah8, {
            [sty.freeBoxiconEnd__aGah8R6BoX]: hasVariant(
              $state,
              "iconEnd",
              "iconEnd"
            ),
            [sty.freeBoxiconStart__aGah8Xgva8]: hasVariant(
              $state,
              "iconStart",
              "iconStart"
            )
          })}
        >
          {renderPlasmicSlot({
            defaultContents: (
              <CircleIcon
                className={classNames(projectcss.all, sty.svg__cxHa4)}
                role={"img"}
              />
            ),

            value: args.end,
            className: classNames(sty.slotTargetEnd)
          })}
        </div>
      </div>
      {$props.showDescription ? (
        <Paziresh24AtomsDescription
          data-plasmic-name={"paziresh24AtomsDescription"}
          data-plasmic-override={overrides.paziresh24AtomsDescription}
          className={classNames(
            "__wab_instance",
            sty.paziresh24AtomsDescription
          )}
        >
          {renderPlasmicSlot({
            defaultContents: "Description...",
            value: args.description
          })}
        </Paziresh24AtomsDescription>
      ) : null}
    </BaseTextField>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  ariaTextField: [
    "ariaTextField",
    "paziresh24AtomsLabel",
    "textInput",
    "textAreaInput",
    "paziresh24AtomsDescription"
  ],
  paziresh24AtomsLabel: ["paziresh24AtomsLabel"],
  textInput: ["textInput"],
  textAreaInput: ["textAreaInput"],
  paziresh24AtomsDescription: ["paziresh24AtomsDescription"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  ariaTextField: typeof BaseTextField;
  paziresh24AtomsLabel: typeof Paziresh24AtomsLabel;
  textInput: typeof Paziresh24AtomsTextInput;
  textAreaInput: typeof Paziresh24AtomsTextAreaInput;
  paziresh24AtomsDescription: typeof Paziresh24AtomsDescription;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicPaziresh24TextField__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicPaziresh24TextField__VariantsArgs;
    args?: PlasmicPaziresh24TextField__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicPaziresh24TextField__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicPaziresh24TextField__ArgsType,
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
          internalArgPropNames: PlasmicPaziresh24TextField__ArgProps,
          internalVariantPropNames: PlasmicPaziresh24TextField__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicPaziresh24TextField__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "ariaTextField") {
    func.displayName = "PlasmicPaziresh24TextField";
  } else {
    func.displayName = `PlasmicPaziresh24TextField.${nodeName}`;
  }
  return func;
}

export const PlasmicPaziresh24TextField = Object.assign(
  // Top-level PlasmicPaziresh24TextField renders the root element
  makeNodeComponent("ariaTextField"),
  {
    // Helper components rendering sub-elements
    paziresh24AtomsLabel: makeNodeComponent("paziresh24AtomsLabel"),
    textInput: makeNodeComponent("textInput"),
    textAreaInput: makeNodeComponent("textAreaInput"),
    paziresh24AtomsDescription: makeNodeComponent("paziresh24AtomsDescription"),

    // Metadata about props expected for PlasmicPaziresh24TextField
    internalVariantProps: PlasmicPaziresh24TextField__VariantProps,
    internalArgProps: PlasmicPaziresh24TextField__ArgProps
  }
);

export default PlasmicPaziresh24TextField;
/* prettier-ignore-end */
