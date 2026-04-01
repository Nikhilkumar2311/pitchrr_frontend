/**
 * Google OAuth Callback Page
 * 
 * Handles the redirect from backend after Google OAuth.
 * Reads the access token from URL params, stores it in memory via AuthContext,
 * fetches the user profile, and redirects to dashboard.
 */

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleGoogleCallback, useAuth } from '@/context/AuthContext';
import { Rocket } from 'lucide-react';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isLoaded } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('auth_error');

        if (error) {
            navigate('/?auth_error=' + error, { replace: true });
            return;
        }

        if (token) {
            // Store token in memory (via AuthContext module-level variable)
            handleGoogleCallback(token);
            // Navigate to dashboard — AuthContext will pick up on next refresh cycle
            // We force a page reload to trigger the AuthContext's session restore
            window.location.href = '/dashboard';
        } else {
            navigate('/', { replace: true });
        }
    }, [searchParams, navigate, isLoaded]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col items-center space-y-4 animate-pulse">
                <div className="p-3 bg-blue-100 rounded-full">
                    <Rocket className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">Verifying Identity</h2>
                    <p className="text-sm text-gray-500">Securely logging you in...</p>
                </div>
            </div>
        </div>
    );
}
