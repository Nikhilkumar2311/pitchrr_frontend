/**
 * Credits React Query Hooks
 *
 * Hooks for fetching credit balance and purchasing credits.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import toast from 'react-hot-toast';

// =============================================================================
// TYPES
// =============================================================================

export interface CreditPack {
    id: string;
    name: string;
    credits: number;
    price: number;
    currency: string;
    popular?: boolean;
}

export interface CreditStats {
    balance: number;
    totalUsed: number;
    lifetimeCredits: number;
}

export interface CreateOrderResponse {
    orderId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    packName: string;
}

export interface VerifyPaymentResponse {
    success: boolean;
    creditsAdded: number;
    newBalance: number;
}

// =============================================================================
// QUERY KEYS
// =============================================================================

export const creditKeys = {
    all: ['credits'] as const,
    stats: () => [...creditKeys.all, 'stats'] as const,
    packs: () => [...creditKeys.all, 'packs'] as const,
};

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Fetch current user's credit balance and stats.
 */
export function useCredits() {
    return useQuery({
        queryKey: creditKeys.stats(),
        queryFn: async (): Promise<CreditStats> => {
            const response = await api.get('/credits');
            return response.data;
        },
        staleTime: 30000, // Consider fresh for 30 seconds
        refetchOnWindowFocus: true,
        retry: false, // Don't retry on 401/404
    });
}

/**
 * Fetch available credit packs.
 */
export function useCreditPacks() {
    return useQuery({
        queryKey: creditKeys.packs(),
        queryFn: async (): Promise<CreditPack[]> => {
            const response = await api.get('/billing/packs');
            return response.data;
        },
        staleTime: 300000, // Consider fresh for 5 minutes
    });
}

/**
 * Create a Razorpay order for purchasing credits.
 */
export function useCreateOrder() {
    return useMutation({
        mutationFn: async (packId: string): Promise<CreateOrderResponse> => {
            const response = await api.post('/billing/create-order', { packId });
            return response.data;
        },
        onError: () => {
            toast.error('Failed to create order. Please try again.');
        },
    });
}

/**
 * Verify payment and add credits to account.
 */
export function useVerifyPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            razorpayOrderId: string;
            razorpayPaymentId: string;
            razorpaySignature: string;
        }): Promise<VerifyPaymentResponse> => {
            const response = await api.post('/billing/verify-payment', data);
            return response.data;
        },
        onSuccess: (data) => {
            // Invalidate credits query to refresh balance
            queryClient.invalidateQueries({ queryKey: creditKeys.stats() });
            toast.success(`${data.creditsAdded} credits added to your account!`);
        },
        onError: () => {
            toast.error('Payment verification failed. Please contact support.');
        },
    });
}
