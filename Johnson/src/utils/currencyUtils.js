// Currency utility: detects user locale, converts from TZS, and formats prices.

const EXCHANGE_RATES = {
    TZS: 1,
    USD: 0.00039,
    EUR: 0.00036,
    GBP: 0.00031,
    KES: 0.056,
    UGX: 1.46,
    ZAR: 0.0071,
    INR: 0.033,
    NGN: 0.60,
    CAD: 0.00054,
    AUD: 0.00061,
};

const CURRENCY_SYMBOLS = {
    TZS: 'TZS',
    USD: '$',
    EUR: '€',
    GBP: '£',
    KES: 'KES',
    UGX: 'UGX',
    ZAR: 'R',
    INR: '₹',
    NGN: '₦',
    CAD: 'C$',
    AUD: 'A$',
};

const LOCALE_TO_CURRENCY = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'en-AU': 'AUD',
    'en-CA': 'CAD',
    'en-KE': 'KES',
    'en-TZ': 'TZS',
    'sw-TZ': 'TZS',
    'sw-KE': 'KES',
    'en-UG': 'UGX',
    'en-ZA': 'ZAR',
    'en-NG': 'NGN',
    'en-IN': 'INR',
    'hi-IN': 'INR',
    'fr-FR': 'EUR',
    'de-DE': 'EUR',
    'es-ES': 'EUR',
    'it-IT': 'EUR',
    'pt-BR': 'USD',
};

/**
 * Default currency is always TZS (Tanzanian Shilling).
 * This ensures all visitors see prices in TZS by default.
 */
export function detectCurrency() {
    return 'TZS';
}

/**
 * Convert an amount from TZS to the target currency.
 */
function convertFromTZS(amountTZS, targetCurrency = 'TZS') {
    const rate = EXCHANGE_RATES[targetCurrency] || 1;
    return amountTZS * rate;
}

/**
 * Format a TZS price into the user's currency with proper symbol and formatting.
 * @param {number} amountTZS - The price in TZS (raw number, e.g. 5000)
 * @param {string} [currency] - Target currency code. Auto-detected if omitted.
 * @returns {string} Formatted price string, e.g. "$1.95" or "TZS 5,000"
 */
export function formatPrice(amountTZS, currency) {
    if (amountTZS === 0) return 'Free';

    const curr = currency || detectCurrency();
    const converted = convertFromTZS(amountTZS, curr);
    const symbol = CURRENCY_SYMBOLS[curr] || curr;

    // For TZS and similar large-value currencies, no decimals
    if (['TZS', 'KES', 'UGX', 'NGN'].includes(curr)) {
        return `${symbol} ${Math.round(converted).toLocaleString()}`;
    }

    // For smaller-value currencies, show 2 decimal places
    return `${symbol}${converted.toFixed(2)}`;
}

export { EXCHANGE_RATES, CURRENCY_SYMBOLS };
