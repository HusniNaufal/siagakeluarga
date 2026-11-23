import { jsx as _jsx } from "react/jsx-runtime";
import { motion, useReducedMotion } from "motion/react";
import { dur, ease } from "@/lib/motion";
/** Fade + geser naik tipis saat elemen muncul. Konten tetap terlihat tanpa JS
 * (initial state bukan display:none), dan tanpa geser kalau reduced-motion aktif. */
export function Reveal({ children, className, delay = 0, y = 12 }) {
    const reduce = useReducedMotion();
    return (_jsx(motion.div, { className: className, initial: { opacity: 0, y: reduce ? 0 : y }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-10% 0px" }, transition: { duration: reduce ? dur.micro : dur.chapter, ease: ease.out, delay }, children: children }));
}
