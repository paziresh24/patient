import { hideLegacySupportAndDelayButtons } from './ReceiptActionButtons.hide';

describe('hideLegacySupportAndDelayButtons', () => {
  it('hides the freeBox that wraps dialog2 and the support CTA sibling', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <div data-chat="keep">chat</div>
      <div data-legacy-box="yes">
        <div data-plasmic-name="dialog2">
          <button type="button">پیگیری تاخیر پزشک</button>
        </div>
        <button type="button">درخواست پشتیبانی این نوبت</button>
      </div>
      <button type="button" data-cancel="keep">لغو نوبت</button>
    `;

    hideLegacySupportAndDelayButtons(root);

    const box = root.querySelector('[data-legacy-box="yes"]') as HTMLElement;
    const chat = root.querySelector('[data-chat="keep"]') as HTMLElement;
    const cancel = root.querySelector('[data-cancel="keep"]') as HTMLElement;

    expect(box.style.display).toBe('none');
    expect(chat.style.display).toBe('');
    expect(cancel.style.display).toBe('');
  });

  it('falls back to hiding buttons by label when dialog2 is absent', () => {
    const root = document.createElement('div');
    root.innerHTML = `
      <button type="button">پیگیری تاخیر پزشک</button>
      <button type="button">درخواست پشتیبانی این نوبت</button>
      <button type="button">پشتیبانی</button>
    `;

    hideLegacySupportAndDelayButtons(root);

    const buttons = Array.from(root.querySelectorAll('button')) as HTMLElement[];
    expect(buttons[0].style.display).toBe('none');
    expect(buttons[1].style.display).toBe('none');
    expect(buttons[2].style.display).toBe('');
  });

  it('no-ops when legacy controls are absent', () => {
    const root = document.createElement('div');
    root.innerHTML = `<button type="button">لغو نوبت</button>`;
    expect(() => hideLegacySupportAndDelayButtons(root)).not.toThrow();
    expect((root.querySelector('button') as HTMLElement).style.display).toBe('');
  });
});
