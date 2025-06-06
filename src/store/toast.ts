import { writable } from 'svelte/store';

type ToastTypes = 'info' | 'success' | 'warning' | 'error';
export type ToastConfig = {
  duration?: number;
  type?: ToastTypes;
  pauseOnHover?: boolean;
  message: string;
  id: number;
  timer?: number;
}

let id = 0;

export const toasts = writable<ToastConfig[]>([]);

export const addToast = (config: Omit<ToastConfig, 'id'>) => {
  const _config: ToastConfig = {
    duration: 5000,
    type: 'info',
    id: ++id,
    pauseOnHover: true,
    ...config
  };

  if (_config.duration) {
    _config.timer = window.setTimeout(() => dismissToast(_config.id), _config.duration);
  }

  toasts.update((all) => ([_config, ...all]));
}

export const dismissToast = (id: number) => {
  toasts.update((all) => all.filter((t) => t.id !== id));
}