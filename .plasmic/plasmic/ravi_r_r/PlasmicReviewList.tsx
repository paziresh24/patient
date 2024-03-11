// @ts-nocheck
/* eslint-disable */
/* tslint:disable */
/* prettier-ignore-start */

/** @jsxRuntime classic */
/** @jsx createPlasmicElementProxy */
/** @jsxFrag React.Fragment */

// This class is auto-generated by Plasmic; please do not edit!
// Plasmic Project: qQzsBf58SqzNJX45iggq96
// Component: Bx6gxTOoja9k

import * as React from 'react';

import Head from 'next/head';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

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
  wrapWithClassName,
} from '@plasmicapp/react-web';
import { DataCtxReader as DataCtxReader__, useDataEnv, useGlobalActions } from '@plasmicapp/react-web/lib/host';

import SetNweReview from '../../SetNweReview'; // plasmic-import: ZewL2B_Ktxrj/component
import Select from '../../Select'; // plasmic-import: zIWWWwAA3-2B/component
import TextInput from '../../TextInput'; // plasmic-import: iKLtt-X_YZoa/component
import ReviewCard from '../../ReviewCard'; // plasmic-import: hjUuvN6lhrZV/component
import Button from '../../Button'; // plasmic-import: oVzoHzMf1TLl/component

import '@plasmicapp/react-web/lib/plasmic.css';

import plasmic_fragment_design_system_css from '../fragment_design_system/plasmic.module.css'; // plasmic-import: h9Dbk9ygddw7UVEq1NNhKi/projectcss
import projectcss from './plasmic.module.css'; // plasmic-import: qQzsBf58SqzNJX45iggq96/projectcss
import sty from './PlasmicReviewList.module.css'; // plasmic-import: Bx6gxTOoja9k/css

import SearchsvgIcon from './icons/PlasmicIcon__Searchsvg'; // plasmic-import: W3TLlIDrGJdy/icon
import ChecksvgIcon from './icons/PlasmicIcon__Checksvg'; // plasmic-import: NWCYMTObqr7D/icon
import ChevronRightIcon from '../fragment_icons/icons/PlasmicIcon__ChevronRight'; // plasmic-import: GHdF3hS-oP_3/icon
import ChevronLeftIcon from '../fragment_icons/icons/PlasmicIcon__ChevronLeft'; // plasmic-import: r9Upp9NbiZkf/icon

createPlasmicElementProxy;

export type PlasmicReviewList__VariantMembers = {};
export type PlasmicReviewList__VariantsArgs = {};
type VariantPropType = keyof PlasmicReviewList__VariantsArgs;
export const PlasmicReviewList__VariantProps = new Array<VariantPropType>();

export type PlasmicReviewList__ArgsType = {
  reviewResponse?: any;
  nextPageTrigger?: (page: number) => void;
  paginationLoadingStatus?: boolean;
  user?: any;
  centers?: any;
  onSearch?: (value: string) => void;
  onFilter?: (value: string) => void;
  onSort?: (value: string) => void;
};
type ArgPropType = keyof PlasmicReviewList__ArgsType;
export const PlasmicReviewList__ArgProps = new Array<ArgPropType>(
  'reviewResponse',
  'nextPageTrigger',
  'paginationLoadingStatus',
  'user',
  'centers',
  'onSearch',
  'onFilter',
  'onSort',
);

export type PlasmicReviewList__OverridesType = {
  root?: Flex__<'div'>;
  setNweReview?: Flex__<typeof SetNweReview>;
  filterInput?: Flex__<typeof Select>;
  sortInput?: Flex__<typeof Select>;
  searchInput?: Flex__<typeof TextInput>;
  cardLine?: Flex__<'div'>;
  reviewCard?: Flex__<typeof ReviewCard>;
  button?: Flex__<typeof Button>;
};

export interface DefaultReviewListProps {
  reviewResponse?: any;
  nextPageTrigger?: (page: number) => void;
  paginationLoadingStatus?: boolean;
  user?: any;
  centers?: any;
  onSearch?: (value: string) => void;
  onFilter?: (value: string) => void;
  onSort?: (value: string) => void;
  className?: string;
}

const $$ = {};

function useNextRouter() {
  try {
    return useRouter();
  } catch {}
  return undefined;
}

function PlasmicReviewList__RenderFunc(props: {
  variants: PlasmicReviewList__VariantsArgs;
  args: PlasmicReviewList__ArgsType;
  overrides: PlasmicReviewList__OverridesType;
  forNode?: string;
}) {
  const { variants, overrides, forNode } = props;

  const args = React.useMemo(
    () =>
      Object.assign(
        {
          paginationLoadingStatus: false,
        },
        props.args,
      ),
    [props.args],
  );

  const $props = {
    ...args,
    ...variants,
  };

  const __nextRouter = useNextRouter();
  const $ctx = useDataEnv?.() || {};
  const refsRef = React.useRef({});
  const $refs = refsRef.current;

  const currentUser = useCurrentUser?.() || {};

  const stateSpecs: Parameters<typeof useDollarState>[0] = React.useMemo(
    () => [
      {
        path: 'page',
        type: 'private',
        variableType: 'number',
        initFunc: ({ $props, $state, $queries, $ctx }) => 1,
      },
      {
        path: 'searchInput.value',
        type: 'private',
        variableType: 'text',
        initFunc: ({ $props, $state, $queries, $ctx }) => '',
      },
      {
        path: 'filterInput.value',
        type: 'private',
        variableType: 'text',
        initFunc: ({ $props, $state, $queries, $ctx }) => 'all',
      },
      {
        path: 'sortInput.value',
        type: 'private',
        variableType: 'text',
        initFunc: ({ $props, $state, $queries, $ctx }) => 'default_order',
      },
    ],
    [$props, $ctx, $refs],
  );
  const $state = useDollarState(stateSpecs, {
    $props,
    $ctx,
    $queries: {},
    $refs,
  });

  return (
    <div
      data-plasmic-name={'root'}
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
      )}
    >
      <SetNweReview
        data-plasmic-name={'setNweReview'}
        data-plasmic-override={overrides.setNweReview}
        className={classNames('__wab_instance', sty.setNweReview)}
      />

      <div className={classNames(projectcss.all, sty.freeBox___3DZjG)} />

      <Stack__ as={'div'} hasGap={true} className={classNames(projectcss.all, sty.freeBox___6RwG3)}>
        <Stack__ as={'div'} hasGap={true} className={classNames(projectcss.all, sty.freeBox__alcob)}>
          <Select
            data-plasmic-name={'filterInput'}
            data-plasmic-override={overrides.filterInput}
            className={classNames('__wab_instance', sty.filterInput)}
            onChange={async (...eventArgs: any) => {
              ((...eventArgs) => {
                generateStateOnChangeProp($state, ['filterInput', 'value'])(eventArgs[0]);
              }).apply(null, eventArgs);
              (async value => {
                const $steps = {};

                $steps['runOnFilter'] = true
                  ? (() => {
                      const actionArgs = {
                        eventRef: $props['onFilter'],
                        args: [
                          (() => {
                            try {
                              return $state.filterInput.value;
                            } catch (e) {
                              if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                                return undefined;
                              }
                              throw e;
                            }
                          })(),
                        ],
                      };
                      return (({ eventRef, args }) => {
                        return eventRef?.(...(args ?? []));
                      })?.apply(null, [actionArgs]);
                    })()
                  : undefined;
                if (
                  $steps['runOnFilter'] != null &&
                  typeof $steps['runOnFilter'] === 'object' &&
                  typeof $steps['runOnFilter'].then === 'function'
                ) {
                  $steps['runOnFilter'] = await $steps['runOnFilter'];
                }
              }).apply(null, eventArgs);
            }}
            options={(() => {
              try {
                return [
                  { value: 'all', label: 'همه نظرات' },
                  ...($props.user.isLogin ? [{ value: 'my_feedbacks', label: 'نظرات من' }] : []),
                  { value: 'recommended', label: 'نظرات منفی' },
                  { value: 'has_nobat', label: 'بیماران دارای نوبت' },
                  ...$props.centers.map(center => ({
                    value: center.id,
                    label: center.name,
                  })),
                ];
              } catch (e) {
                if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                  return undefined;
                }
                throw e;
              }
            })()}
            value={generateStateValueProp($state, ['filterInput', 'value'])}
          />

          <Select
            data-plasmic-name={'sortInput'}
            data-plasmic-override={overrides.sortInput}
            className={classNames('__wab_instance', sty.sortInput)}
            onChange={async (...eventArgs: any) => {
              ((...eventArgs) => {
                generateStateOnChangeProp($state, ['sortInput', 'value'])(eventArgs[0]);
              }).apply(null, eventArgs);
              (async value => {
                const $steps = {};

                $steps['runOnSort'] = true
                  ? (() => {
                      const actionArgs = {
                        eventRef: $props['onSort'],
                        args: [
                          (() => {
                            try {
                              return $state.sortInput.value;
                            } catch (e) {
                              if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                                return undefined;
                              }
                              throw e;
                            }
                          })(),
                        ],
                      };
                      return (({ eventRef, args }) => {
                        return eventRef?.(...(args ?? []));
                      })?.apply(null, [actionArgs]);
                    })()
                  : undefined;
                if (
                  $steps['runOnSort'] != null &&
                  typeof $steps['runOnSort'] === 'object' &&
                  typeof $steps['runOnSort'].then === 'function'
                ) {
                  $steps['runOnSort'] = await $steps['runOnSort'];
                }
              }).apply(null, eventArgs);
            }}
            options={(() => {
              const __composite = [
                { value: null, label: null },
                { label: null, value: null },
                { label: null, value: null },
              ];
              __composite['0']['value'] = 'default_order';
              __composite['0']['label'] = '\u0645\u0631\u062a\u0628\u0637 \u062a\u0631\u06cc\u0646';
              __composite['1']['label'] = '\u062c\u062f\u06cc\u062f \u062a\u0631\u06cc\u0646';
              __composite['1']['value'] = 'created_at';
              __composite['2']['label'] = '\u0645\u062d\u0628\u0648\u0628 \u062a\u0631\u06cc\u0646';
              __composite['2']['value'] = 'like';
              return __composite;
            })()}
            value={generateStateValueProp($state, ['sortInput', 'value'])}
          />
        </Stack__>
        <TextInput
          data-plasmic-name={'searchInput'}
          data-plasmic-override={overrides.searchInput}
          className={classNames('__wab_instance', sty.searchInput)}
          onChange={async (...eventArgs: any) => {
            ((...eventArgs) => {
              generateStateOnChangeProp($state, ['searchInput', 'value'])((e => e.target?.value).apply(null, eventArgs));
            }).apply(null, eventArgs);
            (async event => {
              const $steps = {};
              console.log(eventArgs);

              $steps['runOnSearch'] = true
                ? (() => {
                    const actionArgs = {
                      eventRef: $props['onSearch'],
                      args: [
                        (() => {
                          try {
                            return (() => {
                              console.log('value', $state.searchInput.value);
                              return $state.searchInput.value;
                            })();
                          } catch (e) {
                            if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                              return undefined;
                            }
                            throw e;
                          }
                        })(),
                      ],
                    };
                    return (({ eventRef, args }) => {
                      return eventRef?.(...(args ?? []));
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps['runOnSearch'] != null &&
                typeof $steps['runOnSearch'] === 'object' &&
                typeof $steps['runOnSearch'].then === 'function'
              ) {
                $steps['runOnSearch'] = await $steps['runOnSearch'];
              }
            }).apply(null, eventArgs);
          }}
          placeholder={
            '\u062c\u0633\u062a\u062c\u0648\u06cc \u0646\u0627\u0645 \u0628\u06cc\u0645\u0627\u0631\u06cc \u0648... \u062f\u0631 \u0646\u0638\u0631\u0627\u062a'
          }
          value={generateStateValueProp($state, ['searchInput', 'value']) ?? ''}
        />

        <div className={classNames(projectcss.all, projectcss.__wab_text, sty.text__zJu53)}>
          <React.Fragment>
            {(() => {
              try {
                return $state.searchInput.value;
              } catch (e) {
                if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                  return '';
                }
                throw e;
              }
            })()}
          </React.Fragment>
        </div>
      </Stack__>
      <div className={classNames(projectcss.all, sty.freeBox__juWhk)} />

      {(_par => (!_par ? [] : Array.isArray(_par) ? _par : [_par]))(
        (() => {
          try {
            return $props.reviewResponse;
          } catch (e) {
            if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
              return [];
            }
            throw e;
          }
        })(),
      ).map((__plasmic_item_0, __plasmic_idx_0) => {
        const currentItem = __plasmic_item_0;
        const currentIndex = __plasmic_idx_0;
        return (
          <Stack__
            as={'div'}
            data-plasmic-name={'cardLine'}
            data-plasmic-override={overrides.cardLine}
            hasGap={true}
            className={classNames(projectcss.all, sty.cardLine)}
            key={currentIndex}
          >
            <ReviewCard
              data-plasmic-name={'reviewCard'}
              data-plasmic-override={overrides.reviewCard}
              className={classNames('__wab_instance', sty.reviewCard)}
              commentText={(() => {
                try {
                  return currentItem.description;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return undefined;
                  }
                  throw e;
                }
              })()}
              docCenter={(() => {
                try {
                  return currentItem.center_name;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return undefined;
                  }
                  throw e;
                }
              })()}
              doctorEncounter={(() => {
                try {
                  return currentItem.doctor_encounter;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return undefined;
                  }
                  throw e;
                }
              })()}
              doctorId={(() => {
                try {
                  return currentItem.doctor_id;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return undefined;
                  }
                  throw e;
                }
              })()}
              explanationOfIssue={(() => {
                try {
                  return currentItem.explanation_of_issue;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return undefined;
                  }
                  throw e;
                }
              })()}
              feedbackId={(() => {
                try {
                  return currentItem.id;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return undefined;
                  }
                  throw e;
                }
              })()}
              like={(() => {
                try {
                  return currentItem.like;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return undefined;
                  }
                  throw e;
                }
              })()}
              qualityOfTreatment={(() => {
                try {
                  return currentItem.quality_of_treatment;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return undefined;
                  }
                  throw e;
                }
              })()}
              recommended={(() => {
                try {
                  return currentItem.recommended === '1' ? true : false;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return false;
                  }
                  throw e;
                }
              })()}
              replies={(() => {
                try {
                  return currentItem.reply;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return undefined;
                  }
                  throw e;
                }
              })()}
              serverId={(() => {
                try {
                  return currentItem.server_id;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return undefined;
                  }
                  throw e;
                }
              })()}
              setTime={(() => {
                try {
                  return currentItem.formatted_date;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return undefined;
                  }
                  throw e;
                }
              })()}
              userId={(() => {
                try {
                  return currentItem.user_id;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return undefined;
                  }
                  throw e;
                }
              })()}
              userName={(() => {
                try {
                  return currentItem.user_name;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return undefined;
                  }
                  throw e;
                }
              })()}
              userProfile={(() => {
                try {
                  return currentItem.user_image;
                } catch (e) {
                  if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                    return undefined;
                  }
                  throw e;
                }
              })()}
            />

            <div className={classNames(projectcss.all, sty.freeBox__q1VhB)} />
          </Stack__>
        );
      })}
      {(() => {
        try {
          return $props.reviewResponse.length === 0;
        } catch (e) {
          if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
            return true;
          }
          throw e;
        }
      })() ? (
        <div className={classNames(projectcss.all, sty.freeBox__kwRs)}>
          <div className={classNames(projectcss.all, sty.freeBox__pnl53)}>
            <div className={classNames(projectcss.all, projectcss.__wab_text, sty.text__x0PVy)}>
              {'\u0645\u0648\u0631\u062f\u06cc \u06cc\u0627\u0641\u062a \u0646\u0634\u062f!'}
            </div>
          </div>
        </div>
      ) : null}
      {(() => {
        try {
          return $props.paginationLoadingStatus || $state.page * 10 === $props.reviewResponse.length;
        } catch (e) {
          if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
            return true;
          }
          throw e;
        }
      })() ? (
        <div className={classNames(projectcss.all, sty.freeBox__imJd)}>
          <Button
            data-plasmic-name={'button'}
            data-plasmic-override={overrides.button}
            children2={
              <div className={classNames(projectcss.all, projectcss.__wab_text, sty.text___4XpEt)}>
                {'\u0645\u0634\u0627\u0647\u062f\u0647  \u0628\u06cc\u0634\u062a\u0631'}
              </div>
            }
            className={classNames('__wab_instance', sty.button)}
            link={undefined}
            loading={(() => {
              try {
                return $props.paginationLoadingStatus;
              } catch (e) {
                if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                  return [];
                }
                throw e;
              }
            })()}
            onClick={async event => {
              const $steps = {};

              $steps['updatePage'] = true
                ? (() => {
                    const actionArgs = {
                      variable: {
                        objRoot: $state,
                        variablePath: ['page'],
                      },
                      operation: 2,
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
                $steps['updatePage'] != null &&
                typeof $steps['updatePage'] === 'object' &&
                typeof $steps['updatePage'].then === 'function'
              ) {
                $steps['updatePage'] = await $steps['updatePage'];
              }

              $steps['runNextPageTrigger'] = true
                ? (() => {
                    const actionArgs = {
                      eventRef: $props['nextPageTrigger'],
                      args: [
                        (() => {
                          try {
                            return $state.page;
                          } catch (e) {
                            if (e instanceof TypeError || e?.plasmicType === 'PlasmicUndefinedDataError') {
                              return undefined;
                            }
                            throw e;
                          }
                        })(),
                      ],
                    };
                    return (({ eventRef, args }) => {
                      return eventRef?.(...(args ?? []));
                    })?.apply(null, [actionArgs]);
                  })()
                : undefined;
              if (
                $steps['runNextPageTrigger'] != null &&
                typeof $steps['runNextPageTrigger'] === 'object' &&
                typeof $steps['runNextPageTrigger'].then === 'function'
              ) {
                $steps['runNextPageTrigger'] = await $steps['runNextPageTrigger'];
              }
            }}
            outline={true}
          />
        </div>
      ) : null}
    </div>
  ) as React.ReactElement | null;
}

const PlasmicDescendants = {
  root: ['root', 'setNweReview', 'filterInput', 'sortInput', 'searchInput', 'cardLine', 'reviewCard', 'button'],
  setNweReview: ['setNweReview'],
  filterInput: ['filterInput'],
  sortInput: ['sortInput'],
  searchInput: ['searchInput'],
  cardLine: ['cardLine', 'reviewCard'],
  reviewCard: ['reviewCard'],
  button: ['button'],
} as const;
type NodeNameType = keyof typeof PlasmicDescendants;
type DescendantsType<T extends NodeNameType> = typeof PlasmicDescendants[T][number];
type NodeDefaultElementType = {
  root: 'div';
  setNweReview: typeof SetNweReview;
  filterInput: typeof Select;
  sortInput: typeof Select;
  searchInput: typeof TextInput;
  cardLine: 'div';
  reviewCard: typeof ReviewCard;
  button: typeof Button;
};

type ReservedPropsType = 'variants' | 'args' | 'overrides';
type NodeOverridesType<T extends NodeNameType> = Pick<PlasmicReviewList__OverridesType, DescendantsType<T>>;
type NodeComponentProps<T extends NodeNameType> =
  // Explicitly specify variants, args, and overrides as objects
  {
    variants?: PlasmicReviewList__VariantsArgs;
    args?: PlasmicReviewList__ArgsType;
    overrides?: NodeOverridesType<T>;
  } & Omit<PlasmicReviewList__VariantsArgs, ReservedPropsType> & // Specify variants directly as props
    /* Specify args directly as props*/ Omit<PlasmicReviewList__ArgsType, ReservedPropsType> &
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
  const func = function <T extends PropsType>(props: T & StrictProps<T, PropsType>) {
    const { variants, args, overrides } = React.useMemo(
      () =>
        deriveRenderOpts(props, {
          name: nodeName,
          descendantNames: PlasmicDescendants[nodeName],
          internalArgPropNames: PlasmicReviewList__ArgProps,
          internalVariantPropNames: PlasmicReviewList__VariantProps,
        }),
      [props, nodeName],
    );
    return PlasmicReviewList__RenderFunc({
      variants,
      args,
      overrides,
      forNode: nodeName,
    });
  };
  if (nodeName === 'root') {
    func.displayName = 'PlasmicReviewList';
  } else {
    func.displayName = `PlasmicReviewList.${nodeName}`;
  }
  return func;
}

export const PlasmicReviewList = Object.assign(
  // Top-level PlasmicReviewList renders the root element
  makeNodeComponent('root'),
  {
    // Helper components rendering sub-elements
    setNweReview: makeNodeComponent('setNweReview'),
    filterInput: makeNodeComponent('filterInput'),
    sortInput: makeNodeComponent('sortInput'),
    searchInput: makeNodeComponent('searchInput'),
    cardLine: makeNodeComponent('cardLine'),
    reviewCard: makeNodeComponent('reviewCard'),
    button: makeNodeComponent('button'),

    // Metadata about props expected for PlasmicReviewList
    internalVariantProps: PlasmicReviewList__VariantProps,
    internalArgProps: PlasmicReviewList__ArgProps,
  },
);

export default PlasmicReviewList;
/* prettier-ignore-end */
