import { render } from '@testing-library/react';
import { BookStatus } from 'apps/patient-app/types/bookStatus';

import TagStatus, { TagsStatusTranslation } from './tagStatus';

describe('TagStatus', () => {
    Object.keys(BookStatus).forEach(status => {
        it(`should render translation ${status}`, () => {
            const { baseElement } = render(<TagStatus status={status as BookStatus} />);
            expect(baseElement.textContent).toBe(TagsStatusTranslation[status as BookStatus]);
        });
    });
});
