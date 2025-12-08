/**
 * Converts seconds into a formatted MM:SS string.
 * @param seconds - Total seconds (e.g., 65)
 * @returns Formatted string (e.g., "01:05")
 */
export const formatTime = (seconds: number): string => {
    if (seconds === undefined || seconds === null || isNaN(seconds)) {
        return "00:00";
    }

    // Ensure positive number
    const absSeconds = Math.abs(Math.floor(seconds));

    const minutes = Math.floor(absSeconds / 60);
    const remainingSeconds = absSeconds % 60;

    const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const paddedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return `${paddedMinutes}:${paddedSeconds}`;
};
