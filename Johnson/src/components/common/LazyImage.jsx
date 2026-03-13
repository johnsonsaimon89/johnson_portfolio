import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LazyImage = ({ src, alt, className, style, revealDirection = 'bottom' }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const revealVariants = {
        hidden: {
            clipPath: revealDirection === 'bottom'
                ? 'inset(100% 0 0 0)'
                : 'inset(0 100% 0 0)',
            scale: 1.1,
            filter: 'blur(10px)'
        },
        visible: {
            clipPath: 'inset(0% 0 0 0)',
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1]
            }
        }
    };

    return (
        <div className={`lazy-image-container ${className}`} style={{ ...style, position: 'relative', overflow: 'hidden' }}>
            <motion.img
                src={src}
                alt={alt}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={revealVariants}
                onLoad={() => setIsLoaded(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {!isLoaded && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(20px)'
                }} />
            )}
        </div>
    );
};

export default LazyImage;
