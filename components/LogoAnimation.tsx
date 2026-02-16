import React from 'react';
import { motion } from 'framer-motion';

export const LogoAnimation = () => {
    const title = "THREADA";
    const letters = title.split("");

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.1, // Slower bleed
            },
        },
    };

    const letterVariants = {
        hidden: {
            y: 10,
            opacity: 0,
            scale: 1.1,
            filter: "blur(8px)",
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                duration: 1.4,
                ease: [0.22, 1, 0.36, 1] as const,
            },
        },
    };

    return (
        <motion.div
            className="flex justify-center items-center cursor-default py-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    variants={letterVariants}
                    className="font-logoza text-[18vw] md:text-[17.5vw] leading-[0.78] inline-block text-black scale-x-125 origin-center will-change-transform"
                >
                    {letter}
                </motion.span>
            ))}
        </motion.div>
    );
};
