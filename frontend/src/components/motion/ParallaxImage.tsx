import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Foto besar dengan geseran sangat tipis saat discroll (sekitar 4%). Satu-satunya gerak di
 * section ini, jadi tidak ramai. Dimatikan saat pengguna memilih mengurangi gerakan.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={reduce ? undefined : { y, scale: 1.1 }}
        className={cn("foto absolute inset-0 size-full object-cover", imgClassName)}
      />
    </div>
  );
}
