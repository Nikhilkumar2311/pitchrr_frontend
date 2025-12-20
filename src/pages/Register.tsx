/**
 * Register Page - Uses standard Tailwind classes
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';

export default function Register() {
    const navigate = useNavigate();
    const { register, isLoading } = useAuthStore();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};
        if (!name.trim()) {
            newErrors.name = 'Name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }
        const success = await register({ name, email, password });
        if (success) {
            navigate('/dashboard', { replace: true });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="p-4 lg:p-6">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">P</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">Pitchrr</span>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Create your account
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Start building your startup today
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                type="text"
                                label="Full Name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={errors.name}
                                leftIcon={<User className="w-5 h-5" />}
                            />

                            <Input
                                type="email"
                                label="Email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={errors.email}
                                leftIcon={<Mail className="w-5 h-5" />}
                            />

                            <Input
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={errors.password}
                                helperText="Must be at least 6 characters"
                                leftIcon={<Lock className="w-5 h-5" />}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                }
                            />

                            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                                Create Account
                            </Button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 bg-white text-sm text-gray-500">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        <Link to="/login">
                            <Button variant="secondary" className="w-full" size="lg">
                                Sign In Instead
                            </Button>
                        </Link>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        By creating an account, you agree to our Terms and Privacy Policy.
                    </p>
                </div>
            </main>
        </div>
    );
}
