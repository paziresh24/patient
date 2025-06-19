import { render } from '@testing-library/react';
import Avatar from './avatar';

describe('Avatar', () => {
  it('should show image with default 70*70 pixels', () => {
    const { getByAltText } = render(<Avatar src="https://i.pravatar.cc/150?img=50" />);
    const image = getByAltText('avatar') as HTMLImageElement;

    expect(image.width).toBe(70);
    expect(image.height).toBe(70);
    expect(image.src).toContain('https://i.pravatar.cc/150?img=50');
  });

  it('should image with 100*100 pixels', () => {
    const { getByAltText } = render(<Avatar src="https://i.pravatar.cc/150?img=50" width={100} height={100} />);
    const image = getByAltText('avatar') as HTMLImageElement;

    expect(image.width).toBe(100);
    expect(image.height).toBe(100);
    expect(image.src).toContain('https://i.pravatar.cc/150?img=50');
  });
});
