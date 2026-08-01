/**
 * Guards for the properties «یارا» cannot lose, because there is no classic
 * results page underneath it to catch a mistake.
 *
 * The one that matters most is the failure path: if it breaks, a patient who has
 * just described a symptom gets a dead end.
 */
jest.mock('@/common/apis/services/booking/getBooks', () => ({ getBooks: jest.fn().mockResolvedValue({ data: [] }) }));
jest.mock('@/common/apis/services/booking/removeBook', () => ({ removeBook: jest.fn() }));
jest.mock('cookies-next', () => ({ getCookie: jest.fn().mockReturnValue('terminal-1') }));
jest.mock('../chatApi', () => ({
  postTurn: jest.fn(),
  getConversation: jest.fn(),
  listConversations: jest.fn().mockResolvedValue([]),
  sendChatView: jest.fn(),
  sendChatClick: jest.fn(),
  sendChatExit: jest.fn(),
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

beforeEach(() => jest.clearAllMocks());

describe('مسیرِ شکست — هیچ‌وقت بن‌بست، هیچ‌وقت گم‌شدنِ متنِ کاربر', () => {
  it('خطای شبکه ⇒ بلاکِ عذرخواهی + لینکِ جستجو با همان متنِ کاربر، و حبابِ کاربر سرِ جایش', async () => {
    mockPostTurn.mockResolvedValue(null);
    render(<YaraChat />);

    await userEvent.type(screen.getByLabelText('پیام شما به یارا'), 'گلویم درد می‌کند');
    await userEvent.click(screen.getByRole('button', { name: 'ارسال' }));

    const block = await screen.findByTestId('yara-failure');
    expect(block).toHaveTextContent('الان نمی‌توانم گفتگو کنم');
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
