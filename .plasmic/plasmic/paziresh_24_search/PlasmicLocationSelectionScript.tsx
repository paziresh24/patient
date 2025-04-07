/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: sMdpLWyxbzDCruwMRffW2m
// Component: 5bzKtjF_q24p

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

import Dialog from "../../Dialog"; // plasmic-import: FJiI2-N1is_F/component
import Button from "../../Button"; // plasmic-import: oVzoHzMf1TLl/component
import { Embed } from "@plasmicpkgs/plasmic-basic-components";
import { SideEffect } from "@plasmicpkgs/plasmic-basic-components";
import { Fetcher } from "@plasmicapp/react-web/lib/data-sources";

import "@plasmicapp/react-web/lib/plasmic.css";

import plasmic_fragment_design_system_css from "../fragment_design_system/plasmic.module.css"; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import plasmic_antd_5_hostless_css from "../antd_5_hostless/plasmic.module.css"; // plasmic-import: ohDidvG9XsCeFumugENU3J/projectcss
import projectcss from "./plasmic.module.css"; // plasmic-import: sMdpLWyxbzDCruwMRffW2m/projectcss
import sty from "./PlasmicLocationSelectionScript.module.css"; // plasmic-import: 5bzKtjF_q24p/css

import ChevronRightIcon from "../fragment_icons/icons/PlasmicIcon__ChevronRight"; // plasmic-import: GHdF3hS-oP_3/icon
import ChevronLeftIcon from "../fragment_icons/icons/PlasmicIcon__ChevronLeft"; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicLocationSelectionScript__VariantMembers = {};
export type PlasmicLocationSelectionScript__VariantsArgs = {};
type VariantPropType = keyof PlasmicLocationSelectionScript__VariantsArgs;
export const PlasmicLocationSelectionScript__VariantProps =
  new Array<VariantPropType>();

export type PlasmicLocationSelectionScript__ArgsType = {
  setCityByUsersIp?: boolean;
  requestGeolocationAccess?: boolean;
  givLocationButtonLoadingStatus?: boolean;
};
type ArgPropType = keyof PlasmicLocationSelectionScript__ArgsType;
export const PlasmicLocationSelectionScript__ArgProps = new Array<ArgPropType>(
  "setCityByUsersIp",
  "requestGeolocationAccess",
  "givLocationButtonLoadingStatus"
);

export type PlasmicLocationSelectionScript__OverridesType = {
  root?: Flex__<"div">;
  dialog?: Flex__<typeof Dialog>;
  text?: Flex__<"div">;
  freeBox?: Flex__<"div">;
  useMyLocation?: Flex__<typeof Button>;
  button?: Flex__<typeof Button>;
  locationSelectionScriptEmbed?: Flex__<typeof Embed>;
  sideEffect?: Flex__<typeof SideEffect>;
};

export interface DefaultLocationSelectionScriptProps {
  setCityByUsersIp?: boolean;
  requestGeolocationAccess?: boolean;
  givLocationButtonLoadingStatus?: boolean;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicLocationSelectionScript__RenderFunc(props: {
  variants: PlasmicLocationSelectionScript__VariantsArgs;
  args: PlasmicLocationSelectionScript__ArgsType;
  overrides: PlasmicLocationSelectionScript__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          setCityByUsersIp: false,
          requestGeolocationAccess: false,
          givLocationButtonLoadingStatus: false
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
        path: "dialog.open",
        type: "private",
        variableType: "boolean",
        initFunc: ({ $props, $state, $queries, $ctx }) => undefined
      },
      {
        path: "variable",
        type: "private",
        variableType: "text",
        initFunc: ({ $props, $state, $queries, $ctx }) => ""
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
      <Dialog
        data-plasmic-name={"dialog"}
        data-plasmic-override={overrides.dialog}
        body={
          <React.Fragment>
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
                "\u0628\u0631\u0627\u06cc \u062f\u06cc\u062f\u0646 \u0646\u062a\u0627\u06cc\u062c \u0627\u0637\u0631\u0627\u0641\u062a\u0627\u0646\u060c \u0628\u0647 \u067e\u0630\u06cc\u0631\u063424 \u0627\u062c\u0627\u0632\u0647 \u062f\u0633\u062a\u0631\u0633\u06cc \u0628\u0647 \u0645\u0648\u0642\u0639\u06cc\u062a \u0645\u06a9\u0627\u0646\u06cc \u0631\u0627 \u0628\u062f\u0647\u06cc\u062f."
              }
            </div>
            <Stack__
              as={"div"}
              data-plasmic-name={"freeBox"}
              data-plasmic-override={overrides.freeBox}
              hasGap={true}
              className={classNames(projectcss.all, sty.freeBox)}
            >
              <Button
                data-plasmic-name={"useMyLocation"}
                data-plasmic-override={overrides.useMyLocation}
                children2={
                  "\u0627\u0633\u062a\u0641\u0627\u062f\u0647 \u0627\u0632 \u0645\u0648\u0642\u0639\u06cc\u062a \u0645\u06a9\u0627\u0646\u06cc"
                }
                className={classNames("__wab_instance", sty.useMyLocation)}
                endIcon={
                  <ChevronLeftIcon
                    className={classNames(projectcss.all, sty.svg__zTqP5)}
                    role={"img"}
                  />
                }
                loading={(() => {
                  try {
                    return $props.givLocationButtonLoadingStatus;
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

                  $steps["startButtonLoading"] = true
                    ? (() => {
                        const actionArgs = {
                          customFunction: async () => {
                            return ($props.givLocationButtonLoadingStatus =
                              true);
                          }
                        };
                        return (({ customFunction }) => {
                          return customFunction();
                        })?.apply(null, [actionArgs]);
                      })()
                    : undefined;
                  if (
                    $steps["startButtonLoading"] != null &&
                    typeof $steps["startButtonLoading"] === "object" &&
                    typeof $steps["startButtonLoading"].then === "function"
                  ) {
                    $steps["startButtonLoading"] = await $steps[
                      "startButtonLoading"
                    ];
                  }

                  $steps["locationAccessGivingSetToUrlParams"] = true
                    ? (() => {
                        const actionArgs = {
                          customFunction: async () => {
                            return (() => {
                              const geoLocationUtils = {
                                checkGeolocationAccess: function () {
                                  return new Promise((resolve, reject) => {
                                    if (!navigator.geolocation) {
                                      reject(
                                        "Geolocation is not supported by your browser."
                                      );
                                    } else if (!navigator.permissions) {
                                      reject(
                                        "Permissions API is not supported by your browser."
                                      );
                                    } else {
                                      navigator.permissions
                                        .query({ name: "geolocation" })
                                        .then(function (permissionStatus) {
                                          resolve(permissionStatus.state);
                                        })
                                        .catch(function (err) {
                                          reject(err);
                                        });
                                    }
                                  });
                                },
                                setLatLonToURL: function () {
                                  navigator.geolocation.getCurrentPosition(
                                    function (position) {
                                      const currentUrl = new URL(
                                        window.location.href
                                      );
                                      const searchParams =
                                        currentUrl.searchParams;
                                      searchParams.set(
                                        "lat",
                                        position.coords.latitude
                                      );
                                      searchParams.set(
                                        "lon",
                                        position.coords.longitude
                                      );
                                      window.location.href =
                                        currentUrl.toString();
                                    },
                                    function (error) {
                                      console.error(
                                        "Error occurred: ",
                                        error.message
                                      );
                                    },
                                    {
                                      maximumAge: 60000,
                                      timeout: 5000,
                                      enableHighAccuracy: true
                                    }
                                  );
                                }
                              };
                              return geoLocationUtils
                                .checkGeolocationAccess()
                                .then(status => {
                                  if (
                                    status === "granted" ||
                                    status === "prompt"
                                  ) {
                                    geoLocationUtils.setLatLonToURL();
                                  } else {
                                    console.error(
                                      "Geolocation access was not granted. Status:",
                                      status
                                    );
                                  }
                                })
                                .catch(err => console.error(err));
                            })();
                          }
                        };
                        return (({ customFunction }) => {
                          return customFunction();
                        })?.apply(null, [actionArgs]);
                      })()
                    : undefined;
                  if (
                    $steps["locationAccessGivingSetToUrlParams"] != null &&
                    typeof $steps["locationAccessGivingSetToUrlParams"] ===
                      "object" &&
                    typeof $steps["locationAccessGivingSetToUrlParams"].then ===
                      "function"
                  ) {
                    $steps["locationAccessGivingSetToUrlParams"] = await $steps[
                      "locationAccessGivingSetToUrlParams"
                    ];
                  }

                  $steps["autoPressNearMeButtonRunCode2"] = true
                    ? (() => {
                        const actionArgs = {
                          customFunction: async () => {
                            return (() => {})();
                          }
                        };
                        return (({ customFunction }) => {
                          return customFunction();
                        })?.apply(null, [actionArgs]);
                      })()
                    : undefined;
                  if (
                    $steps["autoPressNearMeButtonRunCode2"] != null &&
                    typeof $steps["autoPressNearMeButtonRunCode2"] ===
                      "object" &&
                    typeof $steps["autoPressNearMeButtonRunCode2"].then ===
                      "function"
                  ) {
                    $steps["autoPressNearMeButtonRunCode2"] = await $steps[
                      "autoPressNearMeButtonRunCode2"
                    ];
                  }

                  $steps["endButtonLoading"] = true
                    ? (() => {
                        const actionArgs = {
                          customFunction: async () => {
                            return ($props.givLocationButtonLoadingStatus =
                              false);
                          }
                        };
                        return (({ customFunction }) => {
                          return customFunction();
                        })?.apply(null, [actionArgs]);
                      })()
                    : undefined;
                  if (
                    $steps["endButtonLoading"] != null &&
                    typeof $steps["endButtonLoading"] === "object" &&
                    typeof $steps["endButtonLoading"].then === "function"
                  ) {
                    $steps["endButtonLoading"] = await $steps[
                      "endButtonLoading"
                    ];
                  }

                  $steps["updateDialogOpen"] = true
                    ? (() => {
                        const actionArgs = {
                          variable: {
                            objRoot: $state,
                            variablePath: ["dialog", "open"]
                          },
                          operation: 0,
                          value: false
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
                    $steps["updateDialogOpen"] != null &&
                    typeof $steps["updateDialogOpen"] === "object" &&
                    typeof $steps["updateDialogOpen"].then === "function"
                  ) {
                    $steps["updateDialogOpen"] = await $steps[
                      "updateDialogOpen"
                    ];
                  }
                }}
                startIcon={
                  <ChevronRightIcon
                    className={classNames(projectcss.all, sty.svg__m2QR0)}
                    role={"img"}
                  />
                }
              />

              <Button
                data-plasmic-name={"button"}
                data-plasmic-override={overrides.button}
                children2={"\u0641\u0639\u0644\u0627 \u0646\u0647"}
                className={classNames("__wab_instance", sty.button)}
                endIcon={
                  <ChevronLeftIcon
                    className={classNames(projectcss.all, sty.svg__prdvl)}
                    role={"img"}
                  />
                }
                onClick={async event => {
                  const $steps = {};

                  $steps["runCode"] = true
                    ? (() => {
                        const actionArgs = {
                          customFunction: async () => {
                            return (document.cookie = `user_geolocation_access_preference=denied; expires=${new Date(
                              Date.now() + 5184000000
                            ).toUTCString()}`);
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

                  $steps["runCode2"] = true
                    ? (() => {
                        const actionArgs = {
                          customFunction: async () => {
                            return ($state.dialog.open = false);
                          }
                        };
                        return (({ customFunction }) => {
                          return customFunction();
                        })?.apply(null, [actionArgs]);
                      })()
                    : undefined;
                  if (
                    $steps["runCode2"] != null &&
                    typeof $steps["runCode2"] === "object" &&
                    typeof $steps["runCode2"].then === "function"
                  ) {
                    $steps["runCode2"] = await $steps["runCode2"];
                  }
                }}
                outline={true}
                startIcon={
                  <ChevronRightIcon
                    className={classNames(projectcss.all, sty.svg__c5XwP)}
                    role={"img"}
                  />
                }
              />
            </Stack__>
          </React.Fragment>
        }
        className={classNames("__wab_instance", sty.dialog)}
        onOpenChange={async (...eventArgs: any) => {
          generateStateOnChangeProp($state, ["dialog", "open"]).apply(
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
        open={generateStateValueProp($state, ["dialog", "open"])}
        title={
          "\u0645\u06cc\u200c\u062e\u0648\u0627\u0647\u06cc\u062f \u067e\u0632\u0634\u06a9\u0627\u0646 \u0646\u0632\u062f\u06cc\u06a9 \u062e\u0648\u062f \u0631\u0627 \u0628\u0628\u06cc\u0646\u06cc\u062f\u061f"
        }
        trigger={null}
      />

      {(() => {
        try {
          return $props.setCityByUsersIp;
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
        <Embed
          data-plasmic-name={"locationSelectionScriptEmbed"}
          data-plasmic-override={overrides.locationSelectionScriptEmbed}
          className={classNames(
            "__wab_instance",
            sty.locationSelectionScriptEmbed
          )}
          code={
            "<script>\r\n// Helper function to get cookie value by name\r\nfunction getCookie(name) {\r\n    var cookieArr = document.cookie.split(\";\");\r\n    for(var i = 0; i < cookieArr.length; i++) {\r\n        var cookiePair = cookieArr[i].split(\"=\");\r\n        if(name === cookiePair[0].trim()) {\r\n            // Decode the cookie value and return\r\n            return decodeURIComponent(cookiePair[1]);\r\n        }\r\n    }\r\n    // Return null if not found\r\n    return null;\r\n}\r\n\r\n// Main function to execute the desired actions\r\nfunction setLocationBasedOnIP() {\r\n    // Step 1: Check if 'new-city' cookie exists\r\n    if(getCookie('new-city') !== null) {\r\n        console.log('User city already set.');\r\n        return;\r\n    }\r\n\r\n    // Polyfill for fetch if needed\r\n    if (!window.fetch) {\r\n        console.error('Fetch API not supported, consider adding a polyfill.');\r\n        return;\r\n    }\r\n\r\n    // Simulate async behavior using callbacks\r\n    // Step 2: Find user's IP address\r\n    fetch('https://api64.ipify.org?format=json').then(function(ipResponse) {\r\n        ipResponse.json().then(function(ipData) {\r\n            var userIP = ipData.ip;\r\n\r\n            // Step 3: Find user's city by their IP\r\n            fetch('https://ip-api.ir/info/' + userIP, {\r\n                method: 'GET',\r\n                headers: {\r\n                    'Origin': 'https://paziresh24.com'\r\n                }\r\n            }).then(function(cityResponse) {\r\n                cityResponse.json().then(function(cityData) {\r\n\r\n                    // Step 4: Fetch list of provinces and cities\r\n                    fetch('https://www.paziresh24.com/api/getbaseinfo', {\r\n                        method: 'POST',\r\n                        headers: {\r\n                            'Content-Type': 'application/x-www-form-urlencoded',\r\n                        },\r\n                        body: 'table=[\"city\",\"province\"]&terminal_id=\"undefined\"'\r\n                    }).then(function(baseInfoResponse) {\r\n                        baseInfoResponse.json().then(function(baseInfoData) {\r\n                            // Find the matching city in the list\r\n                            var matchingCity = baseInfoData.result.city.find(function(city) {\r\n                                return city.en_slug === cityData.city.toLowerCase();\r\n                            });\r\n\r\n                            if (matchingCity) {\r\n                                // Step 5: Put new 'new-city' cookie\r\n                                document.cookie = 'new-city=' + encodeURIComponent(JSON.stringify(matchingCity)) + '; path=/';\r\n                                clarity(\"set\", \"auto_set_city\" , \"\u062a\u0646\u0638\u06cc\u0645 \u0627\u062a\u0648\u0645\u0627\u062a\u06cc\u06a9 \u0634\u0647\u0631 \u0627\u0632 \u0622\u06cc \u067e\u06cc\");\r\n                                // Tagging the click action in Clarity\r\n                                if (window.clarity) {\r\n                                  window.clarity(\"set\", \"auto_set_city\" , \"\u062a\u0646\u0638\u06cc\u0645 \u0627\u062a\u0648\u0645\u0627\u062a\u06cc\u06a9 \u0634\u0647\u0631 \u0627\u0632 \u0622\u06cc \u067e\u06cc\");\r\n                                  window.clarity(\"event\", \"\u0627\u0637\u0631\u0627\u0641 \u0645\u0646 \u0627\u062a\u0648\u0645\u0627\u0646\u06cc\u06a9 \u067e\u06cc\u0634\u0641\u0631\u0636\");\r\n                                  console.log('Clarity tag set for set city');\r\n                                }\r\n                                // Step 6: Refresh the page to set new city\r\n                                location.reload();\r\n                            } else {\r\n                                console.log('Could not find a matching city in the list.');\r\n                            }\r\n                        });\r\n                    });\r\n                });\r\n            });\r\n        });\r\n    }).catch(function(error) {\r\n        console.error('An error occurred:', error);\r\n    });\r\n}\r\n\r\n// Execute the function\r\nsetLocationBasedOnIP();\r\n\r\n</script>\r\n"
          }
        />
      ) : null}
      {(() => {
        try {
          return $props.requestGeolocationAccess;
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
        <SideEffect
          data-plasmic-name={"sideEffect"}
          data-plasmic-override={overrides.sideEffect}
          className={classNames("__wab_instance", sty.sideEffect)}
          onMount={async () => {
            const $steps = {};

            $steps["openGivingGeolocationAccessDialogByRefrences"] = true
              ? (() => {
                  const actionArgs = {
                    customFunction: async () => {
                      return (() => {
                        function checkCookie(name) {
                          const decodedCookie = decodeURIComponent(
                            document.cookie
                          );
                          const ca = decodedCookie.split(";");
                          let cookieValue = null;
                          ca.forEach(val => {
                            let c = val;
                            while (c.charAt(0) === " ") {
                              c = c.substring(1);
                            }
                            if (c.indexOf(name + "=") === 0) {
                              cookieValue = c.substring(
                                name.length + 1,
                                c.length
                              );
                            }
                          });
                          console.log(
                            `[checkCookie] ${name} cookie value:`,
                            cookieValue
                          );
                          return cookieValue;
                        }
                        function checkGeolocationPermission(callback) {
                          if (!navigator.geolocation) {
                            console.log(
                              "[checkGeolocationPermission] Geolocation is not supported by this browser."
                            );
                            callback(false);
                            return;
                          }
                          navigator.permissions
                            .query({ name: "geolocation" })
                            .then(function (result) {
                              console.log(
                                `[checkGeolocationPermission] Geolocation permission state:`,
                                result.state
                              );
                              if (result.state === "granted") {
                                navigator.geolocation.getCurrentPosition(
                                  function (position) {
                                    const queryParams = new URLSearchParams(
                                      window.location.search
                                    );
                                    if (
                                      !queryParams.has("lat") &&
                                      !queryParams.has("lon")
                                    ) {
                                      queryParams.set(
                                        "lat",
                                        position.coords.latitude
                                      );
                                      queryParams.set(
                                        "lon",
                                        position.coords.longitude
                                      );
                                      const newUrl = `${
                                        window.location.pathname
                                      }?${queryParams.toString()}`;
                                      console.log(
                                        `[checkGeolocationPermission] URL with coordinates: ${newUrl}`
                                      );
                                      callback(true, newUrl);
                                    } else {
                                      console.log(
                                        "[checkGeolocationPermission] Coordinates already present in URL, no changes made."
                                      );
                                      callback(true);
                                    }
                                  },
                                  function (error) {
                                    console.log(
                                      `[checkGeolocationPermission] Error obtaining geolocation: ${error.message}`
                                    );
                                    callback(false);
                                  }
                                );
                              } else {
                                callback(false);
                              }
                            })
                            .catch(function (error) {
                              console.log(
                                "[checkGeolocationPermission] Error checking geolocation permission:",
                                error
                              );
                              callback(false);
                            });
                        }
                        function checkConditionsAndOpenDialog() {
                          console.log(
                            "[checkConditionsAndOpenDialog] Checking conditions..."
                          );
                          const cookieValue = checkCookie(
                            "user_geolocation_access_preference"
                          );
                          if (cookieValue !== "denied") {
                            console.log(
                              "[checkConditionsAndOpenDialog] Cookie is not 'denied', checking geolocation permission..."
                            );
                            checkGeolocationPermission(function (
                              hasPermissionOrSupported,
                              url
                            ) {
                              console.log(
                                `[checkGeolocationPermission Callback] hasPermissionOrSupported:`,
                                hasPermissionOrSupported
                              );
                              if (!hasPermissionOrSupported) {
                                console.log(
                                  "[checkConditionsAndOpenDialog] Permission not granted or not supported, opening dialog..."
                                );
                                $state.dialog.open = true;
                              } else if (url) {
                                console.log(
                                  "[checkConditionsAndOpenDialog] Permission granted, URL with lat and lon:",
                                  url
                                );
                                window.location.href = url;
                              } else {
                                console.log(
                                  "[checkConditionsAndOpenDialog] No update to URL required."
                                );
                              }
                            });
                          } else {
                            console.log(
                              "[checkConditionsAndOpenDialog] Cookie is 'denied', not checking geolocation permission or opening dialog."
                            );
                          }
                        }
                        return checkConditionsAndOpenDialog();
                      })();
                    }
                  };
                  return (({ customFunction }) => {
                    return customFunction();
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["openGivingGeolocationAccessDialogByRefrences"] != null &&
              typeof $steps["openGivingGeolocationAccessDialogByRefrences"] ===
                "object" &&
              typeof $steps["openGivingGeolocationAccessDialogByRefrences"]
                .then === "function"
            ) {
              $steps["openGivingGeolocationAccessDialogByRefrences"] =
                await $steps["openGivingGeolocationAccessDialogByRefrences"];
            }

            $steps["sendClarityCustomTagsEventRunCode"] = true
              ? (() => {
                  const actionArgs = {
                    customFunction: async () => {
                      return (() => {
                        if ("clarity" in window) {
                          clarity(
                            "set",
                            "fragment_component_load",
                            "location selection script component loaded"
                          );
                          return console.log(
                            "try to set clarity tag fragment_component_load to location selection script component loaded"
                          );
                        }
                      })();
                    }
                  };
                  return (({ customFunction }) => {
                    return customFunction();
                  })?.apply(null, [actionArgs]);
                })()
              : undefined;
            if (
              $steps["sendClarityCustomTagsEventRunCode"] != null &&
              typeof $steps["sendClarityCustomTagsEventRunCode"] === "object" &&
              typeof $steps["sendClarityCustomTagsEventRunCode"].then ===
                "function"
            ) {
              $steps["sendClarityCustomTagsEventRunCode"] = await $steps[
                "sendClarityCustomTagsEventRunCode"
              ];
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
    "dialog",
    "text",
    "freeBox",
    "useMyLocation",
    "button",
    "locationSelectionScriptEmbed",
    "sideEffect"
  ],
  dialog: ["dialog", "text", "freeBox", "useMyLocation", "button"],
  text: ["text"],
  freeBox: ["freeBox", "useMyLocation", "button"],
  useMyLocation: ["useMyLocation"],
  button: ["button"],
  locationSelectionScriptEmbed: ["locationSelectionScriptEmbed"],
  sideEffect: ["sideEffect"]
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> =
  (typeof PlasmicDescendants)[T][number];
type NodeDefaultElementType = {
  root: "div";
  dialog: typeof Dialog;
  text: "div";
  freeBox: "div";
  useMyLocation: typeof Button;
  button: typeof Button;
  locationSelectionScriptEmbed: typeof Embed;
  sideEffect: typeof SideEffect;
};

type ReservedPropsType = "variants" | "args" | "overrides";
type NodeOverridesType<T extends NodeNameType> = Pick<
  PlasmicLocationSelectionScript__OverridesType,
  DescendantsType<T>
>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicLocationSelectionScript__VariantsArgs;
    args?: PlasmicLocationSelectionScript__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicLocationSelectionScript__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<
      PlasmicLocationSelectionScript__ArgsType,
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
          internalArgPropNames: PlasmicLocationSelectionScript__ArgProps,
          internalVariantPropNames: PlasmicLocationSelectionScript__VariantProps
        }),
      [props, nodeName]
    );
    return PlasmicLocationSelectionScript__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName
    });
  };
  if (nodeName === "root") {
    func.displayName = "PlasmicLocationSelectionScript";
  } else {
    func.displayName = `PlasmicLocationSelectionScript.${nodeName}`;
  }
  return func;
}

export const PlasmicLocationSelectionScript = Object.assign(
  // Top-level PlasmicLocationSelectionScript renders the root element
  makeNodeComponent("root"),
  {
    // Helper components rendering sub-elements
    dialog: makeNodeComponent("dialog"),
    text: makeNodeComponent("text"),
    freeBox: makeNodeComponent("freeBox"),
    useMyLocation: makeNodeComponent("useMyLocation"),
    button: makeNodeComponent("button"),
    locationSelectionScriptEmbed: makeNodeComponent(
      "locationSelectionScriptEmbed"
    ),
    sideEffect: makeNodeComponent("sideEffect"),

    // Metadata about props expected for PlasmicLocationSelectionScript
    internalVariantProps: PlasmicLocationSelectionScript__VariantProps,
    internalArgProps: PlasmicLocationSelectionScript__ArgProps
  }
);

export default PlasmicLocationSelectionScript;
/* prettier-ignore-end */
