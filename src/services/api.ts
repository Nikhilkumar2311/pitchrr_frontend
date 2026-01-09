/**
 * Axios API Client Configuration
 * 
 * This is the SINGLE source for all HTTP requests to the CORE SERVICE.
 * 
 * WHY A CENTRALIZED API CLIENT?
 * 1. All requests go through one place - easy to debug
 * 2. Token injection happens automatically
 * 3. Error handling is consistent
 * 4. Easy to switch base URL for different environments
 * 
 * USAGE:
 * import api from '@/services/api';
 * const data = await api.get('/users');
 * 
 * ENVIRONMENT VARIABLES:
 * - VITE_CORE_API_URL: Core Service URL (default: http://localhost:3001/api/v1)
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

/**
 * We cannot use Clerk hooks (useAuth) directly here because this is a plain TS file.
 * Instead, we will export a function to initialize the interceptor with the Clerk session.
 * OR, more simply, we can use window.Clerk if available, but the best practice
 * is to pass the token getter to the instance.
 */

// Core Service API (all features: auth, ideas, modules, credits, etc.)
const API_BASE_URL = import.meta.env.VITE_CORE_API_URL || 'http://localhost:3001/api/v1';
console.log('[API] Core API Base URL:', API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// For Clerk integration, we'll set this dynamically from a provider/hook later
let getToken: (() => Promise<string | null>) | null = null;

export const setTokenGetter = (fn: () => Promise<string | null>) => {
    getToken = fn;
};

/**
 * REQUEST INTERCEPTOR
 * 
 * Runs BEFORE every request is sent.
 * Automatically attaches the Clerk JWT token if available.
 */
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const fullUrl = `${config.baseURL}${config.url}`;
        console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${fullUrl}`);

        if (getToken) {
            try {
                const token = await getToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log('[API] Token attached:', token.substring(0, 20) + '...');
                } else {
                    console.warn('[API] Request:', config.url, 'No token available from Clerk');
                }
            } catch (err) {
                console.error('[API] Error getting token:', err);
            }
        } else {
            console.warn('[API] Request:', config.url, 'getToken function not set');
        }
        return config;
    },
    (error: AxiosError) => {
        console.error('[API] Request Error:', error);
        return Promise.reject(error);
    }
);

/**
 * RESPONSE INTERCEPTOR
 * 
 * Runs AFTER every response is received.
 * Used for:
 * - Global error handling
 * - Token expiration handling
 * - Logging
 */
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
        // Handle different error types

        if (error.response) {
            // Server responded with an error status code
            const status = error.response.status;
            const message = error.response.data?.message || 'Something went wrong';

            switch (status) {
                case 401:
                    // Unauthorized - token expired or invalid
                    // We let the app handle the auth state. Do NOT force redirect here
                    // as it causes loops if a background check fails.
                    console.warn("API 401 Unauthorized:", message);

                    // Optional: You could broadcast an event here if needed
                    // eventBus.emit('auth:unauthorized');
                    break;

                case 403:
                    // Forbidden - user doesn't have permission
                    toast.error('You do not have permission to do this.');
                    break;

                case 404:
                    // Not found - resource doesn't exist
                    toast.error('Resource not found.');
                    break;

                case 500:
                    // Server error
                    toast.error('Server error. Please try again later.');
                    break;

                default:
                    // Other errors - show the message from server
                    toast.error(message);
            }
        } else if (error.request) {
            // Request was made but no response received (network error)
            toast.error('Network error. Please check your connection.');
        }

        // Always reject so the caller can handle if needed
        return Promise.reject(error);
    }
);

export default api;
