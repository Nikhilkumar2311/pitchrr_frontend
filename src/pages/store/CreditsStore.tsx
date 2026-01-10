/**
 * Credits Store Page
 *
 * Allows users to purchase credit packs using Razorpay.
 */

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    Coins,
    Sparkles,
    Zap,
    Crown,
    Loader2
} from 'lucide-react';
import { Card, Button } from '@/components/ui';
import {
    useCredits,
    useCreditPacks,
    useCreateOrder,
    /*useVerifyPayment,*/
} from '@/hooks';
import toast from 'react-hot-toast';
import api from '@/services/api';

// Pack icons mapping
const PACK_ICONS = {
    mini: Coins,
    starter: Zap,
    basic: Coins,
    growth: Sparkles,
    pro: Crown,
    business: Sparkles,
    enterprise: Crown,
    unlimited: Crown,
    team: Crown,
};

// Declare Razorpay on window
declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function CreditsStore() {
    const { data: credits, isLoading: isLoadingCredits } = useCredits();
    const { data: packs, isLoading: isLoadingPacks } = useCreditPacks();
    const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();
    // TODO: Enable after deploying webhook URL
    // const { mutateAsync: verifyPayment, isPending: isVerifying } = useVerifyPayment();

    const [selectedPack, setSelectedPack] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const handlePurchase = async (packId: string) => {
        setSelectedPack(packId);

        try {
            // Create order
            const order = await createOrder(packId);

            // Load Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount * 100, // Razorpay expects paise
                currency: order.currency,
                name: 'Pitchrr',
                description: order.packName,
                order_id: order.razorpayOrderId,
                handler: async (response: {
                    razorpay_payment_id: string;
                    razorpay_order_id: string;
                    razorpay_signature: string;
                }) => {
                    // TODO: Enable verification after deploying webhook URL
                    // try {
                    //     await verifyPayment({
                    //         razorpayOrderId: response.razorpay_order_id,
                    //         razorpayPaymentId: response.razorpay_payment_id,
                    //         razorpaySignature: response.razorpay_signature,
                    //     });
                    // } catch {
                    //     toast.error('Payment verification failed');
                    // }

                    // For testing: add credits directly via test endpoint
                    console.log('Payment successful (test mode):', response);
                    try {
                        const pack = packs?.find(p => p.id === packId);
                        const { data } = await api.post('/credits/add-test', {
                            credits: pack?.credits || 0,
                            packName: order.packName,
                        });
                        toast.success(`${data.creditsAdded} credits added! New balance: ${data.newBalance}`);
                        // Update credits cache directly with new balance
                        queryClient.setQueryData(['credits', 'stats'], (old: any) => ({
                            ...old,
                            balance: data.newBalance,
                        }));
                        // Also invalidate to ensure fresh data on next fetch
                        queryClient.invalidateQueries({ queryKey: ['credits', 'stats'] });
                    } catch (err) {
                        console.error('Failed to add test credits:', err);
                        toast.error('Failed to add credits in test mode');
                    }
                },
                prefill: {
                    name: '',
                    email: '',
                },
                theme: {
                    color: '#3B82F6',
                },
                modal: {
                    ondismiss: () => {
                        setSelectedPack(null);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch {
            toast.error('Failed to create order');
        } finally {
            setSelectedPack(null);
        }
    };

    const isLoading = isLoadingCredits || isLoadingPacks;
    const isPurchasing = isCreatingOrder /*|| isVerifying*/;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
                    <Coins className="w-8 h-8 text-amber-500" />
                    Buy Credits
                </h1>
                <p className="mt-2 text-gray-600">
                    Power your AI modules with credits
                </p>
            </div>

            {/* Current Balance */}
            <Card className="bg-linear-to-r from-amber-50 to-yellow-50 border-amber-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-amber-700">Current Balance</p>
                        <p className="text-3xl font-bold text-amber-900">
                            {credits?.balance ?? 0} credits
                        </p>
                    </div>
                    <Coins className="w-12 h-12 text-amber-500 opacity-50" />
                </div>
            </Card>

            {/* Credit Packs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {packs?.map((pack, index) => {
                    const Icon = PACK_ICONS[pack.id as keyof typeof PACK_ICONS] || Coins;
                    const isSelected = selectedPack === pack.id;

                    return (
                        <motion.div
                            key={pack.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card
                                className={`relative overflow-hidden cursor-pointer transition-all hover:shadow-lg ${pack.popular
                                    ? 'border-2 border-blue-500 ring-2 ring-blue-100'
                                    : 'hover:border-gray-300'
                                    }`}
                            >
                                {/* Popular Badge */}
                                {pack.popular && (
                                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                                        Most Popular
                                    </div>
                                )}

                                <div className="text-center pt-4">
                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 ${pack.popular
                                        ? 'bg-blue-100'
                                        : 'bg-gray-100'
                                        }`}>
                                        <Icon className={`w-7 h-7 ${pack.popular ? 'text-blue-600' : 'text-gray-600'
                                            }`} />
                                    </div>

                                    {/* Pack Name */}
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {pack.name}
                                    </h3>

                                    {/* Credits */}
                                    <div className="mt-2">
                                        <span className="text-4xl font-bold text-gray-900">
                                            {pack.credits}
                                        </span>
                                        <span className="text-gray-500 ml-1">credits</span>
                                    </div>

                                    {/* Price */}
                                    <div className="mt-2 text-2xl font-semibold text-gray-900">
                                        ₹{pack.price}
                                    </div>

                                    {/* Per Credit Cost */}
                                    <p className="text-sm text-gray-500 mt-1">
                                        ₹{(pack.price / pack.credits).toFixed(2)} per credit
                                    </p>

                                    {/* Buy Button */}
                                    <div className="mt-6">
                                        <Button
                                            onClick={() => handlePurchase(pack.id)}
                                            isLoading={isSelected && isPurchasing}
                                            disabled={isPurchasing}
                                            className={`w-full ${pack.popular
                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                : ''
                                                }`}
                                        >
                                            Buy Now
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
