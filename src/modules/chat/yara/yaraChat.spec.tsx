/**
 * Guards for the properties «یارا» cannot lose, because there is no classic
 * results page underneath it to catch a mistake.
 *
 * The one that matters most is the failure path: if it breaks, a patient who has
 * just described a symptom gets a dead end.
 */
jest.mock('@/common/apis/services/booking/getBooks', () => ({ getBooks: jest.fn().mockResolvedValue({ data: [] }) }));
jest.mock('@/common/apis/services/booking/removeBook', () => ({ removeBook: jest.fn() }));
// کارتِ /s در ماژول‌اسکوپ getConfig می‌خواند — بیرونِ Next باید mock باشد.
jest.mock('next/config', () => () => ({ publicRuntimeConfig: {}, serverRuntimeConfig: {} }));
// `useRouter` is the page's history channel now (`?c=<id>` per conversation);
// outside Next there is no router to mount, so the spec supplies a minimal one.
const push = jest.fn();
jest.mock('next/router', () => ({ useRouter: () => ({ query: {}, push, pathname: '/yara' }) }));
jest.mock('cookies-next', () => ({ getCookie: jest.fn().mockReturnValue('terminal-1') }));
// storeِ واقعی زنجیره‌اش به getConfig می‌رسد؛ mockِ selector-خور (zustand-style).
jest.mock('@/modules/login/store/userInfo', () => ({
  useUserInfoStore: (selector: (s: unknown) => unknown) => selector({ info: { name: '' }, isLogin: true, pending: false }),
}));
jest.mock('../chatApi', () => ({
  postTurn: jest.fn(),
  getConversation: jest.fn(),
  listConversations: jest.fn().mockResolvedValue([]),
  sendChatView: jest.fn(),
  sendChatClick: jest.fn(),
  sendChatExit: jest.fn(),
  sendYaraEvent: jest.fn(),
}));

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { postTurn, sendChatClick, sendChatView, type ChatCard, type TurnResponse } from '../chatApi';
import YaraChat from './yaraChat';
import { FAILURE_CTA, STARTER_CHIPS, YARA_ENTRY_POINT } from './yaraTurn';

const mockPostTurn = postTurn as jest.MockedFunction<typeof postTurn>;

const answer = (over: Partial<TurnResponse> = {}): TurnResponse =>
  ({
    mode: 'chat',
    conversation_id: 'c-1',
    query_id: 'q-1',
    turn_index: 0,
    message: 'این پزشکان را پیشنهاد می‌کنم.',
    ...over,
  }) as TurnResponse;

const cards = (n: number): ChatCard[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `d-${i}`,
    title: `دکتر شماره ${i}`,
    expertise: 'قلب',
    url: `/dr/d-${i}`,
    type: 'doctor',
    position: i + 1,
  }));

beforeEach(() => {
  jest.clearAllMocks();
  // یارا thread را در sessionStorage نگه می‌دارد (بازگشت از پروفایلِ پزشک)؛ بدونِ
  // پاک‌کردنش، گفتگوی یک تست داخلِ تستِ بعدی restore می‌شود.
  window.sessionStorage.clear();
});

describe('مسیرِ شکست — هیچ‌وقت بن‌بست، هیچ‌وقت گم‌شدنِ متنِ کاربر', () => {
  it('خطای شبکه ⇒ بلاکِ عذرخواهی + لینکِ جستجو با همان متنِ کاربر، و حبابِ کاربر سرِ جایش', async () => {
    mockPostTurn.mockResolvedValue(null);
    render(<YaraChat />);

    await userEvent.type(screen.getByLabelText('پیام شما به یارا'), 'گلویم درد می‌کند');
    await userEvent.click(screen.getByRole('button', { name: 'ارسال' }));

    const block = await screen.findByTestId('yara-failure');
    // خطای شبکه دیگر با «سرویس در دسترس نیست» یکی نیست — کاربر باید بفهمد چه شد
    expect(block).toHaveAttribute('data-kind', 'offline');
    expect(block).toHaveTextContent('ارتباط با یارا برقرار نشد');
    // و مهم‌تر: راهِ «دوباره تلاش کن» دارد، نه فقط درِ خروج
    expect(screen.getByTestId('yara-retry')).toBeInTheDocument();
    // متنِ کاربر هنوز در thread است
    expect(screen.getByText('گلویم درد می‌کند')).toBeInTheDocument();
    // و همان متن، لینکِ خروج را می‌سازد
    const cta = screen.getByRole('link', { name: FAILURE_CTA });
    expect(cta.getAttribute('href')).toBe(`/s/?text=${encodeURIComponent('گلویم درد می‌کند')}`);
    // هیچ اسپینری باقی نمی‌ماند
    expect(screen.queryByTestId('yara-busy')).not.toBeInTheDocument();
    // ⛔ هرگز حرفی از بودجه/هزینه
    expect(block.textContent).not.toMatch(/بودجه|هزینه|سقف/);
  });

  it('پاسخِ غیرِ chat برای یک turnِ صریح هم همان مسیرِ شکست است (نه حبابِ خالی)', async () => {
    mockPostTurn.mockResolvedValue({ mode: 'classic', conversation_id: 'c-1' } as TurnResponse);
    render(<YaraChat />);

    await userEvent.type(screen.getByLabelText('پیام شما به یارا'), 'دنبال پزشک پوست هستم');
    await userEvent.click(screen.getByRole('button', { name: 'ارسال' }));

    expect(await screen.findByTestId('yara-failure')).toBeInTheDocument();
    expect(sendChatView).not.toHaveBeenCalled();
  });

  it('اورژانس روی پاسخِ classic (LLM مرده/بودجه صفر) گم نمی‌شود — corpus emergency-001', async () => {
    // khesht روی red-flag حتی در fallback هم `emergency` می‌فرستد؛ این صفحه نباید
    // آن را پشتِ درِ فرار دور بریزد. هر دو باید هم‌زمان دیده شوند.
    mockPostTurn.mockResolvedValue({
      mode: 'classic',
      conversation_id: 'c-1',
      emergency: 'اگر درد قفسه سینه شدید است همین حالا با ۱۱۵ تماس بگیرید.',
    } as TurnResponse);
    render(<YaraChat />);

    await userEvent.type(screen.getByLabelText('پیام شما به یارا'), 'درد شدید قفسه سینه دارم');
    await userEvent.click(screen.getByRole('button', { name: 'ارسال' }));

    expect(await screen.findByText(/۱۱۵/)).toBeInTheDocument();
    expect(screen.getByTestId('yara-failure')).toBeInTheDocument();
  });

  it('پاسخِ chat ولی کاملاً خالی ⇒ باز هم مسیرِ شکست، نه حبابِ خالی', async () => {
    mockPostTurn.mockResolvedValue({ mode: 'chat', conversation_id: 'c-1', query_id: 'q', turn_index: 0 } as TurnResponse);
    render(<YaraChat />);

    await userEvent.type(screen.getByLabelText('پیام شما به یارا'), 'سلام');
    await userEvent.click(screen.getByRole('button', { name: 'ارسال' }));

    expect(await screen.findByTestId('yara-failure')).toBeInTheDocument();
  });

  it('چراغِ وضعیت بعد از شکست سبز نمی‌شود', async () => {
    mockPostTurn.mockResolvedValue(null);
    render(<YaraChat />);
    expect(screen.getByTestId('yara-status-dot')).toHaveAttribute('data-status', 'idle');

    await userEvent.click(screen.getByRole('button', { name: STARTER_CHIPS[0] }));

    await waitFor(() => expect(screen.getByTestId('yara-status-dot')).toHaveAttribute('data-status', 'failed'));
  });
});

describe('چیپ‌های شروع', () => {
  it('لمسِ چیپ همان متن را به‌عنوان یک turnِ صریح می‌فرستد', async () => {
    mockPostTurn.mockResolvedValue(answer());
    render(<YaraChat />);

    await userEvent.click(screen.getByRole('button', { name: STARTER_CHIPS[0] }));

    // انتظار تا پاسخ نشسته باشد — هم assertion را قطعی می‌کند هم warningِ act را حذف
    expect(await screen.findByText('این پزشکان را پیشنهاد می‌کنم.')).toBeInTheDocument();
    expect(mockPostTurn).toHaveBeenCalledTimes(1);
    expect(mockPostTurn).toHaveBeenCalledWith(expect.objectContaining({ text: STARTER_CHIPS[0], explicit: true }));
    // متنِ چیپ به‌عنوان حبابِ کاربر در thread می‌ماند
    expect(screen.getByText(STARTER_CHIPS[0])).toBeInTheDocument();
  });
});

describe('کارت‌های نتیجه', () => {
  it('حتی وقتی پاسخ ۱۰ کارت دارد، حداکثر ۳ تا رندر می‌شود', async () => {
    mockPostTurn.mockResolvedValue(answer({ results: cards(10), result_count: 10, search_query: 'قلب' }));
    render(<YaraChat />);

    await userEvent.click(screen.getByRole('button', { name: STARTER_CHIPS[1] }));

    await waitFor(() => expect(screen.getAllByTestId('yara-result-card')).toHaveLength(3));
  });

  it('کلیک روی کارت با entry point صحیح ثبت می‌شود', async () => {
    mockPostTurn.mockResolvedValue(answer({ results: cards(2), result_count: 2, search_query: 'قلب' }));
    render(<YaraChat />);

    await userEvent.click(screen.getByRole('button', { name: STARTER_CHIPS[1] }));
    const card = (await screen.findAllByTestId('yara-result-card'))[0];
    await userEvent.click(card);

    expect(sendChatClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'd-0' }),
      expect.objectContaining({ conversationId: 'c-1', resultCount: 2 }),
      YARA_ENTRY_POINT
    );
    expect(sendChatView).toHaveBeenCalledWith(expect.objectContaining({ conversation_id: 'c-1' }), YARA_ENTRY_POINT);
  });
});

describe('suggestions — فیلدی که بک‌اند دارد اضافه می‌کند', () => {
  it('وقتی هست، چیپ می‌شود و لمسش label را به‌عنوان turnِ بعدی می‌فرستد', async () => {
    mockPostTurn.mockResolvedValue(
      answer({ suggestions: [{ key: 'k1', label: 'نوبت حضوری' }, { key: 'k2', label: 'ویزیت آنلاین' }] })
    );
    render(<YaraChat />);

    await userEvent.click(screen.getByRole('button', { name: STARTER_CHIPS[0] }));
    await waitFor(() => expect(screen.getAllByTestId('yara-suggestion')).toHaveLength(2));

    await userEvent.click(screen.getByRole('button', { name: 'ویزیت آنلاین' }));
    await waitFor(() =>
      expect(mockPostTurn).toHaveBeenLastCalledWith(expect.objectContaining({ text: 'ویزیت آنلاین', explicit: true }))
    );
    await waitFor(() => expect(screen.getAllByText('ویزیت آنلاین').length).toBeGreaterThan(1));
  });

  it('نبودن یا شکلِ ناشناخته ⇒ هیچ چیپی، و صفحه سالم می‌ماند', async () => {
    mockPostTurn.mockResolvedValue({ ...answer(), suggestions: 'unexpected' } as unknown as TurnResponse);
    render(<YaraChat />);

    await userEvent.click(screen.getByRole('button', { name: STARTER_CHIPS[0] }));

    expect(await screen.findByText('این پزشکان را پیشنهاد می‌کنم.')).toBeInTheDocument();
    expect(screen.queryAllByTestId('yara-suggestion')).toHaveLength(0);
  });
});

describe('composer — این صفحه برای جمله ساخته شده، نه کلیدواژه', () => {
  it('Enter می‌فرستد و Shift+Enter خط جدید می‌سازد (نه ارسال)', async () => {
    mockPostTurn.mockResolvedValue(answer());
    render(<YaraChat />);
    const box = screen.getByLabelText('پیام شما به یارا');

    await userEvent.type(box, 'خط اول{Shift>}{Enter}{/Shift}خط دوم');
    expect(mockPostTurn).not.toHaveBeenCalled();
    expect(box).toHaveValue('خط اول\nخط دوم');

    await userEvent.type(box, '{Enter}');
    await waitFor(() =>
      expect(mockPostTurn).toHaveBeenCalledWith(expect.objectContaining({ text: 'خط اول\nخط دوم', explicit: true }))
    );
    // و کادر بعد از ارسال خالی می‌شود تا متنِ قبلی دوباره فرستاده نشود
    expect(box).toHaveValue('');
  });

  it('فقط وقتی کادر خالی و focus است نمونه‌ها را پیشنهاد می‌دهد', async () => {
    mockPostTurn.mockResolvedValue(answer());
    render(<YaraChat />);
    expect(screen.queryByTestId('yara-suggest-sheet')).not.toBeInTheDocument();

    const box = screen.getByLabelText('پیام شما به یارا');
    await userEvent.click(box);
    expect(screen.getByTestId('yara-suggest-sheet')).toBeInTheDocument();

    // به‌محضِ نوشتن، پیشنهادها راه را باز می‌کنند
    await userEvent.type(box, 'س');
    expect(screen.queryByTestId('yara-suggest-sheet')).not.toBeInTheDocument();
  });

  it('لمسِ یک نمونه دقیقاً مثل تایپ‌کردنِ همان جمله است', async () => {
    mockPostTurn.mockResolvedValue(answer());
    render(<YaraChat />);

    await userEvent.click(screen.getByLabelText('پیام شما به یارا'));
    const first = screen.getAllByTestId('yara-suggest-item')[0];
    const label = first.textContent ?? '';
    await userEvent.click(first);

    await waitFor(() => expect(mockPostTurn).toHaveBeenCalledWith(expect.objectContaining({ text: label, explicit: true })));
  });
});

describe('ریلِ گفت‌وگوها', () => {
  it('گفت‌وگوهای ذخیره‌شده را گروه‌بندی‌شده نشان می‌دهد و باز کردنشان thread را جایگزین می‌کند', async () => {
    const { listConversations, getConversation } = require('../chatApi');
    listConversations.mockResolvedValue([
      { conversation_id: 'c-9', title: 'گازگرفتگی سگ', created_at: new Date().toISOString(), last_message_at: new Date().toISOString(), turn_count: 4 },
    ]);
    getConversation.mockResolvedValue({
      conversation: {},
      messages: [
        { role: 'user', text: 'سلام', turn_index: 0 },
        { role: 'assistant', text: 'پاسخِ بایگانی', turn_index: 0, payload: { message: 'پاسخِ بایگانی' } },
      ],
    });
    render(<YaraChat />);

    const row = await screen.findByTestId('yara-conversation');
    expect(row).toHaveTextContent('گازگرفتگی سگ');
    expect(screen.getByText('امروز')).toBeInTheDocument();

    await userEvent.click(row);
    expect(await screen.findByText('پاسخِ بایگانی')).toBeInTheDocument();
  });

  it('«گفت‌وگوی جدید» thread را پاک می‌کند و به حالتِ خوش‌آمد برمی‌گردد', async () => {
    mockPostTurn.mockResolvedValue(answer());
    render(<YaraChat />);

    await userEvent.click(screen.getByRole('button', { name: STARTER_CHIPS[0] }));
    expect(await screen.findByText('این پزشکان را پیشنهاد می‌کنم.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /گفت‌وگوی جدید/ }));

    expect(screen.queryByText('این پزشکان را پیشنهاد می‌کنم.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: STARTER_CHIPS[0] })).toBeInTheDocument();
    // و conversation_id هم رها شده: turnِ بعدی یک گفت‌وگوی تازه است
    await userEvent.click(screen.getByRole('button', { name: STARTER_CHIPS[0] }));
    await waitFor(() =>
      expect(mockPostTurn).toHaveBeenLastCalledWith(expect.not.objectContaining({ conversationId: 'c-1' }))
    );
  });
});

describe('پیامِ شکست باید بگوید چه شد — نه یک جمله برای چهار حالت', () => {
  it('پاسخِ classic با fallback_reason=rate_limited ⇒ «شلوغ است» + امکانِ تلاشِ دوباره', async () => {
    mockPostTurn.mockResolvedValue({
      mode: 'classic',
      conversation_id: 'c-1',
      fallback_reason: 'rate_limited',
    } as TurnResponse);
    render(<YaraChat />);

    await userEvent.click(screen.getByRole('button', { name: STARTER_CHIPS[0] }));

    const block = await screen.findByTestId('yara-failure');
    expect(block).toHaveAttribute('data-kind', 'busy');
    expect(block).toHaveTextContent('شلوغ');
    expect(screen.getByTestId('yara-retry')).toBeInTheDocument();
  });

  it('علتِ خامِ khesht به آنالیتیکس می‌رود ولی هرگز به کاربر نشان داده نمی‌شود', async () => {
    const { sendYaraEvent } = require('../chatApi');
    mockPostTurn.mockResolvedValue({
      mode: 'classic',
      conversation_id: 'c-1',
      fallback_reason: 'budget_exhausted',
    } as TurnResponse);
    render(<YaraChat />);

    await userEvent.click(screen.getByRole('button', { name: STARTER_CHIPS[0] }));

    const block = await screen.findByTestId('yara-failure');
    expect(block).toHaveAttribute('data-kind', 'unavailable');
    // ⛔ قاعده‌ی §۱۳: هرگز حرفی از بودجه/هزینه به بیمار
    expect(block.textContent).not.toMatch(/بودجه|هزینه|سقف|budget/i);
    expect(sendYaraEvent).toHaveBeenCalledWith(
      'turn_failed',
      expect.objectContaining({ failure_kind: 'unavailable', fallback_reason: 'budget_exhausted' })
    );
  });

  it('«دوباره تلاش کن» واقعاً همان متن را دوباره می‌فرستد', async () => {
    mockPostTurn.mockResolvedValue(null);
    render(<YaraChat />);

    await userEvent.type(screen.getByLabelText('پیام شما به یارا'), 'گلویم درد می‌کند');
    await userEvent.click(screen.getByRole('button', { name: 'ارسال' }));
    await screen.findByTestId('yara-retry');

    mockPostTurn.mockResolvedValue(answer());
    await userEvent.click(screen.getByTestId('yara-retry'));

    await waitFor(() =>
      expect(mockPostTurn).toHaveBeenLastCalledWith(expect.objectContaining({ text: 'گلویم درد می‌کند' }))
    );
  });
});

describe('👍/👎 — حالا جایی برای رفتن دارند', () => {
  it('رأی latch می‌شود و یک رویدادِ واقعی می‌فرستد', async () => {
    const { sendYaraEvent } = require('../chatApi');
    mockPostTurn.mockResolvedValue(answer({ result_count: 2 }));
    render(<YaraChat />);

    await userEvent.click(screen.getByRole('button', { name: STARTER_CHIPS[0] }));
    const up = await screen.findByTestId('yara-rate-up');
    await userEvent.click(up);

    expect(up).toHaveAttribute('aria-pressed', 'true');
    expect(sendYaraEvent).toHaveBeenCalledWith(
      'answer_rated',
      expect.objectContaining({ rating: 1, conversation_id: 'c-1' })
    );
  });
});
