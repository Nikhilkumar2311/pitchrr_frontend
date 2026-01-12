/**
 * SEO Component
 * 
 * Provides dynamic meta tags for each page using react-helmet-async.
 * Ensures proper SEO with unique titles, descriptions, and keywords per page.
 */

import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    canonical?: string;
    noIndex?: boolean;
}

export function SEO({
    title,
    description,
    keywords,
    canonical,
    noIndex = false
}: SEOProps) {
    const fullTitle = title === 'Pitchrr' ? title : `${title} | Pitchrr`;
    const baseUrl = 'https://pitchrr.com';
    const canonicalUrl = canonical ? `${baseUrl}${canonical}` : undefined;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            {noIndex && <meta name="robots" content="noindex, nofollow" />}

            {/* Canonical URL */}
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
}
