/**
 * Utility Functions
 * 
 * Helper functions used across the application.
 * Each function does ONE thing and does it well.
 */

/**
 * Format a date for display
 * 
 * @param date - Date to format
 * @returns Formatted date string (e.g., "Dec 20, 2024")
 */
export function formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Format a date with time
 * 
 * @param date - Date to format
 * @returns Formatted date string (e.g., "Dec 20, 2024 at 2:30 PM")
 */
export function formatDateTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

/**
 * Truncate text to a maximum length
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with "..." if needed
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

/**
 * Generate a unique ID
 * 
 * Simple ID generator for local use.
 * NOT cryptographically secure - use only for UI purposes.
 * 
 * @returns Unique string ID
 */
export function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Delay execution for specified milliseconds
 * 
 * Useful for simulating API calls in development.
 * 
 * @param ms - Milliseconds to wait
 */
export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clamp a number between min and max
 * 
 * @param value - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped number
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Debounce a function
 * 
 * Returns a new function that only executes after the specified delay
 * has passed since the last call.
 * 
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Capitalize the first letter of a string
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Check if running in development mode
 */
export function isDev(): boolean {
    return import.meta.env.DEV;
}

/**
 * Get value from localStorage safely
 * 
 * @param key - Storage key
 * @param fallback - Fallback value if not found
 */
export function getStorageItem<T>(key: string, fallback: T): T {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch {
        return fallback;
    }
}

/**
 * Set value to localStorage safely
 * 
 * @param key - Storage key
 * @param value - Value to store
 */
export function setStorageItem<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}
