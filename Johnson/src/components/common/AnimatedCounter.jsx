import React, { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Extracted from pages/SocialMediaPage.jsx so it can be reused on the
 * homepage (and anywhere else) without duplicating the logic.
 * Behavior is unchanged from the original inline version.
 */
const AnimatedCounter = ({ value, target, suffix }) => {
    const [count, setCount] = useState(0);
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    useEffect(() => {
        if (isInView) {
            const end = parseFloat(target);
            if (isNaN(end)) return;
            const duration = 2000;
            const startTime = performance.now();
            const animate = (currentTime) => {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                setCount(Math.floor(ease * end));
                if (progress < 1) requestAnimationFrame(animate);
                else setCount(target);
            };
            requestAnimationFrame(animate);
        }
    }, [isInView, target]);

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
};

export default AnimatedCounter;
