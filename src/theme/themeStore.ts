import { useSyncExternalStore } from 'react';

export type ThemeMode = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'umi-admin-theme';

const isBrowser = typeof window !== 'undefined';

const listeners = new Set<() => void>();

let currentMode: ThemeMode = 'light';

const readStored = (): ThemeMode => {
  if (!isBrowser) return 'light';
  return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark'
    ? 'dark'
    : 'light';
};

const applyDom = (mode: ThemeMode) => {
  if (!isBrowser) return;
  document.documentElement.setAttribute('data-theme', mode);
  document.documentElement.style.colorScheme = mode;
};

const emit = () => {
  listeners.forEach((listener) => listener());
};

currentMode = readStored();
applyDom(currentMode);

export const getThemeMode = (): ThemeMode => currentMode;

export const setThemeMode = (mode: ThemeMode) => {
  if (mode === currentMode) {
    applyDom(mode);
    return;
  }
  currentMode = mode;
  if (isBrowser) {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  }
  applyDom(mode);
  emit();
};

export const toggleThemeMode = () => {
  setThemeMode(currentMode === 'dark' ? 'light' : 'dark');
};

export const useThemeMode = (): ThemeMode =>
  useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => currentMode,
    () => 'light',
  );
