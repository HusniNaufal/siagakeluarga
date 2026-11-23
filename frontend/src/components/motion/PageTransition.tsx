import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";

/**
 * Transisi pindah halaman: halaman baru memudar masuk sambil naik sedikit (10 px, 350 ms).
 * Juga menggulung ke atas saat berpindah halaman, kecuali tautan membawa #bagian.
 *
 * `fade`: hanya memudar, tanpa geser. Dipakai di Beranda karena geseran (transform) pada
 * pembungkus akan merusak navbar `fixed` dan hero `sticky` di dalamnya.
 */
export function PageTransition({ children, fade = false }: { children: ReactNode; fade?: boolean }) {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  const geser = !fade && !reduce;
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: geser ? 10 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.12 : 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
