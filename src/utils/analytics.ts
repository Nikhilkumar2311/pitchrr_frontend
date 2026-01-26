/**
 * Google Analytics 4 Utility
 * 
 * Centralized analytics tracking using react-ga4.
 * All custom events for the pitch deck app are defined here.
 * 
 * Events tracked:
 * - idea_submitted: When a new startup idea is created
 * - pitch_deck_created: When a pitch deck is generated/exported
 * - module_accessed: When a user accesses any module
 * - module_generated: When AI generates module content
 * - credit_used: When credits are consumed
 * - credit_purchased: When user buys credits
 */

import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-HQZ5YX8FKL';

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize Google Analytics.
 * Call this once in your app entry point.
 */
export const initGA = () => {
    ReactGA.initialize(GA_MEASUREMENT_ID);
};

/**
 * Set user ID for authenticated users.
 * Call this after successful login.
 */
export const setUserId = (userId: string) => {
    ReactGA.gtag('config', GA_MEASUREMENT_ID, { user_id: userId });
};

// =============================================================================
// PAGE TRACKING
// =============================================================================

/**
 * Track page view.
 * React Router integration can auto-track, but this is for manual tracking.
 */
export const trackPageView = (path: string, title?: string) => {
    ReactGA.send({ hitType: 'pageview', page: path, title });
};

// =============================================================================
// CUSTOM EVENTS
// =============================================================================

/**
 * Generic event tracking.
 */
export const trackEvent = (action: string, params?: Record<string, any>) => {
    ReactGA.event(action, params);
};

// =============================================================================
// IDEA EVENTS
// =============================================================================

/**
 * Track when a user submits/creates a new idea.
 */
export const trackIdeaSubmitted = (ideaId: string, ideaTitle: string) => {
    trackEvent('idea_submitted', {
        idea_id: ideaId,
        idea_title: ideaTitle,
        event_category: 'engagement',
    });
};

/**
 * Track when an idea is deleted.
 */
export const trackIdeaDeleted = (ideaId: string) => {
    trackEvent('idea_deleted', {
        idea_id: ideaId,
        event_category: 'engagement',
    });
};

// =============================================================================
// MODULE EVENTS
// =============================================================================

/**
 * Track when a module is accessed/viewed.
 */
export const trackModuleAccessed = (moduleName: string, ideaId: string) => {
    trackEvent('module_accessed', {
        module_name: moduleName,
        idea_id: ideaId,
        event_category: 'navigation',
    });
};

/**
 * Track when AI generates module content.
 */
export const trackModuleGenerated = (
    moduleName: string,
    ideaId: string,
    creditsDeducted: number
) => {
    trackEvent('module_generated', {
        module_name: moduleName,
        idea_id: ideaId,
        credits_deducted: creditsDeducted,
        event_category: 'ai_generation',
    });
};

// =============================================================================
// CREDIT EVENTS
// =============================================================================

/**
 * Track when credits are used.
 */
export const trackCreditUsed = (
    creditType: string,
    amount: number,
    ideaId?: string
) => {
    trackEvent('credit_used', {
        credit_type: creditType,
        credits_spent: amount,
        idea_id: ideaId,
        event_category: 'monetization',
    });
};

/**
 * Track when credits are purchased.
 */
export const trackCreditPurchased = (
    packId: string,
    creditsAdded: number,
    amount: number
) => {
    trackEvent('credit_purchased', {
        pack_id: packId,
        credits_added: creditsAdded,
        purchase_amount: amount,
        event_category: 'monetization',
    });
};

// =============================================================================
// PITCH DECK EVENTS
// =============================================================================

/**
 * Track when a pitch deck is created/exported.
 */
export const trackPitchDeckCreated = (ideaId: string, format: string) => {
    trackEvent('pitch_deck_created', {
        idea_id: ideaId,
        export_format: format,
        event_category: 'engagement',
    });
};

/**
 * Track when a pitch deck is downloaded.
 */
export const trackPitchDeckDownloaded = (ideaId: string, format: string) => {
    trackEvent('pitch_deck_downloaded', {
        idea_id: ideaId,
        export_format: format,
        event_category: 'engagement',
    });
};
