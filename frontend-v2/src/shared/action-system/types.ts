import type { ElementType } from 'react';

export type ActionContext<T, K extends string = string> = {
  entity: T;
  close: () => void;
  handlers: ActionHandlers<T, K>;
};
export type ActionHandlers<T, K extends string = string> = {
  dialog?: {
    open: (key: K, entity: T) => void;
  };

  mutate?: (key: K, entity: T) => void;

  navigate?: (key: K, path: string) => void;
};
export type ActionValue<T> = (ctx: ActionContext<T>) => string;
export type ActionIcon<T> = (ctx: ActionContext<T>) => ElementType;

export type AdminAction<T, K extends string = string> = {
  id: string;
  label: string;

  icon: ElementType;

  variant?: 'default' | 'destructive';

  visible?: (ctx: ActionContext<T, K>) => boolean;
  enabled?: (ctx: ActionContext<T, K>) => boolean;

  confirm?: {
    title: string;
    description?: string;
    confirmText?: string;
  };

  run: (ctx: ActionContext<T, K>) => void | Promise<void>;
};
