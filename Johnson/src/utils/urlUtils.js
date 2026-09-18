/**
 * URL Utilities for safe link handling and formatting across the application.
 */

/**
 * Ensures a URL is properly formatted for external navigation.
 * If a domain or web address like 'hadzabemediacenter.org' or 'www.hadzabemediacenter.org'
 * is passed without a protocol, it automatically prepends 'https://' so that browsers
 * and React Router do not treat it as a relative path under the current domain (e.g. johnsonsaimon.com/hadzabemediacenter.org).
 *
 * @param {string} url - The URL or link path to format.
 * @returns {string} - The formatted, safe URL.
 */
export const formatUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (!trimmed || trimmed === '#') return trimmed;

    // Internal app routes or hash anchors
    if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
        return trimmed;
    }

    // Special protocols
    if (
        trimmed.startsWith('mailto:') ||
        trimmed.startsWith('tel:') ||
        trimmed.startsWith('sms:') ||
        trimmed.startsWith('javascript:')
    ) {
        return trimmed;
    }

    // Protocol-relative URL
    if (trimmed.startsWith('//')) {
        return `https:${trimmed}`;
    }

    // Already contains a valid scheme (http://, https://, etc.)
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) {
        return trimmed;
    }

    // Default to https:// for any web domain or host
    return `https://${trimmed}`;
};

/**
 * Extracts a clean hostname for display purposes (e.g. in mini-browser address bars).
 *
 * @param {string} url - The URL to extract hostname from.
 * @param {string} fallback - Fallback text if hostname cannot be determined.
 * @returns {string}
 */
export const getCleanHostname = (url, fallback = 'preview.local') => {
    if (!url || url === '#' || url === 'undefined') return fallback;
    try {
        const formatted = formatUrl(url);
        const parsed = new URL(formatted);
        return parsed.hostname.replace(/^www\./, '') || fallback;
    } catch {
        return fallback;
    }
};

/**
 * Sanitizes input URL on change / blur / submit in form fields.
 * If the user enters a valid domain like 'hadzabemediacenter.org',
 * it converts it into a full URL.
 *
 * @param {string} input - User typed string in an input field.
 * @returns {string}
 */
export const sanitizeUrlInput = (input) => {
    if (!input || typeof input !== 'string') return '';
    const trimmed = input.trim();
    if (!trimmed) return '';

    // If it looks like a domain (e.g. hadzabemediacenter.org, sub.domain.co, etc.) without protocol:
    if (
        !trimmed.startsWith('http://') &&
        !trimmed.startsWith('https://') &&
        !trimmed.startsWith('/') &&
        !trimmed.startsWith('#') &&
        !trimmed.startsWith('mailto:') &&
        !trimmed.startsWith('tel:') &&
        trimmed.includes('.') &&
        !trimmed.includes(' ')
    ) {
        return `https://${trimmed}`;
    }

    return trimmed;
};
