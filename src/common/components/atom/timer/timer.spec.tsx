import { render } from '@testing-library/react';

import Timer from './timer';

describe('Timer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Timer target={1644812367} />);
    expect(baseElement).toBeTruthy();
  });
});
