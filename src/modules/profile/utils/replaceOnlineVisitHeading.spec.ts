import * as React from 'react';
import { render, screen } from '@testing-library/react';
import {
  ONLINE_VISIT_HEADING_NEW,
  ONLINE_VISIT_HEADING_OLD,
  replaceOnlineVisitHeading,
} from './replaceOnlineVisitHeading';

describe('replaceOnlineVisitHeading', () => {
  it('replaces the old Plasmic title and leaves neighboring copy', () => {
    const tree = replaceOnlineVisitHeading(
      React.createElement(
        'div',
        null,
        React.createElement('div', null, ONLINE_VISIT_HEADING_OLD),
        React.createElement('button', null, 'رزرو نوبت دکتر نمونه'),
      ),
    );
    render(React.createElement(React.Fragment, null, tree));
    expect(screen.getByText(ONLINE_VISIT_HEADING_NEW)).toBeInTheDocument();
    expect(screen.queryByText(ONLINE_VISIT_HEADING_OLD)).not.toBeInTheDocument();
    expect(screen.getByText('رزرو نوبت دکتر نمونه')).toBeInTheDocument();
  });
});
