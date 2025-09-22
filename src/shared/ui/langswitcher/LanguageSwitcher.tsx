'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { buildLanguageView, LanguageSwitcherConfig, LocaleData } from './contract/contract';
import { renderLanguageSwitcher, LanguageSwitcherHandlers } from './render/render';
import { unstyledLanguageSwitcherMap } from './renderers/unstyled/map';

/**
 * Props for the LanguageSwitcher component
 */
type LanguageSwitcherProps = {
  locales: Record<string, LocaleData>; // Available languages/locales
  currentLocale: string;               // Currently selected language code
  className?: string;                  // Optional CSS class for styling
};

/**
 * LanguageSwitcher Component
 *
 * A dropdown component that allows users to switch between different languages/locales.
 * Features:
 * - Displays current language with flag
 * - Searchable dropdown of available languages
 * - Automatically navigates to the new language URL when selected
 * - Closes when clicking outside the component
 *
 * @param locales - Object containing all available language configurations
 * @param currentLocale - The currently active language code
 * @param className - Optional CSS class for custom styling
 */
export function LanguageSwitcher({ locales, currentLocale, className }: LanguageSwitcherProps) {
  // State to track whether the dropdown is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // State to track the current search/filter text
  const [searchValue, setSearchValue] = useState('');

  // Next.js router for programmatic navigation
  const router = useRouter();

  // Current URL pathname for building new language URLs
  const pathname = usePathname();

  // Reference to the container element for click-outside detection
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Effect to handle clicking outside the component to close the dropdown
   * This provides a good user experience by closing the dropdown when user clicks elsewhere
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the click was outside our component
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);     // Close the dropdown
        setSearchValue('');   // Clear the search input
      }
    }

    // Only add the event listener when dropdown is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Cleanup function to remove event listener when component unmounts or dropdown closes
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]); // Re-run effect when isOpen changes

  // Configuration object for building the language switcher view
  const config: LanguageSwitcherConfig = {
    locales,                          // All available languages
    currentLocale,                    // Currently selected language
    searchValue,                      // Current search filter
    isOpen,                          // Whether dropdown is open
    searchPlaceholder: 'Search'      // Placeholder text for search input
  };

  // Build the view model from configuration
  const view = buildLanguageView(config);

  // Event handlers for user interactions
  const handlers: LanguageSwitcherHandlers = {
    /**
     * Toggles the dropdown open/closed state
     * Clears search when closing the dropdown
     */
    onToggle: () => {
      setIsOpen(prev => !prev);    // Toggle the open state
      if (isOpen) {
        setSearchValue('');        // Clear search when closing
      }
    },

    /**
     * Updates the search filter value
     * This will automatically filter the language list
     */
    onSearch: (value: string) => {
      setSearchValue(value);
    },

    /**
     * Handles language selection
     * Navigates to the new language URL and closes the dropdown
     */
    onSelect: (code: string) => {
      // If user selected the current language, just close dropdown
      if (code === currentLocale) {
        setIsOpen(false);
        setSearchValue('');
        return;
      }

      // Parse the current URL path into segments
      const segments = pathname.split('/').filter(Boolean);

      // Check if the first segment is a language code
      if (segments.length > 0 && Object.keys(locales).includes(segments[0])) {
        // Replace existing language code with new one
        segments[0] = code;
      } else {
        // Add language code to the beginning of the path
        segments.unshift(code);
      }

      // Build the new path with the selected language
      const newPath = segments.length > 0 ? `/${segments.join('/')}` : `/${code}`;

      // Close dropdown and clear search
      setIsOpen(false);
      setSearchValue('');

      // Navigate to the new language URL
      router.push(newPath);
    }
  };

  return (
    <div ref={containerRef} className={className}>
      {/* Render the language switcher using the unstyled component map */}
      {renderLanguageSwitcher(view, handlers, unstyledLanguageSwitcherMap)}
    </div>
  );
}