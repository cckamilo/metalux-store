import { Injectable, signal } from '@angular/core';

export type UserMessageType = 'success' | 'error' | 'warning' | 'info';

export interface UserMessageOptions {
  title?: string;
  duration?: number | null;
  dismissible?: boolean;
}

export interface UserMessage {
  id: number;
  type: UserMessageType;
  title: string;
  text: string;
  duration: number | null;
  dismissible: boolean;
}

const DEFAULT_TITLES: Record<UserMessageType, string> = {
  success: 'Confirmación',
  error: 'Error',
  warning: 'Atención',
  info: 'Información'
};

const DEFAULT_DURATIONS: Record<UserMessageType, number | null> = {
  success: 4000,
  error: null,
  warning: 7000,
  info: 5000
};

@Injectable({ providedIn: 'root' })
export class UserMessageService {
  readonly messages = signal<UserMessage[]>([]);
  private nextId = 0;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  success(text: string, options: UserMessageOptions = {}): number {
    return this.show('success', text, options);
  }

  error(text: string, options: UserMessageOptions = {}): number {
    return this.show('error', text, options);
  }

  warning(text: string, options: UserMessageOptions = {}): number {
    return this.show('warning', text, options);
  }

  info(text: string, options: UserMessageOptions = {}): number {
    return this.show('info', text, options);
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer !== undefined) clearTimeout(timer);
    this.timers.delete(id);
    this.messages.update(messages => messages.filter(message => message.id !== id));
  }

  clear(): void {
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.timers.clear();
    this.messages.set([]);
  }

  private show(type: UserMessageType, text: string, options: UserMessageOptions): number {
    const id = ++this.nextId;
    const duration = options.duration === undefined ? DEFAULT_DURATIONS[type] : options.duration;
    this.messages.update(messages => [...messages, {
      id,
      type,
      title: options.title ?? DEFAULT_TITLES[type],
      text,
      duration,
      dismissible: options.dismissible ?? true
    }]);

    if (duration !== null) {
      this.timers.set(id, setTimeout(() => this.dismiss(id), Math.max(0, duration)));
    }

    return id;
  }
}
