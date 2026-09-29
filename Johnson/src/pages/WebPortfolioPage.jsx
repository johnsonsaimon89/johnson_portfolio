import React, { useEffect } from 'react';

// Web Studio components actually rendered
import StudioHero from '../components/WebStudio/StudioHero';
import FeaturedProjects from '../components/WebStudio/FeaturedProjects';
import ProcessTimeline from '../components/WebStudio/ProcessTimeline';
import ToolsDashboard from '../components/WebStudio/ToolsDashboard';
import Testimonials from '../components/WebStudio/Testimonials';
import ValueProp from '../components/WebStudio/ValueProp';
import DesignThinking from '../components/WebStudio/DesignThinking';
import InteractivePreview from '../components/WebStudio/InteractivePreview';
import ResponsiveShowcase from '../components/WebStudio/ResponsiveShowcase';
import CTASection from '../components/common/CTASection';
/*
 * CHANGES FROM ORIGINAL:
 * Removed unused imports (ArrowLeft, Link, InteractivePreview,
 *   ResponsiveShowcase, DesignThinking, ValueProp) that were imported
 *   but never rendered. If ValueProp / DesignThinking have content
 *   worth keeping, finish and re-add them deliberately rather than
 *   leaving them as silent dead code, see plan doc "Dead code cleanup".
 * Replaced <StudioCTA /> (hardcoded web-design-only copy, and a
 *   broken "#contact" anchor with no matching id on this page) with
 *   the shared <CTASection />, using the same copy StudioCTA had, but
 *   now correctly routed to the real /contact page.
 */

const WebPortfolioPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="web-studio-page">
            <StudioHero />
            <ValueProp />
            <FeaturedProjects />
            <InteractivePreview />
            <ProcessTimeline />
            <DesignThinking />
            <ResponsiveShowcase />
            <ToolsDashboard />
            <Testimonials />
            <CTASection
                title="Ready to build a website that grows with you?"
                subtitle="Let's build a digital asset that stands out, tells your story, and helps you win more clients."
                primaryLabel="Start a Project"
                primaryTo="/contact"
                secondaryLabel="Email Me"
                secondaryHref="mailto:hello@johnsonsaimon.com"
            />
        </div>
    );
};

export default WebPortfolioPage;
