import { Dimensions, PixelRatio } from 'react-native';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
};

/**
 * Width percentage to pixels
 * @param percentage - Percentage of screen width (0-100)
 */
export const wp = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

/**
 * Height percentage to pixels
 * @param percentage - Percentage of screen height (0-100)
 */
export const hp = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

/**
 * Moderate scale - scales size based on screen width with a factor
 * @param size - Base size
 * @param factor - Scaling factor (default 0.5)
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const baseWidth = 375; // iPhone X width as base
  const scale = SCREEN_WIDTH / baseWidth;
  return size + (scale - 1) * size * factor;
};

/**
 * Get responsive font size based on screen width
 * @param baseSize - Base font size for mobile
 */
export const getResponsiveFontSize = (baseSize: number): number => {
  if (SCREEN_WIDTH < BREAKPOINTS.mobile) {
    return baseSize;
  } else if (SCREEN_WIDTH < BREAKPOINTS.tablet) {
    return baseSize * 1.1; // 10% larger on tablet
  } else {
    return baseSize * 1.15; // 15% larger on desktop
  }
};

/**
 * Get responsive padding based on screen width
 * @param baseSize - Base padding for mobile
 */
export const getResponsivePadding = (baseSize: number): number => {
  if (SCREEN_WIDTH < BREAKPOINTS.mobile) {
    return baseSize;
  } else if (SCREEN_WIDTH < BREAKPOINTS.tablet) {
    return baseSize * 1.25;
  } else {
    return baseSize * 1.5;
  }
};

/**
 * Get responsive spacing based on screen width
 * @param baseSize - Base spacing for mobile
 */
export const getResponsiveSpacing = (baseSize: number): number => {
  if (SCREEN_WIDTH < BREAKPOINTS.mobile) {
    return baseSize;
  } else if (SCREEN_WIDTH < BREAKPOINTS.tablet) {
    return baseSize * 1.2;
  } else {
    return baseSize * 1.4;
  }
};

/**
 * Get number of columns for grid based on screen width
 * @param mobileColumns - Columns on mobile
 * @param tabletColumns - Columns on tablet
 * @param desktopColumns - Columns on desktop
 */
export const getGridColumns = (
  mobileColumns: number = 2,
  tabletColumns: number = 3,
  desktopColumns: number = 4
): number => {
  if (SCREEN_WIDTH < BREAKPOINTS.mobile) {
    return mobileColumns;
  } else if (SCREEN_WIDTH < BREAKPOINTS.tablet) {
    return tabletColumns;
  } else {
    return desktopColumns;
  }
};

/**
 * Check if device is mobile
 */
export const isMobile = (): boolean => SCREEN_WIDTH < BREAKPOINTS.mobile;

/**
 * Check if device is tablet
 */
export const isTablet = (): boolean => 
  SCREEN_WIDTH >= BREAKPOINTS.mobile && SCREEN_WIDTH < BREAKPOINTS.tablet;

/**
 * Check if device is desktop
 */
export const isDesktop = (): boolean => SCREEN_WIDTH >= BREAKPOINTS.tablet;

/**
 * Get responsive value based on screen size
 * @param mobile - Value for mobile
 * @param tablet - Value for tablet (optional, defaults to desktop value)
 * @param desktop - Value for desktop
 */
export const getResponsiveValue = <T,>(
  mobile: T,
  tablet?: T,
  desktop?: T
): T => {
  if (SCREEN_WIDTH < BREAKPOINTS.mobile) {
    return mobile;
  } else if (SCREEN_WIDTH < BREAKPOINTS.tablet) {
    return tablet ?? desktop ?? mobile;
  } else {
    return desktop ?? tablet ?? mobile;
  }
};

/**
 * Normalize size for different pixel densities
 * @param size - Size to normalize
 */
export const normalize = (size: number): number => {
  const scale = SCREEN_WIDTH / 375;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
