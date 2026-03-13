import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Import all Web Studio components
import StudioHero from '../components/WebStudio/StudioHero';
import FeaturedProjects from '../components/WebStudio/FeaturedProjects';
import InteractivePreview from '../components/WebStudio/InteractivePreview';
import ResponsiveShowcase from '../components/WebStudio/ResponsiveShowcase';
import ProcessTimeline from '../components/WebStudio/ProcessTimeline';
import DesignThinking from '../components/WebStudio/DesignThinking';
import ToolsDashboard from '../components/WebStudio/ToolsDashboard';
import Testimonials from '../components/WebStudio/Testimonials';
import ValueProp from '../components/WebStudio/ValueProp';
import StudioCTA from '../components/WebStudio/StudioCTA';

const WebPortfolioPage = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="web-studio-page">

            {/* Assemble Components */}
            <StudioHero />
            <FeaturedProjects />
            <ProcessTimeline />
            <ToolsDashboard />
            <Testimonials />
            <StudioCTA />

        </div>
    );
};

export default WebPortfolioPage;
