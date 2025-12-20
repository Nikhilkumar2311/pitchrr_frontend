/**
 * Axios API Client Configuration
 * 
 * This is the SINGLE source for all HTTP requests in the app.
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
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

/**
 * Create the axios instance with default configuration
 * 
 * baseURL: Will be set from environment variable
 * timeout: 30 seconds (prevent hanging requests)
 * headers: JSON content type by default
 */
const api = axios.create({
    // Use environment variable for API URL, fallback to localhost for development
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * REQUEST INTERCEPTOR
 * 
 * Runs BEFORE every request is sent.
 * Used to attach the auth token to requests.
 * 
 * localStorage.getItem('token') - gets saved token
 * Authorization header - standard way to send tokens
 */
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage (set during login)
        const token = localStorage.getItem('token');

        // If token exists, add it to the request header
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        // Request failed before being sent
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
    (response) => {
        // Success! Just return the response
        return response;
    },
    (error: AxiosError<{ message?: string }>) => {
        // Handle different error types

        if (error.response) {
            // Server responded with an error status code
            const status = error.response.status;
            const message = error.response.data?.message || 'Something went wrong';

            switch (status) {
                case 401:
                    // Unauthorized - token expired or invalid
                    // Clear local storage and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');

                    // Show toast notification
                    toast.error('Session expired. Please login again.');

                    // Redirect to login (only if we're not already there)
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
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
