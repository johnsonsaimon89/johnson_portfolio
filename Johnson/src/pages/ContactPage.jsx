import React from 'react';
import { motion } from 'framer-motion';
import Contact from '../components/Contact';

const ContactPage = () => {
    return (
        <div className="contact-page">
            <div className="studio-noise" />
            <div style={{ paddingTop: '10vh' }}>
                <Contact />
            </div>
        </div>
    );
};

export default ContactPage;
