/**
 * useLocalStorage Hook
 * 
 * A hook that syncs state with localStorage.
 * 
 * USAGE:
 * const [value, setValue] = useLocalStorage('key', defaultValue);
 * 
 * WHY THIS HOOK?
 * - Automatically persists state to localStorage
 * - Syncs across tabs (optional)
 * - Handles JSON serialization/parsing
 */

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
    // Get initial value from localStorage or use provided initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Update localStorage when state changes
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}
