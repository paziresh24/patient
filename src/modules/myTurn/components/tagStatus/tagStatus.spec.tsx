import { render } from '@testing-library/react';
import { BookStatus } from '../../types/bookStatus';

import TagStatus, { TagsStatusTranslation } from './tagStatus';

describe('TagStatus', () => {
  Object.values(BookStatus).forEach(status => {
    it(`should render translation ${status}`, () => {
      const { baseElement } = render(<TagStatus status={status} />);
      expect(baseElement.textContent).toBe(TagsStatusTranslation[status]);
    });
  });
});
