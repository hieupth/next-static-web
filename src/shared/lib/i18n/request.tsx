import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

/**
 * Generates the request configuration for internationalization (i18n) in a Next.js app.
 * For static export, the locale comes from the RequestLocale set by setRequestLocale.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // For static export, we rely on requestLocale set by setRequestLocale
  const locale = (await requestLocale) || routing.defaultLocale;
  return {
    locale,
    messages: (await import(`@content/i18n/messages/${locale}.json`)).default
  };
});