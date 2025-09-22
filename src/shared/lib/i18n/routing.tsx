import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

// Import locale configuration
import localeConfig from '@content/i18n/locale.json';

/**
 * Configuration for internationalization routing.
 * Defines supported locales and default fallback.
 */
export const routing = defineRouting({
  locales: localeConfig.supportedLocales as string[],
  defaultLocale: localeConfig.defaultLocale
});

/**
 * Navigation utilities with i18n support.
 * Pre-configured wrappers around Next.js navigation APIs.
 */
export const {Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing);

/**
 * Extracts and validates the locale information from the given route parameters.
 * - Resolves the `params` promise containing the locale array.
 * - Determines the current locale from the first element of the array, falling back to the default locale if none is provided.
 * - Checks whether the current locale is valid according to the supported locales in `routing`.
 */
export async function getLocaleFromParams(params: Promise<{locale?: string[]}>) {
  const resolvedParams = await params;
  const localeArray = resolvedParams.locale || [];
  const currentLocale = localeArray[0] || routing.defaultLocale;  
  return {
    localeArray,
    currentLocale,
    isValidLocale: localeArray.length === 0 || routing.locales.includes(currentLocale as string)
  };
}
