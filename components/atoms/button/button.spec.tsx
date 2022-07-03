import { render } from '@testing-library/react';

import Button from './button';

describe('Button', () => {
    it('should content in children', () => {
        const { getByText } = render(<Button>Button</Button>);
        const button = getByText('Button') as HTMLButtonElement;

        expect(button.innerHTML).toBe('Button');
    });
});
