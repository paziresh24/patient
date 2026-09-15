import * as React from 'react';

export const ONLINE_VISIT_HEADING_OLD = 'همین الان آنلاین ویزیت شوید';
export const ONLINE_VISIT_HEADING_NEW = 'آنلاین ویزیت شوید';

/** Plasmic title `text__ue5AT` has no named override; swap via `root.wrapChildren`. */
export const replaceOnlineVisitHeading = (node: React.ReactNode): React.ReactNode => {
  if (typeof node === 'string') {
    return node === ONLINE_VISIT_HEADING_OLD ? ONLINE_VISIT_HEADING_NEW : node;
  }
  if (Array.isArray(node)) {
    return React.Children.map(node, replaceOnlineVisitHeading);
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node) && node.props.children != null) {
    return React.cloneElement(node, undefined, replaceOnlineVisitHeading(node.props.children));
  }
  return node;
};
