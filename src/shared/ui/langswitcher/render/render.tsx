'use client';

import React from 'react';
import { LanguageView, LanguageItem } from '../contract/contract';

/**
 * Component map interface for the language switcher
 * This defines all the UI components that make up the language switcher.
 * By using this pattern, we can easily swap out different visual implementations.
 */
export type LanguageSwitcherMap = {
  // Root container component
  Root: React.FC<React.PropsWithChildren & { className?: string }>;

  // Main trigger button that shows current language
  Trigger: React.FC<{
    label: string;      // Text to display (language name)
    flag: string;       // Flag emoji to display
    isOpen: boolean;    // Whether dropdown is currently open
    onClick: () => void; // Handler for button clicks
    className?: string; // Optional CSS classes
  }>;

  // Dropdown container that appears when open
  Dropdown: React.FC<React.PropsWithChildren & {
    isOpen: boolean;    // Controls visibility of the dropdown
    className?: string; // Optional CSS classes
  }>;

  // Search input field within the dropdown
  SearchInput: React.FC<{
    placeholder: string;               // Placeholder text for the input
    value: string;                     // Current input value
    onChange: (value: string) => void; // Handler for input changes
    className?: string;                // Optional CSS classes
  }>;

  // Container for the list of language options
  ItemsList: React.FC<React.PropsWithChildren & { className?: string }>;

  // Individual language option item
  Item: React.FC<{
    item: LanguageItem;                // Language data to display
    onClick: (code: string) => void;   // Handler for item selection
    className?: string;                // Optional CSS classes
  }>;

  // Icon components for visual feedback
  CaretIcon: React.FC<{ isOpen: boolean; className?: string }>; // Down arrow for dropdown
  SearchIcon: React.FC<{ className?: string }>;                 // Magnifying glass for search
  CheckIcon: React.FC<{ className?: string }>;                  // Checkmark for active language
};

/**
 * Event handlers interface for the language switcher
 * These functions handle all user interactions with the component
 */
export type LanguageSwitcherHandlers = {
  onToggle: () => void;                  // Called when user clicks the main button
  onSearch: (value: string) => void;     // Called when user types in search input
  onSelect: (code: string) => void;      // Called when user selects a language
};

/**
 * Renders the complete language switcher component
 *
 * This function takes the view model, event handlers, and component map,
 * then renders the complete language switcher UI structure.
 *
 * @param view - The complete view model containing all display data
 * @param handlers - Event handlers for user interactions
 * @param C - Component map defining how each part should be rendered
 * @returns JSX element representing the complete language switcher
 */
export function renderLanguageSwitcher(
  view: LanguageView,
  handlers: LanguageSwitcherHandlers,
  C: LanguageSwitcherMap
) {
  // Extract handlers for easier reference
  const { onToggle, onSearch, onSelect } = handlers;

  return (
    <C.Root>
      {/* Main trigger button showing current language */}
      <C.Trigger
        label={view.trigger.label}     // Current language name
        flag={view.trigger.flag}       // Current language flag
        isOpen={view.trigger.isOpen}   // Whether dropdown is open
        onClick={onToggle}             // Toggle dropdown handler
      />

      {/* Dropdown panel (only visible when open) */}
      <C.Dropdown isOpen={view.trigger.isOpen}>
        {/* Search input for filtering languages */}
        <C.SearchInput
          placeholder={view.search.placeholder} // "Search" placeholder text
          value={view.search.value}             // Current search query
          onChange={onSearch}                   // Search input handler
        />

        {/* List of available language options */}
        <C.ItemsList>
          {view.filteredItems.map((item) => (
            <C.Item
              key={item.code}    // Unique key for React rendering
              item={item}        // Language data (name, flag, active state)
              onClick={onSelect} // Language selection handler
            />
          ))}
        </C.ItemsList>
      </C.Dropdown>
    </C.Root>
  );
}