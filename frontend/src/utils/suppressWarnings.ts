/**
 * Suppress known development warnings that don't affect functionality
 */

// Suppress console warnings in development
const originalWarn = console.warn;
const originalError = console.error;

const SUPPRESSED_WARNINGS = [
    '"shadow*" style props are deprecated',
    '"textShadow*" style props are deprecated',
    'props.pointerEvents is deprecated',

    'Animated: `useNativeDriver` is not supported',
    'Download the React DevTools',
];

console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';

    // Check if this warning should be suppressed
    const shouldSuppress = SUPPRESSED_WARNINGS.some(warning =>
        message.includes(warning)
    );

    if (!shouldSuppress) {
        originalWarn.apply(console, args);
    }
};

console.error = (...args: any[]) => {
    const message = args[0]?.toString() || '';

    // Only suppress specific non-critical errors
    const shouldSuppress = SUPPRESSED_WARNINGS.some(warning =>
        message.includes(warning)
    );

    if (!shouldSuppress) {
        originalError.apply(console, args);
    }
};

export { };
