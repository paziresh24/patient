import { render } from '@testing-library/react';

import DropDown from './dropDown';

describe('Card', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DropDown>foo</DropDown>);
    expect(baseElement).toBeTruthy();
  });
});
