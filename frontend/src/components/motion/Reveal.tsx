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

/**
 * Animasi masuk untuk kartu ala Apple: naik pelan, sedikit membesar dari 97,5%, dengan easing
 * yang melambat di akhir. Kartu dalam satu kelompok masuk berurutan (indeks * 90 ms).
 * Hanya sekali per kartu. Saat "kurangi gerakan" aktif, hanya memudar singkat.
 */
export function useReveal(options: { hover?: boolean } = {}) {
  const reduce = useReducedMotion();
  return (index = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 28, scale: reduce ? 1 : 0.975 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    whileHover: options.hover && !reduce ? { y: -4, transition: { type: "spring" as const, stiffness: 320, damping: 24 } } : undefined,
    viewport: { once: true, margin: "-8% 0px" },
    transition: {
      duration: reduce ? 0.2 : 0.75,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: reduce ? 0 : index * 0.09,
    },
  });
}
