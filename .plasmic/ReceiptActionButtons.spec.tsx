import { hideLegacySupportAndDelayButtons } from './ReceiptActionButtons.hide';

describe('hideLegacySupportAndDelayButtons', () => {
  it('hides dialog2 and following siblings only', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <div data-chat="keep">chat</div>
      <div>
        <div data-plasmic-name="dialog2">delay</div>
        <button type="button">درخواست پشتیبانی این نوبت</button>
      </div>
      <button type="button" data-cancel="keep">لغو نوبت</button>
    `;

    hideLegacySupportAndDelayButtons(root);

    const dialog2 = root.querySelector('[data-plasmic-name="dialog2"]') as HTMLElement;
    const supportBtn = root.querySelector('button') as HTMLElement;
    const chat = root.querySelector('[data-chat="keep"]') as HTMLElement;
    const cancel = root.querySelector('[data-cancel="keep"]') as HTMLElement;

    expect(dialog2.style.display).toBe('none');
    expect(supportBtn.style.display).toBe('none');
    expect(chat.style.display).toBe('');
    expect(cancel.style.display).toBe('');
  });

  it('no-ops when dialog2 is absent', () => {
    const root = document.createElement('div');
    root.innerHTML = `<button type="button">لغو نوبت</button>`;
    expect(() => hideLegacySupportAndDelayButtons(root)).not.toThrow();
    expect((root.querySelector('button') as HTMLElement).style.display).toBe('');
  });
});
