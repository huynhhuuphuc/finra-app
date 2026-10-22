import { ACCESS_TOKEN } from '@/constants/cookie';
import { getCookie } from '@/utils/cookie';
import { handleSessionExpired } from '@/utils/session';
import { useEffect } from 'react';

/** Log out after this long without user interaction (5 minutes). */
const IDLE_TIMEOUT = 5 * 60_000;
const CHECK_INTERVAL = 15_000;
const WRITE_THROTTLE = 5_000;
// Shared via localStorage so activity in one tab keeps the other tabs alive.
const LAST_ACTIVITY = 'LAST_ACTIVITY';
const ACTIVITY_EVENTS = [
  'pointerdown',
  'keydown',
  'touchstart',
  'wheel',
  'scroll',
] as const;

let memoryLastActivity: number | null = null;

function readLastActivity() {
  try {
    const value = Number(localStorage.getItem(LAST_ACTIVITY));
    return value > 0 ? value : memoryLastActivity;
  } catch {
    return memoryLastActivity;
  }
}

function writeLastActivity(time: number) {
  memoryLastActivity = time;
  try {
    localStorage.setItem(LAST_ACTIVITY, String(time));
  } catch {
    // Storage blocked (e.g. private mode): the in-memory value still works.
  }
}

const hasSession = () => {
  const token = getCookie(ACCESS_TOKEN);
  return Boolean(token && token !== 'demo-session');
};

/**
 * Logs the user out after IDLE_TIMEOUT without interaction. Background
 * polling (refetchInterval) does not count as activity.
 */
export default function useIdleLogout() {
  useEffect(() => {
    let lastWrite = 0;
    const record = () => {
      const now = Date.now();
      if (now - lastWrite < WRITE_THROTTLE) return;
      lastWrite = now;
      writeLastActivity(now);
    };
    const check = () => {
      if (!hasSession()) return;
      const last = readLastActivity();
      if (last !== null && Date.now() - last >= IDLE_TIMEOUT) {
        handleSessionExpired({ removeNow: true });
      }
    };
    // Mobile browsers pause timers while the screen is locked, so re-check
    // as soon as the page becomes visible again.
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') check();
    };

    if (readLastActivity() === null) record();
    check();
    ACTIVITY_EVENTS.forEach((event) =>
      document.addEventListener(event, record, {
        capture: true,
        passive: true,
      }),
    );
    document.addEventListener('visibilitychange', onVisibilityChange);
    const timer = window.setInterval(check, CHECK_INTERVAL);

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        document.removeEventListener(event, record, { capture: true }),
      );
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.clearInterval(timer);
    };
  }, []);
}
