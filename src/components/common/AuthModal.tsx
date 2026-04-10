/**
 * AuthModal - Custom Auth UI (replacing Clerk)
 * 
 * Views: signin, signup, verify-email, forgot-password, reset-password-code
 * Uses our custom AuthContext for all auth operations.
 * 
 * Design: Clean layout with floating-label inputs, real Pitchrr logo,
 * subtle purple gradient wash at the bottom, single Google OAuth section,
 * and smooth micro-interactions throughout.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Modal, Button, Input } from '@/components/ui';
import { useUIStore } from '@/store';
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Smooth staggered form animation variants
const formVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
};

const fieldVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
    },
};

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

    const showGoogleOAuth = view !== 'forgot-password' && view !== 'verify-email' && view !== 'reset-password-code';

    return (
        <Modal
            isOpen={isAuthModalOpen}
            onClose={handleClose}
            size="md"
            showCloseButton={false}
        >
            {/* Bottom gradient wash - breaks out of body padding to cover full modal */}
            <div
                style={{
                    position: 'absolute',
                    bottom: -20,
                    left: -24,
                    right: -24,
                    height: '65%',
                    background: 'linear-gradient(180deg, transparent 0%, rgba(122, 92, 255, 0.05) 30%, rgba(79, 125, 243, 0.10) 60%, rgba(122, 92, 255, 0.15) 100%)',
                    pointerEvents: 'none',
                    borderRadius: '0 0 var(--dash-radius, 12px) var(--dash-radius, 12px)',
                    zIndex: 0,
                }}
            />
            {/* Radial glow spot at bottom center */}
            <div
                style={{
                    position: 'absolute',
                    bottom: -30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                    height: 120,
                    background: 'radial-gradient(ellipse at center, rgba(122, 92, 255, 0.15) 0%, rgba(79, 125, 243, 0.06) 40%, transparent 70%)',
                    pointerEvents: 'none',
                    filter: 'blur(25px)',
                    zIndex: 0,
                }}
            />

            <div className="relative" style={{ zIndex: 1 }}>
                {/* Header with real logo */}
                <motion.div
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Real Pitchrr Logo */}
                    <div style={{ marginBottom: 20 }}>
                        <img
                            src="/logo.svg"
                            alt="Pitchrr"
                            style={{
                                height: 40,
                                display: 'inline-block',
                            }}
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                        >
                            <h2
                                style={{
                                    fontSize: 22,
                                    fontWeight: 700,
                                    color: '#0F172A',
                                    fontFamily: "var(--dash-font-heading, 'Sora', 'Inter', sans-serif)",
                                    marginBottom: 6,
                                }}
                            >
                                {view === 'signin' && 'Sign in with email'}
                                {view === 'signup' && 'Create your account'}
                                {view === 'forgot-password' && 'Reset Password'}
                                {view === 'verify-email' && 'Verify Email'}
                                {view === 'reset-password-code' && 'Reset Password'}
                            </h2>
                            <p
                                style={{
                                    color: '#94A3B8',
                                    fontSize: 13.5,
                                    fontWeight: 500,
                                    lineHeight: 1.5,
                                }}
                            >
                                {view === 'signin' && 'Access your personalized dashboard'}
                                {view === 'signup' && 'Join Pitchrr and start building today'}
                                {view === 'forgot-password' && 'Enter your email to receive a reset code'}
                                {view === 'verify-email' && `Enter the code sent to ${formData.email}`}
                                {view === 'reset-password-code' && 'Enter code and new password'}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Form fields with staggered animation */}
                <AnimatePresence mode="wait">
                    <motion.form
                        key={view}
                        className="space-y-4"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
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
                            <motion.div variants={fieldVariants}>
                                <Input
                                    label="Full Name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                    leftIcon={<User className="w-[18px] h-[18px]" />}
                                />
                            </motion.div>
                        )}

                        {/* Email Field */}
                        {view !== 'verify-email' && view !== 'reset-password-code' && (
                            <motion.div variants={fieldVariants}>
                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    leftIcon={<Mail className="w-[18px] h-[18px]" />}
                                />
                            </motion.div>
                        )}

                        {/* Password Field */}
                        {(view === 'signin' || view === 'signup' || view === 'reset-password-code') && (
                            <motion.div variants={fieldVariants} className="space-y-1.5">
                                <Input
                                    label={view === 'reset-password-code' ? "New Password" : "Password"}
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => {
                                        setFormData({ ...formData, password: e.target.value });
                                        if (passwordError) setPasswordError('');
                                    }}
                                    required
                                    error={(view === 'signup' || view === 'reset-password-code') ? passwordError : undefined}
                                    helperText={(view === 'signup' || view === 'reset-password-code') && !passwordError ? "Min 8 chars, 1 upper, 1 lower, 1 digit, 1 special." : undefined}
                                    leftIcon={<Lock className="w-[18px] h-[18px]" />}
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="focus:outline-none transition-all"
                                            style={{
                                                color: '#94A3B8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = '#4F7DF3';
                                                e.currentTarget.style.transform = 'scale(1.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#94A3B8';
                                                e.currentTarget.style.transform = 'scale(1)';
                                            }}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-[18px] h-[18px]" />
                                            ) : (
                                                <Eye className="w-[18px] h-[18px]" />
                                            )}
                                        </button>
                                    }
                                />
                                {view === 'signin' && (
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setView('forgot-password')}
                                            className="text-xs font-medium transition-all"
                                            style={{ color: '#4F7DF3' }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = '#3B65D9';
                                                e.currentTarget.style.transform = 'translateX(1px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#4F7DF3';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* OTP Field */}
                        {(view === 'verify-email' || view === 'reset-password-code') && (
                            <motion.div variants={fieldVariants}>
                                <Input
                                    label="Verification Code"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    required
                                    className="text-center text-lg tracking-widest"
                                    maxLength={6}
                                    leftIcon={<Hash className="w-[18px] h-[18px]" />}
                                />
                            </motion.div>
                        )}

                        <motion.div variants={fieldVariants} style={{ paddingTop: 6 }}>
                            <Button
                                type="submit"
                                className="w-full h-12 group"
                                style={{
                                    borderRadius: 12,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    letterSpacing: '-0.01em',
                                    background: 'linear-gradient(135deg, #4F7DF3 0%, #6B5CF7 50%, #7A5CFF 100%)',
                                    boxShadow: '0 4px 15px rgba(79, 125, 243, 0.3), 0 1px 3px rgba(0,0,0,0.1)',
                                }}
                                isLoading={isLoading}
                                rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                            >
                                {view === 'signin' && 'Get Started'}
                                {view === 'signup' && 'Create Account'}
                                {view === 'verify-email' && 'Verify & Login'}
                                {view === 'forgot-password' && 'Send Reset Code'}
                                {view === 'reset-password-code' && 'Reset Password'}
                            </Button>
                        </motion.div>
                    </motion.form>
                </AnimatePresence>

                {/* Resend OTP link */}
                {(view === 'verify-email' || view === 'reset-password-code') && (
                    <div className="mt-3 text-center">
                        <button
                            type="button"
                            onClick={async () => {
                                if (view === 'verify-email') {
                                    handleResendOtp();
                                } else {
                                    const result = await forgotPassword(formData.email);
                                    if (result.success) {
                                        toast.success('New reset code sent!');
                                    } else {
                                        toast.error(result.error || 'Failed to resend');
                                    }
                                }
                            }}
                            className="text-xs font-medium transition-colors"
                            style={{ color: '#4F7DF3' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#3B65D9'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#4F7DF3'}
                        >
                            Didn't receive the code? Resend
                        </button>
                    </div>
                )}

                {/* Footer - single section: account switch + Google OAuth together */}
                <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                >
                    {/* Account switch links */}
                    <div style={{ marginBottom: showGoogleOAuth ? 16 : 0 }}>
                        {view === 'signin' ? (
                            <p className="text-sm" style={{ color: '#64748B' }}>
                                Don't have an account?{' '}
                                <button
                                    onClick={() => setView('signup')}
                                    className="font-bold transition-all"
                                    style={{ color: '#0F172A' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#4F7DF3';
                                        e.currentTarget.style.textDecoration = 'underline';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#0F172A';
                                        e.currentTarget.style.textDecoration = 'none';
                                    }}
                                >
                                    Sign Up
                                </button>
                            </p>
                        ) : view === 'signup' ? (
                            <p className="text-sm" style={{ color: '#64748B' }}>
                                Already have an account?{' '}
                                <button
                                    onClick={() => setView('signin')}
                                    className="font-bold transition-all"
                                    style={{ color: '#0F172A' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#4F7DF3';
                                        e.currentTarget.style.textDecoration = 'underline';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#0F172A';
                                        e.currentTarget.style.textDecoration = 'none';
                                    }}
                                >
                                    Login
                                </button>
                            </p>
                        ) : view === 'verify-email' ? (
                            <p className="text-sm">
                                <button
                                    onClick={() => setView('signup')}
                                    className="font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Back to Signup
                                </button>
                            </p>
                        ) : (
                            <p className="text-sm">
                                <button
                                    onClick={() => setView('signin')}
                                    className="font-semibold transition-colors"
                                    style={{ color: '#4F7DF3' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#3B65D9'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#4F7DF3'}
                                >
                                    Back to Login
                                </button>
                            </p>
                        )}
                    </div>

                    {/* Google OAuth section - single clean divider */}
                    {showGoogleOAuth && (
                        <>
                            <div className="relative" style={{ marginBottom: 18 }}>
                                <div
                                    className="absolute inset-0 flex items-center"
                                    style={{ paddingInline: 8 }}
                                >
                                    <div className="w-full" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }} />
                                </div>
                                <div className="relative flex justify-center">
                                    <span
                                        style={{
                                            background: 'white',
                                            color: '#B0B7C3',
                                            fontWeight: 500,
                                            fontSize: 12,
                                            padding: '0 12px',
                                        }}
                                    >
                                        Or sign in with
                                    </span>
                                </div>
                            </div>

                            <motion.button
                                type="button"
                                onClick={handleOAuth}
                                whileHover={{ scale: 1.06, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    border: '1.5px solid rgba(0,0,0,0.07)',
                                    background: 'white',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                }}
                            >
                                <GoogleIcon className="w-5 h-5" />
                            </motion.button>
                        </>
                    )}
                </motion.div>
            </div>
        </Modal>
    );
}
