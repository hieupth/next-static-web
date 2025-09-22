/**
 * Language Switcher Component
 *
 * This module exports everything needed to use the language switcher component.
 * The language switcher allows users to change the application's language/locale.
 */

// Export the main component
export { LanguageSwitcher } from './LanguageSwitcher';

// Export type definitions for configuration and data structures
export type {
  LocaleData,              // Structure for language/locale information
  LanguageItem,            // Structure for individual language options
  LanguageView,            // Complete view model for rendering
  LanguageSwitcherConfig   // Configuration object for the component
} from './contract/contract';

// Export type definitions for rendering and event handling
export type {
  LanguageSwitcherMap,     // Map of UI components for rendering
  LanguageSwitcherHandlers // Event handlers for user interactions
} from './render/render';