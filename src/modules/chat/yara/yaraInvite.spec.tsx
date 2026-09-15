/**
 * گاردهای خطِ دعوتِ هوم‌پیج (DR-11 §۱۳-۴):
 * خارج از باکت = هیچ DOMی (صفر layout-shift)، و CTR قابلِ اندازه‌گیری (view + click).
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { YaraInvite } from './yaraInvite';
import { useChatGate } from '../useChatGate';
import { sendYaraInvite } from '../chatApi';

// factory الزامی است: بدونِ آن jest برای automock ماژولِ واقعی را لود می‌کند و
// زنجیره‌ی importش به getConfig (که در محیطِ تست undefined است) می‌رسد.
jest.mock('../useChatGate', () => ({ useChatGate: jest.fn() }));
jest.mock('../chatApi', () => ({ sendYaraInvite: jest.fn() }));
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const mockGate = useChatGate as jest.MockedFunction<typeof useChatGate>;

describe('YaraInvite', () => {
  beforeEach(() => jest.clearAllMocks());

  it('خارج از باکت/مهمان/هاستِ ممنوع ⇒ هیچ DOMی رندر نمی‌شود (صفر layout-shift)', () => {
    mockGate.mockReturnValue({ allowed: false, reason: 'feature_off' } as any);
    const { container } = render(<YaraInvite />);
    expect(container).toBeEmptyDOMElement();
    expect(sendYaraInvite).not.toHaveBeenCalled();
  });

  it('کاربرِ مجاز ⇒ خطِ دعوت با لینک به /yara + یک رویدادِ view', () => {
    mockGate.mockReturnValue({ allowed: true, reason: null } as any);
    render(<YaraInvite />);
    const link = screen.getByTestId('yara-invite');
    expect(link).toHaveAttribute('href', '/yara');
    expect(sendYaraInvite).toHaveBeenCalledTimes(1);
    expect(sendYaraInvite).toHaveBeenCalledWith('view');
  });

  it('کلیک ⇒ رویدادِ click (صورتِ CTRِ M-8)', async () => {
    mockGate.mockReturnValue({ allowed: true, reason: null } as any);
    render(<YaraInvite />);
    await userEvent.click(screen.getByTestId('yara-invite'));
    expect(sendYaraInvite).toHaveBeenCalledWith('click');
  });
});
