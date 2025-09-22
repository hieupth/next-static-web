import React from 'react';
import { LanguageSwitcherMap } from '../../render/render';

/**
 * Unstyled Language Switcher Component Map
 *
 * This is the default implementation of the language switcher components.
 * It provides basic HTML structure with minimal inline styles for functionality.
 * You can create your own component map to customize the appearance.
 */
export const unstyledLanguageSwitcherMap: LanguageSwitcherMap = {
  /**
   * Root container component
   * Uses relative positioning to contain the absolutely positioned dropdown
   */
  Root: ({ children, className = '' }) => (
    <div className={className} style={{ position: 'relative', display: 'inline-block' }}>
      {children}
    </div>
  ),

  /**
   * Main trigger button component
   * Shows the current language with flag and dropdown arrow
   * Includes proper ARIA attributes for accessibility
   */
  Trigger: ({ label, flag, isOpen, onClick, className = '' }) => (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-expanded={isOpen}      // Tells screen readers if dropdown is open
      aria-haspopup="listbox"     // Indicates this button opens a list
      style={{ display: 'flex', alignItems: 'center' }}
    >
      {/* Language flag emoji */}
      <span style={{ marginRight: '8px', fontSize: '18px' }}>
        {flag}
      </span>
      {/* Language name */}
      <span style={{ marginRight: '8px' }}>
        {label}
      </span>
      {/* Dropdown arrow (rotates when open) */}
      <CaretIcon isOpen={isOpen} />
    </button>
  ),

  /**
   * Dropdown container component
   * Positioned absolutely below the trigger button
   * Visibility controlled by isOpen prop
   */
  Dropdown: ({ children, isOpen, className = '' }) => (
    <div
      className={className}
      style={{
        position: 'absolute',           // Position relative to Root container
        zIndex: 10,                    // Appear above other page content
        width: '100%',                 // Match trigger button width
        marginTop: '1px',              // Small gap below trigger
        display: isOpen ? 'block' : 'none' // Hide/show based on state
      }}
      role="listbox"                   // ARIA role for accessibility
    >
      {children}
    </div>
  ),

  /**
   * Search input component
   * Allows users to filter the language list by typing
   * Includes a search icon for visual clarity
   */
  SearchInput: ({ placeholder, value, onChange, className = '' }) => (
    <div className={className} style={{ position: 'relative' }}>
      {/* Search icon positioned inside the input field */}
      <div style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <SearchIcon />
      </div>
      {/* Text input with left padding to make room for the icon */}
      <input
        type="text"
        placeholder={placeholder}                    // "Search" placeholder text
        value={value}                               // Current search query
        onChange={(e) => onChange(e.target.value)}  // Update search on typing
        autoComplete="off"                          // Disable browser autocomplete
        style={{ width: '100%', paddingLeft: '32px' }} // Full width with icon space
      />
    </div>
  ),

  /**
   * Items list container component
   * Scrollable container for the language options
   * Limited height to prevent very long lists from overwhelming the UI
   */
  ItemsList: ({ children, className = '' }) => (
    <div className={className} style={{ maxHeight: '240px', overflowY: 'auto' }}>
      {children}
    </div>
  ),

  /**
   * Individual language item component
   * Clickable button showing flag, name, and active state
   * Includes ARIA attributes for screen reader accessibility
   */
  Item: ({ item, onClick, className = '' }) => (
    <button
      type="button"
      className={className}
      onClick={() => onClick(item.code)}    // Select this language
      role="option"                         // ARIA role for list option
      aria-selected={item.isActive}        // Mark active language for screen readers
      style={{ width: '100%', display: 'flex', alignItems: 'center', textAlign: 'left' }}
    >
      {/* Language flag */}
      <span style={{ marginRight: '8px', fontSize: '18px' }}>
        {item.flag}
      </span>
      {/* Language name (takes up remaining space) */}
      <span style={{ flex: 1 }}>
        {item.label}
      </span>
      {/* Check mark for currently active language */}
      {item.isActive && (
        <CheckIcon />
      )}
    </button>
  ),

  /**
   * Dropdown caret/arrow icon component
   * Rotates to indicate dropdown state (down when closed, up when open)
   * Uses CSS transform with smooth transition for visual feedback
   */
  CaretIcon: ({ isOpen, className = '' }) => (
    <svg
      className={className}
      style={{
        width: '16px',
        height: '16px',
        marginLeft: '8px',
        // Rotate 180 degrees when open to point upward
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.15s'  // Smooth animation
      }}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {/* Chevron down path */}
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),

  /**
   * Search magnifying glass icon component
   * Displayed inside the search input field to indicate its purpose
   */
  SearchIcon: ({ className = '' }) => (
    <svg
      className={className}
      style={{ width: '16px', height: '16px' }}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {/* Magnifying glass path */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),

  /**
   * Check mark icon component
   * Displayed next to the currently active/selected language
   * Uses green color to indicate the active state
   */
  CheckIcon: ({ className = '' }) => (
    <svg
      className={className}
      style={{ width: '16px', height: '16px', color: 'green' }}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {/* Check mark path */}
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
};

// Export individual icon components for easier access
// These are referenced within the component map above
const CaretIcon = unstyledLanguageSwitcherMap.CaretIcon;
const SearchIcon = unstyledLanguageSwitcherMap.SearchIcon;
const CheckIcon = unstyledLanguageSwitcherMap.CheckIcon;