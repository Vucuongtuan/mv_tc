'use client';

import { motion } from 'motion/react';
import styles from './footer.module.scss';

const logoText = 'TC Phim.';

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

const charVariants = {
    hidden: {
        opacity: 0,
        y: 40,
        filter: 'blur(8px)',
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.topBar}>
                <div className={styles.topBarInner}>
                    <div className={styles.copyright}>
                        © All rights reserved. {new Date().getFullYear()}
                    </div>
                    <span className={styles.designedBy}>
                        Designed in Vucuongtuan
                    </span>
                </div>
            </div>

            <div className={styles.bigLogo}>
                <motion.div
                    className={styles.logoText}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {logoText.split('').map((char, i) => (
                        <motion.span
                            key={i}
                            // @ts-expect-error
                            variants={charVariants}
                            style={{ display: 'inline-block' }}
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                    ))}
                </motion.div>
            </div>
        </footer>
    );
}