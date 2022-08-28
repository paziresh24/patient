import { render } from '@testing-library/react';

import TurnDetails from './turnDetails';

describe('Tunr Details', () => {
  it('should return just tracking code', () => {
    const { container } = render(<TurnDetails items={[{ id: 0, name: 'کدپیگیری', value: '123' }]} />);
    expect(container.firstChild.childNodes.length).toBe(1);
    expect(container.querySelectorAll('span')[0].innerHTML).toBe('کدپیگیری:');
    expect(container.querySelectorAll('span')[1].innerHTML).toBe('123');
  });
  it('should return two details', () => {
    const { container } = render(
      <TurnDetails
        items={[
          { id: 0, name: 'کدپیگیری', value: '123' },
          { id: 1, name: 'میانگین زمان انتظار در مطب', value: '2 ساعت' },
        ]}
      />,
    );
    expect(container.firstChild.childNodes.length).toBe(2);
  });
});
