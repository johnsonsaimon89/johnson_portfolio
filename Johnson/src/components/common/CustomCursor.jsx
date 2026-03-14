import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const [cursorType, setCursorType] = useState('default');
    const [clicks, setClicks] = useState([]);

    // Mouse position state using motion values for performance
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Spring physics for a smooth follow effect
    const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseDown = (e) => {
            const id = Date.now();
            setClicks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
            
            // Clean up the click animation after it finishes
            setTimeout(() => {
                setClicks((prev) => prev.filter((click) => click.id !== id));
            }, 600);
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            if (!target) return;
            
            // Re-detecting intended cursor state since CSS 'cursor' is globally HIDDEN
            const isClickable = 
                target.tagName === 'A' || 
                target.tagName === 'BUTTON' || 
                target.closest('a') || 
                target.closest('button') ||
                target.closest('[role="button"]') ||
                target.style.cursor === 'pointer';

            const isText = 
                target.tagName === 'INPUT' || 
                target.tagName === 'TEXTAREA' || 
                target.closest('[contenteditable="true"]') ||
                target.tagName === 'P' || 
                target.tagName === 'SPAN' || 
                target.tagName === 'H1' || 
                target.tagName === 'H2' || 
                target.tagName === 'H3' ||
                target.style.cursor === 'text';
            
            if (isClickable) {
                setCursorType('pointer');
            } else if (isText) {
                setCursorType('text');
            } else {
                setCursorType('default');
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY]);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 99999 }}>
            {/* Click/Explode Animations */}
            <AnimatePresence>
                {clicks.map((click) => (
                    <motion.div
                        key={click.id}
                        initial={{ opacity: 1, scale: 0 }}
                        animate={{ opacity: 0, scale: 2.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{
                            position: 'fixed',
                            left: click.x,
                            top: click.y,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.8)',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        {/* Explode particles */}
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: 0, y: 0, opacity: 1 }}
                                animate={{ 
                                    x: (Math.cos((i * 45) * Math.PI / 180) * 40), 
                                    y: (Math.sin((i * 45) * Math.PI / 180) * 40),
                                    opacity: 0 
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    width: 4,
                                    height: 4,
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--brand-accent, #BDFF00)',
                                }}
                            />
                        ))}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Custom Cursor Shape */}
            <motion.div
                style={{
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    x: cursorX,
                    y: cursorY,
                    translateX: cursorType === 'text' ? '0%' : '-15%',
                    translateY: cursorType === 'text' ? '-50%' : '-15%',
                }}
            >
                <motion.div
                    animate={{
                        scale: (cursorType === 'pointer' || cursorType === 'text') ? 1.1 : 1,
                        rotate: cursorType === 'text' ? 0 : -120
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                    {cursorType === 'text' ? (
                        /* Styled I-Beam for Text */
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4V20M8 4H16M8 20H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M12 4V20M8 4H16M8 20H16" stroke="black" strokeWidth="0.5" strokeLinecap="round"/>
                        </svg>
                    ) : (
                        /* Original Rounded Triangle Arrow (Default & Clickable State) */
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g>
                                <path
                                    d="M4.5 3L23.5 14L4.5 25L9.5 14L4.5 3Z"
                                    fill="rgba(0,0,0,0.2)"
                                    stroke="rgba(0,0,0,0.2)"
                                    strokeWidth="3"
                                    strokeLinejoin="round"
                                    transform="translate(1, 1)"
                                />
                                <path
                                    d="M4.5 3L23.5 14L4.5 25L9.5 14L4.5 3Z"
                                    fill="white"
                                    stroke="black"
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                />
                            </g>
                        </svg>
                    )}
                </motion.div>

            </motion.div>
        </div>
    );
};

export default CustomCursor;
