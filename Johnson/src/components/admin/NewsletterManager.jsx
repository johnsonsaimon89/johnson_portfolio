import React from 'react';
import { ExternalLink, Mailbox } from 'lucide-react';
import SubscriberCRM from './Newsletter/SubscriberCRM';
import './AdminComponents.css';

const NewsletterManager = () => {
    return (
        <div className="admin-component-container" style={{ gap: '2rem' }}>
            <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mailbox size={20} color="var(--tab-accent)" /> 
                        Campaign Management
                    </h3>
                    <p style={{ margin: 0, color: 'var(--muted-color)', fontSize: '0.9rem' }}>
                        Design and send newsletters via Resend Broadcasts. New subscribers sync automatically.
                    </p>
                </div>
                <a 
                    href="https://resend.com/broadcasts" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="admin-submit-btn"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'auto', padding: '0.75rem 1.5rem' }}
                >
                    Open Resend <ExternalLink size={16} />
                </a>
            </div>

            <SubscriberCRM />
        </div>
    );
};

export default NewsletterManager;
