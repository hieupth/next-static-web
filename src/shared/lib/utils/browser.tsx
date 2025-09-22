/** Possible values for touch support detection. */
export type TouchSupport = 'has-touch' | 'no-touch';
/** Possible values for mobile device detection. */
export type MobileSupport = 'has-mobile' | 'no-mobile';
/** List of supported browser names for user agent detection. */
export type BrowserName = 
  | 'Chrome' 
  | 'Edge' 
  | 'Safari' 
  | 'Firefox' 
  | 'Opera' 
  | 'Brave' 
  | 'Samsung' 
  | 'Unknown';


/**
 * Detects whether the current environment supports touch input.
 * @returns {TouchSupport} Status indicating touch capability.
 */
export const hasTouch = (): TouchSupport => {
  // Handle SSR case
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 'no-touch';
  }
  try {
    // Multiple ways to detect touch support
    const hasTouchEvents = 'ontouchstart' in document.documentElement;
    const hasPointerEvents = 'onpointerdown' in document.documentElement;
    const hasTouchPoints = navigator.maxTouchPoints > 0;  
    // Return touch support
    return (hasTouchEvents || hasPointerEvents || hasTouchPoints) ? 'has-touch' : 'no-touch';
  } catch (error) {
    console.warn('Error detecting touch support:', error);
    return 'no-touch';
  }
};


/**
 * Determines if the current device should be considered "mobile".
 * @returns {MobileSupport} Status indicating mobile capability.
 */
export const hasMobile = (): MobileSupport => {
  // Handle SSR case
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'no-mobile';
  }
  try {
    // Check user agent first (more reliable for actual mobile devices)
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|Mobile/i;
    const isMobileUA = mobileRegex.test(navigator.userAgent); 
    // Check for tablet-specific patterns
    const tabletRegex = /iPad|Android(?!.*Mobile)|Tablet/i;
    const isTablet = tabletRegex.test(navigator.userAgent);
    // Check viewport width as secondary indicator with safety check
    const isNarrowViewport = window.innerWidth ? window.innerWidth <= 768 : false;
    // Check for touch support
    const isTouchDevice = hasTouch() === 'has-touch';
    // Mobile if: mobile UA OR (narrow viewport AND touch support)
    // Include tablets as mobile devices
    return (isMobileUA || isTablet || (isNarrowViewport && isTouchDevice)) ? 'has-mobile' : 'no-mobile';
  } catch (error) {
    console.warn('Error detecting mobile device:', error);
    return 'no-mobile';
  }
};


/**
 * Checks whether the current User Agent string contains the given substring.
 * @param agent Substring to check against the User Agent string (case-insensitive).
 * @returns {boolean} True if the User Agent contains the substring, false otherwise.
 */
export const isUserAgent = (agent: string): boolean => {
  // Handle SSR case
  if (typeof navigator === 'undefined') {
    return false;
  }
  if (!agent || typeof agent !== 'string') {
    return false;
  }
  try {
    return navigator.userAgent.toLowerCase().includes(agent.toLowerCase());
  } catch (error) {
    console.warn('Error checking user agent:', error);
    return false;
  }
};


/**
 * Determines the name of the current browser based on User Agent string.
 * @returns {BrowserName} Normalized browser name.
 */
export const getUserAgent = (): BrowserName => {
  // Handle SSR case
  if (typeof navigator === 'undefined') {
    return 'Unknown';
  }
  try {
    const userAgent = navigator.userAgent.toLowerCase(); 
    // Order matters - check more specific browsers first
    if (userAgent.includes('brave')) return 'Brave';
    if (userAgent.includes('samsung')) return 'Samsung';
    if (userAgent.includes('opr') || userAgent.includes('opera')) return 'Opera';
    if (userAgent.includes('edg')) return 'Edge'; // New Edge uses 'Edg'
    if (userAgent.includes('chrome')) return 'Chrome';
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'Safari';
    if (userAgent.includes('firefox')) return 'Firefox';
    return 'Unknown';
  } catch (error) {
    console.warn('Error detecting browser:', error);
    return 'Unknown';
  }
};


/**
 * Provides detailed information about the current browser and environment.
 * Falls back to safe defaults if detection fails or in SSR environments.
  * @returns {{
 *   name: BrowserName;
 *   hasTouch: TouchSupport;
 *   isMobile: MobileSupport;
 *   userAgent: string;
 *   viewport: { width: number; height: number } | null;
 *   platform: string;
 * }}
 */
export const getBrowserInfo = () => {
  try {
    return {
      name: getUserAgent(),
      hasTouch: hasTouch(),
      isMobile: hasMobile(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      viewport: typeof window !== 'undefined' ? {
        width: window.innerWidth,
        height: window.innerHeight
      } : null,
      platform: typeof navigator !== 'undefined' ? navigator.platform : '',
    };
  } catch (error) {
    console.warn('Error getting browser info:', error);
    return {
      name: 'Unknown' as BrowserName,
      hasTouch: 'no-touch' as TouchSupport,
      isMobile: 'no-mobile' as MobileSupport,
      userAgent: '',
      viewport: null,
      platform: '',
    };
  }
};


/**
 * Checks if the current code is running in a server-side rendering (SSR) context.
 * @returns {boolean} True if running in SSR, false otherwise.
 */
export const isSSR = (): boolean => {
  return typeof window === 'undefined';
};