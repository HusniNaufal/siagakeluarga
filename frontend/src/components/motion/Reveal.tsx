import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { dur, ease } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/** Fade + geser naik tipis saat elemen muncul. Konten tetap terlihat tanpa JS
 * (initial state bukan display:none), dan tanpa geser kalau reduced-motion aktif. */
export function Reveal({ children, className, delay = 0, y = 12 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: reduce ? dur.micro : dur.chapter, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}
