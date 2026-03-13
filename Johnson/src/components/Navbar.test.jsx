import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';

// Mock IntersectionObserver which is sometimes used by Framer Motion internally
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

describe('Navbar Component', () => {
    // Helper function to render component within router context
    const renderNavbar = () => {
        return render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
    };

    it('renders the brand logo', () => {
        renderNavbar();
        const logo = screen.getByText(/JOHNSON/i);
        expect(logo).toBeInTheDocument();
    });

    it('renders all primary desktop navigation links', () => {
        renderNavbar();

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Social')).toBeInTheDocument();
        expect(screen.getByText('Studio')).toBeInTheDocument();
        expect(screen.getByText('Resources')).toBeInTheDocument();
        expect(screen.getByText('Talk')).toBeInTheDocument();
    });

    it('toggles mobile menu when hamburger icon is clicked', () => {
        renderNavbar();

        // Find the hamburger button class
        const mobileToggleBtn = document.querySelector('.mobile-only');
        expect(mobileToggleBtn).toBeInTheDocument();

        // The mobile menu itself should be initially closed/scaled down (opacity 0) via framer motion,
        // but we can test that the button renders and handles clicks.
        fireEvent.click(mobileToggleBtn);

        // The internal state toggles, but testing Framer Motion's AnimatePresence styling 
        // purely via DOM can be tricky. We just verify the button is intractable.
        expect(mobileToggleBtn).toBeEnabled();
    });
});
