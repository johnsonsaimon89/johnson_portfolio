import { describe, it, expect } from 'vitest';
import { formatUrl, getCleanHostname, sanitizeUrlInput } from './urlUtils';

describe('urlUtils', () => {
    describe('formatUrl', () => {
        it('prepends https:// to bare domain names', () => {
            expect(formatUrl('hadzabemediacenter.org')).toBe('https://hadzabemediacenter.org');
            expect(formatUrl('www.hadzabemediacenter.org')).toBe('https://www.hadzabemediacenter.org');
            expect(formatUrl('hadzabemediacenter.com/about')).toBe('https://hadzabemediacenter.com/about');
        });

        it('preserves existing http and https protocols', () => {
            expect(formatUrl('https://hadzabemediacenter.org')).toBe('https://hadzabemediacenter.org');
            expect(formatUrl('http://hadzabemediacenter.org')).toBe('http://hadzabemediacenter.org');
        });

        it('preserves relative internal routes and anchor hashes', () => {
            expect(formatUrl('/work')).toBe('/work');
            expect(formatUrl('/about')).toBe('/about');
            expect(formatUrl('#podcast')).toBe('#podcast');
            expect(formatUrl('/projects/image.png')).toBe('/projects/image.png');
        });

        it('preserves mailto and tel schemes', () => {
            expect(formatUrl('mailto:johnsonsaimon111@gmail.com')).toBe('mailto:johnsonsaimon111@gmail.com');
            expect(formatUrl('tel:+255768662378')).toBe('tel:+255768662378');
        });

        it('handles empty or non-string inputs gracefully', () => {
            expect(formatUrl('')).toBe('');
            expect(formatUrl(null)).toBe('');
            expect(formatUrl(undefined)).toBe('');
            expect(formatUrl('#')).toBe('#');
        });
    });

    describe('getCleanHostname', () => {
        it('extracts hostname without www', () => {
            expect(getCleanHostname('https://www.hadzabemediacenter.org')).toBe('hadzabemediacenter.org');
            expect(getCleanHostname('hadzabemediacenter.org')).toBe('hadzabemediacenter.org');
            expect(getCleanHostname('https://afrisos.ngo/projects')).toBe('afrisos.ngo');
        });

        it('returns fallback for invalid inputs', () => {
            expect(getCleanHostname('')).toBe('preview.local');
            expect(getCleanHostname('#')).toBe('preview.local');
        });
    });

    describe('sanitizeUrlInput', () => {
        it('adds https:// if typed domain without protocol', () => {
            expect(sanitizeUrlInput('hadzabemediacenter.org')).toBe('https://hadzabemediacenter.org');
            expect(sanitizeUrlInput('https://hadzabemediacenter.org')).toBe('https://hadzabemediacenter.org');
            expect(sanitizeUrlInput('/projects/demo.png')).toBe('/projects/demo.png');
        });
    });
});
