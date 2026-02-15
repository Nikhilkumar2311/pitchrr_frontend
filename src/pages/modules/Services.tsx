/**
 * Services Page
 *
 * Displays all Pitchrr professional services in a categorised card grid.
 * Each card opens a ServiceInquiryModal for lead capture via Web3Forms.
 *
 * Matches the visual language of the Dashboard – motion stagger animations,
 * Card hover elevation, Badge indicators, and the blue-primary palette.
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SEO } from "@/components/common/SEO";
import { ServiceInquiryModal } from "@/components/common/ServiceInquiryModal";
import {
    serviceCategories,
    type ServiceItem,
} from "@/data/servicesData";

/* ────── animation helpers ────── */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

/* ────── component ────── */
export default function Services() {
    const [selectedService, setSelectedService] = useState<{
        service: ServiceItem;
        categoryName: string;
    } | null>(null);

    const handleCardClick = useCallback(
        (service: ServiceItem, categoryName: string) => {
            setSelectedService({ service, categoryName });
        },
        []
    );

    const handleCloseModal = useCallback(() => {
        setSelectedService(null);
    }, []);

    return (
        <>
            <SEO
                title="Our Services"
                description="Explore Pitchrr's professional services — from company incorporation and IP advisory to branding, funding support, and regulatory compliance."
                canonical="/dashboard/services"
            />

            <div className="space-y-10">
                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                Our Services
                            </h1>
                        </div>
                        <p className="text-gray-600 max-w-xl">
                            End-to-end professional services to incorporate, certify, fund,
                            brand, and protect your startup. Click on any service to get started.
                        </p>
                    </div>
                    <Badge variant="primary" size="md">
                        {serviceCategories.reduce(
                            (acc, cat) => acc + cat.services.length,
                            0
                        )}{" "}
                        Services Available
                    </Badge>
                </div>

                {/* ── Category Sections ── */}
                {serviceCategories.map((category) => {
                    const Icon = category.icon;

                    return (
                        <section key={category.id}>
                            {/* Category Header */}
                            <div className="flex items-center gap-3 mb-5">
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: category.bgColor }}
                                >
                                    <Icon
                                        className="w-5 h-5"
                                        style={{ color: category.color }}
                                    />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {category.title}
                                </h2>
                                <Badge variant="default" size="sm">
                                    {category.services.length}
                                </Badge>
                            </div>

                            {/* Service Cards Grid */}
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                            >
                                {category.services.map((service) => (
                                    <motion.div
                                        key={service.id}
                                        variants={cardVariants}
                                        transition={{ duration: 0.35 }}
                                    >
                                        <button
                                            type="button"
                                            className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xl"
                                            onClick={() =>
                                                handleCardClick(service, category.title)
                                            }
                                        >
                                            <Card hover className="h-full flex flex-col">
                                                {/* Accent bar */}
                                                <div
                                                    className="h-1 w-12 rounded-full mb-4"
                                                    style={{ backgroundColor: category.color }}
                                                />

                                                <h3 className="font-semibold text-gray-900 mb-2 leading-snug">
                                                    {service.title}
                                                </h3>

                                                <p className="text-sm text-gray-600 flex-1 mb-4 leading-relaxed">
                                                    {service.description}
                                                </p>

                                                <div className="flex items-center text-blue-600 text-sm font-medium mt-auto">
                                                    <span>Inquire</span>
                                                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                                                </div>
                                            </Card>
                                        </button>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </section>
                    );
                })}
            </div>

            {/* ── Inquiry Modal ── */}
            {selectedService && (
                <ServiceInquiryModal
                    isOpen={!!selectedService}
                    onClose={handleCloseModal}
                    serviceName={selectedService.service.title}
                    categoryName={selectedService.categoryName}
                />
            )}
        </>
    );
}
