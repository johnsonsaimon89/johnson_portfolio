import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import PageRenderer from './components/PageRenderer';

const DynamicPage = ({ slug }) => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('pages')
                .select('*')
                .eq('slug', slug)
                .single();

            if (data && data.is_published) {
                setPageData(data);
            } else {
                setPageData(null);
            }
            setLoading(false);
        };

        if (slug) {
            fetchPage();
        }
    }, [slug]);

    if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

    if (!pageData) {
        return (
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for does not exist or is unpublished.</p>
            </div>
        );
    }

    return (
        <div className="dynamic-page">
            <PageRenderer blocks={pageData.content_blocks} />
        </div>
    );
};

export default DynamicPage;
