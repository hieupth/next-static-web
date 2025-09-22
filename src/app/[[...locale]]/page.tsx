// Import the optimized Image component from nextbasepath
import { Image } from "nextbasepath/components";

// Import Next.js internationalization utilities
import { getTranslations, setRequestLocale } from 'next-intl/server';

// Import routing configuration for supported locales
import { routing } from '@/shared/lib/i18n/routing';

// Import our custom language switcher component
import { LanguageSwitcher } from '@/shared/ui/langswitcher';

// Import locale data containing language configurations
import localeData from '@/../content/i18n/locale.json';

/**
 * Props interface for the Home page component
 * The locale parameter is optional and comes as an array from Next.js dynamic routing
 */
interface HomeProps {
  params: Promise<{locale?: string[]}>; // Optional locale array from URL segments
}

/**
 * Generate static parameters for all supported locales
 * This tells Next.js which pages to pre-generate at build time
 *
 * @returns Array of parameter objects for static generation
 */
export function generateStaticParams() {
  return [
    { locale: [] },  // Default route without locale (uses default language)
    // Generate routes for each supported locale (e.g., /en, /es, /fr)
    ...routing.locales.map((locale) => ({ locale: [locale] }))
  ];
}

/**
 * Home Page Component
 *
 * The main landing page that supports multiple languages.
 * Features:
 * - Dynamic locale detection from URL
 * - Internationalized content using next-intl
 * - Language switcher for changing languages
 * - Responsive design with Tailwind CSS
 *
 * @param params - Contains the locale from the URL (e.g., /en, /es)
 * @returns JSX element representing the home page
 */
export default async function Home({ params }: HomeProps) {
  // Extract locale from URL parameters
  const { locale } = await params;

  // Determine current locale: use from URL or fall back to default
  const currentLocale = locale?.[0] || routing.defaultLocale;

  // Set the locale for the current request (required by next-intl)
  setRequestLocale(currentLocale);

  // Get translations for the 'home' namespace in the current language
  const t = await getTranslations('home');

  return (
    // Main page container with CSS Grid layout
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {/* Main content area (positioned in the middle grid row) */}
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* Next.js logo - inverts colors in dark mode */}
        <Image
          className="dark:invert"  // Invert colors for dark theme
          src="/next.svg"          // Logo source from public folder
          alt="Next.js logo"       // Accessibility description
          width={180}              // Fixed width for consistent sizing
          height={38}              // Fixed height for consistent sizing
          priority                 // Load this image with high priority
        />

        {/* Instructional text list - styled as ordered list */}
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          {/* First instruction - how to get started */}
          <li className="mb-2 tracking-[-.01em]">
            {/* Translated text: "Get started by editing" */}
            {t('getStarted')}{" "}
            {/* Code snippet highlighting the file to edit */}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          {/* Second instruction - about saving and seeing changes */}
          <li className="tracking-[-.01em]">
            {/* Translated text: "Save and see your changes instantly" */}
            {t('saveAndSee')}
          </li>
        </ol>

        {/* Action buttons container - stacks vertically on mobile, horizontally on desktop */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {/* Primary CTA button - Deploy to Vercel */}
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"           // Open in new tab
            rel="noopener noreferrer" // Security attributes for external links
          >
            {/* Vercel logo icon */}
            <Image
              className="dark:invert"    // Invert for dark mode visibility
              src="/vercel.svg"          // Vercel logomark from public folder
              alt="Vercel logomark"      // Screen reader description
              width={20}                 // Small icon size
              height={20}                // Square icon dimensions
            />
            {/* Translated button text: "Deploy now" */}
            {t('deployNow')}
          </a>

          {/* Secondary button - Read documentation */}
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"           // Open in new tab
            rel="noopener noreferrer" // Security attributes for external links
          >
            {/* Translated button text: "Read our docs" */}
            {t('readDocs')}
          </a>
        </div>
      </main>

      {/* Footer section - positioned in the bottom grid row */}
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Language switcher component - allows users to change the site language */}
        <LanguageSwitcher
          locales={localeData.locales}  // All available language configurations
          currentLocale={currentLocale} // Currently active language
        />

        {/* Footer navigation links with icons */}

        {/* Learn Next.js link */}
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"           // Open in new tab
          rel="noopener noreferrer" // Security attributes
        >
          {/* File/document icon */}
          <Image
            aria-hidden           // Decorative icon, hidden from screen readers
            src="/file.svg"       // Icon source from public folder
            alt="File icon"       // Alt text for the icon
            width={16}            // Small icon size
            height={16}           // Square dimensions
          />
          {/* Translated link text: "Learn" */}
          {t('learn')}
        </a>

        {/* Examples/templates link */}
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"           // Open in new tab
          rel="noopener noreferrer" // Security attributes
        >
          {/* Window/template icon */}
          <Image
            aria-hidden           // Decorative icon, hidden from screen readers
            src="/window.svg"     // Icon source from public folder
            alt="Window icon"     // Alt text for the icon
            width={16}            // Small icon size
            height={16}           // Square dimensions
          />
          {/* Translated link text: "Examples" */}
          {t('examples')}
        </a>

        {/* Next.js website link */}
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"           // Open in new tab
          rel="noopener noreferrer" // Security attributes
        >
          {/* Globe/website icon */}
          <Image
            aria-hidden           // Decorative icon, hidden from screen readers
            src="/globe.svg"      // Icon source from public folder
            alt="Globe icon"      // Alt text for the icon
            width={16}            // Small icon size
            height={16}           // Square dimensions
          />
          {/* Translated link text: "Go to nextjs.org" */}
          {t('goToNextjs')}
        </a>
      </footer>
    </div>
  );
}