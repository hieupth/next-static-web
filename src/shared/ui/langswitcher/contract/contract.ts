/**
 * Defines the structure for locale/language data
 * This contains all the information needed to display and format content for a specific language
 */
export type LocaleData = {
  name: string;        // English name of the language (e.g., "English", "Spanish")
  nativeName: string;  // Native name of the language (e.g., "English", "Español")
  flag: string;        // Emoji flag representing the country/language (e.g., "🇺🇸", "🇪🇸")
  rtl: boolean;        // Whether this language is written right-to-left (like Arabic or Hebrew)
  dateFormat: string;  // How dates should be formatted in this language
  numberFormat: string; // How numbers should be formatted in this language
};

/**
 * Represents a single language option in the language switcher dropdown
 * This is used for rendering each selectable language option
 */
export type LanguageItem = {
  code: string;    // Language code (e.g., "en", "es", "fr")
  label: string;   // Display name for this language option
  flag: string;    // Flag emoji to show next to the language name
  isActive: boolean; // Whether this is the currently selected language
};

/**
 * The complete view model for the language switcher component
 * This contains all the data needed to render the entire language switcher UI
 */
export type LanguageView = {
  trigger: {
    label: string;   // Text to show on the main button (current language name)
    flag: string;    // Flag emoji to show on the main button
    isOpen: boolean; // Whether the dropdown is currently open
  };
  search: {
    placeholder: string; // Placeholder text for the search input field
    value: string;       // Current value in the search input field
  };
  items: LanguageItem[];         // All available language options
  filteredItems: LanguageItem[]; // Language options filtered by search query
};

/**
 * Configuration object used to build the language switcher view
 * This is the input data needed to create the complete LanguageView
 */
export type LanguageSwitcherConfig = {
  locales: Record<string, LocaleData>; // All available locales/languages
  currentLocale: string;               // The currently selected language code
  searchValue?: string;                // Optional: current search filter text
  isOpen?: boolean;                    // Optional: whether dropdown is open
  triggerLabel?: string;               // Optional: custom label for the main button
  searchPlaceholder?: string;          // Optional: custom placeholder for search input
};

/**
 * Builds the complete view model for the language switcher component
 * This function takes configuration data and transforms it into a format suitable for rendering
 *
 * @param config - Configuration object containing locales, current language, and UI state
 * @returns A complete LanguageView object ready for rendering
 * @throws Error if locales are empty, current locale is missing, or current locale is not found
 */
export function buildLanguageView(config: LanguageSwitcherConfig): LanguageView {
  // Extract configuration values with sensible defaults
  const {
    locales,
    currentLocale,
    searchValue = '',           // Default to empty search
    isOpen = false,            // Default to closed dropdown
    searchPlaceholder = 'Search' // Default search placeholder text
  } = config;

  // Validate that we have locales data
  if (!locales || Object.keys(locales).length === 0) {
    throw new Error('Locales configuration is required and cannot be empty');
  }

  // Validate that current locale is provided
  if (!currentLocale) {
    throw new Error('Current locale is required');
  }

  // Validate that the current locale exists in our locales data
  const currentLocaleData = locales[currentLocale];
  if (!currentLocaleData) {
    throw new Error(`Current locale "${currentLocale}" not found in locales configuration`);
  }

  // Transform locales data into language items for the dropdown
  const items: LanguageItem[] = Object.entries(locales).map(([code, data]) => ({
    code,
    label: data.nativeName || data.name, // Prefer native name, fallback to English name
    flag: data.flag,
    isActive: code === currentLocale     // Mark the current language as active
  }));

  // Filter items based on search value (if any)
  // Search matches both the language name and the language code
  const filteredItems = searchValue
    ? items.filter(item =>
        item.label.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.code.toLowerCase().includes(searchValue.toLowerCase())
      )
    : items; // If no search value, show all items

  // Build and return the complete view model
  return {
    trigger: {
      label: currentLocaleData.nativeName || currentLocaleData.name, // Button shows current language
      flag: currentLocaleData.flag,   // Button shows current language flag
      isOpen                          // Button reflects dropdown state
    },
    search: {
      placeholder: searchPlaceholder, // Search input placeholder text
      value: searchValue             // Current search input value
    },
    items,          // All available language options
    filteredItems   // Language options after applying search filter
  };
}