import { history } from '@umijs/max';

export function goBack(fallback: string) {
  const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
  if (idx > 0) history.back();
  else history.replace(fallback);
}
