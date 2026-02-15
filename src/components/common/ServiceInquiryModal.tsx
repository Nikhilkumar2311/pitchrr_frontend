/**
 * ServiceInquiryModal Component
 *
 * A professional inquiry form that opens when a user clicks a service card.
 * Submits via Web3Forms API to send an email notification.
 *
 * Future-ready: Can be extended with a `mode` prop for booking / 1-on-1 sessions.
 */

import { useState, useCallback } from "react";
import { Send, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

interface ServiceInquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceName: string;
    categoryName: string;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
}

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

export function ServiceInquiryModal({
    isOpen,
    onClose,
    serviceName,
    categoryName,
}: ServiceInquiryModalProps) {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: `Hi, I'm interested in "${serviceName}" under ${categoryName}. Please share more details.`,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Reset form when modal is opened with a new service
    const handleClose = useCallback(() => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            message: "",
        });
        setErrors({});
        setIsSubmitting(false);
        setIsSuccess(false);
        onClose();
    }, [onClose]);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
        if (!accessKey) {
            toast.error("Web3Forms access key is not configured.");
            console.error(
                "Missing VITE_WEB3FORMS_ACCESS_KEY in environment variables."
            );
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                access_key: accessKey,
                subject: `Service Inquiry: ${serviceName}`,
                from_name: "Pitchrr Services",
                name: formData.name,
                email: formData.email,
                phone: formData.phone || "Not provided",
                company: formData.company || "Not provided",
                message: formData.message,
                service: serviceName,
                category: categoryName,
            };

            const response = await fetch(WEB3FORMS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                setIsSuccess(true);
                toast.success("Inquiry submitted successfully!");
                // Auto-close after showing success state
                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else {
                throw new Error(result.message || "Submission failed");
            }
        } catch (err) {
            console.error("Form submission error:", err);
            toast.error("Failed to submit inquiry. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Inquire About ${serviceName}`} size="lg">
            {isSuccess ? (
                /* ───── Success State ───── */
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Inquiry Submitted!
                    </h3>
                    <p className="text-sm text-gray-600 max-w-xs">
                        We've received your inquiry about <strong>{serviceName}</strong>.
                        Our team will get back to you within 24 hours.
                    </p>
                </div>
            ) : (
                /* ───── Form ───── */
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Service tag */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                            {categoryName}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Full Name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            required
                        />
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Phone Number (Optional)"
                            name="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <Input
                            label="Company Name (Optional)"
                            name="company"
                            placeholder="Your Company"
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </div>

                    <Textarea
                        label="Your Message"
                        name="message"
                        placeholder="Tell us more about your requirements…"
                        value={formData.message}
                        onChange={handleChange}
                        error={errors.message}
                        rows={4}
                        required
                    />

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            leftIcon={<Send className="w-4 h-4" />}
                        >
                            {isSubmitting ? "Sending…" : "Send Inquiry"}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
