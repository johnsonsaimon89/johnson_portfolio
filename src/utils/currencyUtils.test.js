import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectCurrency, formatPrice, EXCHANGE_RATES, CURRENCY_SYMBOLS } from './currencyUtils';

describe('currencyUtils.js', () => {
    // Store original language
    const originalLanguage = navigator.language;

    afterEach(() => {
        // Restore original language after each test
        Object.defineProperty(navigator, 'language', {
            value: originalLanguage,
            configurable: true
        });
    });

    describe('detectCurrency', () => {
        it('should detect USD for en-US', () => {
            Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
            expect(detectCurrency()).toBe('USD');
        });

        it('should detect GBP for en-GB', () => {
            Object.defineProperty(navigator, 'language', { value: 'en-GB', configurable: true });
            expect(detectCurrency()).toBe('GBP');
        });

        it('should detect KES for sw-KE', () => {
            Object.defineProperty(navigator, 'language', { value: 'sw-KE', configurable: true });
            expect(detectCurrency()).toBe('KES');
        });

        it('should fallback to TZS for unknown locales', () => {
            Object.defineProperty(navigator, 'language', { value: 'unknown-LOCALE', configurable: true });
            expect(detectCurrency()).toBe('TZS');
        });
    });

    describe('formatPrice', () => {
        it('should format TZS correctly (no decimals, no conversion)', () => {
            const result = formatPrice(5000, 'TZS');
            expect(result).toBe('TZS 5,000');
        });

        it('should format USD correctly and apply exchange rate', () => {
            // 5000 TZS * 0.00039 USD = 1.95 USD
            const result = formatPrice(5000, 'USD');
            expect(result).toBe('$1.95');
        });

        it('should format KES correctly with no trailing decimals if whole number', () => {
            // Using a mock rate to test rounding logic
            const originalRate = EXCHANGE_RATES.KES;
            EXCHANGE_RATES.KES = 0.05; // 5000 * 0.05 = 250
            const result = formatPrice(5000, 'KES');
            expect(result).toBe('KES 250');

            EXCHANGE_RATES.KES = originalRate; // restore
        });
    });
});
