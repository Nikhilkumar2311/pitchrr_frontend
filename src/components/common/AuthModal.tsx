/**
 * AuthModal - Custom Headless Auth UI using Clerk
 */

import React, { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import { Modal, Button, Input } from '@/components/ui';
import { useUIStore } from '@/store';
import { Chrome, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

type AuthView = 'login' | 'signup' | 'forgot-password';

export function AuthModal() {
    const { isAuthModalOpen, setAuthModalOpen } = useUIStore();
    const [view, setView] = useState<AuthView>('login');
    const [isLoading, setIsLoading] = useState(false);

    // Clerk hooks
    const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
    const { isLoaded: isSignUpLoaded, signUp } = useSignUp();

    // Form states
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        password: '',
        code: '',
    });

    const resetForm = () => {
        setFormData({ firstName: '', email: '', password: '', code: '' });
        setView('login');
    };

    const handleClose = () => {
        setAuthModalOpen(false);
        setTimeout(resetForm, 300); // Reset after animation
    };

    // --- OAuth handling ---
    const handleOAuth = async (provider: 'oauth_google') => {
        if (!isSignInLoaded || !isSignUpLoaded) return;
        try {
            if (view === 'signup') {
                await signUp.authenticateWithRedirect({
                    strategy: provider,
                    redirectUrl: '/sso-callback',
                    redirectUrlComplete: '/dashboard',
                });
            } else {
                await signIn.authenticateWithRedirect({
                    strategy: provider,
                    redirectUrl: '/sso-callback',
                    redirectUrlComplete: '/dashboard',
                });
            }
        } catch (err: any) {
            console.error('[AuthModal] OAuth error:', err);
            toast.error(err.errors?.[0]?.message || 'Google login failed');
        }
    };

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
            } else {
                console.log(result); // Multi-factor auth etc
            }
        } catch (err: any) {
            toast.error(err.errors?.[0]?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Sign Up handling ---
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
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
            // For this flow, we'd normally transition to a 'verify' view
            toast.success('Account created! Please check your email.');
            handleClose();
        } catch (err: any) {
            toast.error(err.errors?.[0]?.message || 'Signup failed');
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
                        {view === 'login' && 'Welcome Back'}
                        {view === 'signup' && 'Create Account'}
                        {view === 'forgot-password' && 'Reset Password'}
                    </h2>
                    <p className="text-gray-400 text-sm mt-2 font-medium">
                        {view === 'login' && 'Enter your details to access your dashboard'}
                        {view === 'signup' && 'Join Pitchrr and start building today'}
                        {view === 'forgot-password' && 'Enter your email to receive a reset code'}
                    </p>
                </div>

                {/* OAuth Buttons */}
                {view !== 'forgot-password' && (
                    <div className="space-y-3 mb-8">
                        <Button
                            variant="secondary"
                            className="w-full h-12 border-gray-100 shadow-sm text-gray-600 hover:bg-gray-50 transition-all font-semibold"
                            leftIcon={<Chrome className="w-5 h-5" />}
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
                )}


                {/* Forms */}
                <form
                    className="space-y-4"
                    onSubmit={view === 'login' ? handleSignIn : handleSignUp}
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

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    {view !== 'forgot-password' && (
                        <div className="space-y-1">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            {view === 'login' && (
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

                    <Button
                        type="submit"
                        className="w-full h-12 group"
                        isLoading={isLoading}
                        rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                    >
                        {view === 'login' ? 'Sign In' : 'Get Started'}
                    </Button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    {view === 'login' ? (
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                onClick={() => setView('signup')}
                                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Signup
                            </button>
                        </p>
                    ) : (
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => setView('login')}
                                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Login
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

