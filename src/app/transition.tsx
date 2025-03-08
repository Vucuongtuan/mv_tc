"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function Transition({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 15, opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 0.75, delay: index * 0.08 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
