/**
 * AuthModal - Custom Auth UI (replacing Clerk)
 * 
 * Views: signin, signup, verify-email, forgot-password, reset-password-code
 * Uses our custom AuthContext for all auth operations.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Modal, Button, Input } from '@/components/ui';
import { useUIStore } from '@/store';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

// Core API URL for Google OAuth redirect
const API_BASE = import.meta.env.VITE_CORE_API_URL || 'http://localhost:3001/api/v1';

// Google Icon Component
const GoogleIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

export function AuthModal() {
    const navigate = useNavigate();
    const { isAuthModalOpen, setAuthModalOpen, authModalView, setAuthModalView } = useUIStore();
    const { login, register, verifyEmail, resendOtp, forgotPassword, resetPassword } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        password: '',
        code: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const resetForm = () => {
        setFormData({ firstName: '', email: '', password: '', code: '' });
        setAuthModalView('signin');
        setPasswordError('');
    };

    const handleClose = () => {
        setAuthModalOpen(false);
        setTimeout(resetForm, 300);
    };

    const view = authModalView;
    const setView = setAuthModalView;

    // --- OAuth handling ---
    const handleOAuth = () => {
        // Redirect to our backend Google OAuth endpoint
        window.location.href = `${API_BASE}/auth/google`;
    };

    // --- Password validation ---
    const validatePassword = (pwd: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!regex.test(pwd)) {
            return 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special char.';
        }
        return '';
    };

    // --- Sign In handling ---
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                toast.success('Welcome back!');
                handleClose();
                navigate('/dashboard');
            } else if (result.needsVerification) {
                toast('Please verify your email first. Code sent!', { icon: '📧' });
                setView('verify-email');
            } else {
                toast.error(result.error || 'Login failed');
            }
        } catch (err: any) {
            toast.error('Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Sign Up handling ---
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        const pError = validatePassword(formData.password);
        if (pError) {
            setPasswordError(pError);
            return;
        }

        setIsLoading(true);

        try {
            const result = await register(formData.firstName, formData.email, formData.password);

            if (result.success) {
                toast.success('Code sent! Check your email.');
                setView('verify-email');
            } else {
                toast.error(result.error || 'Signup failed');
            }
        } catch (err: any) {
            toast.error('Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Verify Email handling ---
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await verifyEmail(formData.email, formData.code);

            if (result.success) {
                toast.success('Account verified!');
                handleClose();
                navigate('/dashboard');
            } else {
                toast.error(result.error || 'Invalid code');
            }
        } catch (err: any) {
            toast.error('Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Resend OTP ---
    const handleResendOtp = async () => {
        const result = await resendOtp(formData.email);
        if (result.success) {
            toast.success('New code sent!');
        } else {
            toast.error(result.error || 'Failed to resend');
        }
    };

    // --- Forgot Password handling ---
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await forgotPassword(formData.email);

            if (result.success) {
                toast.success('Reset code sent to your email');
                setView('reset-password-code');
            } else {
                toast.error(result.error || 'Failed to send reset code');
            }
        } catch (err: any) {
            toast.error('Failed to send reset code');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Reset Password handling ---
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        const pError = validatePassword(formData.password);
        if (pError) {
            setPasswordError(pError);
            return;
        }

        setIsLoading(true);

        try {
            const result = await resetPassword(formData.email, formData.code, formData.password);

            if (result.success) {
                toast.success('Password reset successfully!');
                setView('signin');
                setFormData({ ...formData, password: '', code: '' });
            } else {
                toast.error(result.error || 'Invalid code or password');
            }
        } catch (err: any) {
            toast.error('Reset failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isAuthModalOpen}
            onClose={handleClose}
            size="md"
            showCloseButton={false}
        >
            <div className="py-2">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mt-2">
                        {view === 'signin' && 'Welcome Back'}
                        {view === 'signup' && 'Create Account'}
                        {view === 'forgot-password' && 'Reset Password'}
                        {view === 'verify-email' && 'Verify Email'}
                        {view === 'reset-password-code' && 'Reset Password'}
                    </h2>
                    <p className="text-gray-400 text-sm mt-2 font-medium">
                        {view === 'signin' && 'Enter your details to access your dashboard'}
                        {view === 'signup' && 'Join Pitchrr and start building today'}
                        {view === 'forgot-password' && 'Enter your email to receive a reset code'}
                        {view === 'verify-email' && `Enter the code sent to ${formData.email}`}
                        {view === 'reset-password-code' && 'Enter code and new password'}
                    </p>
                </div>

                {/* OAuth Buttons */}
                {view !== 'forgot-password' && view !== 'verify-email' && view !== 'reset-password-code' && (
                    <div className="space-y-3 mb-8">
                        <Button
                            variant="secondary"
                            className="w-full h-12 border-gray-100 shadow-sm text-gray-600 hover:bg-gray-50 transition-all font-semibold"
                            leftIcon={<GoogleIcon className="w-5 h-5" />}
                            onClick={handleOAuth}
                            isLoading={isLoading}
                        >
                            Continue with Google
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-widest text-[10px]">Or</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Forms */}
                <form
                    className="space-y-4"
                    onSubmit={
                        view === 'signin' ? handleSignIn :
                            view === 'signup' ? handleSignUp :
                                view === 'verify-email' ? handleVerify :
                                    view === 'forgot-password' ? handleForgotPassword :
                                        view === 'reset-password-code' ? handleResetPassword :
                                            (e) => e.preventDefault()
                    }
                >
                    {view === 'signup' && (
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                        />
                    )}

                    {/* Email Field - Hidden in Verify & Reset Code Views */}
                    {view !== 'verify-email' && view !== 'reset-password-code' && (
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    )}

                    {/* Password Field */}
                    {(view === 'signin' || view === 'signup' || view === 'reset-password-code') && (
                        <div className="space-y-1">
                            <Input
                                label={view === 'reset-password-code' ? "New Password" : "Password"}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value });
                                    if (passwordError) setPasswordError('');
                                }}
                                required
                                error={(view === 'signup' || view === 'reset-password-code') ? passwordError : undefined}
                                helperText={(view === 'signup' || view === 'reset-password-code') && !passwordError ? "Min 8 chars, 1 upper, 1 lower, 1 digit, 1 special." : undefined}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="focus:outline-none hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                }
                            />
                            {view === 'signin' && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setView('forgot-password')}
                                        className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* OTP Field */}
                    {(view === 'verify-email' || view === 'reset-password-code') && (
                        <Input
                            label="Verification Code"
                            placeholder="123456"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            required
                            className="text-center text-lg tracking-widest"
                            maxLength={6}
                        />
                    )}

                    <Button
                        type="submit"
                        className="w-full h-12 group"
                        isLoading={isLoading}
                        rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                    >
                        {view === 'signin' && 'Sign In'}
                        {view === 'signup' && 'Get Started'}
                        {view === 'verify-email' && 'Verify & Login'}
                        {view === 'forgot-password' && 'Send Reset Code'}
                        {view === 'reset-password-code' && 'Reset Password'}
                    </Button>
                </form>

                {/* Resend OTP link for verify-email and reset-password views */}
                {(view === 'verify-email' || view === 'reset-password-code') && (
                    <div className="mt-3 text-center">
                        <button
                            type="button"
                            onClick={async () => {
                                if (view === 'verify-email') {
                                    handleResendOtp();
                                } else {
                                    // Re-send forgot password OTP
                                    const result = await forgotPassword(formData.email);
                                    if (result.success) {
                                        toast.success('New reset code sent!');
                                    } else {
                                        toast.error(result.error || 'Failed to resend');
                                    }
                                }
                            }}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Didn't receive the code? Resend
                        </button>
                    </div>
                )}

                {/* Footer Links */}
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    {view === 'signin' ? (
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => setView('signup')}
                                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Signup
                            </button>
                        </p>
                    ) : view === 'signup' ? (
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => setView('signin')}
                                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Login
                            </button>
                        </p>
                    ) : view === 'verify-email' ? (
                        <p className="text-sm text-gray-600">
                            <button
                                onClick={() => setView('signup')}
                                className="font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Back to Signup
                            </button>
                        </p>
                    ) : (
                        <p className="text-sm text-gray-600">
                            <button
                                onClick={() => setView('signin')}
                                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Back to Login
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );
}
