const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

type GTagFunction = (...args: any[]) => void;

const GA_CHECK_INTERVAL = 250;
const GA_MAX_ATTEMPTS = 12;

const getGtag = (): GTagFunction | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return window.gtag;
};

const withGtag = (callback: (gtag: GTagFunction) => void, attempt = 0) => {
  const gtag = getGtag();
  if (gtag) {
    callback(gtag);
    return;
  }

  if (attempt >= GA_MAX_ATTEMPTS) {
    return;
  }

  setTimeout(() => {
    withGtag(callback, attempt + 1);
  }, GA_CHECK_INTERVAL);
};

export const isGaEnabled = () =>
  typeof window !== 'undefined' &&
  typeof window.gtag === 'function' &&
  !!GA_MEASUREMENT_ID;

export const trackPageView = (
  pagePath: string,
  pageTitle?: string,
  pageLocation?: string,
) => {
  if (!GA_MEASUREMENT_ID) {
    return;
  }

  withGtag((gtag) => {
    const title =
      pageTitle ||
      (typeof document !== 'undefined' ? document.title : undefined);
    const location =
      pageLocation ||
      (typeof window !== 'undefined' ? window.location.href : undefined);

    gtag('event', 'page_view', {
      send_to: GA_MEASUREMENT_ID,
      page_path: pagePath,
      ...(title ? { page_title: title } : {}),
      ...(location ? { page_location: location } : {}),
    });
  });
};

export const setGaUserId = (userId?: string | null) => {
  if (!GA_MEASUREMENT_ID || !userId) {
    return;
  }

  withGtag((gtag) => {
    gtag('set', { user_id: userId });
  });
};

export const clearGaUserId = () => {
  if (!GA_MEASUREMENT_ID) {
    return;
  }

  withGtag((gtag) => {
    gtag('set', { user_id: null });
  });
};

export const getGaMeasurementId = () => GA_MEASUREMENT_ID;
