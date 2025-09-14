// ModalBackManager.ts
type CloseFn = () => void;

class ModalBackManager {
  private stack: string[] = [];
  private registry = new Map<string, CloseFn>();
  private isListening = false;

  private ensureListener = () => {
    if (typeof window === 'undefined' || this.isListening) return;
    window.addEventListener('popstate', this.onPopState);
    this.isListening = true;
  };

  private removeListenerIfIdle = () => {
    if (typeof window === 'undefined') return;
    if (this.stack.length === 0 && this.isListening) {
      window.removeEventListener('popstate', this.onPopState);
      this.isListening = false;
    }
  };

  private onPopState = () => {
    const topId = this.stack[this.stack.length - 1];
    if (!topId) return;
    const close = this.registry.get(topId);
    this.registry.delete(topId);
    this.stack.pop();
    close?.();
    this.removeListenerIfIdle();
  };

  open = (close: CloseFn) => {
    if (typeof window === 'undefined') return { id: '' };
    const id = crypto.randomUUID?.() ?? String(Date.now() + Math.random());
    this.registry.set(id, close);
    this.stack.push(id);
    this.ensureListener();
    window.history.pushState({ __modal: true, id }, '', window.location.href);
    return { id };
  };

  /** alias جدید */
  public programmaticBack = (id: string) => {
    if (typeof window === 'undefined') return;
    const isTop = this.stack[this.stack.length - 1] === id;
    if (isTop) {
      window.history.back(); // popstate هندل می‌کند
    } else {
      const idx = this.stack.lastIndexOf(id);
      if (idx !== -1) {
        this.registry.delete(id);
        this.stack.splice(idx, 1);
        this.removeListenerIfIdle();
      }
    }
  };

  /** برای سازگاری با نام قبلی */
  public closeProgrammatically = (id: string) => {
    this.programmaticBack(id);
  };
}

export const modalBackManager = new ModalBackManager();
export type { CloseFn };
