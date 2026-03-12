/**
 * AuthModal - Custom Headless Auth UI using Clerk
 */

import React, { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Input } from '@/components/ui';
import { useUIStore } from '@/store';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

// Google Icon Component
// const GoogleIcon = ({ className }: { className?: string }) => (
//     <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//         <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
//         <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
//         <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
//         <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
//     </svg>
// );

export function AuthModal() {
    const navigate = useNavigate();
    const { isAuthModalOpen, setAuthModalOpen, authModalView, setAuthModalView } = useUIStore();
    const [isLoading, setIsLoading] = useState(false);

    // Clerk hooks
    const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
    const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();

    // Form states
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        password: '',
        code: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const resetForm = () => {
        setFormData({ firstName: '', email: '', password: '', code: '' });
        setAuthModalView('signin');
        setPasswordError('');
    };

    const handleClose = () => {
        setAuthModalOpen(false);
        setTimeout(resetForm, 300); // Reset after animation
    };

    // Sync view with store, but allow local override if needed for transitions?
    // Actually, simply using the store value is best for 'controlled' behavior.
    const view = authModalView;
    const setView = setAuthModalView;

    // --- OAuth handling ---
    // const handleOAuth = async (provider: 'oauth_google') => {
    //     if (!isSignInLoaded || !isSignUpLoaded) return;
    //     try {
    //         if (view === 'signup') {
    //             await signUp.authenticateWithRedirect({
    //                 strategy: provider,
    //                 redirectUrl: '/sso-callback',
    //                 redirectUrlComplete: '/dashboard',
    //             });
    //         } else {
    //             await signIn.authenticateWithRedirect({
    //                 strategy: provider,
    //                 redirectUrl: '/sso-callback',
    //                 redirectUrlComplete: '/dashboard',
    //             });
    //         }
    //     } catch (err: any) {
    //         console.error('[AuthModal] OAuth error:', err);
    //         toast.error(err.errors?.[0]?.message || 'Google login failed');
    //     }
    // };

    // --- Sign In handling ---
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignInLoaded) return;
        setIsLoading(true);

        try {
            const result = await signIn.create({
                identifier: formData.email,
                password: formData.password,
            });

            if (result.status === 'complete') {
                await setSignInActive({ session: result.createdSessionId });
                toast.success('Welcome back!');
                handleClose();
                navigate('/dashboard');
            } else {
                console.error(`Sign-in status: ${result.status}. Please try again.`);
            }
        } catch (err: any) {
            toast.error(err.errors?.[0]?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Sign Up handling ---
    const [passwordError, setPasswordError] = useState('');

    const validatePassword = (pwd: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!regex.test(pwd)) {
            return 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special char.';
        }
        return '';
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        // Validate Password
        const pError = validatePassword(formData.password);
        if (pError) {
            setPasswordError(pError);
            return;
        }

        if (!isSignUpLoaded) return;
        setIsLoading(true);

        try {
            await signUp.create({
                firstName: formData.firstName,
                emailAddress: formData.email,
                password: formData.password,
            });

            // Start email verification
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

            toast.success('Code sent! Check your email.');
            setView('verify-email');
        } catch (err: any) {
            // Clerk might return password policy errors too, handle them
            toast.error(err.errors?.[0]?.message || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Verify Email handling ---
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignUpLoaded) return;
        setIsLoading(true);

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: formData.code,
            });

            if (result.status === 'complete') {
                await setSignUpActive({ session: result.createdSessionId });
                toast.success('Account verified!');
                handleClose();
                navigate('/dashboard');
            } else {
                toast.error('Verification failed. Please try again.');
            }
        } catch (err: any) {
            toast.error(err.errors?.[0]?.message || 'Invalid code');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Forgot Password handling ---
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignInLoaded) return;
        setIsLoading(true);

        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: formData.email,
            });

            toast.success('Reset code sent to your email');
            setView('reset-password-code');
        } catch (err: any) {
            console.error(err);
            toast.error(err.errors?.[0]?.message || 'Failed to send reset code');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Reset Password handling ---
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignInLoaded) return;

        // Reuse validation
        const pError = validatePassword(formData.password);
        if (pError) {
            setPasswordError(pError);
            return;
        }

        setIsLoading(true);

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code: formData.code,
                password: formData.password,
            });

            if (result.status === 'complete') {
                await setSignInActive({ session: result.createdSessionId });
                toast.success('Password reset successfully!');
                handleClose();
                navigate('/dashboard');
            } else {
                console.log(result);
                toast.error('Failed to reset password. Please try again.');
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.errors?.[0]?.message || 'Invalid code or password');
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
                    </h2>
                    <p className="text-gray-400 text-sm mt-2 font-medium">
                        {view === 'signin' && 'Enter your details to access your dashboard'}
                        {view === 'signup' && 'Join Pitchrr and start building today'}
                        {view === 'forgot-password' && 'Enter your email to receive a reset code'}
                        {view === 'verify-email' && `Enter the code sent to ${formData.email}`}
                        {view === 'reset-password-code' && 'Enter code and new password'}
                    </p>
                </div>

                {/* OAuth Buttons — TEMPORARILY COMMENTED OUT for AWS Activate approval
                   TODO: Uncomment after AWS Activate credits are approved */}
                {/* {view !== 'forgot-password' && view !== 'verify-email' && view !== 'reset-password-code' && (
                    <div className="space-y-3 mb-8">
                        <Button
                            variant="secondary"
                            className="w-full h-12 border-gray-100 shadow-sm text-gray-600 hover:bg-gray-50 transition-all font-semibold"
                            leftIcon={<GoogleIcon className="w-5 h-5" />}
                            onClick={() => handleOAuth('oauth_google')}
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
                )} */}


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
                            label="First Name"
                            placeholder="John"
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

                {/* Check for Captcha */}
                <div id="clerk-captcha" />
            </div>
        </Modal>
    );
}

