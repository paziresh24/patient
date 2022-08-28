import { render } from '@testing-library/react';

import Chips from './chips';

describe('Card', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Chips>foo</Chips>);
    expect(baseElement).toBeTruthy();
  });
});
