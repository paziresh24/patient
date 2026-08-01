/**
 * The gate in front of `/yara`, from the patient's side.
 *
 * Three of these four states are things that must **never** happen: a chat UI for
 * a guest, a network call for a guest, and a 404 for someone who is simply not in
 * the rollout bucket.
 */
jest.mock('@/common/apis/services/booking/getBooks', () => ({ getBooks: jest.fn().mockResolvedValue({ data: [] }) }));
jest.mock('@/common/apis/services/booking/removeBook', () => ({ removeBook: jest.fn() }));
jest.mock('cookies-next', () => ({ getCookie: jest.fn().mockReturnValue('terminal-1') }));
jest.mock('next/router', () => ({ useRouter: () => ({ asPath: '/yara', query: {} }) }));
jest.mock('../chatApi', () => ({
  postTurn: jest.fn(),
  getConversation: jest.fn(),
  listConversations: jest.fn().mockResolvedValue([]),
  sendChatView: jest.fn(),
  sendChatClick: jest.fn(),
  sendChatExit: jest.fn(),
}));
jest.mock('../useChatGate', () => ({ useChatGate: jest.fn() }));

import { render, screen } from '@testing-library/react';
import { postTurn } from '../chatApi';
import { useChatGate } from '../useChatGate';
import YaraPage from './yaraPage';

const mockGate = useChatGate as jest.MockedFunction<typeof useChatGate>;

const gate = (reason: ReturnType<typeof useChatGate>['reason']) =>
  mockGate.mockReturnValue({ allowed: reason === null, reason, isPreview: false });

beforeEach(() => jest.clearAllMocks());

describe('مهمان (لاگین‌نکرده)', () => {
  it('CTAی ورود با بازگشت به همین صفحه می‌بیند، نه UIِ چت', () => {
    gate('not_logged_in');
    render(<YaraPage />);

    const cta = screen.getByTestId('yara-login-cta');
    expect(cta.getAttribute('href')).toBe(`/login?redirect_url=${encodeURIComponent('/yara')}`);
    expect(screen.queryByLabelText('پیام شما به یارا')).not.toBeInTheDocument();
  });

  it('هیچ درخواستی به orchestrator نمی‌رود', () => {
    gate('not_logged_in');
    render(<YaraPage />);
    expect(postTurn).not.toHaveBeenCalled();
  });
});

describe('گیتِ بسته', () => {
  it('فلگِ خاموش ⇒ صفحه‌ی مؤدبانه، نه ۴۰۴ و نه چت', () => {
    gate('feature_off');
    render(<YaraPage />);

    expect(screen.getByTestId('yara-unavailable')).toHaveTextContent('یارا هنوز برای حساب شما فعال نشده است.');
    expect(screen.queryByLabelText('پیام شما به یارا')).not.toBeInTheDocument();
    expect(screen.queryByTestId('yara-login-cta')).not.toBeInTheDocument();
  });

  it('هاستِ غیرمجاز (دانشگاه) ⇒ همان صفحه‌ی بسته، حتی اگر کاربر لاگین باشد', () => {
    // fail-closed: allow-listِ hostها قبل از گیتِ لاگین ارزیابی می‌شود
    gate('host_not_allowed');
    render(<YaraPage />);
    expect(screen.getByTestId('yara-unavailable')).toBeInTheDocument();
    expect(postTurn).not.toHaveBeenCalled();
  });
});

describe('وضعیتِ نامعلوم', () => {
  it('تا وقتی store در حالِ pending است، هیچ‌کدام از دو حالت flash نمی‌شود', () => {
    gate('auth_pending');
    render(<YaraPage />);

    expect(screen.getByTestId('yara-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('yara-login-cta')).not.toBeInTheDocument();
    expect(screen.queryByTestId('yara-unavailable')).not.toBeInTheDocument();
  });
});

describe('گیتِ باز', () => {
  it('کاربرِ مجاز خودِ گفتگو را می‌بیند', () => {
    gate(null);
    render(<YaraPage />);
    expect(screen.getByLabelText('پیام شما به یارا')).toBeInTheDocument();
  });
});
